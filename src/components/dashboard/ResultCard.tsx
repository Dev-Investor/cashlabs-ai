import React from 'react';
import { DiagnosisResult } from '../../types';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '../ui/card';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { 
  CheckCircle2, 
  Target, 
  Zap, 
  DollarSign, 
  Calendar, 
  Rocket, 
  ShieldCheck,
  Briefcase,
  ArrowRight,
  BarChart3
} from 'lucide-react';
import { motion } from 'motion/react';

interface Props {
  diagnosis: DiagnosisResult;
}

export const ResultCard: React.FC<Props> = ({ diagnosis }) => {
  const { output } = diagnosis;

  const levelColors = {
    'Explorer': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    'Builder': 'bg-neon-green/10 text-neon-green border-neon-green/20',
    'Agency Owner': 'bg-purple-500/10 text-purple-400 border-purple-500/20'
  }[output?.level || 'Explorer'] || 'bg-neon-green/10 text-neon-green border-neon-green/20';

  if (!output) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Top Banner: AI Income Score */}
      <Card className="bg-card-bg border-border shadow-2xl backdrop-blur-md overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-neon-green/5 blur-[80px] rounded-full -mr-32 -mt-32" />
        <CardContent className="p-8 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="relative w-40 h-40 shrink-0">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="80"
                  cy="80"
                  r="72"
                  stroke="currentColor"
                  strokeWidth="10"
                  fill="transparent"
                  className="text-slate-800/50"
                />
                <circle
                  cx="80"
                  cy="80"
                  r="72"
                  stroke="currentColor"
                  strokeWidth="10"
                  fill="transparent"
                  strokeDasharray={452.39}
                  strokeDashoffset={452.39 * (1 - (output.aiIncomeScore?.score || 0) / 100)}
                  className="text-neon-green"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-black text-white">{output.aiIncomeScore?.score || 0}</span>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Score</span>
              </div>
            </div>
            
            <div className="flex-grow text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon-green/10 border border-neon-green/20 text-neon-green text-[10px] font-black uppercase tracking-widest mb-4">
                <BarChart3 className="w-3 h-3" />
                AI Income Score™
              </div>
              <h2 className="text-3xl font-black text-white mb-4 tracking-tight">
                Tu potencial de ingresos es <span className="text-neon-green">estratégico.</span>
              </h2>
              <div className="p-4 bg-slate-800/30 rounded-xl border border-border inline-block max-w-xl">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-neon-green/20 flex items-center justify-center text-neon-green shrink-0 mt-1">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Paso Crítico para Escalar</p>
                    <p className="text-sm text-white font-medium leading-relaxed">
                      {output.criticalNextStep || 'Sigue el plan de acción para ver resultados.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Level & Model */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-card-bg border-border shadow-xl backdrop-blur-sm overflow-hidden">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Nivel Estratégico</span>
                <Badge className={`${levelColors} border font-bold`}>
                  {output.level || 'Explorer'}
                </Badge>
              </div>
              <CardTitle className="text-2xl font-bold text-white">Tu Perfil IA</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 bg-slate-800/30 rounded-xl border border-border">
                <div className="flex items-center gap-2 mb-2 text-neon-green font-bold text-sm">
                  <Briefcase className="w-4 h-4" />
                  Modelo Recomendado
                </div>
                <p className="text-white font-medium leading-relaxed">
                  {output.recommendedModel || 'Modelo de servicio IA personalizado'}
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 text-white font-bold text-sm">
                  <ShieldCheck className="w-4 h-4 text-neon-green" />
                  Plan de Acción 30 Días
                </div>
                <div className="space-y-3">
                  <ActionStep week="Semana 1" content={output.actionPlan?.week1 || 'Configuración inicial'} />
                  <ActionStep week="Semana 2" content={output.actionPlan?.week2 || 'Lanzamiento de oferta'} />
                  <ActionStep week="Semana 3" content={output.actionPlan?.week3 || 'Prospección activa'} />
                  <ActionStep week="Semana 4" content={output.actionPlan?.week4 || 'Escalamiento'} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-neon-green/5 border-neon-green/20 shadow-xl backdrop-blur-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2 text-neon-green font-bold text-sm">
                <Rocket className="w-4 h-4" />
                Próximos Pasos
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {(output.nextSteps || []).map((step, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                    <div className="mt-1 w-1.5 h-1.5 rounded-full bg-neon-green shrink-0" />
                    {step}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: The Offer */}
        <div className="lg:col-span-2">
          <Card className="bg-card-bg border-border shadow-2xl backdrop-blur-sm h-full">
            <CardHeader className="border-b border-border pb-6">
              <div className="flex items-center gap-2 text-neon-green font-bold text-sm mb-2 uppercase tracking-widest">
                <Zap className="w-4 h-4" />
                Oferta Irresistible
              </div>
              <CardTitle className="text-3xl font-bold text-white leading-tight">
                {output.offer?.promise || 'Tu oferta de alto valor'}
              </CardTitle>
              <CardDescription className="text-slate-400 text-lg mt-2">
                {output.offer?.valueProposition || 'Propuesta de valor estratégica'}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <OfferSection title="Nicho Objetivo" content={output.offer?.niche || 'Mercado específico'} icon={<Target className="w-4 h-4 text-neon-green" />} />
                  <OfferSection title="Problema que Resuelve" content={output.offer?.problem || 'Punto de dolor del cliente'} icon={<Zap className="w-4 h-4 text-neon-green" />} />
                </div>
                <div className="space-y-6">
                  <OfferSection title="Entregables del Servicio" content={output.offer?.deliverables || 'Soluciones concretas'} icon={<Calendar className="w-4 h-4 text-neon-green" />} />
                  <div className="p-5 bg-neon-green text-deep-black rounded-2xl shadow-lg shadow-neon-green/20">
                    <div className="flex items-center gap-2 mb-1 opacity-80 font-bold text-[10px] uppercase tracking-widest">
                      <DollarSign className="w-3 h-3" />
                      Inversión Sugerida
                    </div>
                    <p className="text-3xl font-black">{output.offer?.price || '$500 - $1500 USD'}</p>
                    <p className="text-[10px] mt-2 font-bold opacity-80 leading-tight">
                      {output.offer?.priceJustification || 'Basado en el valor entregado y el mercado actual.'}
                    </p>
                  </div>
                </div>
              </div>

              <Separator className="bg-border" />

              <div className="bg-slate-800/30 p-6 rounded-2xl border border-border">
                <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-neon-green" />
                  ¿Por qué esta oferta funcionará?
                </h4>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Esta estructura ha sido diseñada específicamente para tu nivel <span className="text-neon-green font-bold">{output.level || 'Explorer'}</span> y tus habilidades actuales. El modelo <span className="text-white font-medium">{output.recommendedModel || 'IA'}</span> tiene una alta demanda en el mercado hispano actual, permitiéndote posicionarte como un experto en IA desde el primer día.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

function ActionStep({ week, content }: { week: string; content: string }) {
  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <div className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] font-bold text-neon-green shrink-0">
          {week.split(' ')[1]}
        </div>
        <div className="w-px h-full bg-slate-800 my-1" />
      </div>
      <div className="pb-4">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">{week}</span>
        <p className="text-xs text-slate-300 leading-relaxed">{content}</p>
      </div>
    </div>
  );
}

function OfferSection({ title, content, icon }: { title: string; content: string; icon: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-white font-bold text-sm">
        {icon}
        {title}
      </div>
      <p className="text-slate-400 text-sm leading-relaxed">
        {content}
      </p>
    </div>
  );
}
