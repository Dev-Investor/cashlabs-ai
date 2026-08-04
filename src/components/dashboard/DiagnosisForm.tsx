import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent } from '../ui/card';
import { Loader2, Sparkles, Brain, Search, Target, Clock, Wallet, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  onGenerate: (data: any) => Promise<void>;
  loading: boolean;
}

export function DiagnosisForm({ onGenerate, loading }: Props) {
  const [formData, setFormData] = useState({
    experience: '',
    skills: '',
    time: '',
    capital: '',
    incomeGoal: ''
  });

  const [loadingMessage, setLoadingMessage] = useState('');
  const messages = [
    "Analizando tu perfil estratégico...",
    "Escaneando modelos de negocio rentables...",
    "Validando oportunidades en el mercado latino...",
    "Estructurando tu plan de acción de 30 días...",
    "Finalizando tu ruta de monetización..."
  ];

  React.useEffect(() => {
    if (loading) {
      let i = 0;
      setLoadingMessage(messages[0]);
      const interval = setInterval(() => {
        i = (i + 1) % messages.length;
        setLoadingMessage(messages[i]);
      }, 2500);
      return () => clearInterval(interval);
    }
  }, [loading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(formData);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Card className="border-border shadow-2xl bg-card-bg backdrop-blur-xl overflow-hidden">
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="experience" className="text-white font-bold flex items-center gap-2 text-base">
                  <Brain className="w-5 h-5 text-neon-green" />
                  ¿Cuál es tu nivel actual en negocios digitales?
                </Label>
                <Input
                  id="experience"
                  placeholder="Ej: Principiante, intermedio, avanzado"
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  required
                  className="h-14 bg-slate-800/30 border-border text-white placeholder:text-slate-600 focus:border-neon-green focus:ring-neon-green/20 transition-all"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="skills" className="text-white font-bold flex items-center gap-2 text-base">
                  <Zap className="w-5 h-5 text-neon-green" />
                  ¿Qué habilidades tienes actualmente?
                </Label>
                <Input
                  id="skills"
                  placeholder="Ej: ventas, diseño, programación, marketing, organización, etc."
                  value={formData.skills}
                  onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                  required
                  className="h-14 bg-slate-800/30 border-border text-white placeholder:text-slate-600 focus:border-neon-green focus:ring-neon-green/20 transition-all"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="time" className="text-white font-bold flex items-center gap-2 text-base">
                    <Clock className="w-5 h-5 text-neon-green" />
                    ¿Cuánto tiempo puedes dedicar por semana?
                  </Label>
                  <Input
                    id="time"
                    placeholder="Ej: 5 horas, 10 horas, tiempo completo"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    required
                    className="h-14 bg-slate-800/30 border-border text-white placeholder:text-slate-600 focus:border-neon-green focus:ring-neon-green/20 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="capital" className="text-white font-bold flex items-center gap-2 text-base">
                    <Wallet className="w-5 h-5 text-neon-green" />
                    ¿Cuánto capital puedes invertir inicialmente?
                  </Label>
                  <Input
                    id="capital"
                    placeholder="Ej: $0, $200, $1000"
                    value={formData.capital}
                    onChange={(e) => setFormData({ ...formData, capital: e.target.value })}
                    required
                    className="h-14 bg-slate-800/30 border-border text-white placeholder:text-slate-600 focus:border-neon-green focus:ring-neon-green/20 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="incomeGoal" className="text-white font-bold flex items-center gap-2 text-base">
                  <Target className="w-5 h-5 text-neon-green" />
                  ¿Cuál es tu meta mensual de ingresos?
                </Label>
                <Input
                  id="incomeGoal"
                  placeholder="Ej: $1000 USD, $3000 USD, etc."
                  value={formData.incomeGoal}
                  onChange={(e) => setFormData({ ...formData, incomeGoal: e.target.value })}
                  required
                  className="h-14 bg-slate-800/30 border-border text-white placeholder:text-slate-600 focus:border-neon-green focus:ring-neon-green/20 transition-all"
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-neon-green hover:bg-bright-green text-deep-black h-16 text-xl font-extrabold shadow-lg shadow-neon-green/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-6 w-6 animate-spin mr-2" />
              ) : (
                <Sparkles className="h-6 w-6 mr-2" />
              )}
              {loading ? 'Generando Ruta...' : 'Generar Mi Ruta de Monetización'}
            </Button>

            <AnimatePresence>
              {loading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-4"
                >
                  <p className="text-neon-green font-bold animate-pulse text-lg">
                    {loadingMessage}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
