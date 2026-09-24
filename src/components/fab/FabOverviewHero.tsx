import React from 'react';

export interface FabOverviewHeroProps {
  onStartTour?: () => void;
  onWatchIntro?: () => void;
  className?: string;
}

export const FabOverviewHero: React.FC<FabOverviewHeroProps> = ({
  onStartTour,
  onWatchIntro,
  className = '',
}) => {
  return (
    <div
      className={`max-w-[460px] flex flex-col items-start select-none ${className}`.trim()}
    >
      {/* Category Tag */}
      <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#00a6a6] font-bold mb-2">
        VIRTUAL FAB
      </span>

      {/* Main Hero Heading */}
      <h1 className="font-display text-4xl sm:text-5xl xl:text-6xl font-extrabold text-white tracking-tight leading-[1.08] mb-4 drop-shadow-md">
        Fab Overview
      </h1>

      {/* Supporting Copy */}
      <p className="font-body text-sm sm:text-base text-slate-200 leading-relaxed mb-6 drop-shadow">
        Step inside a modern semiconductor fab and explore how atomic-scale
        materials become the chips that power our world.
      </p>

      {/* CTA Button Group */}
      <div className="flex flex-wrap items-center gap-4">
        {/* Primary CTA: Start the Tour */}
        <button
          type="button"
          onClick={onStartTour}
          className="h-11 sm:h-12 px-6 rounded-full bg-[#00a6a6] text-[#102a43] font-body font-bold text-sm sm:text-base inline-flex items-center gap-2 transition-all hover:brightness-110 active:brightness-95 shadow-lg shadow-[#00a6a6]/30 cursor-pointer focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#00a6a6] focus-visible:outline-offset-2"
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

        {/* Secondary Action: Watch Intro */}
        <button
          type="button"
          onClick={onWatchIntro}
          className="h-11 sm:h-12 px-4 rounded-full border border-white/30 hover:border-[#00a6a6] text-white hover:text-[#00a6a6] bg-[#102a43]/40 backdrop-blur-sm font-body font-semibold text-xs sm:text-sm inline-flex items-center gap-2.5 transition-all cursor-pointer focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#00a6a6] focus-visible:outline-offset-2"
        >
          <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center shrink-0">
            <svg
              className="w-3 h-3 translate-x-0.5 fill-current"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
          <div className="flex flex-col items-start leading-none text-left">
            <span>Watch Intro</span>
            <span className="text-[10px] text-white/50 font-normal mt-0.5">
              2 min
            </span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default FabOverviewHero;
