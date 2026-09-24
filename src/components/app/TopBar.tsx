import React from 'react';

export interface TopBarProps {
  currentLessons?: number;
  totalLessons?: number;
  activeView?: 'fab-overview' | 'station-focus' | 'wafer-lab';
  onBackToFab?: () => void;
  onOpenSettings?: () => void;
  className?: string;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentLessons = 2,
  totalLessons = 12,
  activeView = 'fab-overview',
  onBackToFab,
  onOpenSettings,
  className = '',
}) => {
  // SVG circular progress calculation (radius 12, circumference ~75.4)
  const radius = 12;
  const circumference = 2 * Math.PI * radius;
  const progressPercent = currentLessons / totalLessons;
  const strokeDashoffset = circumference - progressPercent * circumference;

  return (
    <header
      className={`h-16 bg-[#0c1e33] border-b border-white/10 px-4 md:px-8 flex items-center justify-between text-text-on-dark shrink-0 select-none z-30 ${className}`.trim()}
    >
      {/* LEFT: Brand mark, tagline & Back button */}
      <div className="flex items-center gap-4">
        {activeView !== 'fab-overview' && (
          <button
            type="button"
            onClick={onBackToFab}
            aria-label="Return to Fab Overview"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white font-body text-xs sm:text-sm font-medium transition-colors cursor-pointer focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-brand-cyan focus-visible:outline-offset-2"
          >
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
                d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
              />
            </svg>
            <span className="hidden sm:inline">Back to Fab</span>
          </button>
        )}

        <a href="#main-content" className="flex flex-col group">
          <span className="font-display font-bold text-lg md:text-xl tracking-tight text-white leading-none">
            SILICON <span className="text-brand-cyan">JOURNEY</span>
          </span>
          <span className="font-sans text-[8px] md:text-[9px] uppercase tracking-[0.2em] text-slate-300 font-medium mt-1 leading-none">
            EXPLORE &bull; LEARN &bull; BUILD &bull; WHAT&apos;S NEXT
          </span>
        </a>
      </div>

      {/* CENTER: Main Navigation (Desktop) */}
      <nav
        aria-label="Main Navigation"
        className="hidden lg:flex items-center gap-1 xl:gap-2 text-sm font-body"
      >
        <button
          type="button"
          className="px-3.5 py-1.5 rounded-lg text-slate-300 hover:text-white transition-colors cursor-pointer"
        >
          Home
        </button>
        <button
          type="button"
          className="px-3.5 py-1.5 rounded-lg text-slate-300 hover:text-white transition-colors cursor-pointer"
        >
          Learning Map
        </button>
        <button
          type="button"
          aria-current="page"
          className="px-4 py-1.5 rounded-lg bg-[#14375a] text-white border border-brand-cyan shadow-sm shadow-brand-cyan/20 font-semibold cursor-pointer"
        >
          Virtual Fab
        </button>
        <button
          type="button"
          className="px-3.5 py-1.5 rounded-lg text-slate-300 hover:text-white transition-colors cursor-pointer"
        >
          Chips
        </button>
        <button
          type="button"
          className="px-3.5 py-1.5 rounded-lg text-slate-300 hover:text-white transition-colors cursor-pointer"
        >
          Careers
        </button>
      </nav>

      {/* RIGHT: Search, Progress ring & Profile */}
      <div className="flex items-center gap-3 md:gap-5">
        {/* Search button */}
        <button
          type="button"
          aria-label="Search curriculum"
          className="p-2 text-slate-300 hover:text-white hover:bg-white/5 rounded-full transition-colors cursor-pointer"
        >
          <svg
            className="w-4 h-4 md:w-5 md:h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </button>

        {/* Circular Progress Indicator */}
        <div
          className="flex items-center gap-2.5"
          aria-label={`My Progress: ${currentLessons} of ${totalLessons} lessons completed`}
        >
          <div className="relative w-8 h-8 md:w-9 md:h-9 flex items-center justify-center shrink-0">
            <svg
              className="w-full h-full -rotate-90"
              viewBox="0 0 32 32"
              aria-hidden="true"
            >
              <circle
                cx="16"
                cy="16"
                r={radius}
                className="text-white/10"
                strokeWidth="2.5"
                stroke="currentColor"
                fill="transparent"
              />
              <circle
                cx="16"
                cy="16"
                r={radius}
                className="text-brand-cyan transition-all duration-500"
                strokeWidth="2.5"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
              />
            </svg>
          </div>
          <div className="hidden sm:flex flex-col text-left leading-tight">
            <span className="text-[10px] text-slate-400 font-body">
              My Progress
            </span>
            <span className="text-xs font-semibold text-white font-mono">
              {currentLessons} / {totalLessons} lessons
            </span>
          </div>
        </div>

        {/* User Profile Avatar / Settings Button */}
        <button
          type="button"
          onClick={onOpenSettings}
          aria-label="User profile and accessibility settings"
          className="p-1.5 md:p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-full transition-colors focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-brand-cyan focus-visible:outline-offset-2 cursor-pointer"
        >
          <svg
            className="w-6 h-6 md:w-7 md:h-7"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.964 0a9 9 0 10-11.964 0m11.964 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </button>
      </div>
    </header>
  );
};

export default TopBar;
