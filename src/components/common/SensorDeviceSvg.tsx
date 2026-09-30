import React from 'react';

interface SensorDeviceSvgProps {
  className?: string;
  size?: number;
}

export const SensorDeviceSvg: React.FC<SensorDeviceSvgProps> = ({
  className = '',
  size = 140,
}) => {
  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full drop-shadow-xl select-none"
      >
        <defs>
          <linearGradient id="bodyTopGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#334155" />
            <stop offset="50%" stopColor="#1E293B" />
            <stop offset="100%" stopColor="#0F172A" />
          </linearGradient>

          <linearGradient id="bodySideGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1E293B" />
            <stop offset="50%" stopColor="#0F172A" />
            <stop offset="100%" stopColor="#020617" />
          </linearGradient>

          <linearGradient id="pvPanelGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1E3A8A" />
            <stop offset="40%" stopColor="#0F172A" />
            <stop offset="100%" stopColor="#172554" />
          </linearGradient>

          <radialGradient id="greenLedGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#34D399" />
            <stop offset="40%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#047857" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Ambient Drop Shadow */}
        <ellipse cx="100" cy="175" rx="65" ry="14" fill="#000000" opacity="0.45" />

        {/* Isometric 3D Enclosure Base */}
        {/* Left Side Wall */}
        <polygon points="40,110 95,142 95,165 40,132" fill="#0F172A" />
        {/* Right Side Wall */}
        <polygon points="95,142 160,105 160,128 95,165" fill="#020617" />

        {/* Front Face / Main Housing */}
        <path
          d="M 40,70 L 95,102 L 95,142 L 40,110 Z"
          fill="url(#bodySideGrad)"
          stroke="#334155"
          strokeWidth="1.5"
        />

        {/* Right Face */}
        <path
          d="M 95,102 L 160,65 L 160,105 L 95,142 Z"
          fill="#090D16"
          stroke="#1E293B"
          strokeWidth="1.5"
        />

        {/* Top Bezel / PV Panel Roof */}
        <path
          d="M 40,70 L 105,33 L 160,65 L 95,102 Z"
          fill="url(#bodyTopGrad)"
          stroke="#475569"
          strokeWidth="2"
        />

        {/* Embedded Solar PV Harvesting Window */}
        <path
          d="M 54,69 L 105,40 L 146,64 L 95,93 Z"
          fill="url(#pvPanelGrad)"
          stroke="#38BDF8"
          strokeWidth="0.75"
          strokeOpacity="0.4"
        />
        {/* Solar grid lines */}
        <line x1="79" y1="55" x2="120" y2="78" stroke="#38BDF8" strokeWidth="0.5" strokeOpacity="0.5" />
        <line x1="105" y1="40" x2="95" y2="93" stroke="#38BDF8" strokeWidth="0.5" strokeOpacity="0.5" />

        {/* TrustChain Logo on Front Face */}
        <g transform="translate(62, 108) scale(0.35) skewY(16)">
          <path
            d="M 12,88 C 15,40 50,12 88,12 C 88,50 60,85 12,88 Z"
            fill="#10B981"
          />
          <path
            d="M 15,85 C 40,65 65,40 85,15"
            stroke="#A7F3D0"
            strokeWidth="6"
            strokeLinecap="round"
            fill="none"
          />
          <text
            x="96"
            y="65"
            fill="#FFFFFF"
            fontSize="32"
            fontWeight="bold"
            fontFamily="sans-serif"
          >
            TRUSTCHAIN
          </text>
        </g>

        {/* Green Status LED indicator */}
        <circle cx="145" cy="85" r="4" fill="#34D399" />
        <circle cx="145" cy="85" r="8" fill="url(#greenLedGlow)" />

        {/* Corner Rubberized Bumpers (IP65 Ruggedization) */}
        <circle cx="40" cy="70" r="3.5" fill="#10B981" />
        <circle cx="95" cy="102" r="3.5" fill="#10B981" />
        <circle cx="160" cy="65" r="3.5" fill="#10B981" />
        <circle cx="105" cy="33" r="3.5" fill="#10B981" />
      </svg>
    </div>
  );
};
