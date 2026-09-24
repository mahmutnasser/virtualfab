import React, { useState } from 'react';
import type { BasicTerm } from '../../../data/terminology';
import { getSource, type AcademicSource } from '../../../data/sources';
import { CdMeasurementVisual } from '../measurement/CdMeasurementVisual';
import { OverlayVisual } from '../measurement/OverlayVisual';
import { YieldWaferMap } from '../measurement/YieldWaferMap';

interface TermCardProps {
  term: BasicTerm;
  onSelectTerm?: (termId: string) => void;
  defaultExpanded?: boolean;
}

export const TermCard: React.FC<TermCardProps> = ({
  term,
  onSelectTerm,
  defaultExpanded = false,
}) => {
  const [showEngineering, setShowEngineering] = useState<boolean>(defaultExpanded);
  const [showCitation, setShowCitation] = useState<boolean>(false);

  // Safely resolve sources
  const sources: (AcademicSource | null)[] = term.sourceIds
    .map((sId: string) => {
      try {
        return getSource(sId);
      } catch {
        return null;
      }
    })
    .filter(Boolean);

  return (
    <article
      id={`term-${term.id}`}
      aria-labelledby={`heading-${term.id}`}
      className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs hover:border-slate-300 hover:shadow-md transition-all duration-200 text-left"
    >
      <div>
        {/* Top Header: Category Tag & Verified Badge */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md font-sans">
            {term.category}
          </span>
          <span className="text-[11px] font-medium text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200/50 flex items-center gap-1 font-sans">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
            Verified
          </span>
        </div>

        {/* Term Name */}
        <h3
          id={`heading-${term.id}`}
          className="text-xl font-bold tracking-tight text-[#102A43]"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          {term.term}
        </h3>

        {/* One-Sentence Plain Definition */}
        <p className="mt-2 text-sm text-[#172B3A] leading-relaxed font-body">
          {term.shortDefinition}
        </p>

        {/* Specialized Interactive Visual Embeds (CD, Overlay, Yield, Photoresist) */}
        {term.id === 'photoresist' && (
          <div className="my-4 rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 shadow-xs">
            <div className="relative aspect-[16/9] w-full">
              <img
                src="/images/basics/hero-wafer-cleanroom.jpg"
                alt="Photoresist-coated 300 mm silicon wafer in cleanroom"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2.5 left-2.5 right-2.5 bg-slate-950/85 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700 text-[11px] font-sans text-slate-300 leading-snug">
                <span className="font-semibold text-purple-300">Educational Note:</span> Real-world photoresists vary from amber to reddish-brown or translucent; purple is used in Silicon Journey as an instructional visual convention.
              </div>
            </div>
          </div>
        )}
        {term.id === 'cd' && (
          <div className="my-4">
            <CdMeasurementVisual />
          </div>
        )}
        {term.id === 'overlay' && (
          <div className="my-4">
            <OverlayVisual />
          </div>
        )}
        {term.id === 'yield' && (
          <div className="my-4">
            <YieldWaferMap />
          </div>
        )}

        {/* "Why It Matters in Fab" Callout */}
        <div className="mt-4 p-3.5 rounded-xl bg-slate-50/80 border border-slate-100">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1 font-sans">
            Why It Matters in Fab
          </span>
          <p className="text-xs text-slate-600 leading-relaxed font-body">
            {term.whyItMatters}
          </p>
        </div>

        {/* Expandable Engineering View (Progressive Disclosure) */}
        {term.engineeringDefinition && (
          <div className="mt-3">
            <button
              type="button"
              onClick={() => setShowEngineering(!showEngineering)}
              aria-expanded={showEngineering}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 hover:text-teal-800 transition-colors cursor-pointer font-sans"
            >
              <span>{showEngineering ? '▼ Hide' : '▶ Show'} Engineering View</span>
            </button>

            {showEngineering && (
              <div className="mt-2 p-3.5 rounded-xl bg-cyan-50/40 border border-cyan-100/70 text-xs text-slate-700 leading-relaxed font-body">
                <span className="text-[10px] font-mono font-bold text-teal-800 uppercase tracking-wider block mb-1">
                  Advanced Formulation / Mechanism
                </span>
                <p>{term.engineeringDefinition}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Footer: Related Terms & Academic Citations */}
      <div className="mt-5 pt-4 border-t border-slate-100 space-y-2">
        {/* Related Terms */}
        {term.relatedTermIds && term.relatedTermIds.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-slate-400 font-medium">See also:</span>
            {term.relatedTermIds.map((rId: string) => (
              <button
                key={rId}
                type="button"
                onClick={() => onSelectTerm && onSelectTerm(rId)}
                className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 text-[11px] font-medium transition-colors cursor-pointer"
              >
                #{rId}
              </button>
            ))}
          </div>
        )}

        {/* Academic Source Citation Link */}
        {sources.length > 0 && (
          <div className="pt-1">
            <button
              type="button"
              onClick={() => setShowCitation(!showCitation)}
              aria-expanded={showCitation}
              className="text-[11px] text-slate-400 hover:text-slate-600 underline font-sans cursor-pointer"
            >
              {sources.length} Academic Reference{sources.length > 1 ? 's' : ''}
            </button>

            {showCitation && (
              <div className="mt-2 p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-600 space-y-1">
                {sources.map((src: AcademicSource | null, idx: number) => {
                  if (!src) return null;
                  return (
                    <div key={src.id ?? idx}>
                      <span className="font-semibold text-slate-800">{src.authors}</span> ({src.year}).{' '}
                      <em>{src.title}</em>. {src.publisher}.
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </article>
  );
};

export default TermCard;
