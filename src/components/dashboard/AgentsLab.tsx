import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { 
  Bot, 
  Plus, 
  Play, 
  Settings2, 
  Trash2, 
  Sparkles,
  MessageSquare,
  Zap,
  Shield,
  BrainCircuit,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';

interface Agent {
  id: string;
  name: string;
  role: string;
  behavior: string;
  status: 'active' | 'idle';
  createdAt: number;
}

interface Props {
  onNavigate?: (lab: string) => void;
}

export function AgentsLab({ onNavigate }: Props) {
  const [agents, setAgents] = useState<Agent[]>([
    {
      id: '1',
      name: 'Estratega de Ventas',
      role: 'Cierre de High Ticket',
      behavior: 'Analiza perfiles de prospectos y genera guiones persuasivos basados en sus puntos de dolor.',
      status: 'active',
      createdAt: Date.now()
    }
  ]);

  const [isCreating, setIsCreating] = useState(false);
  const [newAgent, setNewAgent] = useState({ name: '', role: '', behavior: '' });
  const [loading, setLoading] = useState(false);

  const handleCreateAgent = () => {
    if (!newAgent.name || !newAgent.role || !newAgent.behavior) {
      toast.error('Por favor completa todos los campos');
      return;
    }

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const agent: Agent = {
        id: Math.random().toString(36).substr(2, 9),
        ...newAgent,
        status: 'active',
        createdAt: Date.now()
      };
      setAgents([agent, ...agents]);
      setNewAgent({ name: '', role: '', behavior: '' });
      setIsCreating(false);
      setLoading(false);
      toast.success('¡Agente de IA creado exitosamente!');
    }, 1500);
  };

  const deleteAgent = (id: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este agente de IA de forma permanente?')) {
      setAgents(agents.filter(a => a.id !== id));
      toast.success('Agente eliminado');
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-white mb-2 flex items-center gap-3">
            <Bot className="w-8 h-8 text-neon-green" />
            AI Agents Lab
          </h1>
          <p className="text-slate-400">Diseña, entrena y despliega agentes de IA especializados.</p>
        </div>
        
        <Button 
          onClick={() => setIsCreating(true)}
          className="bg-neon-green hover:bg-bright-green text-deep-black font-black"
        >
          <Plus className="w-5 h-5 mr-2" />
          Crear Nuevo Agente
        </Button>
      </div>

      <AnimatePresence>
        {isCreating && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <Card className="bg-slate-900/50 border-neon-green/30 neon-glow mb-8">
              <CardHeader>
                <CardTitle className="text-white">Configuración del Agente</CardTitle>
                <CardDescription>Define la identidad y el propósito de tu nuevo activo digital.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Nombre del Agente</label>
                    <Input 
                      placeholder="Ej: Growth Hacker Pro" 
                      value={newAgent.name}
                      onChange={(e) => setNewAgent({...newAgent, name: e.target.value})}
                      className="bg-slate-900 border-border focus:border-neon-green/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Rol / Especialidad</label>
                    <Input 
                      placeholder="Ej: Especialista en LinkedIn Ads" 
                      value={newAgent.role}
                      onChange={(e) => setNewAgent({...newAgent, role: e.target.value})}
                      className="bg-slate-900 border-border focus:border-neon-green/50"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Comportamiento e Instrucciones</label>
                  <Textarea 
                    placeholder="Describe detalladamente cómo debe actuar el agente, su tono y sus objetivos..." 
                    value={newAgent.behavior}
                    onChange={(e) => setNewAgent({...newAgent, behavior: e.target.value})}
                    className="bg-slate-900 border-border focus:border-neon-green/50 min-h-[120px]"
                  />
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <Button variant="ghost" onClick={() => setIsCreating(false)} className="text-slate-400">
                    Cancelar
                  </Button>
                  <Button 
                    onClick={handleCreateAgent} 
                    disabled={loading}
                    className="bg-neon-green text-deep-black font-bold px-8"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Desplegar Agente'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map((agent, idx) => (
          <motion.div
            key={agent.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card className="bg-card-bg border-border hover:border-neon-green/30 transition-all group relative overflow-hidden h-full flex flex-col">
              <div className="absolute top-0 right-0 p-4">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
                  <span className="text-[10px] font-bold text-neon-green uppercase tracking-widest">Online</span>
                </div>
              </div>
              
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center mb-4 group-hover:bg-neon-green/10 transition-colors">
                  <BrainCircuit className="w-6 h-6 text-slate-400 group-hover:text-neon-green" />
                </div>
                <CardTitle className="text-xl text-white">{agent.name}</CardTitle>
                <CardDescription className="font-bold text-neon-green/70">{agent.role}</CardDescription>
              </CardHeader>
              
              <CardContent className="flex-1 flex flex-col justify-between">
                <p className="text-sm text-slate-400 leading-relaxed italic">
                  "{agent.behavior}"
                </p>
                
                <div className="flex items-center gap-2 mt-8 pt-6 border-t border-border">
                  <Button 
                    size="sm" 
                    onClick={() => {
                      toast.info(`Iniciando chat con ${agent.name}...`);
                      onNavigate?.('chatbot');
                    }}
                    className="flex-1 bg-neon-green text-deep-black font-black transition-all hover:bg-bright-green"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Chat
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => toast.info(`Abriendo configuración de ${agent.name}...`)}
                    className="border-border hover:border-neon-green/30"
                  >
                    <Settings2 className="w-4 h-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteAgent(agent.id);
                    }}
                    className="border-border hover:border-red-500/30 hover:text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {agents.length === 0 && !isCreating && (
        <div className="text-center py-20 border-2 border-dashed border-border rounded-3xl">
          <Bot className="w-12 h-12 text-slate-700 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-400">No tienes agentes activos</h3>
          <p className="text-slate-600 mb-6">Comienza creando tu primer agente especializado.</p>
          <Button onClick={() => setIsCreating(true)} variant="outline" className="border-border">
            Crear Agente
          </Button>
        </div>
      )}
    </div>
  );
}
