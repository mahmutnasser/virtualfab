import React, { useEffect, useRef, useState } from 'react';
import type { ProcessStep } from '../../types/process';
import ExpandableSection from '../ui/ExpandableSection';
import { ContextualGlossaryDrawer } from './ContextualGlossaryDrawer';
import { STATION_TELEMETRY_MAP } from '../../data/station-telemetry';
import StationMiniWaferCrossSection from './StationMiniWaferCrossSection';
import { FAB_EQUIPMENT_STATIONS } from '../../data/equipment';

export interface StationPanelProps {
  step: ProcessStep;
  onInspect: () => void;
  onBack: () => void;
  onOpenBasics?: (termId?: string) => void;
  className?: string;
}

export const StationPanel: React.FC<StationPanelProps> = ({
  step,
  onInspect,
  onBack,
  onOpenBasics,
  className = '',
}) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const inspectButtonRef = useRef<HTMLButtonElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);
  const [isMobile, setIsMobile] = React.useState(false);
  const [isGlossaryOpen, setIsGlossaryOpen] = useState(false);

  const telemetry = STATION_TELEMETRY_MAP[step.id];
  const equipmentStation = Object.values(FAB_EQUIPMENT_STATIONS).find((eq) =>
    eq.stepIds.includes(step.id)
  );

  useEffect(() => {
    previousActiveElement.current = document.activeElement as HTMLElement;

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onBack();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    inspectButtonRef.current?.focus();

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', checkMobile);
      previousActiveElement.current?.focus();
    };
  }, [onBack]);

  const stepBadgeText =
    step.isCheckpoint || step.order === 'checkpoint'
      ? `CHECKPOINT · ${step.checkpointKind ?? 'METROLOGY'}`
      : typeof step.stepNumber === 'number'
        ? `STEP ${step.stepNumber} OF 6`
        : step.order === 'start'
          ? 'WAFER SETUP'
          : 'PROCESS LOOP';

  return (
    <aside
      ref={panelRef}
      role="dialog"
      data-testid="station-panel"
      aria-modal={isMobile ? 'true' : undefined}
      aria-labelledby="station-panel-title"
      aria-describedby="station-panel-desc"
      className={`z-30 flex flex-col justify-between bg-white/95 border border-slate-200/80 backdrop-blur-xl shadow-2xl shadow-slate-900/15 text-slate-800 transition-all duration-300 animate-in fade-in slide-in-from-right-4 md:w-[380px] lg:w-[420px] md:h-[calc(100%-2rem)] md:m-4 md:rounded-2xl max-md:fixed max-md:inset-x-0 max-md:bottom-0 max-md:max-h-[82vh] max-md:rounded-t-3xl max-md:border-b-0 max-md:p-5 p-6 select-none overflow-y-auto ${className}`.trim()}
    >
      {/* Mobile drag handle */}
      <div className="md:hidden flex justify-center mb-3">
        <div className="w-12 h-1.5 rounded-full bg-slate-300" aria-hidden="true" />
      </div>

      <div>
        {/* Top bar with Step Badge and Close / Back button */}
        <div className="flex items-center justify-between gap-3 pb-4 border-b border-slate-200/80">
          <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-[#00a6a6]/10 text-[#007f7f] border border-[#00a6a6]/25 font-mono text-[11px] font-bold tracking-wider uppercase">
            {stepBadgeText}
          </span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setIsGlossaryOpen(true)}
              aria-label="View glossary terms for this station"
              className="inline-flex items-center gap-1 px-2.5 py-1 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg text-xs font-mono font-medium transition-colors cursor-pointer border border-slate-200"
            >
              <svg className="w-3.5 h-3.5 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span>Terms</span>
            </button>
            <button
              type="button"
              onClick={onBack}
              aria-label="Close station focus panel and return to fab overview"
              className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#00a6a6] focus-visible:outline-offset-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Station Title & Equipment Name */}
        <div className="mt-4">
          <h2
            id="station-panel-title"
            className="font-display text-2xl sm:text-3xl font-bold text-[#102a43] tracking-tight"
          >
            {step.name}
          </h2>
          <div className="inline-flex items-center gap-2 mt-2 px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200/90 text-xs font-mono text-slate-600">
            <span className="w-2 h-2 rounded-full bg-[#00a6a6]" aria-hidden="true" />
            <span>{step.stationName}</span>
          </div>

          {/* Cleanroom Bay & Hardware Reference Badges */}
          {equipmentStation && (
            <div className="mt-2.5 flex flex-wrap items-center gap-1.5 text-[11px] font-mono">
              <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium border border-slate-200/80">
                {equipmentStation.cleanroomBay}
              </span>
              {equipmentStation.realEquipmentReference && (
                <span className="px-2 py-0.5 rounded bg-teal-50 text-teal-800 font-medium border border-teal-200/70" title="Industry benchmark tool reference">
                  Ref: {equipmentStation.realEquipmentReference}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Step Description */}
        <p
          id="station-panel-desc"
          className="font-body text-sm sm:text-base text-slate-600 mt-3.5 leading-relaxed"
        >
          {step.description}
        </p>

        {/* Mini Wafer Cross-Section Preview */}
        {telemetry && (
          <div className="mt-4">
            <StationMiniWaferCrossSection telemetry={telemetry} />
          </div>
        )}

        {/* Chamber Recipe & Telemetry Card */}
        {telemetry && telemetry.metrics.length > 0 && (
          <div className="mt-4 p-3.5 rounded-xl bg-slate-50 border border-slate-200/90 space-y-2.5 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-mono text-[10px] uppercase tracking-wider text-slate-700 font-bold">
                  Chamber Recipe & Telemetry
                </span>
              </div>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
                {telemetry.chamberState}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-200/70">
              {telemetry.metrics.map((metric, idx) => (
                <div key={idx} className="flex flex-col bg-white p-2 rounded-lg border border-slate-200/60 shadow-xs">
                  <span className="text-[10px] text-slate-500 font-mono">{metric.label}</span>
                  <span className="text-xs font-mono font-semibold text-[#102a43] truncate" title={metric.value}>
                    {metric.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Learning Example / Key Process Facts */}
        {step.typedFacts && step.typedFacts.length > 0 ? (
          <div className="mt-5 p-4 rounded-xl bg-[#f0f4f8] border border-slate-200/90 space-y-2.5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#007f7f] block font-bold">
                LEARNING EXAMPLE
              </span>
              <span className="text-slate-400 text-xs font-mono" aria-hidden="true">→</span>
            </div>
            {step.typedFacts.map((fact, idx) => (
              <div key={idx} className="flex justify-between items-baseline text-xs gap-3">
                <span className="text-slate-500 shrink-0">{fact.label}:</span>
                <span className="font-mono text-[#102a43] font-semibold text-right">
                  {fact.value}
                </span>
              </div>
            ))}
          </div>
        ) : step.keyFacts ? (
          <div className="mt-5 p-4 rounded-xl bg-[#f0f4f8] border border-slate-200/90 space-y-2.5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#007f7f] block font-bold">
                LEARNING EXAMPLE
              </span>
              <span className="text-slate-400 text-xs font-mono" aria-hidden="true">→</span>
            </div>
            {step.keyFacts.material && (
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Example Film:</span>
                <span className="font-mono text-[#102a43] font-semibold">
                  {step.keyFacts.material}
                </span>
              </div>
            )}
            {step.keyFacts.thickness && (
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Illustrative thickness:</span>
                <span className="font-mono text-slate-700">
                  {step.keyFacts.thickness}
                </span>
              </div>
            )}
          </div>
        ) : null}

        {/* Why this step? Expandable section */}
        <div className="mt-5">
          <ExpandableSection
            title="Why this step?"
            defaultOpen={true}
            className="border border-slate-200/90 bg-slate-50/70 rounded-xl text-slate-800"
          >
            <p className="font-body text-xs sm:text-sm text-slate-600 leading-relaxed pt-1">
              {step.whyThisStep}
            </p>
          </ExpandableSection>
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-6 pt-4 border-t border-slate-200/80 flex flex-col gap-3">
        <button
          ref={inspectButtonRef}
          type="button"
          onClick={onInspect}
          aria-label={step.id === 'repeat' ? 'Launch Multi-Layer Wafer Lab' : 'Open Wafer Lab'}
          className="w-full h-12 rounded-full bg-[#00a6a6] text-[#102a43] font-body font-bold text-sm sm:text-base inline-flex items-center justify-center gap-2 transition-all hover:bg-[#009595] hover:brightness-105 active:brightness-95 shadow-md shadow-[#00a6a6]/25 cursor-pointer focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#00a6a6] focus-visible:outline-offset-2"
        >
          <span>{step.id === 'repeat' ? 'Launch Multi-Layer Wafer Lab' : 'Open Wafer Lab'}</span>
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
              d={step.id === 'repeat' ? 'M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99' : 'M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3'}
            />
          </svg>
        </button>

        <button
          type="button"
          onClick={onBack}
          className="w-full py-2 text-xs font-body font-medium text-slate-500 hover:text-[#102a43] transition-colors cursor-pointer text-center"
        >
          &larr; Back to Fab Overview
        </button>
      </div>

      {/* Non-destructive Contextual Glossary Drawer */}
      <ContextualGlossaryDrawer
        isOpen={isGlossaryOpen}
        onClose={() => setIsGlossaryOpen(false)}
        stepId={step.id}
        onOpenBasics={onOpenBasics}
      />
    </aside>
  );
};

export default StationPanel;
