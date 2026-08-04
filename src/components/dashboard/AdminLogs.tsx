import React, { useState, useEffect } from 'react';
import { auth } from '../../lib/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { Loader2, Shield, Clock, User, Zap, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export function AdminLogs() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;
        const token = await user.getIdToken();

        const response = await fetch('/api/admin/logs', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setLogs(data);
        }
      } catch (error) {
        console.error('Error fetching logs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
    const interval = setInterval(fetchLogs, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-neon-green" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Shield className="w-6 h-6 text-neon-green" />
          Logs de Auditoría en Tiempo Real
        </h2>
        <Badge variant="outline" className="border-neon-green/20 text-neon-green">
          {logs.length} Registros Recientes
        </Badge>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {logs.map((log) => (
          <Card key={log.id} className="bg-slate-900/50 border-slate-800 hover:border-slate-700 transition-colors">
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
              <div className="flex items-center gap-3">
                <Badge className={log.status === 'success' ? 'bg-neon-green/10 text-neon-green border-neon-green/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}>
                  {log.status === 'success' ? 'SUCCESS' : 'ERROR'}
                </Badge>
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {log.timestamp ? format(new Date(log.timestamp), 'HH:mm:ss - dd MMM', { locale: es }) : 'Reciente'}
                </span>
              </div>
              <div className="text-xs font-mono text-slate-600">
                {log.executionTimeMs}ms
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <User className="w-3 h-3" />
                    Usuario: <span className="text-white">{log.userId}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Zap className="w-3 h-3" />
                    Plan: <span className="text-neon-green font-bold">{log.userPlan}</span>
                  </div>
                </div>
                <div className="text-xs text-slate-400">
                  <p className="font-bold mb-1">Input:</p>
                  <p className="line-clamp-2 italic">
                    {log.input?.skills} | {log.input?.incomeGoal}
                  </p>
                </div>
              </div>
              {log.error && (
                <div className="mt-3 p-2 bg-red-500/5 border border-red-500/10 rounded text-red-400 text-[10px] flex items-start gap-2">
                  <AlertCircle className="w-3 h-3 shrink-0 mt-0.5" />
                  {log.error}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
