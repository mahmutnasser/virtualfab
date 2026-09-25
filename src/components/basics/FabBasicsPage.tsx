import React, { useState, useMemo } from 'react';
import SiteHeader from '../app/SiteHeader';
import { FabBasicsHero } from './FabBasicsHero';
import { ScaleZoomViewer } from './scale/ScaleZoomViewer';
import { PatterningMiniLesson } from './patterning/PatterningMiniLesson';
import { ProcessVerbsStrip } from './process/ProcessVerbsStrip';
import { DuvEuvComparator } from './patterning/DuvEuvComparator';
import { TermCard } from './cards/TermCard';
import {
  CANONICAL_TERMS,
  CATEGORY_METADATA,
  TermCategory,
} from '../../data/terminology';

interface FabBasicsPageProps {
  onOpenFab?: () => void;
  onOpenHome?: () => void;
  initialTermId?: string;
}

export const FabBasicsPage: React.FC<FabBasicsPageProps> = ({
  onOpenFab,
  onOpenHome,
  initialTermId,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<TermCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredTerms = useMemo(() => {
    return CANONICAL_TERMS.filter((t) => {
      const matchesCategory = selectedCategory === 'all' || t.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        t.term.toLowerCase().includes(q) ||
        t.shortDefinition.toLowerCase().includes(q) ||
        t.whyItMatters.toLowerCase().includes(q) ||
        (t.engineeringDefinition && t.engineeringDefinition.toLowerCase().includes(q)) ||
        t.id.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const handleSelectRelatedTerm = (termId: string) => {
    setSearchQuery(termId);
    const el = document.getElementById('all-terms');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F9FE] text-[#173348] flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* 1. Global White Top Navigation */}
      <SiteHeader activeSection="basics" onOpenHome={onOpenHome ?? (() => {})} onOpenBasics={() => document.getElementById('main-content')?.scrollIntoView?.()} onOpenFab={onOpenFab ?? (() => {})} />

      {/* Main Editorial Content Container */}
      <main id="main-content" tabIndex={-1} className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-12 sm:space-y-20 focus:outline-none">
        
        {/* 2. Hero Section: Left Editorial + Right Large 300 mm Wafer */}
        <FabBasicsHero
          onStartWithWafer={() => handleScrollToSection('scale-viewer')}
          onBrowseAllTerms={() => handleScrollToSection('all-terms')}
        />

        <nav aria-label="On this page" className="flex flex-wrap items-center gap-x-5 gap-y-2 border-y border-[#DCE5F2] py-4 text-sm">
          <span className="mr-2 font-semibold text-[#173348]">On this page</span>
          {[
            ['scale-viewer', 'Scale'],
            ['patterning-lesson', 'Patterning'],
            ['duv-vs-euv', 'Optics'],
            ['process-verbs', 'Process'],
            ['all-terms', 'Vocabulary'],
          ].map(([id, label]) => (
            <a key={id} href={`#${id}`} className="inline-flex min-h-[44px] items-center font-semibold text-[#145DB4] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#166FE5]">{label}</a>
          ))}
        </nav>

        {/* 3. Section 01: Scale Hierarchy (Wafer -> Field -> Die -> Layer -> Feature) */}
        <ScaleZoomViewer onNavigateToFab={onOpenFab} />

        {/* 4. Section 02: Patterning Visual Story (2.5D Cutaways) */}
        <PatterningMiniLesson onOpenFab={onOpenFab} />

        {/* 5. Section 03: DUV vs. EUV Optical Architecture */}
        <DuvEuvComparator />

        {/* 6. Section 04: The 4 Universal Process Verbs */}
        <ProcessVerbsStrip />

        {/* 7. Section 05: Compact Searchable Vocabulary Reference */}
        <section id="all-terms" aria-labelledby="registry-heading" className="space-y-6 pt-4 text-left scroll-mt-24">
          
          {/* Section Header with Large Editorial Number */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-semibold text-[#145DB4] tracking-wider uppercase bg-[#EAF2FF] px-2.5 py-1 rounded-full border border-[#DCE5F2] font-sans">
                  05 · Curriculum Reference
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  {filteredTerms.length} of {CANONICAL_TERMS.length} Terms
                </span>
              </div>
              <h2
                id="registry-heading"
                className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#102A43]"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Semiconductor Vocabulary Reference
              </h2>
              <p className="mt-1 text-sm sm:text-base text-slate-600 max-w-2xl font-body">
                Peer-reviewed definitions, manufacturing consequences, and progressive engineering details.
              </p>
            </div>

            {/* Search Input */}
            <div className="w-full md:w-80">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search all vocabulary..."
                className="w-full min-h-[44px] px-4 py-2.5 text-sm rounded-xl border border-slate-300 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#166FE5] focus:border-transparent font-sans shadow-xs"
              />
            </div>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap gap-2 pt-1">
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={`min-h-[44px] px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-[#166FE5] text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              All Categories ({CANONICAL_TERMS.length})
            </button>
            {(Object.keys(CATEGORY_METADATA) as TermCategory[]).map((catKey) => {
              const meta = CATEGORY_METADATA[catKey];
              const count = CANONICAL_TERMS.filter((t) => t.category === catKey).length;
              return (
                <button
                  key={catKey}
                  type="button"
                  onClick={() => setSelectedCategory(catKey)}
                  className={`min-h-[44px] px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    selectedCategory === catKey
                      ? 'bg-[#166FE5] text-white shadow-sm'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  {meta.title} ({count})
                </button>
              );
            })}
          </div>

          {/* Terms Grid (Refined, lighter visual weight) */}
          {filteredTerms.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
              {filteredTerms.map((term) => (
                <TermCard
                  key={term.id}
                  term={term}
                  onSelectTerm={handleSelectRelatedTerm}
                  defaultExpanded={initialTermId === term.id}
                />
              ))}
            </div>
          ) : (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
              <p className="text-slate-500 text-sm">No vocabulary terms match your filter or search query.</p>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                }}
                className="mt-3 text-xs font-semibold text-[#145DB4] hover:text-[#104D98] underline cursor-pointer"
              >
                Reset filters
              </button>
            </div>
          )}
        </section>

        {/* Global Journey Launch CTA Banner */}
        <section className="rounded-3xl bg-[#102A43] text-white p-8 sm:p-12 border border-slate-800 shadow-md flex flex-col md:flex-row items-center justify-between gap-8 text-left">
          <div className="space-y-2.5 max-w-xl">
            <span className="text-xs font-mono text-[#00A6A6] font-bold uppercase tracking-wider">
              Ready for the Cleanroom?
            </span>
            <h3
              className="text-2xl sm:text-3xl font-bold tracking-tight text-white"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Step Inside the Virtual Fab
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed font-body">
              Now that you speak the language, observe real cleanroom tools, navigate multi-bay wafer routing, and manipulate atomic cross-sections inside the interactive Fab World.
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenFab}
            className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-body font-bold text-sm bg-[#00A6A6] hover:bg-[#008F8F] text-white transition-all shadow-sm shrink-0 cursor-pointer"
          >
            <span>Launch Virtual Fab</span>
            <span className="font-mono text-base">→</span>
          </button>
        </section>
      </main>

      {/* Light Museum-Style Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 mt-16 text-center text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            Silicon Journey · Virtual Fab Basics Module · Grade: Undergraduate Engineering
          </div>
          <div className="flex items-center gap-4">
            <span>Verified References: Plummer et al., Sze & Ng, Quirk & Serda, Levinson</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default FabBasicsPage;
