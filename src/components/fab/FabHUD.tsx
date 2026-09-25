import React from 'react';
import ProcessMapDisclosure from './ProcessMapDisclosure';
import FabOverviewHero from './FabOverviewHero';

export interface FabHUDProps {
  activeStepId?: string;
  completedStepIds?: string[];
  onSelectStep?: (stepId: string) => void;
  onStartTour?: () => void;
  onOpenBasics?: () => void;
  className?: string;
}

export const FabHUD: React.FC<FabHUDProps> = ({
  activeStepId = 'deposition',
  completedStepIds = ['start'],
  onSelectStep,
  onStartTour,
  onOpenBasics,
  className = '',
}) => {
  return (
    <div
      className={`absolute inset-0 pointer-events-none flex flex-col justify-between z-20 ${className}`.trim()}
    >
      {/* ── DESKTOP HUD LAYOUT (hidden on mobile) ── */}
      <div className="hidden md:flex flex-col w-full h-full p-4 lg:p-6">
        <div className="w-full max-w-[1360px] mx-auto pointer-events-auto">
          <ProcessMapDisclosure activeStepId={activeStepId} completedStepIds={completedStepIds} onSelectStep={(stepId) => onSelectStep?.(stepId)} />
        </div>

        {/* Middle row: Hero on left, positioned above machinery */}
        <div className="w-full flex justify-between items-start mt-4 lg:mt-7">
          <div className="pointer-events-auto max-w-[480px]">
            <FabOverviewHero onStartTour={onStartTour} onOpenBasics={onOpenBasics} />
          </div>
        </div>

      </div>

      {/* ── MOBILE HUD LAYOUT (<768px, matches mobile mockup) ── */}
      <div className="md:hidden flex flex-col justify-between w-full h-full p-4 pointer-events-auto overflow-y-auto">
        {/* Mobile Header Title Card */}
        <div className="bg-white/95 border border-[#DCE5F2] backdrop-blur-md rounded-xl p-4 shadow-lg mb-4">
          <span className="font-mono text-[10px] uppercase tracking-widest text-[#166FE5] font-bold">
            VIRTUAL FAB
          </span>
          <h1 className="font-display font-bold text-2xl text-[#102A43] mt-0.5">
            Virtual Fab
          </h1>
          <p className="font-body text-xs text-[#476176] mt-1 leading-relaxed">
            Explore the semiconductor manufacturing process
          </p>
        </div>

        <div className="relative z-30 my-4">
          <ProcessMapDisclosure activeStepId={activeStepId} completedStepIds={completedStepIds} onSelectStep={(stepId) => onSelectStep?.(stepId)} />
        </div>

        {/* Mobile Bottom Tagline & Primary CTA */}
        <div className="mt-4 pt-2">
          <div className="mb-3 text-left">
            <p className="font-display font-bold text-sm text-white tracking-tight">
              Small Structures. Big Possibilities.
            </p>
            <p className="font-mono text-[9px] uppercase tracking-widest text-[#BBD8FF] font-semibold">
              SILICON JOURNEY
            </p>
          </div>
          <button
            type="button"
            onClick={onStartTour}
            className="w-full h-12 rounded-xl bg-[#166FE5] text-white font-body font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#166FE5]/30 cursor-pointer hover:bg-[#145DB4] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#166FE5]"
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
        </div>
      </div>
    </div>
  );
};

export default FabHUD;
