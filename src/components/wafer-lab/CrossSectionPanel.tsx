import WaferCrossSectionSVG, { type SupportedWaferState } from './WaferCrossSectionSVG';
import LayerLegend from './LayerLegend';
import ScaleNotice from './ScaleNotice';

export interface CrossSectionPanelProps {
  waferState: SupportedWaferState;
  className?: string;
}

export const CrossSectionPanel: React.FC<CrossSectionPanelProps> = ({
  waferState,
  className = '',
}) => {
  return (
    <div
      className={`bg-white rounded-2xl border border-slate-200/80 p-5 lg:p-6 shadow-sm flex flex-col justify-between ${className}`.trim()}
    >
      {/* Top Header of Diagram with Scale Notice */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <span className="font-mono text-[11px] uppercase tracking-wider text-[#00a6a6] font-bold block">
            SCIENTIFIC CROSS-SECTION
          </span>
          <h2 className="font-display text-lg font-bold text-slate-900 mt-0.5">
            Wafer Layer Architecture
          </h2>
        </div>
        <ScaleNotice />
      </div>

      {/* Main SVG Cross-Section Renderer */}
      <div className="my-4 flex items-center justify-center">
        <WaferCrossSectionSVG waferState={waferState} />
      </div>

      {/* Bottom Material Legend */}
      <div className="pt-3 border-t border-slate-100">
        <LayerLegend layers={waferState.layers} />
      </div>
    </div>
  );
};

export default CrossSectionPanel;
