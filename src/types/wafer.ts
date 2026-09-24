export type MaterialType = 'silicon' | 'oxide' | 'photoresist' | 'metal';

export interface MaterialLayer {
  id: string;
  type: MaterialType;
  name: string;
  chemicalFormula?: string;
  thicknessLabel: string;
  relativeHeight: number; // visual height in SVG viewBox units
  color: string;
  patternType?: 'crosshatch' | 'dots' | 'stripes';
}

export interface WaferState {
  stepId: string;
  layers: MaterialLayer[];
}

export const SILICON_SUBSTRATE_LAYER: MaterialLayer = {
  id: 'silicon-substrate',
  type: 'silicon',
  name: 'Silicon Substrate',
  chemicalFormula: 'Si',
  thicknessLabel: '775 µm substrate',
  relativeHeight: 120,
  color: '#6B7B8D',
  patternType: 'crosshatch',
};

export const OXIDE_FILM_LAYER: MaterialLayer = {
  id: 'oxide-film',
  type: 'oxide',
  name: 'Silicon Dioxide',
  chemicalFormula: 'SiO₂',
  thicknessLabel: '~100 nm (illustrative)',
  relativeHeight: 40,
  color: '#B0D4E8',
  patternType: 'dots',
};

export const INITIAL_BARE_WAFER: WaferState = {
  stepId: 'start',
  layers: [SILICON_SUBSTRATE_LAYER],
};

export function applyMockDeposition(currentState: WaferState): WaferState {
  // If oxide is already present, return current state
  if (currentState.layers.some((l) => l.id === OXIDE_FILM_LAYER.id)) {
    return currentState;
  }
  return {
    stepId: 'deposition',
    layers: [SILICON_SUBSTRATE_LAYER, OXIDE_FILM_LAYER],
  };
}
