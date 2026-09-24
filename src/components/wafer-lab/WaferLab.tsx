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
        {/* Responsive Grid: Two-Column on Desktop (60-65% / 35-40%), Stacked on Mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (60-65% on Desktop): Scientific Visualization */}
          <div className="lg:col-span-7 xl:col-span-7 space-y-4">
            <CrossSectionPanel waferState={wafer} />
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
          <EngineeringView />
          <SourcePanel />
        </div>
      </main>
    </div>
  );
};

export default WaferLab;
