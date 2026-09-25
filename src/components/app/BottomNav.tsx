import React from 'react';

export interface BottomNavProps {
  onOpenBasics?: () => void;
  onOpenHome?: () => void;
  className?: string;
}

export const BottomNav: React.FC<BottomNavProps> = ({ onOpenBasics, onOpenHome, className = '' }) => (
  <nav
    aria-label="Mobile Navigation"
    className={`min-h-16 bg-white border-t border-[#DCE5F2] px-2 sm:px-4 flex items-center justify-center gap-1 sm:gap-3 text-[#173348] select-none z-30 lg:hidden ${className}`.trim()}
  >
    <button type="button" onClick={onOpenHome} className="min-h-[44px] flex-1 rounded-xl px-2 text-sm font-semibold text-[#476176] hover:bg-[#EAF2FF] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#166FE5]">
      Home
    </button>
    <span aria-current="page" className="min-h-[44px] flex-1 inline-flex items-center justify-center rounded-xl bg-[#EAF2FF] px-2 text-sm font-semibold text-center text-[#145DB4]">
      Virtual Fab
    </span>
    <button
      type="button"
      onClick={onOpenBasics}
      className="min-h-[44px] flex-1 rounded-xl bg-[#166FE5] px-2 text-sm font-semibold text-white hover:bg-[#145DB4] transition-colors cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#166FE5] focus-visible:outline-offset-2"
    >
      Fab Basics
    </button>
  </nav>
);

export default BottomNav;
