import React from 'react';

export interface FabOverviewHeroProps {
  onStartTour?: () => void;
  onOpenBasics?: () => void;
  className?: string;
}

export const FabOverviewHero: React.FC<FabOverviewHeroProps> = ({ onStartTour, onOpenBasics, className = '' }) => (
  <div className={`w-[min(440px,38vw)] border-t-4 border-[#166FE5] bg-white p-7 shadow-[0_18px_50px_rgba(21,65,112,0.13)] lg:p-8 ${className}`.trim()}>
    <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#145DB4]">01 / The process</p>
    <h2 className="mt-7 font-display text-3xl font-bold leading-[1.12] tracking-[-0.035em] text-[#102A43] lg:text-4xl">Step into the cleanroom.</h2>
    <p className="mt-6 text-sm leading-7 text-[#476176] lg:text-base">See how deposition, lithography, and etch change the wafer layer by layer.</p>
    <button type="button" onClick={onStartTour} className="mt-8 flex min-h-[52px] w-full items-center justify-between rounded-lg bg-[#166FE5] px-5 text-sm font-bold text-white transition-colors hover:bg-[#145DB4] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#166FE5] focus-visible:outline-offset-2">
      Start the guided tour <span aria-hidden="true">→</span>
    </button>
    <button type="button" onClick={onOpenBasics} className="mt-2 min-h-[44px] text-sm font-bold text-[#145DB4] hover:underline">Start with Fab Basics →</button>
    <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.13em] text-[#667F94]">6 process stations / 1 connected wafer</p>
  </div>
);

export default FabOverviewHero;
