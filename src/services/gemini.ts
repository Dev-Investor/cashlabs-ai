import { GoogleGenAI, Type } from "@google/genai";
import { DiagnosisResult, UserPlan } from "../types";
import { auth } from "../lib/firebase";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

function cleanJSON(text: string): string {
  if (!text) return "";
  return text.replace(/```json\n?|```/g, '').trim();
}

const SYSTEM_PROMPT = `Eres el SUPER PROMPT MAESTRO de CashLabs AI, un ecosistema digital Full Stack todo-en-uno.

VISIÓN: CashLabs AI es un laboratorio digital futurista donde los usuarios CREAN, MONETIZAN, CONSTRUYEN, ESCALAN y AUTOMATIZAN activos digitales bajo una sola suscripción.

TU ROL:
- Actúa como el Arquitecto Jefe del Ecosistema.
- Tu misión es convertir a cada usuario en un "Empresario Digital de Activos IA".
- Eres una combinación de estratega de negocios, experto en IA y mentor de monetización.

REGLAS DE ORO:
- Tono: Profesional, futurista, tecnológico, directo y altamente accionable.
- Estética Verbal: Usa términos como "Activos Digitales", "Infraestructura de Ingresos", "Escalabilidad Modular", "Ecosistema IA".
- No generes respuestas genéricas. Cada consejo debe ser un paso hacia la monetización real.
- CashLabs AI es el "App Store" de la Inteligencia Artificial para emprendedores.`;

export async function generateDiagnosis(input: {
  experience: string;
  skills: string;
  time: string;
  capital: string;
  incomeGoal: string;
  userPlan: UserPlan;
  userId: string;
}): Promise<DiagnosisResult['output'] & { id?: string }> {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('Debes iniciar sesión para realizar un diagnóstico');
  }

  // Try backend first (for OpenAI if configured)
  try {
    const token = await user.getIdToken();
    const response = await fetch('/api/diagnosis', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(input),
    });

    if (response.ok) {
      return response.json();
    }
    
    // If backend fails with 500 or 404, we fallback to local Gemini
    // But if it's a 400 (validation) or 401/403 (auth), we throw
    if (response.status === 400 || response.status === 401 || response.status === 403) {
      const error = await response.json();
      throw new Error(error.error || 'Error en la solicitud');
    }
  } catch (e) {
    console.warn('Backend diagnosis failed, falling back to local Gemini:', e);
  }

  // Fallback to local Gemini call (Frontend)
  const prompt = `
    SOLICITUD DE DIAGNÓSTICO ESTRATÉGICO:
    - Experiencia: ${input.experience}
    - Habilidades: ${input.skills}
    - Tiempo: ${input.time}
    - Capital: ${input.capital}
    - Meta: ${input.incomeGoal}
    - Plan: ${input.userPlan}
    
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

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        systemInstruction: SYSTEM_PROMPT,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            level: { type: Type.STRING },
            aiIncomeScore: {
              type: Type.OBJECT,
              properties: {
                score: { type: Type.NUMBER },
                level: { type: Type.STRING },
              },
              required: ["score", "level"],
            },
            recommendedModel: { type: Type.STRING },
            offer: {
              type: Type.OBJECT,
              properties: {
                niche: { type: Type.STRING },
                problem: { type: Type.STRING },
                valueProposition: { type: Type.STRING },
                promise: { type: Type.STRING },
                deliverables: { type: Type.STRING },
                price: { type: Type.STRING },
                priceJustification: { type: Type.STRING },
              },
              required: ["niche", "problem", "valueProposition", "promise", "deliverables", "price", "priceJustification"],
            },
            actionPlan: {
              type: Type.OBJECT,
              properties: {
                week1: { type: Type.STRING },
                week2: { type: Type.STRING },
                week3: { type: Type.STRING },
                week4: { type: Type.STRING },
              },
              required: ["week1", "week2", "week3", "week4"],
            },
            criticalNextStep: { type: Type.STRING },
            nextSteps: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: ["level", "aiIncomeScore", "recommendedModel", "offer", "actionPlan", "criticalNextStep", "nextSteps"],
        },
      }
    });

    const text = response.text;
    if (!text) throw new Error("No se recibió respuesta de la IA");
    return JSON.parse(cleanJSON(text));
  } catch (error: any) {
    console.error('Gemini Error:', error);
    throw new Error('Error al generar el diagnóstico con IA: ' + (error.message || 'Error desconocido'));
  }
}
