import React from 'react';

export interface FabOverviewHeroProps {
  onStartTour?: () => void;
  onOpenBasics?: () => void;
  className?: string;
}

export const FabOverviewHero: React.FC<FabOverviewHeroProps> = ({
  onStartTour,
  onOpenBasics,
  className = '',
}) => {
  return (
    <div
      className={`max-w-[480px] flex flex-col items-start select-none rounded-[24px] border border-[#DCE5F2] bg-white/95 p-6 sm:p-8 shadow-[0_18px_50px_rgba(21,65,112,0.15)] backdrop-blur-xl ${className}`.trim()}
    >
      {/* Category Tag */}
      <span className="font-mono text-xs uppercase tracking-[0.16em] text-[#166FE5] font-bold mb-3">
        VIRTUAL FAB
      </span>

      {/* Main Hero Heading */}
      <h1 className="font-display text-4xl sm:text-5xl font-bold text-[#102A43] tracking-[-0.04em] leading-[1.08] mb-4">
        Fab Overview
      </h1>

      {/* Supporting Copy */}
      <p className="font-body text-sm sm:text-base text-[#476176] leading-relaxed mb-6">
        Step inside a modern semiconductor fab and explore how atomic-scale
        materials become the chips that power our world.
      </p>
      <p className="mb-6 border-l-2 border-[#166FE5] pl-3 text-sm font-semibold leading-6 text-[#314B63]">
        Follow one wafer through a simplified patterning cycle.
      </p>

      {/* CTA Button Group */}
      <div className="flex flex-wrap items-center gap-4">
        {/* Primary CTA: Start the Tour */}
        <button
          type="button"
          onClick={onStartTour}
          className="min-h-[48px] px-6 rounded-xl bg-[#166FE5] text-white font-body font-bold text-sm sm:text-base inline-flex items-center gap-2 transition-colors hover:bg-[#145DB4] shadow-[0_8px_24px_rgba(22,111,229,0.18)] cursor-pointer focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#166FE5] focus-visible:outline-offset-2"
        >
          <span>Start the Tour</span>
          <svg
            className="w-4 h-4"
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

        {/* A working route for learners who want context before touring the fab. */}
        <button
          type="button"
          onClick={onOpenBasics}
          className="min-h-[48px] px-5 rounded-xl border border-[#C9D8E9] hover:border-[#166FE5] text-[#145DB4] bg-white font-body font-semibold text-sm inline-flex items-center gap-2 transition-colors cursor-pointer focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#166FE5] focus-visible:outline-offset-2"
        >
          <span>Start with Fab Basics</span>
        </button>
      </div>
    </div>
  );
};

export default FabOverviewHero;
