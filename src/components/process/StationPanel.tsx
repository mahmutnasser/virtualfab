import React, { useEffect, useRef, useState } from 'react';
import { CANONICAL_PROCESS_STEPS, type ProcessStep } from '../../types/process';
import { ContextualGlossaryDrawer } from './ContextualGlossaryDrawer';
import { STATION_TELEMETRY_MAP } from '../../data/station-telemetry';
import StationMiniWaferCrossSection from './StationMiniWaferCrossSection';
import { FAB_EQUIPMENT_STATIONS } from '../../data/equipment';

export interface StationPanelProps {
  step: ProcessStep;
  onInspect: () => void;
  onBack: () => void;
  onOpenBasics?: (termId?: string) => void;
  onNextStation?: () => void;
  onPreviousStation?: () => void;
  className?: string;
}

export const StationPanel: React.FC<StationPanelProps> = ({
  step,
  onInspect,
  onBack,
  onOpenBasics,
  onNextStation,
  onPreviousStation,
  className = '',
}) => {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const asideRef = useRef<HTMLElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);
  const onBackRef = useRef(onBack);
  onBackRef.current = onBack;
  const [isMobile, setIsMobile] = useState(false);
  const [isGlossaryOpen, setIsGlossaryOpen] = useState(false);
  const telemetry = STATION_TELEMETRY_MAP[step.id];
  const equipmentStation = Object.values(FAB_EQUIPMENT_STATIONS).find((eq) => eq.stepIds.includes(step.id));

  const currentIndex = CANONICAL_PROCESS_STEPS.findIndex((s) => s.id === step.id);
  const prevStep = currentIndex > 0 ? CANONICAL_PROCESS_STEPS[currentIndex - 1] : null;
  const nextStep =
    currentIndex >= 0 && currentIndex < CANONICAL_PROCESS_STEPS.length - 1
      ? CANONICAL_PROCESS_STEPS[currentIndex + 1]
      : null;

  useEffect(() => {
    previousActiveElement.current = document.activeElement as HTMLElement;
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onBackRef.current();
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    window.addEventListener('keydown', handleKeyDown);
    headingRef.current?.focus({ preventScroll: true });
    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('keydown', handleKeyDown);
      previousActiveElement.current?.focus({ preventScroll: true });
    };
  }, []);

  useEffect(() => {
    // When moving between process steps, always ensure the panel starts at the very top
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
    if (asideRef.current) {
      asideRef.current.scrollTop = 0;
    }
    headingRef.current?.focus({ preventScroll: true });
  }, [step.id]);

  const stepBadgeText = step.isCheckpoint || step.order === 'checkpoint'
    ? `CHECKPOINT · ${step.checkpointKind ?? 'METROLOGY'}`
    : typeof step.stepNumber === 'number'
      ? `STEP ${step.stepNumber} OF 6`
      : step.order === 'start' ? 'WAFER SETUP' : 'PROCESS LOOP';

  return (
    <aside
      ref={asideRef}
      role="dialog"
      data-testid="station-panel"
      aria-modal={isMobile ? 'true' : undefined}
      aria-labelledby="station-panel-title"
      aria-describedby="station-panel-desc"
      className={`z-30 flex flex-col overflow-hidden border border-[#DCE5F2] bg-white text-[#102A43] shadow-[0_16px_48px_rgba(21,65,112,0.16)] md:m-4 md:h-[calc(100%-2rem)] md:w-[380px] md:rounded-xl lg:w-[420px] max-md:fixed max-md:inset-x-0 max-md:bottom-0 max-md:max-h-[82vh] max-md:rounded-t-2xl max-md:border-b-0 ${className}`.trim()}
    >
      <div className="flex justify-center pt-3 md:hidden" aria-hidden="true">
        <div className="h-1 w-10 rounded-full bg-[#C9D8E9]" />
      </div>

      <header className="shrink-0 border-b border-[#DCE5F2] px-5 pb-4 pt-4 sm:px-6">
        <div className="flex items-center justify-between gap-3">
          <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#145DB4]">{stepBadgeText}</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsGlossaryOpen(true)}
              aria-label="View glossary terms for this station"
              className="min-h-[44px] rounded-lg px-2 text-xs font-semibold text-[#145DB4] hover:bg-[#EAF2FF]"
            >
              Terms
            </button>
            <button
              type="button"
              onClick={onBack}
              aria-label="Close station focus panel and return to fab overview"
              className="flex h-11 w-11 items-center justify-center rounded-lg text-[#476176] hover:bg-[#EAF2FF] hover:text-[#145DB4]"
            >
              <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" d="M6 6l12 12M18 6 6 18" />
              </svg>
            </button>
          </div>
        </div>

        <h2 ref={headingRef} tabIndex={-1} id="station-panel-title" className="mt-2 font-display text-2xl font-bold tracking-tight outline-none sm:text-3xl">
          {step.name}
        </h2>
        <p className="mt-1 text-xs font-semibold text-[#667F94]">{step.stationName}</p>

        {/* Quick Station Stepper */}
        <div className="flex items-center justify-between text-xs py-1.5 px-3 bg-[#F6F9FE] rounded-lg border border-[#DCE5F2] mt-3">
          <button
            type="button"
            disabled={!prevStep || !onPreviousStation}
            onClick={onPreviousStation}
            aria-label={prevStep ? `Go to previous station: ${prevStep.name}` : 'No previous station'}
            className="inline-flex items-center gap-1 text-[#476176] hover:text-[#102A43] disabled:opacity-30 disabled:cursor-not-allowed font-medium px-2 py-1 rounded hover:bg-white transition-colors cursor-pointer"
          >
            <span aria-hidden="true">←</span>
            <span className="hidden sm:inline truncate max-w-[90px]">{prevStep?.name ?? 'Prev'}</span>
          </button>

          <span className="text-[11px] font-semibold text-[#667F94]">
            Station {currentIndex + 1} of {CANONICAL_PROCESS_STEPS.length}
          </span>

          <button
            type="button"
            disabled={!nextStep || !onNextStation}
            onClick={onNextStation}
            aria-label={nextStep ? `Go to next station: ${nextStep.name}` : 'No next station'}
            className="inline-flex items-center gap-1 text-[#145DB4] hover:text-[#0C4080] disabled:opacity-30 disabled:cursor-not-allowed font-bold px-2 py-1 rounded hover:bg-white transition-colors cursor-pointer"
          >
            <span className="hidden sm:inline truncate max-w-[90px]">{nextStep?.name ?? 'Next'}</span>
            <span aria-hidden="true">→</span>
          </button>
        </div>

        <p id="station-panel-desc" className="mt-3 text-sm leading-6 text-[#476176]">{step.description}</p>
      </header>

      <div ref={scrollContainerRef} className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5 sm:px-6">
        {telemetry && (
          <section aria-label="Wafer state">
            <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.13em] text-[#145DB4]">What changes on the wafer</h3>
            <StationMiniWaferCrossSection telemetry={telemetry} />
          </section>
        )}

        <section className="mt-6 border-t border-[#DCE5F2] pt-5">
          <h3 className="font-display text-lg font-bold">Why this step?</h3>
          <p className="mt-2 text-sm leading-6 text-[#476176]">{step.whyThisStep}</p>
        </section>

        {(step.typedFacts?.length || step.keyFacts) && (
          <section className="mt-6 border-t border-[#DCE5F2] pt-5">
            <h3 className="text-xs font-bold uppercase tracking-[0.13em] text-[#145DB4]">Learning example</h3>
            <dl className="mt-3 space-y-2 text-sm">
              {step.typedFacts?.map((fact, index) => (
                <div key={index} className="flex flex-wrap justify-between gap-x-4 gap-y-1">
                  <dt className="text-[#667F94]">{fact.label}</dt>
                  <dd className="font-semibold text-[#102A43]">{fact.value}</dd>
                </div>
              ))}
              {!step.typedFacts && step.keyFacts?.material && (
                <div className="flex flex-wrap justify-between gap-x-4 gap-y-1">
                  <dt className="text-[#667F94]">Example film</dt>
                  <dd className="font-semibold">{step.keyFacts.material}</dd>
                </div>
              )}
              {!step.typedFacts && step.keyFacts?.thickness && (
                <div className="flex flex-wrap justify-between gap-x-4 gap-y-1">
                  <dt className="text-[#667F94]">Illustrative thickness</dt>
                  <dd className="font-semibold">{step.keyFacts.thickness}</dd>
                </div>
              )}
            </dl>
          </section>
        )}

        <details className="group mt-6 rounded-lg border border-[#DCE5F2] bg-[#F6F9FE]">
          <summary className="flex min-h-[48px] cursor-pointer list-none items-center justify-between px-4 text-sm font-bold text-[#145DB4] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#166FE5]">
            Equipment and recipe <span aria-hidden="true" className="transition-transform group-open:rotate-180">⌄</span>
          </summary>
          <div className="space-y-4 border-t border-[#DCE5F2] px-4 py-4 text-xs text-[#476176]">
            {equipmentStation && (
              <div>
                <p className="font-semibold">{equipmentStation.cleanroomBay}</p>
                {equipmentStation.realEquipmentReference && (
                  <p className="mt-1 font-mono text-[#006666]">Ref: {equipmentStation.realEquipmentReference}</p>
                )}
              </div>
            )}
            {telemetry && (
              <div>
                <p className="font-bold uppercase tracking-wide text-[#145DB4]">Chamber Recipe &amp; Telemetry</p>
                <p className="mt-1 font-semibold text-[#476176]">{telemetry.chamberState}</p>
                <dl className="mt-3 grid grid-cols-2 gap-3">
                  {telemetry.metrics.map((metric) => (
                    <div key={metric.label}>
                      <dt className="text-[#667F94]">{metric.label}</dt>
                      <dd className="mt-1 font-semibold text-[#102A43]">{metric.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </div>
        </details>
      </div>

      <footer className="shrink-0 border-t border-[#DCE5F2] bg-white px-5 py-4 sm:px-6 space-y-2.5">
        {nextStep && onNextStation ? (
          <button
            type="button"
            onClick={onNextStation}
            aria-label={`Next Tool: ${nextStep.name}`}
            className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-lg bg-[#166FE5] px-5 text-sm font-bold text-white hover:bg-[#145DB4] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#166FE5] focus-visible:outline-offset-2 transition-colors cursor-pointer"
          >
            <span>Next Tool: {nextStep.name}</span>
            <span aria-hidden="true">→</span>
          </button>
        ) : step.id === 'repeat' ? (
          <button
            type="button"
            onClick={onBack}
            aria-label="Start Another Layer Cycle"
            className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-lg bg-[#166FE5] px-5 text-sm font-bold text-white hover:bg-[#145DB4] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#166FE5] focus-visible:outline-offset-2 transition-colors cursor-pointer"
          >
            <span>Start Another Layer Cycle</span>
            <span aria-hidden="true">↻</span>
          </button>
        ) : null}

        <button
          type="button"
          onClick={step.id === 'repeat' ? onBack : onInspect}
          aria-label={step.id === 'repeat' ? 'Start Another Layer Cycle' : 'Open Wafer Lab'}
          className={`flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg px-4 text-xs sm:text-sm font-bold transition-colors cursor-pointer focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#166FE5] focus-visible:outline-offset-2 ${
            nextStep && onNextStation
              ? 'border border-[#C9D8E9] bg-[#F6F9FE] text-[#145DB4] hover:bg-[#EAF2FF]'
              : 'bg-[#166FE5] text-white hover:bg-[#145DB4]'
          }`}
        >
          <span>{step.id === 'repeat' ? 'Start Another Layer Cycle' : 'Open Wafer Lab (Inspect Cross-Section)'}</span>
          <span aria-hidden="true">🔬</span>
        </button>

        <div className="flex items-center justify-between text-xs font-medium text-[#667F94] pt-1">
          {prevStep && onPreviousStation ? (
            <button
              type="button"
              onClick={onPreviousStation}
              className="hover:text-[#102A43] transition-colors cursor-pointer py-1"
            >
              ← Prev: {prevStep.name}
            </button>
          ) : <div />}
          <button
            type="button"
            onClick={onBack}
            className="hover:text-[#102A43] transition-colors cursor-pointer py-1"
          >
            Back to Fab Overview
          </button>
        </div>
      </footer>

      <ContextualGlossaryDrawer isOpen={isGlossaryOpen} onClose={() => setIsGlossaryOpen(false)} stepId={step.id} onOpenBasics={onOpenBasics} />
    </aside>
  );
};

export default StationPanel;
