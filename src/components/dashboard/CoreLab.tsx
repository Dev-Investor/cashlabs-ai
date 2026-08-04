import React from 'react';
import { UserProfile, DiagnosisResult } from '../../types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { 
  BarChart3, 
  Zap, 
  TrendingUp, 
  FileText, 
  Clock, 
  ArrowRight,
  ShieldCheck,
  Target
} from 'lucide-react';
import { motion } from 'motion/react';

interface CoreLabProps {
  userProfile: UserProfile | null;
  latestDiagnosis: DiagnosisResult | null;
  onNavigate: (lab: string) => void;
}

export function CoreLab({ userProfile, latestDiagnosis, onNavigate }: CoreLabProps) {
  const score = userProfile?.aiIncomeScore || 0;
  
  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Hero Section: AI Income Score */}
      <Card className="bg-card-bg border-border overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-neon-green/5 blur-[100px] rounded-full -mr-48 -mt-48" />
        <CardContent className="p-10 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="relative w-48 h-48 shrink-0">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="transparent"
                  className="text-slate-800/50"
                />
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="transparent"
                  strokeDasharray={552.92}
                  strokeDashoffset={552.92 * (1 - score / 100)}
                  className="text-neon-green transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl font-black text-white">{score}</span>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Score</span>
              </div>
            </div>
            
            <div className="flex-grow text-center md:text-left space-y-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon-green/10 border border-neon-green/20 text-neon-green text-[10px] font-black uppercase tracking-widest mb-4">
                  <BarChart3 className="w-3 h-3" />
                  AI Income Score™
                </div>
                <h2 className="text-4xl font-black text-white tracking-tight mb-2">
                  Nivel: <span className="text-neon-green">{userProfile?.level || 'Explorer'}</span>
                </h2>
                <p className="text-slate-400 text-lg max-w-xl">
                  Tu preparación actual para generar ingresos con IA. Sigue las recomendaciones para escalar tu score.
                </p>
              </div>
              
              <Button 
                onClick={() => onNavigate('service')}
                className="bg-neon-green hover:bg-bright-green text-deep-black font-bold px-8 h-12 rounded-xl transition-all hover:scale-105"
              >
                Mejorar mi Score
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grid Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Activos Digitales"
          value="3 Agentes / 12 Prompts"
          icon={<Zap className="w-5 h-5 text-neon-green" />}
          onClick={() => onNavigate('agents')}
        />
        <StatCard 
          title="Ingresos Generados"
          value="$0.00"
          icon={<TrendingUp className="w-5 h-5 text-neon-green" />}
          onClick={() => onNavigate('analytics')}
        />
        <StatCard 
          title="Nivel de Ecosistema"
          value={userProfile?.level || 'Explorer'}
          icon={<ShieldCheck className="w-5 h-5 text-neon-green" />}
          onClick={() => onNavigate('subscription')}
        />
        <StatCard 
          title="Próxima Acción"
          value="Crear Agente de Ventas"
          icon={<Target className="w-5 h-5 text-neon-green" />}
          onClick={() => onNavigate('agents')}
        />
      </div>

      {/* Recent Activity or Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 bg-card-bg border-border">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-neon-green" />
              Actividad Reciente
            </CardTitle>
          </CardHeader>
          <CardContent>
            {latestDiagnosis ? (
              <div className="space-y-4">
                <div className="p-4 bg-slate-800/30 rounded-xl border border-border flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-white">Diagnóstico Completado</p>
                    <p className="text-xs text-slate-500">{new Date(latestDiagnosis.createdAt).toLocaleDateString()}</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => onNavigate('history')} className="text-neon-green hover:bg-neon-green/10">
                    Ver Historial Completo
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-slate-500 text-sm">No hay actividad reciente.</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-card-bg border-border">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-neon-green" />
              Estatus del Plan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 bg-neon-green/5 rounded-xl border border-neon-green/20">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Plan Actual</p>
              <p className="text-xl font-black text-neon-green">{userProfile?.plan || 'START'}</p>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-bold text-white uppercase tracking-widest">Beneficios Activos</p>
              <ul className="space-y-2">
                <BenefitItem text="1 Modelo recomendado" />
                <BenefitItem text="Acceso a ServiceLab" />
                <BenefitItem text="AI Income Score™ básico" />
              </ul>
            </div>
            <Button 
              onClick={() => onNavigate('subscription')}
              className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold"
            >
              Mejorar Plan
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, onClick }: { title: string; value: string; icon: React.ReactNode; onClick: () => void }) {
  return (
    <Card 
      className="bg-card-bg border-border hover:border-neon-green/30 transition-all cursor-pointer group"
      onClick={onClick}
    >
      <CardContent className="p-6 space-y-4">
        <div className="w-10 h-10 rounded-xl bg-neon-green/10 flex items-center justify-center text-neon-green border border-neon-green/20 group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <div>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{title}</p>
          <p className="text-sm font-bold text-white line-clamp-1">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function BenefitItem({ text }: { text: string }) {
  return (
    <li className="flex items-center gap-2 text-xs text-slate-400">
      <div className="w-1 h-1 rounded-full bg-neon-green" />
      {text}
    </li>
  );
}
