import React from 'react';
import ExpandableSection from '../ui/ExpandableSection';
import { SOURCE_REGISTRY } from '../../data/sources';

export interface SourcePanelProps {
  stepId?: string;
  className?: string;
}

const STEP_SOURCE_MAPPING: Record<string, string[]> = {
  deposition: ['SRC-FAB-PROCESS-01', 'SRC-DEPOSITION-01', 'SRC-DEVICE-ADV-01'],
  coat: ['SRC-FAB-PROCESS-01', 'SRC-SEMICON-MFG-01'],
  lithography: ['SRC-LITHO-EUV-01', 'SRC-METROLOGY-01', 'SRC-FAB-PROCESS-01'],
  develop: ['SRC-PROCESS-CONTROL-01', 'SRC-METROLOGY-01', 'SRC-LITHO-EUV-01'],
  adi: ['SRC-PROCESS-CONTROL-01', 'SRC-METROLOGY-01', 'SRC-LITHO-EUV-01'],
  etch: ['SRC-FAB-PROCESS-01', 'SRC-SEMICON-MFG-01', 'SRC-PROCESS-CONTROL-01'],
  aei: ['SRC-FAB-PROCESS-01', 'SRC-SEMICON-MFG-01', 'SRC-PROCESS-CONTROL-01'],
  strip: ['SRC-FAB-PROCESS-01', 'SRC-SEMICON-MFG-01'],
};

export const SourcePanel: React.FC<SourcePanelProps> = ({
  stepId = 'deposition',
  className = '',
}) => {
  const normalizedId = stepId?.toLowerCase() || 'deposition';
  const sourceIds = STEP_SOURCE_MAPPING[normalizedId] || STEP_SOURCE_MAPPING.deposition;

  const relevantSources = sourceIds
    .map((id) => SOURCE_REGISTRY[id])
    .filter(Boolean);

  return (
    <div className={className}>
      <ExpandableSection title="Sources &bull; Scientific References" defaultOpen={false}>
        <div className="space-y-3 font-mono text-xs text-slate-600 leading-relaxed pt-1">
          {relevantSources.map((src, index) => (
            <div key={src.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 font-bold text-[10px]">
                    {src.id}
                  </span>
                  <span className="text-slate-400 font-mono text-[10px]">Reference #{index + 1}</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  {src.reviewStatus.replace(/_/g, ' ')}
                </span>
              </div>
              <p className="font-body text-slate-800 text-xs font-semibold">
                {src.citation}
              </p>
              {src.chapterOrPages && (
                <p className="text-[11px] text-slate-600 mt-1">
                  <span className="text-slate-400 font-medium">Section:</span> {src.chapterOrPages}
                </p>
              )}
              {src.doiOrIsbn && (
                <p className="text-[10px] text-slate-400 mt-0.5">
                  <span className="text-slate-400">Identifier:</span> {src.doiOrIsbn}
                </p>
              )}
              {src.claimsSupported && src.claimsSupported.length > 0 && (
                <div className="mt-2 pt-2 border-t border-slate-200/60">
                  <span className="text-[10px] text-slate-400 block mb-1 uppercase font-semibold">
                    Supported Claims in Step:
                  </span>
                  <ul className="list-disc list-inside space-y-0.5 text-[11px] text-slate-600 font-body">
                    {src.claimsSupported.map((claim, cIdx) => (
                      <li key={cIdx}>{claim}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </ExpandableSection>
    </div>
  );
};

export default SourcePanel;
