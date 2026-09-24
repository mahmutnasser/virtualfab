import React from 'react';
import ProcessJourneyTrack from './ProcessJourneyTrack';
import FabOverviewHero from './FabOverviewHero';
import FabNarration from './FabNarration';
import { CANONICAL_PROCESS_STEPS } from '../../types/process';

export interface FabHUDProps {
  activeStepId?: string;
  completedStepIds?: string[];
  onSelectStep?: (stepId: string) => void;
  onStartTour?: () => void;
  className?: string;
}

export const FabHUD: React.FC<FabHUDProps> = ({
  activeStepId = 'deposition',
  completedStepIds = ['start'],
  onSelectStep,
  onStartTour,
  className = '',
}) => {
  return (
    <div
      className={`absolute inset-0 pointer-events-none flex flex-col justify-between z-20 ${className}`.trim()}
    >
      {/* ── DESKTOP HUD LAYOUT (hidden on mobile) ── */}
      <div className="hidden md:flex flex-col w-full h-full p-6 lg:p-8">
        {/* Top: Process Sequence Track */}
        <div className="w-full max-w-[1360px] mx-auto pointer-events-auto bg-white/95 border border-slate-200/80 backdrop-blur-xl rounded-2xl p-1.5 lg:p-2 shadow-xl shadow-slate-900/10">
          <ProcessJourneyTrack
            activeStepId={activeStepId}
            completedStepIds={completedStepIds}
            onSelectStep={onSelectStep}
          />
        </div>

        {/* Middle row: Hero on left, positioned above machinery */}
        <div className="w-full flex justify-between items-start mt-6 lg:mt-10 pl-2 lg:pl-6">
          <div className="pointer-events-auto max-w-[480px]">
            <FabOverviewHero onStartTour={onStartTour} />
          </div>
        </div>

        {/* Bottom row: Information card anchored bottom-right */}
        <div className="w-full flex justify-end items-end mt-auto">
          <div className="pointer-events-auto pb-2 pr-2">
            <FabNarration onExploreProcess={onStartTour} />
          </div>
        </div>
      </div>

      {/* ── MOBILE HUD LAYOUT (<768px, matches mobile mockup) ── */}
      <div className="md:hidden flex flex-col justify-between w-full h-full p-4 pointer-events-auto overflow-y-auto">
        {/* Mobile Header Title Card */}
        <div className="bg-[#0c1f33]/90 border border-white/10 backdrop-blur-md rounded-xl p-4 shadow-lg mb-4">
          <span className="font-mono text-[10px] uppercase tracking-widest text-[#00a6a6] font-bold">
            VIRTUAL FAB
          </span>
          <h1 className="font-display font-bold text-2xl text-white mt-0.5">
            Virtual Fab
          </h1>
          <p className="font-body text-xs text-slate-300 mt-1 leading-relaxed">
            Explore the semiconductor manufacturing process
          </p>
        </div>

        {/* Mobile Floating Process Step Nodes (Overlaying Cleanroom - Full Canonical Flow) */}
        <div className="relative my-auto max-w-[270px]">
          <div
            tabIndex={0}
            role="region"
            aria-label="Process steps list"
            className="space-y-2 max-h-[46vh] overflow-y-auto pr-1.5 focus:outline-none focus:ring-1 focus:ring-[#00a6a6]/50 rounded-xl"
          >
            {CANONICAL_PROCESS_STEPS.map((step) => {
              const isActive = step.id === activeStepId;
              const isCompleted = completedStepIds.includes(step.id);
              const badgeLabel =
                typeof step.stepNumber === 'number'
                  ? `${step.stepNumber}`
                  : step.checkpointKind
                    ? step.checkpointKind
                    : step.order === 'start'
                      ? 'In'
                      : 'Loop';

              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => onSelectStep?.(step.id)}
                  aria-label={`Go to ${step.name}`}
                  className={`w-full text-left rounded-2xl p-2.5 shadow-md flex items-center justify-between gap-3 cursor-pointer transition-all duration-200 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#00a6a6] ${
                    isActive
                      ? 'bg-white/95 border-2 border-[#00a6a6] shadow-[#00a6a6]/20'
                      : isCompleted
                        ? 'bg-white/90 border border-[#00a6a6]/40 hover:border-[#00a6a6]'
                        : 'bg-white/85 border border-slate-200/90 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`w-7 h-7 rounded-full font-bold text-xs flex items-center justify-center shrink-0 ${
                        isActive
                          ? 'bg-[#00a6a6] text-white shadow-sm'
                          : isCompleted
                            ? 'bg-[#00a6a6]/15 text-[#007f7f] border border-[#00a6a6]/40'
                            : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                    >
                      {step.isCheckpoint ? (
                        <span className="text-[10px] font-bold tracking-tight">
                          {step.checkpointKind ?? 'QC'}
                        </span>
                      ) : (
                        badgeLabel
                      )}
                    </span>
                    <span className="font-display font-bold text-sm text-[#102a43] truncate">
                      {step.name}
                    </span>
                  </div>

                  <svg
                    className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#00a6a6]' : 'text-slate-400'}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </button>
              );
            })}
          </div>

          {/* More steps scroll discovery indicator */}
          <div className="flex items-center justify-center gap-1.5 pt-2 text-[10px] font-mono uppercase tracking-wider text-[#00a6a6]/90 select-none">
            <span>More steps</span>
            <svg
              className="w-3.5 h-3.5 animate-bounce text-[#00a6a6]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Mobile Bottom Tagline & Primary CTA */}
        <div className="mt-4 pt-2">
          <div className="mb-3 text-left">
            <p className="font-display font-bold text-sm text-white tracking-tight">
              Small Structures. Big Possibilities.
            </p>
            <p className="font-mono text-[9px] uppercase tracking-widest text-[#00a6a6] font-semibold">
              SILICON JOURNEY
            </p>
          </div>
          <button
            type="button"
            onClick={onStartTour}
            className="w-full h-12 rounded-full bg-[#00a6a6] text-[#102a43] font-body font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#00a6a6]/30 cursor-pointer active:brightness-95 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#00a6a6]"
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
