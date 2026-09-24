import React from 'react';

export interface FabCTAProps {
  label?: string;
  onClick?: () => void;
  className?: string;
  ariaLabel?: string;
}

export const FabCTA: React.FC<FabCTAProps> = ({
  label = 'Start the Tour',
  onClick,
  className = '',
  ariaLabel,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel || label}
      className={`h-11 sm:h-12 px-6 rounded-full bg-[#00a6a6] text-[#102a43] font-body font-bold text-sm sm:text-base inline-flex items-center justify-center gap-2 transition-all hover:brightness-110 active:brightness-95 shadow-lg shadow-[#00a6a6]/30 cursor-pointer focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#00a6a6] focus-visible:outline-offset-2 ${className}`.trim()}
    >
      <span>{label}</span>
      <svg
        className="w-4 h-4 shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2.5"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
        />
      </svg>
    </button>
  );
};

export default FabCTA;
