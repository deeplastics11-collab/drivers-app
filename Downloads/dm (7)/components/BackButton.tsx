import React from 'react';

interface BackButtonProps {
  onClick: () => void;
  ariaLabel?: string;
  className?: string;
}

const BackButton: React.FC<BackButtonProps> = ({ 
  onClick, 
  ariaLabel = "Go back",
  className = ""
}) => {
  return (
    <button
      onClick={onClick}
      className={`w-10 h-10 bg-amber-500 text-slate-950 rounded-2xl flex items-center justify-center active:scale-90 transition-all shadow-lg shadow-amber-500/20 shrink-0 ${className}`}
      aria-label={ariaLabel}
    >
      <i className="fa-solid fa-chevron-left text-base"></i>
    </button>
  );
};

export default BackButton;
