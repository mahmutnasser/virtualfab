import React, { useId, useState } from 'react';
import { CANONICAL_PROCESS_STEPS } from '../../types/process';

interface ProcessMapDisclosureProps {
  variant?: 'overview' | 'station';
  activeStepId: string;
  completedStepIds: string[];
  onSelectStep: (stepId: string) => void;
  onBackToFab?: () => void;
}

export const ProcessMapDisclosure: React.FC<ProcessMapDisclosureProps> = ({
  variant = 'station',
  activeStepId,
  completedStepIds,
  onSelectStep,
  onBackToFab,
}) => {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const currentStep = CANONICAL_PROCESS_STEPS.find((step) => step.id === activeStepId);
  const stepContext = currentStep?.stepNumber
    ? `Step ${currentStep.stepNumber} of 6`
    : currentStep?.isCheckpoint
      ? 'Inspection checkpoint'
      : currentStep?.order === 'repeat'
        ? 'Process loop'
        : 'Starting point';

  const selectStep = (stepId: string) => {
    setOpen(false);
    onSelectStep(stepId);
  };

  return (
    <section aria-label="Fab process map" className={`relative w-full border border-[#DCE5F2] bg-white ${variant === 'overview' ? 'rounded-md' : 'rounded-2xl shadow-[0_12px_32px_rgba(21,65,112,0.12)] backdrop-blur-xl'}`}>
      <div className="flex min-h-[72px] flex-wrap items-center justify-between gap-2 px-4 py-3 sm:px-5">
        {variant === 'overview' ? (
          <div className="flex min-w-0 flex-1 flex-col gap-3 py-2 sm:flex-row sm:items-center sm:gap-8">
            <div className="min-w-0 sm:w-1/3">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#145DB4]">Current view</p>
              <p className="mt-1 font-display text-base font-bold text-[#102A43] sm:text-lg">Cleanroom overview</p>
            </div>
            <div className="min-w-0 border-t border-[#DCE5F2] pt-3 sm:border-l sm:border-t-0 sm:py-0 sm:pl-8">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#667F94]">Next station</p>
              <p className="mt-1 text-sm font-semibold text-[#102A43] sm:text-base">Deposition / build the first film</p>
            </div>
          </div>
        ) : <div className="flex min-w-0 items-center gap-3">
          <span aria-hidden="true" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#EAF2FF] text-[#166FE5]">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5"><path strokeLinecap="round" strokeLinejoin="round" d="M4 18h4V6h5v7h7M17 10l3 3-3 3" /></svg>
          </span>
          <div className="min-w-0">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-[#667F94]">{stepContext}</p>
            <p className="truncate font-display text-sm font-bold text-[#173348] sm:text-base">{currentStep?.name ?? 'Fab process'}</p>
          </div>
        </div>}
        <div className="flex items-center gap-2">
          {onBackToFab && <button type="button" onClick={onBackToFab} className="min-h-[44px] rounded-lg px-2 text-xs font-semibold text-[#476176] hover:bg-[#EAF2FF] hover:text-[#145DB4] sm:px-3 sm:text-sm">← Fab Overview</button>}
          <button type="button" aria-expanded={open} aria-controls={panelId} onClick={() => setOpen((wasOpen) => !wasOpen)} className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-[#C9D8E9] bg-white px-3 text-xs font-bold text-[#145DB4] hover:border-[#166FE5] hover:bg-[#F4F8FF] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#166FE5] sm:text-sm">
            {open ? 'Close process map' : 'View process map'}
            <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`}><path strokeLinecap="round" strokeLinejoin="round" d="m4 7 6 6 6-6" /></svg>
          </button>
        </div>
      </div>

      {open && (
        <div id={panelId} className="absolute left-0 right-0 top-full z-50 mt-2 max-h-[min(55vh,360px)] overflow-y-auto rounded-xl border border-[#DCE5F2] bg-white p-3 shadow-[0_20px_50px_rgba(21,65,112,0.18)] sm:p-4">
          <p className="mb-3 text-xs text-[#667F94]">Select a station to inspect the wafer at that point in the cycle.</p>
          <ol aria-label="Process stations" className="grid grid-cols-2 gap-2 lg:grid-cols-3 2xl:grid-cols-5">
            {CANONICAL_PROCESS_STEPS.map((step) => {
              const active = step.id === activeStepId;
              const completed = completedStepIds.includes(step.id);
              return (
                <li key={step.id}>
                  <button type="button" onClick={() => selectStep(step.id)} aria-current={active ? 'step' : undefined} className={`flex min-h-[48px] w-full items-center gap-2 rounded-lg border px-3 text-left text-xs font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#166FE5] ${active ? 'border-[#166FE5] bg-[#EAF2FF] text-[#145DB4]' : 'border-[#DCE5F2] text-[#314B63] hover:bg-[#F4F8FE]'}`}>
                    <span className="font-mono text-[#166FE5]">{step.stepNumber ?? step.checkpointKind ?? (step.order === 'start' ? 'S' : '↺')}</span>
                    <span>{step.name}{completed && !active ? ' ✓' : ''}</span>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
      )}
    </section>
  );
};

export default ProcessMapDisclosure;
