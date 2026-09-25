import React from 'react';

export interface TopBarProps {
  currentLessons?: number;
  totalLessons?: number;
  activeView?: 'fab-overview' | 'station-focus' | 'wafer-lab';
  onBackToFab?: () => void;
  onOpenBasics?: () => void;
  onOpenHome?: () => void;
  onOpenSettings?: () => void;
  className?: string;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentLessons = 2,
  totalLessons = 12,
  activeView = 'fab-overview',
  onBackToFab,
  onOpenBasics,
  onOpenHome,
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
      className={`min-h-[72px] bg-white border-b border-[#DCE5F2] px-3 sm:px-5 md:px-8 flex items-center justify-between gap-2 text-[#173348] shrink-0 select-none z-30 shadow-[0_2px_12px_rgba(21,65,112,0.05)] ${className}`.trim()}
    >
      {/* LEFT: Brand mark, tagline & Back button */}
      <div className="flex items-center gap-2 sm:gap-4 min-w-0">
        {activeView !== 'fab-overview' && (
          <button
            type="button"
            onClick={onBackToFab}
            aria-label="Return to Fab Overview"
            className="flex min-h-[44px] items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg bg-[#EAF2FF] hover:bg-[#DCEBFF] text-[#145DB4] font-body text-xs sm:text-sm font-semibold transition-colors cursor-pointer focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#166FE5] focus-visible:outline-offset-2"
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

        <button type="button" onClick={onOpenHome} aria-label="Silicon Journey Home" className="flex flex-col group text-left cursor-pointer rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#166FE5]">
          <span className="font-display font-bold text-lg md:text-xl tracking-tight text-[#173348] leading-none">
            <span className="sm:hidden">SJ</span>
            <span className="hidden sm:inline">SILICON <span className="text-[#166FE5]">JOURNEY</span></span>
          </span>
          <span className="hidden md:block font-sans text-[9px] uppercase tracking-[0.14em] text-[#6C8499] font-medium mt-1 leading-none">
            EXPLORE &bull; LEARN &bull; BUILD
          </span>
        </button>
      </div>

      {/* Visible switch between the two working sections. */}
      <div className="flex items-center gap-2 md:gap-4 shrink-0">
        <nav aria-label="Explore sections" className="flex items-center gap-1 rounded-xl border border-[#DCE5F2] bg-[#F4F8FE] p-1">
          <button type="button" onClick={onOpenHome} className="inline-flex min-h-[44px] items-center rounded-lg px-2 sm:px-3 text-xs sm:text-sm font-semibold text-[#476176] hover:bg-white hover:text-[#145DB4] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#166FE5]">
            Home
          </button>
          <span aria-current="page" className="hidden sm:inline-flex min-h-[40px] items-center rounded-lg bg-white px-3 text-xs font-bold text-[#145DB4] shadow-sm">
            Virtual Fab
          </span>
          <button
            type="button"
            onClick={onOpenBasics}
            className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg bg-[#166FE5] px-2.5 sm:px-4 text-xs sm:text-sm font-bold text-white hover:bg-[#145DB4] transition-colors cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#166FE5] focus-visible:outline-offset-2"
          >
            Fab Basics <span aria-hidden="true">→</span>
          </button>
        </nav>

        {/* Circular Progress Indicator */}
        <div
          className="hidden lg:flex items-center gap-2.5"
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
                className="text-[#DCE5F2]"
                strokeWidth="2.5"
                stroke="currentColor"
                fill="transparent"
              />
              <circle
                cx="16"
                cy="16"
                r={radius}
                className="text-[#166FE5] transition-all duration-500"
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
            <span className="text-[10px] text-[#667F94] font-body">
              My Progress
            </span>
            <span className="text-xs font-semibold text-[#173348] font-mono">
              {currentLessons} / {totalLessons} lessons
            </span>
          </div>
        </div>

        {/* User Profile Avatar / Settings Button */}
        <button
          type="button"
          onClick={onOpenSettings}
          aria-label="User profile and accessibility settings"
          className="hidden xl:inline-flex p-1.5 md:p-2 text-[#667F94] hover:text-[#145DB4] hover:bg-[#EAF2FF] rounded-full transition-colors focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#166FE5] focus-visible:outline-offset-2 cursor-pointer"
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
