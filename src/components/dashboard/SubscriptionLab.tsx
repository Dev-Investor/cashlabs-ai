import React, { useState } from 'react';
import { UserProfile } from '../../types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { 
  ShieldCheck, 
  Zap, 
  CheckCircle2, 
  CreditCard,
  Crown,
  Rocket,
  ArrowRight
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

interface SubscriptionLabProps {
  userProfile: UserProfile | null;
}

export function SubscriptionLab({ userProfile }: SubscriptionLabProps) {
  const currentPlan = userProfile?.plan || 'START';

  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  const plans = [
    {
      id: 'STARTER',
      name: 'STARTER',
      price: billingCycle === 'monthly' ? '27' : '22',
      description: 'Ideal para creadores que inician su ecosistema digital.',
      icon: Rocket,
      features: [
        'Acceso a Prompt Library',
        'AI Agents Lab (Básico)',
        '3 Agentes activos',
        'Soporte por comunidad'
      ],
      buttonText: 'Plan Actual',
      color: 'slate'
    },
    {
      id: 'PRO',
      name: 'PRO',
      price: billingCycle === 'monthly' ? '67' : '54',
      description: 'Para profesionales que escalan activos digitales.',
      icon: Zap,
      features: [
        'Agentes ilimitados',
        'Chatbot Builder (Beta)',
        'Marketplace Fee reducido',
        'Soporte prioritario 24/7'
      ],
      buttonText: 'Hacer Upgrade',
      color: 'neon',
      popular: true
    },
    {
      id: 'BUSINESS',
      name: 'BUSINESS',
      price: billingCycle === 'monthly' ? '147' : '117',
      description: 'Control total para empresas y agencias de IA.',
      icon: Crown,
      features: [
        'Todo lo del plan PRO',
        'Tool Builder (Acceso anticipado)',
        'Analytics Center avanzado',
        'API de desarrollador'
      ],
      buttonText: 'Escalar a Business',
      color: 'gold'
    }
  ];

  return (
    <div className="space-y-12 max-w-6xl mx-auto pb-12">
      <div className="text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-white tracking-tight">
            Gestiona tu <span className="text-neon-green">Suscripción</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Escala tu plan para desbloquear herramientas avanzadas de automatización y crecimiento.
          </p>
        </div>

        <div className="flex items-center justify-center gap-4">
          <span className={cn("text-sm font-bold transition-colors", billingCycle === 'monthly' ? "text-white" : "text-slate-500")}>Mensual</span>
          <button 
            onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
            className="w-12 h-6 rounded-full bg-slate-800 p-1 relative transition-all"
          >
            <div className={cn(
              "w-4 h-4 rounded-full bg-neon-green transition-all",
              billingCycle === 'annual' ? "translate-x-6" : "translate-x-0"
            )} />
          </button>
          <span className={cn("text-sm font-bold transition-colors flex items-center gap-2", billingCycle === 'annual' ? "text-white" : "text-slate-500")}>
            Anual
            <span className="text-[10px] bg-neon-green/20 text-neon-green px-1.5 py-0.5 rounded-full">-20%</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan, index) => {
          const isCurrent = currentPlan === plan.id;
          const Icon = plan.icon;
          
          return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={cn(
                "h-full bg-card-bg border-border flex flex-col relative overflow-hidden transition-all duration-300",
                plan.popular && "border-neon-green/50 shadow-[0_0_30px_rgba(57,255,20,0.1)]",
                isCurrent && "border-slate-700"
              )}>
                {plan.popular && (
                  <div className="absolute top-0 right-0">
                    <div className="bg-neon-green text-deep-black text-[10px] font-black px-3 py-1 uppercase tracking-widest transform rotate-45 translate-x-8 translate-y-4 w-32 text-center">
                      Popular
                    </div>
                  </div>
                )}

                <CardHeader className="p-8">
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center mb-6 border",
                    plan.color === 'neon' ? "bg-neon-green/10 border-neon-green/20 text-neon-green" : 
                    plan.color === 'gold' ? "bg-yellow-500/10 border-yellow-500/20 text-yellow-500" :
                    "bg-slate-800/50 border-slate-700 text-slate-400"
                  )}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <CardTitle className="text-2xl font-black text-white">{plan.name}</CardTitle>
                  <div className="flex items-baseline gap-1 mt-2">
                    <span className="text-3xl font-black text-white">${plan.price}</span>
                    <span className="text-slate-500 text-sm font-medium">/mes</span>
                  </div>
                  <CardDescription className="mt-4 text-slate-400 leading-relaxed">
                    {plan.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="p-8 pt-0 flex-1 flex flex-col">
                  <div className="space-y-4 flex-1">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">¿Qué incluye?</p>
                    <ul className="space-y-3">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                          <CheckCircle2 className={cn(
                            "w-4 h-4 mt-0.5 shrink-0",
                            plan.color === 'neon' ? "text-neon-green" : 
                            plan.color === 'gold' ? "text-yellow-500" : "text-slate-500"
                          )} />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button
                    className={cn(
                      "w-full mt-8 h-12 font-black uppercase tracking-widest text-xs transition-all",
                      isCurrent 
                        ? "bg-slate-800 text-slate-400 cursor-default" 
                        : plan.color === 'neon'
                        ? "bg-neon-green hover:bg-bright-green text-deep-black shadow-[0_0_20px_rgba(57,255,20,0.2)]"
                        : plan.color === 'gold'
                        ? "bg-yellow-500 hover:bg-yellow-400 text-deep-black"
                        : "bg-white hover:bg-slate-100 text-deep-black"
                    )}
                    disabled={isCurrent}
                  >
                    {isCurrent ? (
                      <span className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4" />
                        {plan.buttonText}
                      </span>
                    ) : (
                      plan.buttonText
                    )}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Billing Info */}
      <Card className="bg-card-bg border-border">
        <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 border border-border">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-white font-bold">Método de Pago</h3>
              <p className="text-sm text-slate-500">No hay tarjetas registradas aún.</p>
            </div>
          </div>
          <Button variant="outline" className="border-border text-slate-300 hover:bg-slate-800">
            Gestionar en Stripe
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
