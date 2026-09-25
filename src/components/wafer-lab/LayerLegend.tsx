import type { MaterialLayer as EngineMaterialLayer } from '../../engine/types';
import type { MaterialLayer as LegacyMaterialLayer } from '../../types/wafer';

export type SupportedLayer = EngineMaterialLayer | LegacyMaterialLayer;

export interface LayerLegendProps {
  layers: SupportedLayer[];
  className?: string;
}

export const LayerLegend: React.FC<LayerLegendProps> = ({
  layers,
  className = '',
}) => {
  const addedProcessLayers = layers.filter(
    (l) => ('material' in l ? l.material !== 'silicon' : l.id !== 'silicon-substrate'),
  );

  return (
    <div
      aria-label="Material Layer Legend"
      className={`flex flex-wrap items-center gap-4 text-xs font-body ${className}`.trim()}
    >
      <span className="font-mono text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
        {addedProcessLayers.length === 0
          ? 'Silicon substrate present; 0 added process layers.'
          : 'Layers:'}
      </span>
      {layers.map((layer) => (
        <div key={layer.id} className="inline-flex items-center gap-2">
          {/* Swatch with color & textural cue */}
          <div
            className="w-4 h-4 rounded border border-slate-300 relative overflow-hidden shadow-xs shrink-0"
            style={{ backgroundColor: layer.color }}
            aria-hidden="true"
          >
            {layer.patternType === 'crosshatch' && (
              <div className="absolute inset-0 opacity-30 bg-[radial-gradient(#172b3a_1px,transparent_1px)] [background-size:3px_3px]" />
            )}
            {layer.patternType === 'dots' && (
              <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#00a6a6_1.5px,transparent_1.5px)] [background-size:4px_4px]" />
            )}
            {layer.patternType === 'stripes' && (
              <div className="absolute inset-0 opacity-30 bg-[repeating-linear-gradient(45deg,#000,#000_1px,transparent_1px,transparent_3px)]" />
            )}
          </div>

          <div className="flex items-baseline gap-1.5">
            <span className="font-semibold text-slate-800">{layer.name}</span>
            {layer.chemicalFormula && (
              <span className="font-mono text-[11px] text-slate-500">
                ({layer.chemicalFormula})
              </span>
            )}
            <span className="text-[10px] text-slate-400 font-mono">
              &bull; {layer.thicknessLabel}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LayerLegend;
