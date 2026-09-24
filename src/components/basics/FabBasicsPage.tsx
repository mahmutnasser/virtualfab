import React, { useState, useMemo } from 'react';
import { FabBasicsTopNav } from './FabBasicsTopNav';
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
  initialTermId?: string;
}

export const FabBasicsPage: React.FC<FabBasicsPageProps> = ({
  onOpenFab,
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
    <div className="min-h-screen bg-[#F8FAFC] text-[#172B3A] flex flex-col font-sans selection:bg-teal-100 selection:text-teal-900">
      {/* 1. Global White Top Navigation */}
      <FabBasicsTopNav onNavigateToFab={onOpenFab ?? (() => {})} />

      {/* Main Editorial Content Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-16 sm:space-y-24">
        
        {/* 2. Hero Section: Left Editorial + Right Large 300 mm Wafer */}
        <FabBasicsHero
          onStartWithWafer={() => handleScrollToSection('scale-viewer')}
          onBrowseAllTerms={() => handleScrollToSection('all-terms')}
        />

        {/* Section Jump Anchors (Museum Guide Style) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200/80 text-xs">
          <span className="text-slate-400 font-semibold uppercase tracking-wider pl-1 shrink-0 text-[11px]">Jump To:</span>
          <button
            type="button"
            onClick={() => handleScrollToSection('scale-viewer')}
            className="px-3.5 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-[#00A6A6] hover:text-[#00A6A6] transition-colors whitespace-nowrap cursor-pointer shadow-2xs font-medium text-slate-700"
          >
            01 Scale Hierarchy
          </button>
          <button
            type="button"
            onClick={() => handleScrollToSection('patterning-lesson')}
            className="px-3.5 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-[#00A6A6] hover:text-[#00A6A6] transition-colors whitespace-nowrap cursor-pointer shadow-2xs font-medium text-slate-700"
          >
            02 Patterning Visual Story
          </button>
          <button
            type="button"
            onClick={() => handleScrollToSection('duv-vs-euv')}
            className="px-3.5 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-[#00A6A6] hover:text-[#00A6A6] transition-colors whitespace-nowrap cursor-pointer shadow-2xs font-medium text-slate-700"
          >
            03 DUV vs EUV
          </button>
          <button
            type="button"
            onClick={() => handleScrollToSection('process-verbs')}
            className="px-3.5 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-[#00A6A6] hover:text-[#00A6A6] transition-colors whitespace-nowrap cursor-pointer shadow-2xs font-medium text-slate-700"
          >
            04 The 4 Verbs
          </button>
          <button
            type="button"
            onClick={() => handleScrollToSection('all-terms')}
            className="px-3.5 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-[#00A6A6] hover:text-[#00A6A6] transition-colors whitespace-nowrap cursor-pointer shadow-2xs font-medium text-slate-700"
          >
            05 Vocabulary Registry ({CANONICAL_TERMS.length})
          </button>
        </div>

        {/* 3. Section 01: Scale Hierarchy (Wafer -> Field -> Die -> Layer -> Feature) */}
        <ScaleZoomViewer onNavigateToFab={onOpenFab} />

        {/* 4. Section 02: Patterning Visual Story (2.5D Cutaways) */}
        <PatterningMiniLesson onOpenFab={onOpenFab} />

        {/* 5. Section 03: DUV vs. EUV Optical Architecture */}
        <DuvEuvComparator />

        {/* 6. Section 04: The 4 Universal Process Verbs */}
        <ProcessVerbsStrip />

        {/* 7. Section 05: Compact Searchable Vocabulary Reference */}
        <section id="all-terms" aria-labelledby="registry-heading" className="space-y-6 pt-4 text-left">
          
          {/* Section Header with Large Editorial Number */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-semibold text-[#00A6A6] tracking-wider uppercase bg-cyan-50 px-2.5 py-0.5 rounded-full border border-cyan-200/60 font-sans">
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
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00A6A6] focus:border-transparent font-sans shadow-xs"
              />
            </div>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap gap-2 pt-1">
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-[#102A43] text-white shadow-sm'
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
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    selectedCategory === catKey
                      ? 'bg-[#102A43] text-white shadow-sm'
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
                className="mt-3 text-xs font-semibold text-teal-600 hover:text-teal-700 underline cursor-pointer"
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
