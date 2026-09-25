import React, { useState } from 'react';

export type SiteSection = 'home' | 'basics' | 'fab';

interface SiteHeaderProps {
  activeSection: SiteSection;
  floating?: boolean;
  onOpenHome: () => void;
  onOpenBasics: () => void;
  onOpenFab: () => void;
}

const sections: { id: SiteSection; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'basics', label: 'Fab Basics' },
  { id: 'fab', label: 'Virtual Fab' },
];

export const SiteHeader: React.FC<SiteHeaderProps> = ({ activeSection, floating = false, onOpenHome, onOpenBasics, onOpenFab }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const openSection = (section: SiteSection) => {
    setMenuOpen(false);
    if (section === 'home') onOpenHome();
    if (section === 'basics') onOpenBasics();
    if (section === 'fab') onOpenFab();
  };

  return (
    <header onKeyDown={(event) => { if (event.key === 'Escape') setMenuOpen(false); }} className={floating ? 'pointer-events-none absolute inset-x-0 top-2 z-50' : 'sticky top-0 z-50 shrink-0 border-b border-[#DCE5F2] bg-white'}>
      <div className={floating ? 'pointer-events-auto mx-auto flex h-12 w-max max-w-[calc(100%-1rem)] items-center justify-between gap-4 rounded-xl border border-[#DCE5F2] bg-white/95 px-2 shadow-[0_8px_28px_rgba(21,65,112,0.16)] backdrop-blur-md sm:px-3' : 'mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8'}>
        <button type="button" onClick={() => openSection('home')} aria-label="Silicon Journey Home" className="inline-flex min-h-[44px] items-center gap-2 rounded-lg text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#166FE5]">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#166FE5] font-display text-[11px] font-bold tracking-wide text-white">SJ</span>
          <span className="font-display text-[11px] font-bold uppercase tracking-tight text-[#173348] min-[360px]:text-[13px] sm:text-base">Silicon Journey</span>
        </button>

        <nav aria-label="Main navigation" className={`hidden h-full items-center md:flex ${floating ? 'gap-4' : 'gap-6'}`}>
          {sections.map((section) => section.id === activeSection ? (
            <span key={section.id} aria-current="page" className="inline-flex h-full items-center border-b-2 border-[#166FE5] pt-0.5 text-sm font-bold text-[#145DB4]">
              {section.label}
            </span>
          ) : (
            <button key={section.id} type="button" onClick={() => openSection(section.id)} className="inline-flex min-h-[44px] items-center rounded text-sm font-semibold text-[#476176] hover:text-[#145DB4] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#166FE5]">
              {section.label}
            </button>
          ))}
        </nav>

        <button type="button" aria-expanded={menuOpen} aria-controls="site-mobile-navigation" aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'} onClick={() => setMenuOpen((open) => !open)} className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-[#DCE5F2] text-[#173348] hover:bg-[#EAF2FF] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#166FE5] md:hidden">
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5"><path strokeLinecap="round" d={menuOpen ? 'M5 5l14 14M19 5 5 19' : 'M4 7h16M4 12h16M4 17h16'} /></svg>
        </button>
      </div>

      {menuOpen && (
        <nav id="site-mobile-navigation" aria-label="Mobile main navigation" className={`pointer-events-auto absolute top-full border border-[#DCE5F2] bg-white p-3 shadow-[0_16px_24px_rgba(21,65,112,0.12)] md:hidden ${floating ? 'left-1/2 mt-2 w-[min(22rem,calc(100vw-1rem))] -translate-x-1/2 rounded-xl' : 'inset-x-0 border-x-0 border-t-0'}`}>
          {sections.map((section) => section.id === activeSection ? (
            <span key={section.id} aria-current="page" className="flex min-h-[48px] items-center rounded-lg border-l-[3px] border-[#166FE5] bg-[#EAF2FF] px-4 text-sm font-bold text-[#145DB4]">{section.label}</span>
          ) : (
            <button key={section.id} type="button" onClick={() => openSection(section.id)} className="flex min-h-[48px] w-full items-center rounded-lg px-4 text-left text-sm font-semibold text-[#476176] hover:bg-[#F4F8FE] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#166FE5]">{section.label}</button>
          ))}
        </nav>
      )}
    </header>
  );
};

export default SiteHeader;
