import React from 'react';
import { motion } from 'motion/react';
import { 
  CheckCircle2, 
  ArrowRight, 
  Zap, 
  ShieldCheck, 
  TrendingUp, 
  Target, 
  Users, 
  BarChart3,
  Globe,
  ChevronRight
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { BrandLogo } from '../ui/BrandLogo';

interface LandingPageProps {
  onGetStarted: () => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-[#0B0F14] text-slate-300 selection:bg-neon-green selection:text-deep-black relative overflow-hidden">
      {/* Grid Background */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03] bg-grid" />
      
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-[#0B0F14]/80 backdrop-blur-md border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <BrandLogo size="md" />
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <a href="#solucion" className="hover:text-white transition-colors">Solución</a>
            <a href="#score" className="hover:text-white transition-colors">AI Income Score™</a>
            <a href="#planes" className="hover:text-white transition-colors">Planes</a>
          </div>
          <Button 
            onClick={onGetStarted}
            className="bg-neon-green hover:bg-bright-green text-deep-black font-bold px-6"
          >
            Comenzar Ahora
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-neon-green/10 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-bright-green/5 blur-[120px] rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon-green/10 border border-neon-green/20 text-neon-green text-xs font-bold uppercase tracking-widest mb-6">
                <Zap className="w-3 h-3" />
                AI Revenue Infrastructure
              </div>
              <h1 className="text-5xl lg:text-7xl font-black text-white tracking-tight leading-[1.1] mb-6">
                Convierte <span className="text-neon-green">AI</span> en <br /> Dinero Real
              </h1>
              <p className="text-xl text-slate-400 mb-8 leading-relaxed max-w-xl">
                Lanza tu servicio con Inteligencia Artificial en 30 días, incluso si empiezas desde cero.
              </p>
              
              <div className="space-y-4 mb-10">
                <HeroBullet text="Descubre qué servicio con IA puedes vender" />
                <HeroBullet text="Obtén tu oferta lista para cobrar" />
                <HeroBullet text="Recibe un plan paso a paso" />
                <HeroBullet text="Escala hacia una micro‑agencia" />
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg"
                  onClick={onGetStarted}
                  className="bg-neon-green hover:bg-bright-green text-deep-black font-black text-lg px-8 h-16 shadow-lg shadow-neon-green/20"
                >
                  Comenzar Ahora
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  className="border-slate-700 text-white hover:bg-slate-800 font-bold text-lg px-8 h-16"
                >
                  Ver Cómo Funciona
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden aspect-video lg:aspect-square flex flex-col">
                <div className="h-12 bg-slate-800/50 border-b border-slate-700 flex items-center px-4 gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/20" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                    <div className="w-3 h-3 rounded-full bg-green-500/20" />
                  </div>
                  <div className="flex-grow text-center text-[10px] text-slate-500 font-mono">cashlabs.ai/dashboard</div>
                </div>
                <div className="flex-grow p-8 flex flex-col items-center justify-center text-center">
                  <div className="relative w-48 h-48 mb-8">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="96"
                        cy="96"
                        r="88"
                        stroke="currentColor"
                        strokeWidth="12"
                        fill="transparent"
                        className="text-slate-800"
                      />
                      <circle
                        cx="96"
                        cy="96"
                        r="88"
                        stroke="currentColor"
                        strokeWidth="12"
                        fill="transparent"
                        strokeDasharray={552.92}
                        strokeDashoffset={552.92 * (1 - 0.62)}
                        className="text-neon-green"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-4xl font-black text-white">62</span>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Score</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">AI Income Score™</h3>
                  <Badge className="bg-neon-green/10 text-neon-green border-neon-green/20 mb-4">Nivel: Builder</Badge>
                  <p className="text-sm text-slate-500 max-w-xs">Tu progreso es medible. Tu crecimiento es estratégico.</p>
                </div>
              </div>
              {/* Floating elements */}
              <div className="absolute -top-6 -right-6 bg-slate-800 border border-slate-700 p-4 rounded-xl shadow-xl animate-bounce-slow">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-neon-green/20 flex items-center justify-center text-neon-green">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-slate-500 uppercase">Ingresos Proyectados</div>
                    <div className="text-lg font-bold text-white">$3,500 USD</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-24 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-black text-white mb-4">¿Por qué la mayoría no gana dinero con IA?</h2>
            <p className="text-slate-500 text-lg">La brecha entre la curiosidad y la rentabilidad es la ejecución.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <ProblemCard 
              text="Consumen información pero no ejecutan" 
              description="El exceso de tutoriales sin un plan de acción real paraliza el crecimiento."
            />
            <ProblemCard 
              text="No saben qué servicio ofrecer" 
              description="Intentan vender de todo a todos sin especializarse en un nicho rentable."
            />
            <ProblemCard 
              text="No tienen una oferta clara" 
              description="Sin una promesa de valor medible, el mercado ignora tu propuesta."
            />
          </div>

          <div className="text-center">
            <div className="inline-block p-8 rounded-2xl bg-deep-black border border-slate-800">
              <p className="text-2xl font-bold text-slate-400">
                La IA no genera dinero. <br />
                <span className="text-white">Los sistemas estratégicos sí.</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section id="solucion" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl lg:text-5xl font-black text-white mb-4">CashLabsAI convierte tu potencial en ingresos medibles.</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-px bg-slate-800 -translate-y-1/2 z-0" />
            <SolutionStep number="1" title="Diagnóstico Inteligente" description="Analizamos tu perfil, capital y tiempo." />
            <SolutionStep number="2" title="Modelo de Servicio" description="Recomendamos el servicio IA ideal para ti." />
            <SolutionStep number="3" title="Oferta Irresistible" description="Creamos tu propuesta de valor lista para vender." />
            <SolutionStep number="4" title="Plan de Acción" description="Tu hoja de ruta de 30 días paso a paso." />
          </div>

          <div className="mt-20 text-center">
            <Button 
              size="lg"
              onClick={onGetStarted}
              className="bg-neon-green hover:bg-bright-green text-deep-black font-black text-xl px-12 h-20 rounded-2xl shadow-2xl shadow-neon-green/20"
            >
              Crear Mi Ruta de Monetización
            </Button>
          </div>
        </div>
      </section>

      {/* AI Income Score Section */}
      <section id="score" className="py-24 bg-slate-900/30 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative order-2 lg:order-1">
              <div className="absolute inset-0 bg-neon-green/20 blur-[100px] rounded-full" />
              <Card className="relative bg-slate-900 border-slate-800 p-12 flex flex-col items-center text-center">
                <div className="relative w-64 h-64 mb-8">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="128" cy="128" r="116" stroke="currentColor" strokeWidth="16" fill="transparent" className="text-slate-800" />
                    <circle cx="128" cy="128" r="116" stroke="currentColor" strokeWidth="16" fill="transparent" strokeDasharray={728.85} strokeDashoffset={728.85 * (1 - 0.62)} className="text-neon-green" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-6xl font-black text-white">62</span>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Score</span>
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-white mb-2">AI Income Score™: 62 / 100</h3>
                <Badge className="bg-neon-green/10 text-neon-green border-neon-green/20 text-lg px-6 py-1 mb-6">Nivel: Builder</Badge>
                <p className="text-slate-400 text-lg leading-relaxed">
                  No es motivación. <br />
                  <span className="text-white font-bold">Es estrategia medible.</span>
                </p>
              </Card>
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-4xl lg:text-6xl font-black text-white mb-6 leading-tight">Tu progreso es medible. <br /> Tu crecimiento es estratégico.</h2>
              <p className="text-xl text-slate-400 mb-10 leading-relaxed">
                CashLabsAI incluye el AI Income Score™, una métrica propietaria que evalúa tu preparación para generar ingresos con Inteligencia Artificial.
              </p>
              <Button 
                size="lg"
                onClick={onGetStarted}
                className="bg-white hover:bg-slate-200 text-deep-black font-black text-lg px-8 h-16"
              >
                Descubrir Mi Score
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Plans Section */}
      <section id="planes" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl lg:text-5xl font-black text-white mb-4">Elige tu nivel de crecimiento</h2>
            <p className="text-slate-500 text-lg">Planes diseñados para cada etapa de tu carrera en IA.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <PlanCard 
              name="START" 
              color="text-neon-green" 
              features={[
                "Diagnóstico básico",
                "1 modelo recomendado",
                "Oferta simplificada",
                "Plan resumido",
                "AI Income Score™ visible"
              ]}
              onSelect={onGetStarted}
            />
            <PlanCard 
              name="PRO" 
              color="text-bright-green" 
              featured 
              features={[
                "Diagnóstico avanzado",
                "Hasta 3 modelos",
                "Oferta profesional completa",
                "Plan detallado 30 días",
                "AI Income Score™ con desglose",
                "Recomendaciones estratégicas"
              ]}
              onSelect={onGetStarted}
            />
            <PlanCard 
              name="FUNDADOR" 
              color="text-purple-400" 
              features={[
                "Todo lo de PRO",
                "Acceso futuro a comunidad",
                "Acceso prioritario a funciones",
                "Insignia Founder",
                "Precio congelado de por vida"
              ]}
              limited
              onSelect={onGetStarted}
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex flex-col items-center md:items-start gap-4">
              <BrandLogo size="md" />
              <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">AI Revenue Infrastructure</span>
            </div>
            <div className="text-slate-500 text-sm">
              © 2026 CashLabsAI. Todos los derechos reservados.
            </div>
            <div className="flex gap-8 text-sm text-slate-500">
              <a href="#" className="hover:text-white">Términos</a>
              <a href="#" className="hover:text-white">Privacidad</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function HeroBullet({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3 text-slate-300 font-medium">
      <div className="w-5 h-5 rounded-full bg-neon-green/20 flex items-center justify-center text-neon-green">
        <CheckCircle2 className="w-3.5 h-3.5" />
      </div>
      {text}
    </div>
  );
}

function ProblemCard({ text, description }: { text: string; description: string }) {
  return (
    <Card className="bg-slate-900/50 border-slate-800 p-8 hover:border-red-500/20 transition-all group">
      <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500 mb-6 group-hover:scale-110 transition-transform">
        <span className="text-2xl font-bold">×</span>
      </div>
      <h3 className="text-xl font-bold text-white mb-3">{text}</h3>
      <p className="text-slate-500 text-sm leading-relaxed">{description}</p>
    </Card>
  );
}

function SolutionStep({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="relative z-10 flex flex-col items-center text-center">
      <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-2xl font-black text-neon-green mb-6 shadow-xl">
        {number}
      </div>
      <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
      <p className="text-sm text-slate-500 max-w-[180px]">{description}</p>
    </div>
  );
}

function PlanCard({ name, color, features, featured, limited, onSelect }: { name: string; color: string; features: string[]; featured?: boolean; limited?: boolean; onSelect: () => void }) {
  return (
    <Card className={`relative bg-slate-900 border-slate-800 p-8 flex flex-col h-full ${featured ? 'border-neon-green/50 shadow-2xl shadow-neon-green/10 scale-105 z-10' : ''}`}>
      {featured && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-neon-green text-deep-black text-[10px] font-black uppercase tracking-widest px-4 py-1 rounded-full">
          Recomendado
        </div>
      )}
      <div className="mb-8">
        <h3 className={`text-2xl font-black mb-2 ${color}`}>{name}</h3>
        {limited && (
          <div className="flex items-center gap-2 text-red-400 text-[10px] font-bold uppercase tracking-widest">
            <Users className="w-3 h-3" />
            12 cupos restantes
          </div>
        )}
      </div>
      <ul className="space-y-4 mb-10 flex-grow">
        {features.map((f, i) => (
          <li key={i} className="flex items-start gap-3 text-sm text-slate-400">
            <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${color}`} />
            {f}
          </li>
        ))}
      </ul>
      <Button 
        onClick={onSelect}
        className={`w-full font-black h-14 rounded-xl ${featured ? 'bg-neon-green hover:bg-bright-green text-deep-black' : 'bg-slate-800 hover:bg-slate-700 text-white'}`}
      >
        Seleccionar Plan
      </Button>
    </Card>
  );
}

function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}>
      {children}
    </span>
  );
}
