import React from 'react';
import {
  type QuestionConfig,
  DEPOSITION_INTERPRETATION_QUESTION,
  getOptionFeedback,
  isQuestionAnswerCorrect,
} from '../../types/prediction';
import FeedbackCard from './FeedbackCard';

export interface InterpretationQuestionProps {
  questionConfig?: QuestionConfig;
  selectedOptionId: string | null;
  onSelectOption: (optionId: string) => void;
  disabled?: boolean;
  className?: string;
}

export const InterpretationQuestion: React.FC<InterpretationQuestionProps> = ({
  questionConfig = DEPOSITION_INTERPRETATION_QUESTION,
  selectedOptionId,
  onSelectOption,
  disabled = false,
  className = '',
}) => {
  const feedbackData = getOptionFeedback(
    questionConfig,
    selectedOptionId,
  );

  return (
    <div className={`space-y-3 ${className}`.trim()}>
      <div className="space-y-1">
        <span className="font-mono text-[11px] uppercase tracking-wider text-[#00a6a6] font-bold block">
          STEP 2: CONCEPTUAL INTERPRETATION
        </span>
        <h3
          id="interpretation-heading"
          className="font-display text-sm sm:text-base font-bold text-slate-900 leading-snug"
        >
          {questionConfig.prompt}
        </h3>
        <p className="font-body text-xs text-slate-500">
          {questionConfig.subtext}
        </p>
      </div>

      <div
        role="radiogroup"
        aria-labelledby="interpretation-heading"
        className="space-y-2.5 pt-1"
      >
        {questionConfig.options.map((option) => {
          const isSelected = selectedOptionId === option.id;
          const isCorrect = isQuestionAnswerCorrect(
            questionConfig,
            option.id,
          );

          return (
            <button
              key={option.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              disabled={disabled}
              onClick={() => {
                if (!disabled) onSelectOption(option.id);
              }}
              className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm font-body cursor-pointer transition-all duration-150 flex items-start gap-3 select-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#00a6a6] focus-visible:outline-offset-1 ${
                disabled
                  ? 'opacity-60 cursor-not-allowed bg-slate-50 border-slate-200'
                  : isSelected
                    ? isCorrect
                      ? 'bg-emerald-50/70 border-emerald-500/70 shadow-xs'
                      : 'bg-amber-50/70 border-amber-500/70 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full border mt-0.5 flex items-center justify-center shrink-0 transition-colors ${
                  isSelected
                    ? isCorrect
                      ? 'border-emerald-600 bg-emerald-600 text-white'
                      : 'border-amber-600 bg-amber-600 text-white'
                    : 'border-slate-300 bg-white'
                }`}
                aria-hidden="true"
              >
                {isSelected && (
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                )}
              </div>
              <span
                className={`leading-relaxed ${
                  isSelected
                    ? 'font-medium text-slate-900'
                    : 'text-slate-700'
                }`}
              >
                {option.label}
              </span>
            </button>
          );
        })}
      </div>

      {feedbackData && (
        <div className="pt-2">
          <FeedbackCard
            type={feedbackData.isCorrect ? 'correct' : 'incorrect'}
            message={feedbackData.feedback}
          />
        </div>
      )}
    </div>
  );
};

export default InterpretationQuestion;
