import React from 'react';
import {
  type QuestionOptionItem,
  DEPOSITION_PREDICTION_OPTIONS,
} from '../../types/prediction';

export interface PredictionQuestionProps {
  prompt?: string;
  subtext?: string;
  ariaLabel?: string;
  options?: QuestionOptionItem[];
  selectedOptionId: string | null;
  onSelectOption: (optionId: string) => void;
  disabled?: boolean;
  className?: string;
}

export const PredictionQuestion: React.FC<PredictionQuestionProps> = ({
  prompt = 'What will deposition change on the wafer?',
  subtext = 'Select what happens physically to the wafer before running the equipment.',
  ariaLabel = 'Prediction options for process step',
  options = DEPOSITION_PREDICTION_OPTIONS,
  selectedOptionId,
  onSelectOption,
  disabled = false,
  className = '',
}) => {
  return (
    <fieldset className={`border-none p-0 m-0 select-none ${className}`.trim()}>
      <legend className="block">
        <span className="font-mono text-[11px] uppercase tracking-wider text-[#00a6a6] font-bold block">
          YOUR TURN &bull; CONCEPT PREDICTION
        </span>
        <h3 className="font-display text-lg sm:text-xl font-bold text-slate-900 mt-1 leading-snug">
          {prompt}
        </h3>
        <p className="font-body text-xs text-slate-500 mt-1">
          {subtext}
        </p>
      </legend>

      <div
        role="radiogroup"
        aria-label={ariaLabel}
        className="mt-4 space-y-2.5"
      >
        {options.map((option) => {
          const isSelected = selectedOptionId === option.id;

          return (
            <button
              key={option.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              disabled={disabled}
              onClick={() => onSelectOption(option.id)}
              className={`w-full text-left p-3.5 rounded-xl border transition-all duration-150 flex items-center gap-3 cursor-pointer focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#00a6a6] focus-visible:outline-offset-2 ${
                isSelected
                  ? 'bg-blue-50/70 border-[#00a6a6] ring-1 ring-[#00a6a6] shadow-xs'
                  : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
              } ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
            >
              {/* Radio circle */}
              <div
                className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                  isSelected
                    ? 'border-[#00a6a6] bg-[#00a6a6]'
                    : 'border-slate-300 bg-white'
                }`}
                aria-hidden="true"
              >
                {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>

              {/* Option text */}
              <span className={`font-body text-sm ${isSelected ? 'font-semibold text-slate-900' : 'text-slate-700'}`}>
                {option.label}
              </span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
};

export default PredictionQuestion;
