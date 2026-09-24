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
      className={`h-16 bg-white border-b border-slate-200/90 px-4 md:px-8 flex items-center justify-between text-slate-800 shrink-0 select-none z-30 shadow-[0_1px_3px_rgba(0,0,0,0.03)] sticky top-0 ${className}`.trim()}
    >
      {/* Brand & Module Title */}
      <div className="flex items-center gap-3 md:gap-5">
        <a
          href="#basics-top"
          className="flex items-center gap-2 group focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#00a6a6] focus-visible:outline-offset-2 rounded"
          aria-label="Silicon Journey Fab Basics"
        >
          <div className="w-8 h-8 rounded-lg bg-[#102a43] flex items-center justify-center text-white font-display font-bold text-xs tracking-wider shadow-sm">
            SJ
          </div>
          <div className="flex flex-col">
            <span className="font-display font-bold text-base md:text-lg tracking-tight text-[#102a43] leading-none">
              SILICON <span className="text-[#00a6a6]">JOURNEY</span>
            </span>
            <span className="font-mono text-[10px] tracking-wider uppercase text-slate-500 font-semibold mt-0.5">
              Fab Basics
            </span>
          </div>
        </a>

        <div className="hidden sm:block h-5 w-px bg-slate-200" aria-hidden="true" />

        <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200/60 font-body">
          Speak the Language
        </span>
      </div>

      {/* Center Nav Anchors */}
      <nav aria-label="Fab Basics sections" className="hidden lg:flex items-center gap-1">
        <a
          href="#section-scale"
          className="px-3 py-1.5 rounded-lg text-xs font-body font-semibold text-slate-600 hover:text-[#102a43] hover:bg-slate-100/80 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#00a6a6]"
        >
          01 Scale
        </a>
        <a
          href="#section-patterning"
          className="px-3 py-1.5 rounded-lg text-xs font-body font-semibold text-slate-600 hover:text-[#102a43] hover:bg-slate-100/80 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#00a6a6]"
        >
          02 Patterns
        </a>
        <a
          href="#section-process"
          className="px-3 py-1.5 rounded-lg text-xs font-body font-semibold text-slate-600 hover:text-[#102a43] hover:bg-slate-100/80 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#00a6a6]"
        >
          03 Materials
        </a>
        <a
          href="#section-measurement"
          className="px-3 py-1.5 rounded-lg text-xs font-body font-semibold text-slate-600 hover:text-[#102a43] hover:bg-slate-100/80 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#00a6a6]"
        >
          04 Measuring
        </a>
        <a
          href="#section-logistics"
          className="px-3 py-1.5 rounded-lg text-xs font-body font-semibold text-slate-600 hover:text-[#102a43] hover:bg-slate-100/80 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#00a6a6]"
        >
          05 Logistics
        </a>
      </nav>

      {/* Return to Virtual Fab CTA */}
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={onNavigateToFab}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-lg bg-[#102a43] hover:bg-[#1b3d5e] text-white font-body text-xs sm:text-sm font-semibold transition-all shadow-sm hover:shadow cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#00a6a6] focus-visible:outline-offset-2"
        >
          <span>Launch Virtual Fab</span>
          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#00a6a6]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </button>
      </div>
    </header>
  );
};

export default FabBasicsTopNav;
