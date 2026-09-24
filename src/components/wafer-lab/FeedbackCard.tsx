import React from 'react';

export interface FeedbackCardProps {
  type: 'correct' | 'incorrect' | 'info';
  title?: string;
  message: string;
  className?: string;
}

export const FeedbackCard: React.FC<FeedbackCardProps> = ({
  type,
  title,
  message,
  className = '',
}) => {
  const isCorrect = type === 'correct';
  const isIncorrect = type === 'incorrect';

  const defaultTitle = isCorrect
    ? 'Correct!'
    : isIncorrect
      ? 'Not Quite'
      : 'Did You Know?';

  const containerClasses = isCorrect
    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
    : isIncorrect
      ? 'bg-amber-50 border-amber-200 text-amber-900'
      : 'bg-blue-50 border-blue-200 text-blue-900';

  const iconClasses = isCorrect
    ? 'text-emerald-600'
    : isIncorrect
      ? 'text-amber-600'
      : 'text-blue-600';

  return (
    <div
      role="status"
      aria-live="polite"
      className={`p-4 rounded-xl border flex items-start gap-3 transition-all ${containerClasses} ${className}`.trim()}
    >
      <div className={`mt-0.5 shrink-0 ${iconClasses}`}>
        {isCorrect ? (
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2.5"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        ) : isIncorrect ? (
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2.5"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
            />
          </svg>
        ) : (
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
              d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
            />
          </svg>
        )}
      </div>

      <div className="flex-1 text-sm font-body">
        <h4 className="font-display font-bold leading-tight">
          {title || defaultTitle}
        </h4>
        <p className="mt-1 leading-relaxed opacity-90">{message}</p>
      </div>
    </div>
  );
};

export default FeedbackCard;
