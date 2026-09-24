import React from 'react';
import WaferLabHeader from './WaferLabHeader';
import CrossSectionPanel from './CrossSectionPanel';
import PredictionPanel from './PredictionPanel';
import KeyIdea from './KeyIdea';
import EngineeringView from './EngineeringView';
import SourcePanel from './SourcePanel';
import { useVirtualFabStore } from '../../store/virtual-fab-store';
import { useLiveAnnouncer } from '../a11y/LiveAnnouncerContext';
import { getStepCurriculum } from '../../data/wafer-lab-curriculum';

export interface WaferLabProps {
  onReturnToFab?: () => void;
  onReturnToStation?: () => void;
  onNextStep?: () => void;
  className?: string;
}

export const WaferLab: React.FC<WaferLabProps> = ({
  onReturnToFab,
  onReturnToStation,
  onNextStep,
  className = '',
}) => {
  const wafer = useVirtualFabStore((s) => s.wafer);
  const selectedNodeId = useVirtualFabStore((s) => s.selectedNodeId) || 'deposition';
  const isProcessExecuted = useVirtualFabStore((s) => s.isProcessExecuted);
  const predictionSelectedId = useVirtualFabStore((s) => s.predictionSelectedId);
  const predictionCommitted = useVirtualFabStore((s) => s.predictionCommitted);
  const interpretationAnsweredId = useVirtualFabStore((s) => s.interpretationAnsweredId);
  const isInterpretationCorrect = useVirtualFabStore((s) => s.isInterpretationCorrect);

  const selectPrediction = useVirtualFabStore((s) => s.selectPrediction);
  const commitPrediction = useVirtualFabStore((s) => s.commitPrediction);
  const runProcess = useVirtualFabStore((s) => s.runProcess);
  const processFinished = useVirtualFabStore((s) => s.processFinished);
  const answerInterpretation = useVirtualFabStore((s) => s.answerInterpretation);
  const completeStep = useVirtualFabStore((s) => s.completeStep);
  const proceedToNextStep = useVirtualFabStore((s) => s.proceedToNextStep);
  const returnToFabStore = useVirtualFabStore((s) => s.returnToFab);

  const curriculum = getStepCurriculum(selectedNodeId);

  let announce: ((msg: string) => void) | undefined;
  try {
    const announcer = useLiveAnnouncer();
    announce = announcer.announce;
  } catch {
    announce = undefined;
  }

  const handleReturn = () => {
    if (onReturnToFab) {
      onReturnToFab();
    } else {
      returnToFabStore();
    }
  };

  const handleNext = () => {
    completeStep();
    if (onNextStep) {
      onNextStep();
    } else {
      proceedToNextStep(curriculum.nextStepId);
    }
  };

  const handleRunProcess = () => {
    if (!predictionCommitted && curriculum.predictionQuestion) {
      commitPrediction();
    }
    const result = runProcess();
    processFinished(result);
    announce?.(curriculum.finishedAnnouncement);
  };

  return (
    <div
      className={`min-h-screen w-full flex flex-col bg-[#F8FAFC] text-[#172B3A] select-none ${className}`.trim()}
    >
      {/* ── 1. HEADER ── */}
      <WaferLabHeader
        stepNumber={curriculum.stepNumber}
        totalSteps={curriculum.totalSteps ?? 6}
        isCheckpoint={curriculum.isCheckpoint}
        checkpointKind={curriculum.checkpointKind}
        title={curriculum.title}
        subtitle={curriculum.subtitle}
        onReturnToStation={onReturnToStation}
        onReturnToFab={handleReturn}
      />

      {/* ── 2. MAIN LEARNING CONTENT AREA ── */}
      <main className="flex-1 w-full max-w-[1280px] mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* Real-Time Cleanroom Equipment Telemetry Status Strip */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-3 sm:px-4 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-slate-300 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isProcessExecuted ? 'bg-emerald-400 opacity-75' : 'bg-cyan-400 opacity-75'}`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${isProcessExecuted ? 'bg-emerald-500' : 'bg-[#00A6A6]'}`}></span>
            </span>
            <span className="text-slate-400 uppercase tracking-wider text-[11px]">Tool Station:</span>
            <span className="font-bold text-white">{curriculum.stationName}</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-slate-400 text-[11px] hidden md:inline">Chamber Status:</span>
            <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] tracking-wider uppercase border ${
              isProcessExecuted
                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50'
                : 'bg-cyan-950/80 text-cyan-300 border-cyan-500/50'
            }`}>
              {isProcessExecuted ? 'Recipe Cycle Complete' : 'Ready For Recipe'}
            </span>
          </div>
        </div>

        {/* Responsive Grid: Two-Column on Desktop (60-65% / 35-40%), Stacked on Mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (60-65% on Desktop): Scientific Visualization */}
          <div className="lg:col-span-7 xl:col-span-7 space-y-4">
            <CrossSectionPanel waferState={wafer} stepId={selectedNodeId} />
            <KeyIdea text={curriculum.keyIdea} />
          </div>

          {/* Right Column (35-40% on Desktop): Learner Interaction */}
          <div className="lg:col-span-5 xl:col-span-5">
            <PredictionPanel
              stepId={selectedNodeId}
              isProcessExecuted={isProcessExecuted}
              selectedPredictionId={predictionSelectedId}
              onSelectPrediction={selectPrediction}
              onRunProcess={handleRunProcess}
              interpretationAnsweredId={interpretationAnsweredId}
              isInterpretationCorrect={isInterpretationCorrect}
              onAnswerInterpretation={answerInterpretation}
              onCompleteStep={completeStep}
              onNextStep={handleNext}
              onReturnToFab={handleReturn}
            />
          </div>
        </div>

        {/* ── 3. SUPPORTING SCIENTIFIC CONTEXT (Collapsible Drawers) ── */}
        <div className="pt-2 grid md:grid-cols-2 gap-4">
          <EngineeringView stepId={selectedNodeId} />
          <SourcePanel stepId={selectedNodeId} />
        </div>
      </main>
    </div>
  );
};

export default WaferLab;
