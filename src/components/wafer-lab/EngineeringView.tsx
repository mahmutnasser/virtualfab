import React from 'react';
import ExpandableSection from '../ui/ExpandableSection';

export interface EngineeringViewProps {
  className?: string;
}

export const EngineeringView: React.FC<EngineeringViewProps> = ({
  className = '',
}) => {
  return (
    <div className={className}>
      <ExpandableSection title="Engineering View &bull; Film Deposition Mechanics" defaultOpen={false}>
        <div className="space-y-3 font-body text-xs sm:text-sm text-slate-600 leading-relaxed pt-1">
          <p>
            In semiconductor fabrication, <strong>Deposition</strong> introduces dielectric,
            semiconducting, or conductive thin films onto the wafer without consuming the underlying substrate
            <span className="ml-1 text-[10px] font-mono px-1 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
              [SRC-FAB-PROCESS-01]
            </span>.
          </p>
          <div className="grid sm:grid-cols-2 gap-3 pt-1">
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono text-xs font-bold text-slate-800">
                  Chemical Vapor Deposition (CVD)
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  [SRC-DEPOSITION-01]
                </span>
              </div>
              <span className="text-xs text-slate-500 block">
                Precursor gases (e.g. SiH₄ + N₂O) react chemically on the heated wafer surface at ~300°C–800°C to grow solid films with conformal coverage across complex topologies.
              </span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono text-xs font-bold text-slate-800">
                  Atomic Layer Deposition (ALD)
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  [SRC-DEVICE-ADV-01]
                </span>
              </div>
              <span className="text-xs text-slate-500 block">
                Pulsed sequential self-limiting surface reactions deposit material one atomic monolayer at a time, achieving sub-nanometer thickness uniformity and defect prevention.
              </span>
            </div>
          </div>
        </div>
      </ExpandableSection>
    </div>
  );
};

export default EngineeringView;
