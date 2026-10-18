import React from 'react';
import { Handshake } from 'lucide-react';

interface VibeLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  className?: string;
}

export const VibeLogo: React.FC<VibeLogoProps> = ({
  size = 'md',
  showTagline = false,
  className = '',
}) => {
  const sizeClasses = {
    sm: {
      icon: 'w-7 h-7',
      text: 'text-lg',
      tagline: 'text-[10px]',
      iconSize: 16,
    },
    md: {
      icon: 'w-9 h-9',
      text: 'text-xl',
      tagline: 'text-xs',
      iconSize: 20,
    },
    lg: {
      icon: 'w-12 h-12',
      text: 'text-2xl sm:text-3xl',
      tagline: 'text-xs sm:text-sm',
      iconSize: 26,
    },
    xl: {
      icon: 'w-16 h-16',
      text: 'text-3xl sm:text-4xl',
      tagline: 'text-sm sm:text-base',
      iconSize: 34,
    },
  }[size];

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Vibe Symbol: Handshake */}
      <div
        className={`${sizeClasses.icon} rounded-xl bg-gradient-to-tr from-[#0F172A] via-[#1E293B] to-[#0F172A] border border-[#22D3EE]/40 flex items-center justify-center shadow-lg shadow-[#22D3EE]/20 relative overflow-hidden group shrink-0`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.25)_0%,transparent_70%)] opacity-80 group-hover:opacity-100 transition-opacity" />
        <Handshake size={sizeClasses.iconSize} className="relative z-10 text-[#22D3EE] drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]" />
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span
            className={`${sizeClasses.text} font-black tracking-tight text-[#F8FAFC] flex items-center`}
          >
            Vibe
            <span className="inline-block w-2 h-2 rounded-full bg-[#22D3EE] ml-1 animate-pulse shadow-[0_0_8px_#22D3EE]" />
          </span>
          <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-[#1E293B] text-[#22D3EE] border border-[#22D3EE]/30">
            find your vibing study partner
          </span>
        </div>
        {showTagline && (
          <span
            className={`${sizeClasses.tagline} text-[#94A3B8] font-medium tracking-wide`}
          >
            Let&apos;s Vibe Together.
          </span>
        )}
      </div>
    </div>
  );
};
