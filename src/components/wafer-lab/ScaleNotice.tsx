import React from 'react';

export interface ScaleNoticeProps {
  className?: string;
}

export const ScaleNotice: React.FC<ScaleNoticeProps> = ({ className = '' }) => {
  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-slate-500 font-mono text-[11px] select-none ${className}`.trim()}
    >
      <svg
        className="w-3.5 h-3.5 text-slate-400 shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
        />
      </svg>
      <span>Cross-section diagram &bull; Not to scale</span>
    </div>
  );
};

export default ScaleNotice;
