import React from 'react';

export interface BottomNavProps {
  onOpenBasics?: () => void;
  onOpenHome?: () => void;
  className?: string;
}

export const BottomNav: React.FC<BottomNavProps> = ({ onOpenBasics, onOpenHome, className = '' }) => (
  <nav
    aria-label="Mobile Navigation"
    className={`min-h-16 bg-[#0c1e33] border-t border-white/10 px-2 sm:px-4 flex items-center justify-center gap-1 sm:gap-3 text-white select-none z-30 lg:hidden ${className}`.trim()}
  >
    <button type="button" onClick={onOpenHome} className="min-h-[44px] flex-1 rounded-xl px-2 text-sm font-semibold text-slate-200 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white">
      Home
    </button>
    <span aria-current="page" className="min-h-[44px] flex-1 inline-flex items-center justify-center rounded-xl bg-white/15 px-2 text-sm font-semibold text-center">
      Virtual Fab
    </span>
    <button
      type="button"
      onClick={onOpenBasics}
      className="min-h-[44px] flex-1 rounded-xl bg-[#166FE5] px-2 text-sm font-semibold text-white hover:bg-[#145DB4] transition-colors cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2"
    >
      Fab Basics
    </button>
  </nav>
);

export default BottomNav;
