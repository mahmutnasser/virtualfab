import React from 'react';
import type { ProcessStep } from '../../types/process';
import { CANONICAL_PROCESS_STEPS } from '../../types/process';
import ProcessStepPill from './ProcessStepPill';

export interface ProcessMapProps {
  steps?: ProcessStep[];
  activeStepId?: string;
  completedStepIds?: string[];
  onSelectStep?: (stepId: string) => void;
  className?: string;
}

export const ProcessMap: React.FC<ProcessMapProps> = ({
  steps = CANONICAL_PROCESS_STEPS,
  activeStepId = 'deposition',
  completedStepIds = ['start'],
  onSelectStep,
  className = '',
}) => {
  return (
    <nav
      aria-label="Semiconductor Patterning Process Map"
      className={`w-full max-w-[1360px] mx-auto select-none ${className}`.trim()}
    >
      <ol className="flex items-center justify-between gap-1 md:gap-2 w-full overflow-x-auto no-scrollbar py-2 px-1">
        {steps.map((step, idx) => {
          const isActive = step.id === activeStepId;
          const isCompleted = step.order === 'start' || completedStepIds.includes(step.id);

          return (
            <React.Fragment key={step.id}>
              <li className="shrink-0 flex items-center">
                <ProcessStepPill
                  step={step}
                  isActive={isActive}
                  isCompleted={isCompleted}
                  onClick={() => onSelectStep?.(step.id)}
                />
              </li>

              {/* Connecting line between steps */}
              {idx < steps.length - 1 && (
                <div
                  className={`flex-1 min-w-[12px] lg:min-w-[20px] h-[1.5px] -mt-5 lg:-mt-6 transition-colors duration-300 ${
                    isCompleted
                      ? 'bg-[#00a6a6]'
                      : isActive
                        ? 'bg-gradient-to-r from-[#00a6a6] to-slate-200'
                        : 'bg-slate-200'
                  }`}
                  aria-hidden="true"
                />
              )}
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
};

export default ProcessMap;
