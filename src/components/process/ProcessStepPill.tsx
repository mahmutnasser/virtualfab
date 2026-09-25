import React from 'react';
import type { ProcessStep } from '../../types/process';

export interface ProcessStepPillProps {
  step: ProcessStep;
  isActive?: boolean;
  isCompleted?: boolean;
  onClick?: () => void;
  className?: string;
}

export const ProcessStepPill: React.FC<ProcessStepPillProps> = ({
  step,
  isActive = false,
  isCompleted = false,
  onClick,
  className = '',
}) => {
  // Determine badge label
  let badgeLabel: string;
  let accessiblePrefix: string;

  if (step.order === 'start') {
    badgeLabel = 'Start';
    accessiblePrefix = 'Setup: Start wafer';
  } else if (step.order === 'repeat') {
    badgeLabel = '↺';
    accessiblePrefix = 'Process Loop: Repeat';
  } else if (step.isCheckpoint || step.order === 'checkpoint') {
    badgeLabel = step.checkpointKind ?? 'QC';
    accessiblePrefix = `Process Control Checkpoint: ${step.name}`;
  } else {
    badgeLabel = String(step.stepNumber ?? step.order);
    accessiblePrefix = `Step ${badgeLabel} of 6: ${step.name}`;
  }

  const effectiveStatus = isActive
    ? 'active'
    : isCompleted
      ? 'completed'
      : 'upcoming';

  const accessibleLabel = `${accessiblePrefix}. Status: ${effectiveStatus}.`;

  // Compact label for process rail: prevents mid-word truncation or visual '...'
  const displayLabel =
    step.shortName ??
    (step.id === 'lithography'
      ? 'Lithography'
      : step.id === 'adi' || step.checkpointKind === 'ADI'
        ? 'ADI'
        : step.id === 'aei' || step.checkpointKind === 'AEI'
          ? 'AEI'
          : step.order === 'start'
            ? 'Start'
            : step.order === 'repeat'
              ? 'Repeat'
              : step.name);

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={accessibleLabel}
      aria-current={isActive ? 'step' : undefined}
      className={`group flex flex-col items-center text-center shrink-0 min-w-[44px] sm:min-w-[50px] md:min-w-[56px] lg:min-w-[60px] xl:min-w-[64px] p-1 sm:p-1.5 rounded-xl transition-all duration-300 cursor-pointer focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#166FE5] focus-visible:outline-offset-2 ${
        isActive
          ? 'scale-[1.04]'
          : 'hover:bg-slate-100/80 active:scale-98'
      } ${className}`.trim()}
    >
      {/* Badge: Numbered Circle for operations, Diamond for metrology checkpoints, Circle for setup/loop */}
      <div
        className={`w-7 h-7 sm:w-8 sm:h-8 lg:w-9 lg:h-9 flex items-center justify-center font-mono font-bold transition-all duration-400 ease-out ${
          step.isCheckpoint
            ? `rotate-45 rounded-[5px] text-[8px] sm:text-[9px] tracking-tight ${
                isActive
                  ? 'bg-[#166FE5] text-white ring-2 ring-[#166FE5]/40 shadow-md shadow-[#166FE5]/25 scale-[1.04]'
                  : isCompleted
                    ? 'bg-[#EAF2FF] text-[#145DB4] border-2 border-[#166FE5]'
                    : 'bg-white text-[#145DB4] border-2 border-[#A7CBFA] group-hover:border-[#166FE5]'
              }`
            : `rounded-full text-[10px] sm:text-xs ${
                isActive
                  ? 'bg-[#166FE5] text-white ring-2 ring-[#166FE5]/40 shadow-md shadow-[#166FE5]/25 font-bold scale-[1.04]'
                  : isCompleted
                    ? 'bg-[#EAF2FF] text-[#145DB4] border border-[#A7CBFA] font-semibold'
                    : 'bg-[#f0f4f8] text-[#102a43] border border-slate-300 group-hover:border-slate-400 group-hover:bg-slate-100'
              }`
        }`}
      >
        <span className={step.isCheckpoint ? '-rotate-45 block leading-none font-bold' : 'block leading-none'}>
          {isCompleted && step.order !== 'start' ? (
            <svg
              className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#145DB4]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="3"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 12.75l6 6 9-13.5"
                style={{
                  strokeDasharray: 24,
                  animation: 'checkmarkReveal 0.4s ease-out forwards',
                }}
              />
            </svg>
          ) : (
            badgeLabel
          )}
        </span>
      </div>

      {/* Step Name: compact, no truncation or ellipses */}
      <span
        className={`mt-1 font-display text-[10px] sm:text-[11px] lg:text-xs tracking-tight transition-colors whitespace-nowrap ${
          isActive
            ? 'text-[#102a43] font-bold'
            : isCompleted
              ? 'text-[#102a43] font-semibold'
              : 'text-[#627d98] font-medium group-hover:text-[#102a43]'
        }`}
      >
        {displayLabel}
      </span>
    </button>
  );
};

export default ProcessStepPill;
