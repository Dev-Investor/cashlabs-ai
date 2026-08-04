import React from 'react';
import { DiagnosisResult } from '../../types';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { History as HistoryIcon, ChevronRight, Calendar, Trash2, Zap } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface Props {
  generations: DiagnosisResult[];
  onSelect: (gen: DiagnosisResult) => void;
  onDelete: (id: string) => void;
}

export function History({ generations, onSelect, onDelete }: Props) {
  if (generations.length === 0) {
    return (
      <Card className="border-dashed border-slate-800 bg-slate-900/30">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <HistoryIcon className="w-12 h-12 text-slate-700 mb-4" />
          <h3 className="text-lg font-bold text-white">Sin historial aún</h3>
          <p className="text-slate-500 max-w-xs">
            Tus rutas de monetización generadas aparecerán aquí para que puedas consultarlas cuando quieras.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white flex items-center gap-2">
        <HistoryIcon className="w-5 h-5 text-neon-green" />
        Tu Historial
      </h2>
      <ScrollArea className="h-[600px] pr-4">
        <div className="space-y-3">
          {generations.map((gen) => (
            <Card 
              key={gen.id} 
              className="group border-slate-800 bg-slate-900/50 hover:border-neon-green/50 hover:shadow-lg hover:shadow-neon-green/5 transition-all cursor-pointer overflow-hidden backdrop-blur-sm"
              onClick={() => onSelect(gen)}
            >
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-neon-green group-hover:bg-neon-green group-hover:text-deep-black transition-colors">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white line-clamp-1 text-sm">
                      {gen.output.recommendedModel}
                    </h4>
                    <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">
                      {format(gen.createdAt, "d 'de' MMMM, yyyy", { locale: es })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-slate-500 hover:text-red-400 hover:bg-red-400/10"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(gen.id);
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                  <ChevronRight className="w-5 h-5 text-slate-700 group-hover:text-neon-green transition-colors" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
