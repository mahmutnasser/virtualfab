import React, { useState } from 'react';
import PredictionQuestion from './PredictionQuestion';
import InterpretationQuestion from './InterpretationQuestion';
import {
  DEPOSITION_PREDICTION_QUESTION,
  DEPOSITION_INTERPRETATION_QUESTION,
  DEPOSITION_PREDICTION_COMPARISONS,
  getOptionFeedback,
  isQuestionAnswerCorrect,
} from '../../types/prediction';
import { getStepCurriculum } from '../../data/wafer-lab-curriculum';
import FeedbackCard from './FeedbackCard';

export interface PredictionPanelProps {
  stepId?: string;
  isProcessExecuted?: boolean;
  selectedPredictionId?: string | null;
  onSelectPrediction?: (id: string) => void;
  onRunProcess?: () => void;
  interpretationAnsweredId?: string | null;
  isInterpretationCorrect?: boolean;
  onAnswerInterpretation?: (id: string) => void;
  onCompleteStep?: () => void;
  onNextStep?: () => void;
  onReturnToFab?: () => void;
  className?: string;
}

export const PredictionPanel: React.FC<PredictionPanelProps> = ({
  stepId = 'deposition',
  isProcessExecuted = false,
  selectedPredictionId,
  onSelectPrediction,
  onRunProcess,
  interpretationAnsweredId,
  isInterpretationCorrect,
  onAnswerInterpretation,
  onCompleteStep,
  onNextStep,
  onReturnToFab,
  className = '',
}) => {
  const curriculum = getStepCurriculum(stepId);
  const predictionQuestion = curriculum.predictionQuestion ?? DEPOSITION_PREDICTION_QUESTION;
  const interpretationQuestion =
    curriculum.interpretationQuestion ?? DEPOSITION_INTERPRETATION_QUESTION;
  const predictionComparisons =
    curriculum.predictionComparisons ?? DEPOSITION_PREDICTION_COMPARISONS;

  // Support both controlled (via store) and uncontrolled (in isolated component tests) modes
  const [internalPredictionId, setInternalPredictionId] = useState<string | null>(null);
  const [internalInterpId, setInternalInterpId] = useState<string | null>(null);

  const activePredictionId =
    selectedPredictionId !== undefined ? selectedPredictionId : internalPredictionId;
  const activeInterpId =
    interpretationAnsweredId !== undefined ? interpretationAnsweredId : internalInterpId;
  const activeInterpCorrect =
    isInterpretationCorrect !== undefined
      ? isInterpretationCorrect
      : isQuestionAnswerCorrect(interpretationQuestion, activeInterpId);

  const handleSelectPrediction = (id: string) => {
    setInternalPredictionId(id);
    onSelectPrediction?.(id);
  };

  const handleSelectInterpretation = (id: string) => {
    setInternalInterpId(id);
    onAnswerInterpretation?.(id);
  };

  const predictionFeedback = getOptionFeedback(
    predictionQuestion,
    activePredictionId,
  );

  // Invariant: Non-blocking pedagogy. Any selected prediction unlocks process execution.
  // Checkpoints do not require a prediction question.
  const isCheckpoint = Boolean(curriculum.isCheckpoint);
  const isRepeat = curriculum.id === 'repeat';
  const canRunProcess = isCheckpoint || Boolean(activePredictionId && !isProcessExecuted);

  // Comparison data for post-execution contrast
  const comparisonInfo = activePredictionId
    ? predictionComparisons[activePredictionId]
    : undefined;

  const handleProceed = () => {
    onCompleteStep?.();
    if (onNextStep) {
      onNextStep();
    } else if (onReturnToFab) {
      onReturnToFab();
    }
  };

  const handleReturn = () => {
    if (activeInterpCorrect) {
      onCompleteStep?.();
    }
    onReturnToFab?.();
  };

  // ─────────────────────────────────────────────────────────────
  // REPEAT NODE SUMMARY VIEW
  // ─────────────────────────────────────────────────────────────
  if (isRepeat) {
    return (
      <div
        className={`bg-white rounded-2xl border border-slate-200/80 p-5 lg:p-6 shadow-sm flex flex-col justify-between select-none ${className}`.trim()}
      >
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-cyan-50 border border-cyan-200 text-cyan-950">
            <span className="font-mono text-[11px] uppercase tracking-wider text-cyan-700 font-bold block mb-1">
              PATTERNING CYCLE 1 COMPLETE
            </span>
            <h3 className="font-display font-bold text-base text-cyan-950">
              1 Patterned Dielectric Layer on Silicon
            </h3>
            <p className="font-body text-xs text-cyan-900 mt-1 leading-relaxed">
              You have completed the entire canonical sequence: Deposition → Coat Resist →
              Lithography → Develop → ADI Inspection → Etch → AEI Inspection → Strip.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
            <span className="font-mono text-[11px] uppercase tracking-wider text-slate-500 font-bold block">
              THE MULTI-LAYER REPETITION CONCEPT
            </span>
            <p className="font-body text-slate-700 leading-relaxed">
              One simplified patterned dielectric layer is complete. Many repeated patterning and layer-building cycles create more complex device structures.
            </p>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={handleProceed}
              className="w-full h-12 rounded-full font-body font-bold text-sm sm:text-base inline-flex items-center justify-center gap-2 transition-all bg-[#00a6a6] text-[#102a43] shadow-md shadow-[#00a6a6]/30 hover:brightness-105 active:brightness-95 cursor-pointer"
            >
              <span>{curriculum.nextStepLabel}</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // CHECKPOINT INSPECTION VIEW (ADI / AEI)
  // ─────────────────────────────────────────────────────────────
  if (isCheckpoint) {
    const chk = curriculum.checkpointConfig;

    return (
      <div
        className={`bg-white rounded-2xl border border-slate-200/80 p-5 lg:p-6 shadow-sm flex flex-col justify-between select-none ${className}`.trim()}
      >
        {!isProcessExecuted ? (
          <div className="space-y-4">
            <div>
              <span className="font-mono text-[11px] uppercase tracking-wider text-[#00a6a6] font-bold block">
                INLINE METROLOGY CHECKPOINT &bull; {curriculum.checkpointKind}
              </span>
              <h3 className="font-display text-lg sm:text-xl font-bold text-slate-900 mt-1 leading-snug">
                {curriculum.title}
              </h3>
              <p className="font-body text-xs text-slate-500 mt-1">
                {chk?.description}
              </p>
            </div>

            {/* Inspection Specifications Table */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="font-mono text-[11px] uppercase tracking-wider text-slate-500 font-bold block">
                MEASUREMENT TOLERANCES
              </span>
              <div className="space-y-1.5 font-mono text-xs">
                {chk?.inspectionMetrics.map((m, idx) => (
                  <div key={idx} className="flex justify-between items-center py-1 border-b border-slate-200/60 last:border-none">
                    <span className="text-slate-700">{m.label}:</span>
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      {m.spec}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={onRunProcess}
                aria-label={curriculum.runButtonLabel}
                className="w-full h-12 rounded-full font-body font-bold text-sm sm:text-base inline-flex items-center justify-center gap-2 transition-all cursor-pointer bg-[#00a6a6] text-[#102a43] shadow-md shadow-[#00a6a6]/30 hover:brightness-105 active:brightness-95"
              >
                <span>{curriculum.runButtonLabel}</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 animate-in fade-in duration-300">
            {/* Metrology Pass Banner */}
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-3 text-emerald-900">
              <span className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-sm shrink-0">
                ✓
              </span>
              <div>
                <h4 className="font-display font-bold text-sm">
                  Metrology Verified: {curriculum.checkpointKind} Passed
                </h4>
                <p className="font-body text-xs text-emerald-800 mt-0.5">
                  Pattern dimensions, feature profiles, and alignment tolerances evaluated.
                </p>
              </div>
            </div>

            {/* Reworkability Explanation */}
            <div className={`p-3.5 rounded-xl border space-y-1.5 ${chk?.reworkable ? 'bg-sky-50 border-sky-200 text-sky-950' : 'bg-amber-50 border-amber-200 text-amber-950'}`}>
              <span className="font-mono text-[11px] uppercase tracking-wider font-bold block">
                {chk?.reworkable ? 'PRE-ETCH INSPECTION CHECKPOINT' : 'POST-ETCH INSPECTION CHECKPOINT'}
              </span>
              <p className="font-body text-xs sm:text-sm leading-relaxed">
                {chk?.reworkExplanation}
              </p>
            </div>

            {/* Interpretation Question */}
            {curriculum.interpretationQuestion && (
              <div className="pt-2 border-t border-slate-200/80">
                <InterpretationQuestion
                  questionConfig={curriculum.interpretationQuestion}
                  selectedOptionId={activeInterpId}
                  onSelectOption={handleSelectInterpretation}
                />
              </div>
            )}

            {/* Continuation CTA */}
            <div className="pt-2 flex flex-col gap-2.5">
              <button
                type="button"
                disabled={!activeInterpCorrect}
                onClick={handleProceed}
                className={`w-full h-12 rounded-full font-body font-bold text-sm sm:text-base inline-flex items-center justify-center gap-2 transition-all shadow-md ${
                  activeInterpCorrect
                    ? 'bg-[#00a6a6] text-[#102a43] shadow-[#00a6a6]/30 hover:brightness-105 active:brightness-95 cursor-pointer'
                    : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed opacity-75'
                }`}
              >
                <span>{curriculum.nextStepLabel}</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </button>

              <button
                type="button"
                onClick={handleReturn}
                className="w-full py-2 text-xs font-body font-medium text-slate-500 hover:text-slate-800 transition-colors cursor-pointer text-center"
              >
                &larr; Return to Fab Overview
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // STANDARD FABRICATION OPERATION VIEW (1..6)
  // ─────────────────────────────────────────────────────────────
  return (
    <div
      className={`bg-white rounded-2xl border border-slate-200/80 p-5 lg:p-6 shadow-sm flex flex-col justify-between select-none ${className}`.trim()}
    >
      {/* ── BEFORE PROCESS EXECUTION: PREDICTION FLOW ── */}
      {!isProcessExecuted ? (
        <div className="space-y-4">
          <PredictionQuestion
            prompt={predictionQuestion.prompt}
            subtext={predictionQuestion.subtext}
            options={predictionQuestion.options}
            selectedOptionId={activePredictionId}
            onSelectOption={handleSelectPrediction}
            disabled={isProcessExecuted}
          />

          {/* Feedback Card for Selected Prediction */}
          {predictionFeedback && (
            <div className="pt-1">
              <FeedbackCard
                type={predictionFeedback.isCorrect ? 'correct' : 'incorrect'}
                message={predictionFeedback.feedback}
              />
            </div>
          )}

          {/* Primary Action Button: Run Equipment */}
          <div className="pt-2">
            <button
              type="button"
              disabled={!canRunProcess}
              onClick={onRunProcess}
              aria-label={curriculum.runButtonLabel}
              className={`w-full h-12 rounded-full font-body font-bold text-sm sm:text-base inline-flex items-center justify-center gap-2 transition-all cursor-pointer focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#00a6a6] focus-visible:outline-offset-2 ${
                canRunProcess
                  ? 'bg-[#00a6a6] text-[#102a43] shadow-md shadow-[#00a6a6]/30 hover:brightness-105 active:brightness-95'
                  : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed opacity-75'
              }`}
            >
              <span>{curriculum.runButtonLabel}</span>
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
                  d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z"
                />
              </svg>
            </button>
            {!canRunProcess && !activePredictionId && (
              <p className="text-center font-mono text-[11px] text-slate-400 mt-2">
                Select your prediction above to unlock the {curriculum.title.toLowerCase()} run
              </p>
            )}
          </div>
        </div>
      ) : (
        /* ── AFTER PROCESS EXECUTION: EXPLANATION, COMPARISON & INTERPRETATION ── */
        <div className="space-y-4 animate-in fade-in duration-300">
          {/* Success Banner */}
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-3 text-emerald-900">
            <span className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-sm shrink-0">
              ✓
            </span>
            <div>
              <h4 className="font-display font-bold text-sm">
                Process Complete: {stepId === 'deposition' ? 'Thin Film Deposited' : `${curriculum.title} Finished`}
              </h4>
              <p className="font-body text-xs text-emerald-800 mt-0.5">
                {curriculum.subtitle}
              </p>
            </div>
          </div>

          {/* Explicit Contrast: Prediction vs Actual Result */}
          {comparisonInfo && (
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs sm:text-sm">
              <span className="font-mono text-[11px] uppercase tracking-wider text-slate-500 font-bold block">
                PREDICTION RECAP
              </span>
              <p className="font-body text-slate-700">
                <strong className="text-slate-900">You predicted:</strong>{' '}
                <span className="italic">“{comparisonInfo.predicted}”</span>
              </p>
              <p className="font-body text-slate-600 leading-relaxed pt-0.5">
                {comparisonInfo.comparison}
              </p>
            </div>
          )}

          {/* Scientific Explanation */}
          <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200 space-y-1.5">
            <span className="font-mono text-[11px] uppercase tracking-wider text-[#00a6a6] font-bold block">
              WHAT CHANGED?
            </span>
            <p className="font-body text-xs sm:text-sm text-slate-700 leading-relaxed">
              {curriculum.keyIdea}
            </p>
          </div>

          {/* Conceptual Interpretation Question (Gating before Step Complete) */}
          <div className="pt-2 border-t border-slate-200/80">
            <InterpretationQuestion
              questionConfig={interpretationQuestion}
              selectedOptionId={activeInterpId}
              onSelectOption={handleSelectInterpretation}
            />
          </div>

          {/* Action CTAs: Unlocked when Interpretation is Answered Correctly */}
          <div className="pt-2 flex flex-col gap-2.5">
            <button
              type="button"
              disabled={!activeInterpCorrect}
              onClick={handleProceed}
              className={`w-full h-12 rounded-full font-body font-bold text-sm sm:text-base inline-flex items-center justify-center gap-2 transition-all shadow-md focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#00a6a6] focus-visible:outline-offset-2 ${
                activeInterpCorrect
                  ? 'bg-[#00a6a6] text-[#102a43] shadow-[#00a6a6]/30 hover:brightness-105 active:brightness-95 cursor-pointer'
                  : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed opacity-75'
              }`}
            >
              <span>{curriculum.nextStepLabel}</span>
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

            {!activeInterpCorrect && (
              <p className="text-center font-mono text-[11px] text-slate-400">
                Select the correct conceptual answer above to complete this step
              </p>
            )}

            <button
              type="button"
              onClick={handleReturn}
              className="w-full py-2 text-xs font-body font-medium text-slate-500 hover:text-slate-800 transition-colors cursor-pointer text-center"
            >
              &larr; Return to Fab Overview
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PredictionPanel;
