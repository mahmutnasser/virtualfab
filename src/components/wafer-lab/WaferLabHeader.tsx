import React from 'react';

export interface WaferLabHeaderProps {
  stepNumber?: number;
  totalSteps?: number;
  isCheckpoint?: boolean;
  checkpointKind?: 'ADI' | 'AEI';
  title?: string;
  subtitle?: string;
  onReturnToStation?: () => void;
  onReturnToFab?: () => void;
  className?: string;
}

export const WaferLabHeader: React.FC<WaferLabHeaderProps> = ({
  stepNumber = 1,
  totalSteps = 6,
  isCheckpoint = false,
  checkpointKind,
  title = 'Deposition',
  subtitle = 'Adding a thin film to the wafer surface',
  onReturnToStation,
  onReturnToFab,
  className = '',
}) => {
  const handleBack = onReturnToStation ?? onReturnToFab;

  return (
    <header
      className={`w-full bg-white border-b border-slate-200/80 px-4 sm:px-8 py-3.5 flex items-center justify-between select-none shrink-0 ${className}`.trim()}
    >
      {/* Left: Back button + Step Title */}
      <div className="flex items-center gap-3 sm:gap-4">
        <button
          type="button"
          onClick={handleBack}
          aria-label={`Return to ${title} Station / Return to Fab Overview`}
          className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#00a6a6] focus-visible:outline-offset-2"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2.5"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
            />
          </svg>
        </button>

        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="font-display text-xl sm:text-2xl font-bold text-slate-900 tracking-tight leading-tight">
              {title}
            </h1>
            {isCheckpoint ? (
              <span className="font-mono text-[11px] uppercase tracking-wider text-sky-700 font-bold px-2 py-0.5 rounded-md bg-sky-50 border border-sky-100">
                CHECKPOINT &bull; {checkpointKind ?? 'METROLOGY'}
              </span>
            ) : stepNumber ? (
              <span className="font-mono text-[11px] uppercase tracking-wider text-[#00a6a6] font-bold px-2 py-0.5 rounded-md bg-blue-50 border border-blue-100">
                STEP {stepNumber} OF {totalSteps}
              </span>
            ) : null}
          </div>
          <p className="font-body text-xs sm:text-sm text-slate-500 mt-0.5">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Right: Quick action */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onReturnToFab}
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
        >
          <span>Exit to Fab World</span>
        </button>
      </div>
    </header>
  );
};

export default WaferLabHeader;
