import React, { useEffect, useRef } from 'react';
import type { ProcessStep } from '../../types/process';
import { CANONICAL_PROCESS_STEPS } from '../../types/process';
import ProcessStepPill from '../process/ProcessStepPill';

export interface ProcessJourneyTrackProps {
  steps?: ProcessStep[];
  activeStepId?: string;
  completedStepIds?: string[];
  onSelectStep?: (stepId: string) => void;
  className?: string;
}

export const ProcessJourneyTrack: React.FC<ProcessJourneyTrackProps> = ({
  steps = CANONICAL_PROCESS_STEPS,
  activeStepId = 'deposition',
  completedStepIds = ['start'],
  onSelectStep,
  className = '',
}) => {
  const containerRef = useRef<HTMLOListElement>(null);
  const activePillRef = useRef<HTMLLIElement>(null);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(false);

  const checkScroll = React.useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const hasOverflow = el.scrollWidth > el.clientWidth + 2;
    setCanScrollLeft(hasOverflow && el.scrollLeft > 6);
    setCanScrollRight(hasOverflow && el.scrollLeft < el.scrollWidth - el.clientWidth - 6);
  }, []);

  useEffect(() => {
    checkScroll();
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener('scroll', checkScroll, { passive: true });
    window.addEventListener('resize', checkScroll);
    return () => {
      el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [checkScroll]);

  useEffect(() => {
    const container = containerRef.current;
    const activePill = activePillRef.current;
    if (!container || !activePill) return;

    // 1. If entire track fits without overflow, keep at 0
    if (container.scrollWidth <= container.clientWidth) {
      container.scrollLeft = 0;
      checkScroll();
      return;
    }

    // 2. Requirement D: Desktop favors full-node visibility over mathematically centering the active node.
    const containerRect = container.getBoundingClientRect();
    const pillRect = activePill.getBoundingClientRect();
    const margin = 8;

    const isFullyVisible =
      pillRect.left >= containerRect.left + margin &&
      pillRect.right <= containerRect.right - margin;

    if (isFullyVisible) {
      checkScroll();
      return;
    }

    // 3. Requirement A & E: Scroll to snap on full-item boundaries (nearest edge alignment)
    if (typeof activePill.scrollIntoView === 'function') {
      activePill.scrollIntoView({
        behavior: 'smooth',
        inline: 'nearest',
        block: 'nearest',
      });
    }
    setTimeout(checkScroll, 350);
  }, [activeStepId, checkScroll]);

  return (
    <nav
      aria-label="Process Overview Track"
      className={`relative w-full max-w-[1360px] mx-auto px-1 sm:px-2 md:px-3 py-2 select-none ${className}`.trim()}
    >
      {/* Subtle edge fade indicators: unobtrusively indicate continuation only when actually overflowing */}
      {canScrollLeft && (
        <div
          aria-hidden="true"
          className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-white via-white/80 to-transparent pointer-events-none z-10"
        />
      )}
      {canScrollRight && (
        <div
          aria-hidden="true"
          className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-white via-white/80 to-transparent pointer-events-none z-10"
        />
      )}

      <ol
        ref={containerRef}
        style={{ scrollPadding: '0 12px' }}
        className="flex items-center justify-between gap-0.5 sm:gap-1 md:gap-1.5 lg:gap-2 w-full overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory"
      >
        {steps.map((step, idx) => {
          const isActive = step.id === activeStepId;
          const isCompleted = step.order === 'start' || completedStepIds.includes(step.id);

          return (
            <React.Fragment key={step.id}>
              <li
                ref={isActive ? activePillRef : null}
                className="shrink-0 flex items-center snap-center sm:snap-start"
              >
                <ProcessStepPill
                  step={step}
                  isActive={isActive}
                  isCompleted={isCompleted}
                  onClick={() => onSelectStep?.(step.id)}
                />
              </li>

              {/* Connecting line between steps */}
              {idx < steps.length - 1 && (
                <li
                  className={`flex-1 min-w-[4px] sm:min-w-[6px] md:min-w-[8px] lg:min-w-[10px] xl:min-w-[12px] h-[1.5px] -mt-5 lg:-mt-6 transition-colors duration-300 ${
                    isCompleted
                      ? 'bg-[#166FE5]'
                      : isActive
                        ? 'bg-gradient-to-r from-[#166FE5] to-slate-200'
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

export default ProcessJourneyTrack;
