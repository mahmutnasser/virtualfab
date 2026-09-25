import React from 'react';

export interface FabBasicsTopNavProps {
  onNavigateToFab: () => void;
  className?: string;
}

export const FabBasicsTopNav: React.FC<FabBasicsTopNavProps> = ({
  onNavigateToFab,
  className = '',
}) => {
  return (
    <header
      role="banner"
      className={`min-h-16 bg-white border-b border-[#DCE5F2] px-4 md:px-8 flex items-center justify-between text-slate-800 shrink-0 select-none z-30 shadow-[0_1px_3px_rgba(0,0,0,0.03)] sticky top-0 ${className}`.trim()}
    >
      {/* Brand & Module Title */}
      <div className="flex items-center gap-3 md:gap-5">
        <a
          href="#basics-top"
          className="flex items-center gap-2 group focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#166FE5] focus-visible:outline-offset-2 rounded"
          aria-label="Silicon Journey Fab Basics"
        >
          <div className="w-8 h-8 rounded-lg bg-[#166FE5] flex items-center justify-center text-white font-display font-bold text-xs tracking-wider shadow-sm">
            SJ
          </div>
          <div className="flex flex-col">
            <span className="font-display font-bold text-xs sm:text-base md:text-lg tracking-tight text-[#102a43] leading-none">
              SILICON JOURNEY
            </span>
            <span className="font-mono text-[10px] tracking-wider uppercase text-slate-500 font-semibold mt-0.5">
              Fab Basics
            </span>
          </div>
        </a>

        <div className="hidden sm:block h-5 w-px bg-slate-200" aria-hidden="true" />

        <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#EAF2FF] text-[#145DB4] border border-[#DCE5F2] font-body">
          Visual learning path
        </span>
      </div>

      {/* Center Nav Anchors */}
      <nav aria-label="Fab Basics sections" className="hidden xl:flex items-center gap-1">
        <a
          href="#scale-viewer"
          className="px-3 py-2 rounded-lg text-xs font-body font-semibold text-slate-600 hover:text-[#145DB4] hover:bg-[#EAF2FF] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#166FE5]"
        >
          Scale
        </a>
        <a
          href="#patterning-lesson"
          className="px-3 py-2 rounded-lg text-xs font-body font-semibold text-slate-600 hover:text-[#145DB4] hover:bg-[#EAF2FF] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#166FE5]"
        >
          Patterning
        </a>
        <a
          href="#duv-vs-euv"
          className="px-3 py-2 rounded-lg text-xs font-body font-semibold text-slate-600 hover:text-[#145DB4] hover:bg-[#EAF2FF] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#166FE5]"
        >
          Optics
        </a>
        <a
          href="#process-verbs"
          className="px-3 py-2 rounded-lg text-xs font-body font-semibold text-slate-600 hover:text-[#145DB4] hover:bg-[#EAF2FF] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#166FE5]"
        >
          Process
        </a>
        <a
          href="#all-terms"
          className="px-3 py-2 rounded-lg text-xs font-body font-semibold text-slate-600 hover:text-[#145DB4] hover:bg-[#EAF2FF] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#166FE5]"
        >
          Vocabulary
        </a>
      </nav>

      {/* Persistent switch back to the simulation */}
      <nav aria-label="Explore sections" className="flex items-center gap-1 rounded-xl bg-[#F2F7FF] p-1 border border-[#DCE5F2]">
        <span aria-current="page" className="hidden sm:inline-flex min-h-[40px] items-center rounded-lg bg-white px-3 text-xs font-semibold text-[#145DB4] shadow-sm">
          Fab Basics
        </span>
        <button
          type="button"
          onClick={onNavigateToFab}
          aria-label="Return to Virtual Fab"
          className="inline-flex min-h-[44px] items-center gap-1.5 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-lg bg-[#166FE5] hover:bg-[#145DB4] text-white font-body text-xs sm:text-sm font-semibold transition-all shadow-sm hover:shadow cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#166FE5] focus-visible:outline-offset-2"
        >
          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          <span>Virtual Fab</span>
        </button>
      </nav>
    </header>
  );
};

export default FabBasicsTopNav;
