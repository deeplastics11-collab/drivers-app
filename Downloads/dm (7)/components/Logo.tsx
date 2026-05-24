
import React from 'react';

const Logo: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const sizes = {
    sm: { box: 'w-10 h-10', text: 'text-xs', glow: 'shadow-[0_0_15px_rgba(59,130,246,0.6)]', radius: 'rounded-xl' },
    md: { box: 'w-14 h-14', text: 'text-base', glow: 'shadow-[0_0_20px_rgba(59,130,246,0.7)]', radius: 'rounded-2xl' },
    lg: { box: 'w-20 h-20', text: 'text-2xl', glow: 'shadow-[0_0_30px_rgba(59,130,246,0.8)]', radius: 'rounded-3xl' }
  };

  const config = sizes[size];

  return (
    <div className={`${config.box} ${config.radius} bg-amber-500 flex items-center justify-center ${config.glow} border border-amber-400 shrink-0`}>
      <span className={`text-slate-950 font-black tracking-tighter ${config.text}`}>
        DFMS
      </span>
    </div>
  );
};

export default Logo;
