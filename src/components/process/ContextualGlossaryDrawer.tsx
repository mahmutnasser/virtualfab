import React, { useState, useEffect, useRef } from 'react';
import { getTermsForFabContext, BasicTerm, CANONICAL_TERMS } from '../../data/terminology';

export interface ContextualGlossaryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  stepId: string;
  onOpenBasics?: (termId?: string) => void;
}

export const ContextualGlossaryDrawer: React.FC<ContextualGlossaryDrawerProps> = ({
  isOpen,
  onClose,
  stepId,
  onOpenBasics,
}) => {
  const [search, setSearch] = useState<string>('');
  const [expandedTermId, setExpandedTermId] = useState<string | null>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // Manage accessibility and focus
  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement;
      closeButtonRef.current?.focus();

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          e.preventDefault();
          onClose();
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        previousActiveElement.current?.focus();
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const contextTerms = getTermsForFabContext(stepId);
  const displayTerms: BasicTerm[] = search
    ? CANONICAL_TERMS.filter(
        (t) =>
          t.term.toLowerCase().includes(search.toLowerCase()) ||
          t.shortDefinition.toLowerCase().includes(search.toLowerCase()) ||
          t.id.toLowerCase().includes(search.toLowerCase())
      )
    : contextTerms.length > 0
    ? contextTerms
    : CANONICAL_TERMS.slice(0, 6);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Fab Vocabulary & Key Terms"
      className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200"
    >
      {/* Click outside to close */}
      <div className="flex-1" onClick={onClose} aria-hidden="true" />

      {/* Drawer content panel */}
      <div
        ref={drawerRef}
        className="w-full max-w-md bg-white h-full shadow-2xl border-l border-slate-200 flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-300"
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <span className="w-2 h-2 rounded-full bg-teal-500" />
              <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-500">
                Fab Basics Glossary
              </span>
            </div>
            <h3
              className="text-lg font-bold text-slate-900"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Key Terms for this Station
            </h3>
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close glossary drawer"
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Search bar */}
        <div className="p-4 border-b border-slate-100 bg-white">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search all fab terms..."
            className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 font-sans"
          />
        </div>

        {/* Terms list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {displayTerms.map((term) => {
            const isExpanded = expandedTermId === term.id;
            return (
              <div
                key={term.id}
                className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-white transition-colors"
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h4 className="font-bold text-slate-900 text-sm">{term.term}</h4>
                  <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-slate-200 text-slate-600">
                    {term.category}
                  </span>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed">{term.shortDefinition}</p>

                {isExpanded && (
                  <div className="mt-2.5 pt-2 border-t border-slate-200 space-y-2 text-xs">
                    <div>
                      <span className="font-semibold text-slate-800 text-[11px] block">Why It Matters:</span>
                      <p className="text-slate-600 text-[11px] leading-relaxed">{term.whyItMatters}</p>
                    </div>
                    {term.engineeringDefinition && (
                      <div className="p-2 rounded bg-teal-50/60 border border-teal-100 font-mono text-[10px] text-teal-950">
                        {term.engineeringDefinition}
                      </div>
                    )}
                  </div>
                )}

                <div className="mt-2.5 flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={() => setExpandedTermId(isExpanded ? null : term.id)}
                    className="text-[11px] font-mono text-teal-700 hover:text-teal-800 font-medium"
                  >
                    {isExpanded ? '▲ Less' : '▼ Details'}
                  </button>

                  {onOpenBasics && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenBasics(term.id);
                      }}
                      className="text-[11px] font-mono text-slate-500 hover:text-teal-700 inline-flex items-center gap-1"
                    >
                      <span>Full Lesson</span>
                      <span>→</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer with link to complete Fab Basics module */}
        <div className="p-4 border-t border-slate-200 bg-slate-50">
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenBasics?.();
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 transition-colors shadow-xs"
          >
            <span>Open Complete "Fab Basics" Guide</span>
            <span className="font-mono">→</span>
          </button>
        </div>
      </div>
    </div>
  );
};
