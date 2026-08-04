import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Wrench, 
  FileText, 
  TrendingUp, 
  Users, 
  MessageSquare, 
  ShoppingBag, 
  Code, 
  ChevronLeft, 
  ChevronRight,
  Settings,
  ShieldCheck,
  History as HistoryIcon,
  Bot,
  MessageCircle,
  Library,
  Store,
  Hammer,
  BarChart,
  Briefcase
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { UserPlan } from '../../types';
import { Button } from '../ui/button';
import { BrandLogo } from '../ui/BrandLogo';

interface SidebarProps {
  userPlan: UserPlan;
  activeLab: string;
  onLabChange: (lab: string) => void;
  isAdmin: boolean;
}

export function Sidebar({ userPlan, activeLab, onLabChange, isAdmin }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuGroups = [
    {
      label: 'CORE',
      items: [
        { id: 'core', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'history', label: 'Historial', icon: HistoryIcon },
      ]
    },
    {
      label: 'AI LABS',
      items: [
        { id: 'agents', label: 'AI Agents Lab', icon: Bot },
        { id: 'chatbot', label: 'Chatbot Builder', icon: MessageCircle },
        { id: 'prompts', label: 'Prompt Library', icon: Library },
      ]
    },
    {
      label: 'BUSINESS',
      items: [
        { id: 'marketplace', label: 'Marketplace', icon: Store },
        { id: 'tool-builder', label: 'Tool Builder', icon: Hammer },
        { id: 'analytics', label: 'Analytics Center', icon: BarChart },
        { id: 'my-business', label: 'My Business', icon: Briefcase },
      ]
    },
    {
      label: 'ADMIN',
      items: [
        { id: 'admin', label: 'Founder Panel', icon: ShieldCheck, adminOnly: true },
        { id: 'settings', label: 'Configuración', icon: Settings },
      ]
    }
  ].map(group => ({
    ...group,
    items: group.items.map(item => ({
      ...item,
      pro: (item as any).pro || false,
      comingSoon: (item as any).comingSoon || false,
      adminOnly: (item as any).adminOnly || false
    }))
  }));

  return (
    <div 
      className={cn(
        "h-screen bg-card-bg border-r border-border transition-all duration-300 flex flex-col sticky top-0",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="p-6 flex items-center justify-between">
        {!isCollapsed ? (
          <BrandLogo size="sm" />
        ) : (
          <div className="w-8 h-8 rounded-full border border-slate-800 flex items-center justify-center bg-[#0B0F14]">
            <span className="text-[10px] font-black text-neon-green">CL</span>
          </div>
        )}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-lg bg-slate-800/50 text-slate-400 hover:text-neon-green transition-colors"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-8">
        {menuGroups.map((group) => (
          <div key={group.label} className="space-y-2">
            {!isCollapsed && (
              <h3 className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
                {group.label}
              </h3>
            )}
            <div className="space-y-1">
              {group.items.map((item) => {
                if (item.adminOnly && !isAdmin) return null;
                
                const isActive = activeLab === item.id;
                const isDisabled = item.comingSoon || (item.pro && userPlan === 'START');
                
                return (
                  <button
                    key={item.id}
                    onClick={() => !isDisabled && onLabChange(item.id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group relative",
                      isActive 
                        ? "bg-neon-green text-deep-black font-bold" 
                        : "text-slate-400 hover:text-white hover:bg-slate-800/50",
                      isDisabled && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    <item.icon className={cn("w-5 h-5 shrink-0", isActive ? "text-deep-black" : "group-hover:text-neon-green")} />
                    {!isCollapsed && (
                      <div className="flex-1 flex items-center justify-between">
                        <span className="text-sm">{item.label}</span>
                        {item.pro && userPlan === 'START' && (
                          <ShieldCheck className="w-3 h-3 text-neon-green" />
                        )}
                        {item.comingSoon && (
                          <span className="text-[8px] px-1.5 py-0.5 bg-slate-800 text-slate-500 rounded-full">SOON</span>
                        )}
                      </div>
                    )}
                    {isCollapsed && isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-neon-green rounded-r-full" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        {!isCollapsed ? (
          <div className="space-y-4">
            <div className="px-3 py-3 bg-slate-800/30 rounded-xl border border-border">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Plan Actual</p>
              <p className="text-sm font-bold text-neon-green">{userPlan}</p>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onLabChange('subscription')}
              className={cn(
                "w-full justify-start text-slate-400 hover:text-white hover:bg-slate-800/50",
                activeLab === 'subscription' && "bg-neon-green/10 text-neon-green"
              )}
            >
              <Settings className="w-4 h-4 mr-2" />
              Gestionar Suscripción
            </Button>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="w-8 h-8 rounded-lg bg-neon-green/10 flex items-center justify-center text-neon-green border border-neon-green/20">
              <span className="text-[10px] font-black">{userPlan[0]}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
