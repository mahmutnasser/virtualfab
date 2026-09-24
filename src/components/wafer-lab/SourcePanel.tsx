import React from 'react';
import ExpandableSection from '../ui/ExpandableSection';
import { SOURCE_REGISTRY } from '../../data/sources';

export interface SourcePanelProps {
  className?: string;
}

export const SourcePanel: React.FC<SourcePanelProps> = ({ className = '' }) => {
  const depositionSources = [
    SOURCE_REGISTRY['SRC-FAB-PROCESS-01'],
    SOURCE_REGISTRY['SRC-DEPOSITION-01'],
    SOURCE_REGISTRY['SRC-DEVICE-ADV-01'],
  ].filter(Boolean);

  return (
    <div className={className}>
      <ExpandableSection title="Sources &bull; Scientific References" defaultOpen={false}>
        <div className="space-y-3 font-mono text-xs text-slate-600 leading-relaxed pt-1">
          {depositionSources.map((src, index) => (
            <div key={src.id} className="p-2 rounded bg-slate-50 border border-slate-200/80">
              <div className="flex items-center gap-2 mb-1">
                <span className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 font-bold text-[10px]">
                  {src.id}
                </span>
                <span className="text-slate-400 font-mono text-[10px]">Reference #{index + 1}</span>
              </div>
              <p className="font-body text-slate-800 text-xs font-medium">
                {src.citation}
              </p>
              {src.chapterOrPages && (
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Section: {src.chapterOrPages}
                </p>
              )}
              {src.doiOrIsbn && (
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Identifier: {src.doiOrIsbn}
                </p>
              )}
            </div>
          ))}
        </div>
      </ExpandableSection>
    </div>
  );
};

export default SourcePanel;
