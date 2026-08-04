import React, { useState, useEffect } from 'react';
import { auth, db, OperationType, handleFirestoreError } from '../../lib/firebase';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  deleteDoc, 
  doc, 
  getDoc 
} from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { DiagnosisResult, UserProfile } from '../../types';
import { generateDiagnosis } from '../../services/gemini';
import { DiagnosisForm } from './DiagnosisForm';
import { ResultCard } from './ResultCard';
import { History } from './History';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { toast } from 'sonner';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '../ui/card';
import { 
  LogOut, 
  User, 
  Sparkles, 
  History as HistoryIcon, 
  ArrowLeft, 
  ShieldCheck,
  Bell,
  Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import { AdminLogs } from './AdminLogs';
import { Sidebar } from '../layout/Sidebar';
import { CoreLab } from './CoreLab';
import { SubscriptionLab } from './SubscriptionLab';
import { GrowthLab } from './GrowthLab';
import { PromptLibrary } from './PromptLibrary';
import { AgentsLab } from './AgentsLab';

export function Dashboard() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [generations, setGenerations] = useState<DiagnosisResult[]>([]);
  const [currentGeneration, setCurrentGeneration] = useState<DiagnosisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeLab, setActiveLab] = useState('core');

  const isAdmin = auth.currentUser?.email === 'alexanderhs024@gmail.com';

  useEffect(() => {
    if (!auth.currentUser) return;

    // Listen for user profile
    const profileUnsubscribe = onSnapshot(doc(db, 'users', auth.currentUser.uid), (docSnap) => {
      if (docSnap.exists()) {
        setUserProfile(docSnap.data() as UserProfile);
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, `users/${auth.currentUser?.uid}`);
    });

    // Listen for generations
    const q = query(
      collection(db, 'diagnoses'),
      where('userId', '==', auth.currentUser.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as DiagnosisResult));
      setGenerations(data);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'diagnoses');
    });

    return () => {
      profileUnsubscribe();
      unsubscribe();
    };
  }, []);

  const handleGenerate = async (input: any) => {
    if (!userProfile) return;
    setLoading(true);
    try {
      const output = await generateDiagnosis({
        ...input,
        userPlan: userProfile.plan || 'START',
        userId: auth.currentUser!.uid
      });
      
      const newDiagnosis = {
        id: output.id,
        userId: auth.currentUser!.uid,
        userPlan: userProfile.plan || 'START',
        input,
        output,
        createdAt: Date.now()
      } as DiagnosisResult;

      setCurrentGeneration(newDiagnosis);
      toast.success('¡Ruta de monetización generada!');
      setActiveLab('service'); // Stay in service lab to show results
    } catch (error: any) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : 'Error al generar el diagnóstico';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este registro del historial? Esta acción no se puede deshacer.')) return;
    try {
      await deleteDoc(doc(db, 'diagnoses', id));
      if (currentGeneration?.id === id) {
        setCurrentGeneration(null);
      }
      toast.success('Diagnóstico eliminado');
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `diagnoses/${id}`);
    }
  };

  const handleLogout = () => {
    signOut(auth);
  };

  const labNames: Record<string, string> = {
    core: 'Dashboard',
    history: 'Historial',
    agents: 'AI Agents Lab',
    chatbot: 'Chatbot Builder',
    prompts: 'Prompt Library',
    marketplace: 'Marketplace',
    'tool-builder': 'Tool Builder',
    analytics: 'Analytics Center',
    'my-business': 'My Business',
    service: 'ServiceLab',
    offer: 'OfferLab',
    growth: 'GrowthLab',
    subscription: 'Suscripción',
    admin: 'Founder Panel',
    settings: 'Configuración'
  };

  return (
    <div className="min-h-screen bg-deep-black flex">
      <Sidebar 
        userPlan={userProfile?.plan || 'START'} 
        activeLab={activeLab} 
        onLabChange={setActiveLab}
        isAdmin={isAdmin}
      />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 border-b border-border bg-card-bg/50 backdrop-blur-md sticky top-0 z-40 px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-bold text-white">{labNames[activeLab]}</h2>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-neon-green/10 border border-neon-green/20 rounded-full text-neon-green text-[10px] font-black uppercase tracking-widest">
              <ShieldCheck className="w-3 h-3" />
              Score {userProfile?.aiIncomeScore || 0}
            </div>
            
            <div className="flex items-center gap-4">
              <button className="text-slate-400 hover:text-white transition-colors">
                <Bell className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3 pl-6 border-l border-border">
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-bold text-white">{userProfile?.fullName || 'Usuario'}</p>
                  <p className="text-[10px] text-slate-500 font-medium">{userProfile?.plan || 'START'}</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-800 border border-border flex items-center justify-center text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handleLogout}
                  className="text-slate-400 hover:text-red-400"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeLab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeLab === 'core' && (
                <CoreLab 
                  userProfile={userProfile} 
                  latestDiagnosis={generations[0]} 
                  onNavigate={setActiveLab}
                />
              )}

              {activeLab === 'service' && (
                <div className="space-y-8">
                  {!currentGeneration ? (
                    <div className="max-w-4xl mx-auto">
                      <div className="mb-8 text-center">
                        <h1 className="text-3xl font-black text-white mb-2">ServiceLab</h1>
                        <p className="text-slate-400">Genera tu ruta de monetización estratégica con IA.</p>
                      </div>
                      <DiagnosisForm onGenerate={handleGenerate} loading={loading} />
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <Button 
                          variant="outline" 
                          onClick={() => setCurrentGeneration(null)}
                          className="bg-slate-900 border-border text-slate-300 hover:bg-slate-800"
                        >
                          <ArrowLeft className="w-4 h-4 mr-2" />
                          Nuevo Diagnóstico
                        </Button>
                        <div className="text-sm text-slate-500 font-medium">
                          Ruta generada para: <span className="text-neon-green">{currentGeneration.input.skills}</span>
                        </div>
                      </div>
                      <ResultCard diagnosis={currentGeneration} />
                    </div>
                  )}
                </div>
              )}

              {activeLab === 'offer' && (
                <div className="space-y-8">
                  <div className="mb-8">
                    <h1 className="text-3xl font-black text-white mb-2">OfferLab</h1>
                    <p className="text-slate-400">Tus ofertas generadas listas para vender.</p>
                  </div>
                  {generations.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {generations.map((gen) => (
                        <Card key={gen.id} className="bg-card-bg border-border hover:border-neon-green/30 transition-all cursor-pointer" onClick={() => {
                          setCurrentGeneration(gen);
                          setActiveLab('service');
                        }}>
                          <CardHeader>
                            <CardTitle className="text-white">{gen.output.offer.promise}</CardTitle>
                            <CardDescription>{gen.output.recommendedModel}</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-slate-400 line-clamp-2">{gen.output.offer.valueProposition}</p>
                            <div className="mt-4 flex items-center justify-between">
                              <span className="text-neon-green font-bold">{gen.output.offer.price}</span>
                              <span className="text-[10px] text-slate-500">{new Date(gen.createdAt).toLocaleDateString()}</span>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-20 bg-card-bg rounded-2xl border border-border">
                      <p className="text-slate-500">No tienes ofertas generadas aún.</p>
                      <Button onClick={() => setActiveLab('service')} className="mt-4 bg-neon-green text-deep-black font-bold">
                        Generar mi primera oferta
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {activeLab === 'history' && (
                <div className="max-w-4xl mx-auto">
                  <History 
                    generations={generations} 
                    onSelect={(gen) => {
                      setCurrentGeneration(gen);
                      setActiveLab('service');
                    }}
                    onDelete={handleDelete}
                  />
                </div>
              )}

              {activeLab === 'growth' && (
                <GrowthLab latestDiagnosis={generations[0]} />
              )}

              {activeLab === 'subscription' && (
                <SubscriptionLab userProfile={userProfile} />
              )}

              {activeLab === 'prompts' && (
                <PromptLibrary />
              )}

              {activeLab === 'agents' && (
                <AgentsLab onNavigate={setActiveLab} />
              )}

              {['chatbot', 'marketplace', 'tool-builder', 'analytics', 'my-business'].includes(activeLab) && (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center mb-6">
                    <Sparkles className="w-10 h-10 text-neon-green animate-pulse" />
                  </div>
                  <h2 className="text-2xl font-black text-white mb-2">{labNames[activeLab]}</h2>
                  <p className="text-slate-500 max-w-md">
                    Este módulo está siendo optimizado para el nuevo ecosistema CashLabs AI. 
                    Estará disponible muy pronto para potenciar tus activos digitales.
                  </p>
                </div>
              )}

              {activeLab === 'admin' && isAdmin && <AdminLogs />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
