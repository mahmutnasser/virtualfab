import React from 'react';

export interface BottomNavProps {
  onOpenBasics?: () => void;
  className?: string;
}

export const BottomNav: React.FC<BottomNavProps> = ({ onOpenBasics, className = '' }) => (
  <nav
    aria-label="Mobile Navigation"
    className={`min-h-16 bg-[#0c1e33] border-t border-white/10 px-4 flex items-center justify-center gap-3 text-white select-none z-30 lg:hidden ${className}`.trim()}
  >
    <span aria-current="page" className="min-h-[44px] flex-1 max-w-44 inline-flex items-center justify-center rounded-xl bg-white/15 px-3 text-sm font-semibold">
      Virtual Fab
    </span>
    <button
      type="button"
      onClick={onOpenBasics}
      className="min-h-[44px] flex-1 max-w-44 rounded-xl bg-[#166FE5] px-3 text-sm font-semibold text-white hover:bg-[#145DB4] transition-colors cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2"
    >
      Fab Basics →
    </button>
  </nav>
);

export default BottomNav;
