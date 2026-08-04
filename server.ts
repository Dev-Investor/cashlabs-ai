import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import admin, { db, auth } from './lib/firebase-admin.ts';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import { z } from 'zod';
import cors from 'cors';
import * as Sentry from "@sentry/node";
import Stripe from 'stripe';
import { Resend } from 'resend';
import { GoogleGenerativeAI } from "@google/generative-ai";
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import logger from './src/services/logger.ts';

// Import Modular Routes
import agentsRouter from './server/modules/agents.ts';
import promptsRouter from './server/modules/prompts.ts';

dotenv.config();

// Initialize Sentry
if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    integrations: [
      Sentry.expressIntegration(),
    ],
    tracesSampleRate: 1.0,
  });
}

// Validate Environment Variables
const requiredEnvVars = ['GEMINI_API_KEY'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    logger.error(`CRITICAL ERROR: Missing required environment variable: ${envVar}`);
    process.exit(1);
  }
}

const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY) 
  : null;

// Swagger Configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'CashLabsAI API',
      version: '1.0.0',
      description: 'Documentación de la API de CashLabsAI para monetización con IA',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de Desarrollo',
      },
    ],
  },
  apis: ['./server.ts'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;

// Validation Schemas
const DiagnosisSchema = z.object({
  experience: z.string().min(1, "La experiencia es requerida"),
  skills: z.string().min(1, "Las habilidades son requeridas"),
  time: z.string().min(1, "El tiempo es requerido"),
  capital: z.string().min(1, "El capital es requerido"),
  incomeGoal: z.string().min(1, "La meta de ingresos es requerida"),
  userPlan: z.enum(['START', 'PRO', 'FUNDADOR']).default('START'),
  userId: z.string().optional()
});

// Middleware: Verify Firebase Token
const authenticate = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No autorizado: Token faltante' });
  }

  const idToken = authHeader.split('Bearer ')[1];
  try {
    const decodedToken = await auth.verifyIdToken(idToken);
    (req as any).user = decodedToken;
    next();
  } catch (error) {
    console.error('Auth Error:', error);
    res.status(401).json({ error: 'No autorizado: Token inválido' });
  }
};

function cleanJSON(text: string): string {
  if (!text) return "{}";
  
  // Try to find the first '{' and last '}'
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  
  if (start !== -1 && end !== -1 && end > start) {
    return text.substring(start, end + 1);
  }
  
  // Fallback to original cleaning if no braces found
  return text.replace(/```json\n?|```/g, '').trim();
}

