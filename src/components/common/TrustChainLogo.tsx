import React from 'react';

interface TrustChainLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
}

export const TrustChainLogo: React.FC<TrustChainLogoProps> = ({
  className = '',
  size = 'md',
  showSubtitle = true,
}) => {
  const iconSize = size === 'sm' ? 'w-6 h-6' : size === 'lg' ? 'w-10 h-10' : 'w-8 h-8';
  const titleSize = size === 'sm' ? 'text-base' : size === 'lg' ? 'text-2xl' : 'text-lg';

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Stylized TrustChain Leaf Emblem matching UI Guide */}
      <div className={`relative ${iconSize} shrink-0 flex items-center justify-center`}>
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm">
          <defs>
            <linearGradient id="leafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#34D399" />
              <stop offset="50%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
            <linearGradient id="veinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#A7F3D0" />
              <stop offset="100%" stopColor="#FFFFFF" />
            </linearGradient>
          </defs>
          {/* Main Leaf Body */}
          <path
            d="M 12,88 C 15,40 50,12 88,12 C 88,50 60,85 12,88 Z"
            fill="url(#leafGrad)"
          />
          {/* Center Leaf Vein Line */}
          <path
            d="M 15,85 C 40,65 65,40 85,15"
            stroke="url(#veinGrad)"
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
          />
          {/* Side Branch Veins */}
          <path
            d="M 38,62 C 50,55 58,58 60,56"
            stroke="#A7F3D0"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M 55,45 C 68,38 74,40 76,38"
            stroke="#A7F3D0"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      </div>

      <div className="flex flex-col">
        <div className={`font-black tracking-tight leading-none text-white ${titleSize} flex items-center`}>
          <span>TRUST</span>
          <span className="text-emerald-400">CHAIN</span>
        </div>
        {showSubtitle && (
          <span className="text-[10px] text-slate-400 font-medium tracking-tight mt-0.5">
            Trusted Evidence from Farm to Fork
          </span>
        )}
      </div>
    </div>
  );
};
