import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { 
  Search, 
  Library, 
  Copy, 
  Check, 
  Tag, 
  Sparkles,
  Zap,
  Target,
  Code,
  Megaphone,
  BookOpen
} from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';

interface Prompt {
  id: string;
  title: string;
  description: string;
  content: string;
  category: 'Marketing' | 'Ventas' | 'Desarrollo' | 'Educación' | 'Automatización';
  premium?: boolean;
}

const PROMPTS: Prompt[] = [
  {
    id: '1',
    title: 'Framework de Oferta Irresistible',
    description: 'Genera una oferta siguiendo la fórmula de Alex Hormozi optimizada para IA.',
    category: 'Marketing',
    content: 'Actúa como un experto en marketing de respuesta directa. Crea una oferta irresistible para [PRODUCTO/SERVICIO] dirigida a [NICHO]. Usa la fórmula: [Resultado Deseado] + [Tiempo] + [Garantía] - [Esfuerzo].'
  },
  {
    id: '2',
    title: 'Guión de Ventas Consultivas',
    description: 'Estructura de llamada para cerrar servicios de alto valor (High Ticket).',
    category: 'Ventas',
    content: 'Genera un guión de ventas de 5 pasos para una llamada de descubrimiento de 30 minutos. El objetivo es vender [SERVICIO] de [PRECIO]. Incluye manejo de objeciones sobre precio y tiempo.'
  },
  {
    id: '3',
    title: 'Arquitectura de Micro-SaaS',
    description: 'Define la estructura técnica y el MVP para una herramienta digital.',
    category: 'Desarrollo',
    content: 'Diseña la arquitectura técnica para un Micro-SaaS que resuelve [PROBLEMA]. Incluye stack recomendado, esquema de base de datos y lista de features para el MVP.'
  },
  {
    id: '4',
    title: 'Automatización de Onboarding',
    description: 'Flujo lógico para automatizar la bienvenida de nuevos clientes.',
    category: 'Automatización',
    content: 'Crea un flujo de automatización en Make.com/Zapier que se active cuando un cliente paga en Stripe. Debe incluir: Email de bienvenida, creación de carpeta en Drive y mensaje en Slack.'
  },
  {
    id: '5',
    title: 'Plan de Contenido Viral',
    description: 'Estrategia de 30 días para Reels y TikTok enfocada en autoridad.',
    category: 'Marketing',
    content: 'Genera un calendario de 30 días para Reels. Cada día debe tener: Título gancho, concepto del video y CTA. El nicho es [NICHO] y el objetivo es ganar seguidores calificados.'
  }
];

export function PromptLibrary() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredPrompts = PROMPTS.filter(prompt => {
    const matchesSearch = prompt.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         prompt.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? prompt.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  const handleCopy = (prompt: Prompt) => {
    navigator.clipboard.writeText(prompt.content);
    setCopiedId(prompt.id);
    toast.success('Prompt copiado al portapapeles');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const categories = [
    { name: 'Marketing', icon: Megaphone },
    { name: 'Ventas', icon: Zap },
    { name: 'Desarrollo', icon: Code },
    { name: 'Educación', icon: BookOpen },
    { name: 'Automatización', icon: Target },
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-white mb-2 flex items-center gap-3">
            <Library className="w-8 h-8 text-neon-green" />
            Prompt Library
          </h1>
          <p className="text-slate-400">Biblioteca estratégica para potenciar tus activos digitales.</p>
        </div>
        
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <Input 
            placeholder="Buscar prompts..." 
            className="pl-10 bg-slate-900/50 border-border focus:border-neon-green/50 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button 
          variant={selectedCategory === null ? 'default' : 'outline'}
          onClick={() => setSelectedCategory(null)}
          className={selectedCategory === null ? 'bg-neon-green text-deep-black' : 'border-border text-slate-400'}
          size="sm"
        >
          Todos
        </Button>
        {categories.map((cat) => (
          <Button 
            key={cat.name}
            variant={selectedCategory === cat.name ? 'default' : 'outline'}
            onClick={() => setSelectedCategory(cat.name)}
            className={selectedCategory === cat.name ? 'bg-neon-green text-deep-black' : 'border-border text-slate-400'}
            size="sm"
          >
            <cat.icon className="w-3 h-3 mr-2" />
            {cat.name}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredPrompts.map((prompt, idx) => (
            <motion.div
              key={prompt.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card className="bg-card-bg border-border hover:border-neon-green/30 transition-all group h-full flex flex-col">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-neon-green bg-neon-green/10 px-2 py-0.5 rounded">
                      {prompt.category}
                    </span>
                    {prompt.premium && (
                      <Sparkles className="w-4 h-4 text-amber-400" />
                    )}
                  </div>
                  <CardTitle className="text-xl text-white group-hover:text-neon-green transition-colors">
                    {prompt.title}
                  </CardTitle>
                  <CardDescription className="text-slate-400 line-clamp-2">
                    {prompt.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-end pt-0">
                  <div className="mt-4 p-4 bg-slate-900/50 rounded-xl border border-border/50 relative group/prompt">
                    <p className="text-xs text-slate-500 font-mono line-clamp-3 italic">
                      {prompt.content}
                    </p>
                    <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm opacity-0 group-hover/prompt:opacity-100 transition-opacity flex items-center justify-center rounded-xl">
                      <Button 
                        size="sm" 
                        onClick={() => handleCopy(prompt)}
                        className="bg-neon-green text-deep-black font-bold"
                      >
                        {copiedId === prompt.id ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                        {copiedId === prompt.id ? 'Copiado' : 'Copiar Prompt'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredPrompts.length === 0 && (
        <div className="text-center py-20">
          <p className="text-slate-500">No se encontraron prompts que coincidan con tu búsqueda.</p>
        </div>
      )}
    </div>
  );
}
