import React, { useState } from 'react';
import { DiagnosisResult } from '../../types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { 
  TrendingUp, 
  Video, 
  Linkedin, 
  Instagram, 
  Sparkles, 
  Loader2, 
  Calendar,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { auth } from '../../lib/firebase';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';

interface GrowthLabProps {
  latestDiagnosis: DiagnosisResult | null;
}

interface ContentStrategy {
  strategy: string;
  contentCalendar: {
    day: string;
    hook: string;
    body: string;
    cta: string;
    type: string;
  }[];
  tips: string[];
}

export function GrowthLab({ latestDiagnosis }: GrowthLabProps) {
  const [loading, setLoading] = useState(false);
  const [strategy, setStrategy] = useState<ContentStrategy | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState('Reels/TikTok');

  const generateContent = async () => {
    if (!latestDiagnosis) {
      toast.error('Primero debes realizar un diagnóstico en ServiceLab');
      return;
    }

    setLoading(true);
    try {
      const token = await auth.currentUser?.getIdToken();
      const response = await fetch('/api/generate-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          diagnosisId: latestDiagnosis.id,
          platform: selectedPlatform
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Error al generar contenido');
      
      setStrategy(data);
      toast.success('¡Estrategia de contenido generada!');
    } catch (error) {
      console.error(error);
      toast.error('No se pudo generar la estrategia');
    } finally {
      setLoading(false);
    }
  };

  if (!latestDiagnosis) {
    return (
      <div className="max-w-4xl mx-auto text-center py-20">
        <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-6">
          <TrendingUp className="w-10 h-10 text-slate-600" />
        </div>
        <h2 className="text-2xl font-black text-white mb-4">GrowthLab Bloqueado</h2>
        <p className="text-slate-500 mb-8 max-w-md mx-auto">
          Para generar estrategias de crecimiento, primero necesitamos analizar tu perfil en el ServiceLab.
        </p>
        <Button className="bg-neon-green text-deep-black font-bold">
          Ir a ServiceLab
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-white mb-2">GrowthLab</h1>
          <p className="text-slate-400">Escala tu oferta con estrategias de contenido impulsadas por IA.</p>
        </div>
        
        <div className="flex items-center gap-2 p-1 bg-slate-800/50 rounded-xl border border-border">
          <PlatformButton 
            active={selectedPlatform === 'Reels/TikTok'} 
            onClick={() => setSelectedPlatform('Reels/TikTok')}
            icon={<Video className="w-4 h-4" />}
            label="Reels/TikTok"
          />
          <PlatformButton 
            active={selectedPlatform === 'LinkedIn'} 
            onClick={() => setSelectedPlatform('LinkedIn')}
            icon={<Linkedin className="w-4 h-4" />}
            label="LinkedIn"
          />
          <PlatformButton 
            active={selectedPlatform === 'Instagram Feed'} 
            onClick={() => setSelectedPlatform('Instagram Feed')}
            icon={<Instagram className="w-4 h-4" />}
            label="Feed"
          />
        </div>
      </div>

      {!strategy ? (
        <Card className="bg-card-bg border-border overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-neon-green/5 blur-[80px] rounded-full -mr-32 -mt-32" />
          <CardContent className="p-12 text-center relative z-10">
            <Sparkles className="w-12 h-12 text-neon-green mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-white mb-4">Generar Estrategia de Contenido</h2>
            <p className="text-slate-400 mb-8 max-w-lg mx-auto">
              Crearemos un calendario de contenido de 7 días diseñado específicamente para vender tu oferta de: 
              <span className="text-neon-green font-bold ml-1">"{latestDiagnosis.output.offer.promise}"</span>
            </p>
            <Button 
              onClick={generateContent} 
              disabled={loading}
              className="bg-neon-green hover:bg-bright-green text-deep-black font-black px-10 h-14 text-lg shadow-lg shadow-neon-green/10"
            >
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Generar Plan de Growth'}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-card-bg border-border">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-neon-green" />
                  Calendario de 7 Días
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {strategy.contentCalendar.map((item, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    key={idx} 
                    className="p-6 bg-slate-800/30 rounded-2xl border border-border hover:border-neon-green/30 transition-all"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className="px-3 py-1 rounded-full bg-neon-green/10 text-neon-green text-[10px] font-black uppercase tracking-widest">
                        {item.day}
                      </span>
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                        Tipo: {item.type}
                      </span>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Gancho (Hook)</p>
                        <p className="text-white font-bold italic">"{item.hook}"</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Cuerpo</p>
                        <p className="text-slate-300 text-sm leading-relaxed">{item.body}</p>
                      </div>
                      <div className="pt-4 border-t border-border flex items-center justify-between">
                        <p className="text-xs font-bold text-neon-green">CTA: {item.cta}</p>
                        <Button variant="ghost" size="sm" className="text-[10px] text-slate-500 hover:text-white">
                          Copiar Texto
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="bg-card-bg border-border">
              <CardHeader>
                <CardTitle className="text-white">Estrategia Maestra</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {strategy.strategy}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card-bg border-border">
              <CardHeader>
                <CardTitle className="text-white">Tips de Ejecución</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {strategy.tips.map((tip, idx) => (
                  <div key={idx} className="flex gap-3">
                    <CheckCircle2 className="w-4 h-4 text-neon-green shrink-0 mt-0.5" />
                    <p className="text-xs text-slate-400">{tip}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Button 
              onClick={() => setStrategy(null)}
              variant="outline" 
              className="w-full border-border text-slate-400 hover:text-white"
            >
              Generar otra variante
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function PlatformButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
        active 
          ? 'bg-neon-green text-deep-black shadow-lg shadow-neon-green/10' 
          : 'text-slate-500 hover:text-slate-300'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