const SYSTEM_PROMPT = `Eres el SUPER PROMPT MAESTRO de CashLabs AI, un ecosistema digital Full Stack todo-en-uno.

VISIÓN: CashLabs AI es un laboratorio digital futurista donde los usuarios CREAN, MONETIZAN, CONSTRUYEN, ESCALAN y AUTOMATIZAN activos digitales bajo una sola suscripción.

TU ROL:
- Actúa como el Arquitecto Jefe del Ecosistema.
- Tu misión es convertir a cada usuario en un "Empresario Digital de Activos IA".
- Eres una combinación de estratega de negocios, experto en IA y mentor de monetización.

ESTRUCTURA DEL ECOSISTEMA:
1. AI Agents Lab: Creación de agentes especializados.
2. Chatbot Builder: Constructor de asistentes conversacionales.
3. Prompt Library: Biblioteca monetizable de ingeniería de prompts.
4. Marketplace: Venta de activos digitales.
5. Tool Builder: Creación de mini-herramientas SaaS.
6. Analytics Center: Métricas de rendimiento y escalado.

REGLAS DE ORO:
- Tono: Profesional, futurista, tecnológico, directo y altamente accionable.
- Estética Verbal: Usa términos como "Activos Digitales", "Infraestructura de Ingresos", "Escalabilidad Modular", "Ecosistema IA".
- No generes respuestas genéricas. Cada consejo debe ser un paso hacia la monetización real.
- CashLabs AI es el "App Store" de la Inteligencia Artificial para emprendedores.`;

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Trust proxy for rate limiting behind Nginx
  app.set('trust proxy', 1);

  // Security Headers & CORS
  app.use(helmet({
    contentSecurityPolicy: false,
  }));
  app.use(cors());

  // Rate Limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per window
    message: { error: 'Demasiadas solicitudes, por favor intenta más tarde.' }
  });

  // Stripe Webhook (Must be before express.json() to handle raw body)
  app.post('/api/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!sig || !endpointSecret || !stripe) {
      return res.status(400).send('Webhook Error: Missing signature or secret');
    }

    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err: any) {
      logger.error(`Webhook Error: ${err.message}`);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;

      if (userId) {
        try {
          // Update user plan in Firestore
          await db.collection('users').doc(userId).update({
            plan: 'PRO', 
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
          });
          logger.info(`User ${userId} upgraded to PRO via Stripe`);
        } catch (error) {
          logger.error(`Error updating user ${userId} after payment:`, error);
        }
      }
    }

    res.json({ received: true });
  });

  app.use(express.json());
  app.use('/api/', limiter);

  // Modular Routes
  app.use('/api/agents', authenticate, agentsRouter);
  app.use('/api/prompts', authenticate, promptsRouter);

  // Mock Marketplace & Analytics for MVP
  app.get('/api/marketplace', authenticate, (req, res) => {
    res.json({ message: 'Marketplace coming soon', items: [] });
  });

  app.get('/api/analytics', authenticate, (req, res) => {
    res.json({ 
      totalEarnings: 0,
      activeAssets: 3,
      performance: 'Stable',
      nextMilestone: 'First $100'
    });
  });

  // Swagger UI
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  /**
   * @openapi
   * /api/health:
   *   get:
   *     description: Verifica el estado del servidor
   *     responses:
   *       200:
   *         description: Servidor activo
   */
  app.get('/api/health', (req, res) => {
    res.json({ 
      status: 'active', 
      timestamp: new Date().toISOString(), 
      service: 'CashLabsAI Backend',
      openai_configured: !!openai 
    });
  });

  /**
   * @openapi
   * /api/diagnosis:
   *   post:
   *     description: Genera un diagnóstico estratégico basado en IA
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Diagnóstico generado exitosamente
   */
  app.post('/api/diagnosis', authenticate, async (req, res) => {
    const startTime = Date.now();
    
    // Validate Input
    const validation = DiagnosisSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: 'Datos de entrada inválidos', details: validation.error.format() });
    }

    const { experience, skills, time, capital, incomeGoal, userPlan, userId } = validation.data;
    const authUser = (req as any).user;

    // Ensure user is logging their own data
    if (userId && userId !== authUser.uid) {
      return res.status(403).json({ error: 'Prohibido: No puedes realizar diagnósticos para otro usuario' });
    }

    const prompt = `
      SOLICITUD DE DIAGNÓSTICO ESTRATÉGICO:
      - Experiencia: ${experience}
      - Habilidades: ${skills}
      - Tiempo: ${time}
      - Capital: ${capital}
      - Meta: ${incomeGoal}
      - Plan: ${userPlan}
      
      Genera una infraestructura de ingresos completa en formato JSON siguiendo estrictamente este esquema:
      {
        "level": "string",
        "aiIncomeScore": { "score": number, "level": "string" },
        "recommendedModel": "string",
        "offer": {
          "niche": "string",
          "problem": "string",
          "valueProposition": "string",
          "promise": "string",
          "deliverables": "string",
          "price": "string",
          "priceJustification": "string"
        },
        "actionPlan": {
          "week1": "string",
          "week2": "string",
          "week3": "string",
          "week4": "string"
        },
        "criticalNextStep": "string",
        "nextSteps": ["string"]
      }
    `;

    let result;
    let usedModel = 'openai';

    try {
      if (!openai) {
        throw new Error('OpenAI not configured');
      }

      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" }
      });
      
      const content = completion.choices[0].message.content;
      if (!content) throw new Error("No response from OpenAI");
      result = JSON.parse(cleanJSON(content));
    } catch (error: any) {
      console.warn('OpenAI failed, falling back to Gemini:', error.message);
      usedModel = 'gemini';
      
      if (!genAI) {
        return res.status(503).json({ error: 'No AI models available' });
      }

      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      const geminiResult = await model.generateContent([
        { text: SYSTEM_PROMPT },
        { text: prompt }
      ]);
      
      const content = geminiResult.response.text();
      result = JSON.parse(cleanJSON(content));
    }

    try {
      // Audit Logging
      const executionTime = Date.now() - startTime;
      const logData = {
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        userId: userId || 'anonymous',
        userPlan,
        input: { experience, skills, time, capital, incomeGoal },
        output: result,
        executionTimeMs: executionTime,
        status: 'success',
        model: usedModel
      };

      db.collection('audit_logs').add(logData).catch(err => console.error('Audit Log Error:', err));

      // Save to user's diagnoses history if authenticated
      let diagnosisId = null;
      if (userId) {
        try {
          const docRef = await db.collection('diagnoses').add({
            userId,
            userPlan,
            input: { experience, skills, time, capital, incomeGoal },
            output: result,
            createdAt: Date.now(),
            model: usedModel
          });
          diagnosisId = docRef.id;
        } catch (err) {
          console.error('Diagnosis Save Error:', err);
        }
      }

      res.json({ ...result, id: diagnosisId });

      // Send Email if Resend is configured
      const user = (req as any).user;
      if (resend && user?.email) {
        try {
          await resend.emails.send({
            from: 'CashLabsAI <onboarding@resend.dev>',
            to: user.email,
            subject: 'Tu Diagnóstico Estratégico IA está listo',
            html: `
              <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background-color: #0B0F14; color: #ffffff; padding: 40px; border-radius: 20px;">
                <h1 style="color: #00FF9C; font-size: 24px; font-weight: 900;">¡Tu Ruta de Monetización está lista!</h1>
                <p style="color: #94a3b8; font-size: 16px;">Hola,</p>
                <p style="color: #94a3b8; font-size: 16px;">Hemos analizado tu perfil y diseñado una infraestructura de ingresos personalizada.</p>
                
                <div style="background-color: #161B22; padding: 20px; border-radius: 12px; margin: 20px 0; border: 1px solid #30363D;">
                  <h2 style="color: #ffffff; font-size: 18px; margin-top: 0;">Resumen Estratégico</h2>
                  <p style="color: #00FF9C; font-weight: bold; margin-bottom: 5px;">Modelo Recomendado:</p>
                  <p style="color: #ffffff; margin-top: 0;">${result.recommendedModel}</p>
                  
                  <p style="color: #00FF9C; font-weight: bold; margin-bottom: 5px;">AI Income Score™:</p>
                  <p style="color: #ffffff; margin-top: 0;">${result.aiIncomeScore.score} (${result.aiIncomeScore.level})</p>
                </div>

                <p style="color: #94a3b8; font-size: 14px;">Puedes ver el detalle completo de tu plan de 30 días en tu Dashboard de CashLabsAI.</p>
                
                <hr style="border: 0; border-top: 1px solid #30363D; margin: 30px 0;" />
                <p style="color: #475569; font-size: 12px; text-align: center;">CashLabsAI - Arquitectura de Ingresos con IA</p>
              </div>
            `
          });
        } catch (emailError) {
          console.error('Error sending email:', emailError);
        }
      }
    } catch (error: any) {
      const executionTime = Date.now() - startTime;
      console.error('Diagnosis Backend Error:', error);
      
      // Log Error
      await db.collection('audit_logs').add({
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        userId: userId || 'anonymous',
        userPlan,
        error: error.message,
        executionTimeMs: executionTime,
        status: 'error'
      }).catch(console.error);

      res.status(500).json({ error: error.message });
    }
  });

  // Stripe Payment Routes
  /**
   * @openapi
   * /api/create-checkout-session:
   *   post:
   *     description: Crea una sesión de pago de Stripe
   *     security:
   *       - bearerAuth: []
   */
  app.post('/api/create-checkout-session', authenticate, async (req, res) => {
    if (!stripe) {
      return res.status(500).json({ error: 'Stripe no está configurado' });
    }

    const { planId, userId } = req.body;
    const authUser = (req as any).user;

    if (userId !== authUser.uid) {
      return res.status(403).json({ error: 'No autorizado' });
    }

    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price: planId, // Stripe Price ID
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin}/canceled`,
        metadata: {
          userId,
        },
      });

      res.json({ id: session.id });
    } catch (error: any) {
      logger.error('Stripe Session Error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Admin Routes
  app.get('/api/admin/logs', authenticate, async (req, res) => {
    try {
      const authUser = (req as any).user;
      
      // Verify Admin Role (using email for now as per firestore.rules)
      if (authUser.email !== "alexanderhs024@gmail.com") {
        return res.status(403).json({ error: 'Prohibido: Se requieren privilegios de administrador' });
      }

      const snapshot = await db.collection('audit_logs')
        .orderBy('timestamp', 'desc')
        .limit(50)
        .get();
      
      const logs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate?.() || doc.data().timestamp
      }));
      
      res.json(logs);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  /**
   * @swagger
   * /api/generate-content:
   *   post:
   *     summary: Genera contenido para redes sociales basado en un diagnóstico
   *     security:
   *       - bearerAuth: []
   */
  app.post('/api/generate-content', authenticate, async (req, res) => {
    const { diagnosisId, platform } = req.body;
    const authUser = (req as any).user;

    logger.info(`Generating content for diagnosis ${diagnosisId}, platform: ${platform}`);

    if (!diagnosisId) {
      return res.status(400).json({ error: 'ID de diagnóstico requerido' });
    }

    try {
      const docSnap = await db.collection('diagnoses').doc(diagnosisId).get();
      if (!docSnap.exists) {
        logger.warn(`Diagnosis ${diagnosisId} not found`);
        return res.status(404).json({ error: 'Diagnóstico no encontrado' });
      }

      const diagnosis = docSnap.data();
      if (diagnosis?.userId !== authUser.uid) {
        logger.warn(`User ${authUser.uid} tried to access diagnosis ${diagnosisId} owned by ${diagnosis?.userId}`);
        return res.status(403).json({ error: 'Prohibido: No tienes acceso a este diagnóstico' });
      }

      const prompt = `
        ACTÚA COMO UN EXPERTO EN GROWTH HACKING Y CONTENT MARKETING.
        
        CONTEXTO DEL NEGOCIO:
        - Modelo: ${diagnosis?.output.recommendedModel}
        - Oferta: ${diagnosis?.output.offer.promise}
        - Valor: ${diagnosis?.output.offer.valueProposition}
        - Precio: ${diagnosis?.output.offer.price}
        
        SOLICITUD:
        Genera una estrategia de contenido para la plataforma: ${platform || 'Instagram/TikTok (Reels)'}.
        
        REGLAS CRÍTICAS:
        1. Responde ÚNICAMENTE con un objeto JSON válido.
        2. No incluyas texto explicativo fuera del JSON.
        3. El calendario debe ser de 7 días.
        
        FORMATO DE RESPUESTA (JSON ESTRICTO):
        {
          "strategy": "string (resumen de la estrategia)",
          "contentCalendar": [
            {
              "day": "Día 1",
              "hook": "string (gancho inicial)",
              "body": "string (cuerpo del contenido)",
              "cta": "string (llamado a la acción)",
              "type": "string (Educativo, Venta, Entretenimiento, etc.)"
            }
          ],
          "tips": ["string"]
        }
      `;

      let result;
      let rawResponse = '';
      
      if (openai) {
        const completion = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            { role: "system", content: "Eres un experto en marketing digital y ventas de servicios con IA. Responde siempre en formato JSON." },
            { role: "user", content: prompt }
          ],
          response_format: { type: "json_object" }
        });
        rawResponse = completion.choices[0].message.content || '{}';
      } else if (genAI) {
        const model = genAI.getGenerativeModel({ 
          model: "gemini-2.0-flash",
          generationConfig: { responseMimeType: "application/json" }
        });
        const geminiResult = await model.generateContent(prompt);
        rawResponse = geminiResult.response.text();
      } else {
        return res.status(503).json({ error: 'No AI models available' });
      }

      try {
        const cleaned = cleanJSON(rawResponse);
        result = JSON.parse(cleaned);
        
        // Basic validation of the result structure
        if (!result.strategy || !Array.isArray(result.contentCalendar)) {
          throw new Error('Estructura de respuesta inválida');
        }
      } catch (parseError) {
        logger.error('Error parsing AI response:', { rawResponse, parseError });
        throw new Error('La IA devolvió un formato incompatible. Por favor, intenta de nuevo.');
      }

      res.json(result);
    } catch (error: any) {
      logger.error('Content Generation Error:', error);
      res.status(500).json({ error: error.message || 'Error al generar contenido' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    logger.info(`Server running on http://localhost:${PORT}`);
    logger.info(`Swagger docs available at http://localhost:${PORT}/api-docs`);
  });

  // Sentry Error Handler
  if (process.env.SENTRY_DSN) {
    Sentry.setupExpressErrorHandler(app);
  }

  // Global Error Handler
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Unhandled Error:', err);
    res.status(500).json({ 
      error: 'Error interno del servidor',
      message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  });
}

startServer();
