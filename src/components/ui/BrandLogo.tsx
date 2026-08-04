import React from 'react';
import { motion } from 'motion/react';
import { Zap } from 'lucide-react';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ className = '', size = 'md' }) => {
  const sizes = {
    sm: { container: 'gap-1.5', icon: 'w-4 h-4', text: 'text-xl', circle: 'w-8 h-8' },
    md: { container: 'gap-2', icon: 'w-5 h-5', text: 'text-2xl', circle: 'w-10 h-10' },
    lg: { container: 'gap-3', icon: 'w-8 h-8', text: 'text-4xl', circle: 'w-16 h-16' },
  };

  const currentSize = sizes[size];

  return (
    <div className={`flex items-center ${currentSize.container} group ${className}`}>
      {/* Circular Frame */}
      <div className="relative">
        {/* Soft Glow */}
        <div className="absolute -inset-2 bg-neon-green/10 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        
        <div className={`${currentSize.circle} rounded-full border border-slate-800 flex items-center justify-center bg-[#0B0F14] relative overflow-hidden shadow-2xl`}>
          {/* Subtle Brushed Metal Reflection */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-50" />
          
          {/* Circuit Lines (Simplified SVG) */}
          <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 100 100">
            <path d="M20 50 H80 M50 20 V80 M35 35 L65 65 M35 65 L65 35" stroke="#00FF9C" strokeWidth="0.5" fill="none" />
            <circle cx="50" cy="50" r="2" fill="#00FF9C" />
          </svg>

          <Zap className={`${currentSize.icon} text-neon-green relative z-10 drop-shadow-[0_0_10px_rgba(0,255,156,0.5)]`} />
        </div>
      </div>

      {/* Text Composition */}
      <div className="relative flex items-center tracking-tighter font-black">
        {/* CashLabs - Brushed Metal Finish */}
        <span className={`${currentSize.text} bg-gradient-to-b from-[#E2E8F0] via-[#94A3B8] to-[#475569] bg-clip-text text-transparent drop-shadow-sm`}>
          CashLabs
        </span>
        
        {/* AI - Refined Neon Green Glow */}
        <span className={`${currentSize.text} text-[#00FF9C] ml-0.5 relative`}>
          AI
          <span className="absolute inset-0 blur-[6px] opacity-40 text-[#00FF9C] select-none pointer-events-none">AI</span>
        </span>
      </div>
    </div>
  );
};
