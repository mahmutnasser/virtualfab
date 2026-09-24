/**
 * SIMULATION SPATIAL DISCRETIZATION CONTRACT:
 *
 * 16 discrete spatial segments across the wafer diameter represent a conceptual
 * spatial discretization for this educational simulation.
 *
 * IMPORTANT SCIENTIFIC NOTICE:
 * 16 segments are NOT:
 * - physical resolution
 * - feature count
 * - die count
 * - scanner resolution
 * - predictive process geometry
 *
 * The UI must NEVER display "16 segments" as though it were a physical
 * semiconductor property.
 */
export const SIMULATION_MASK_SEGMENTS = 16;

export type MaterialKind =
  | 'silicon'
  | 'oxide'
  | 'photoresist'
  | 'metal'
  | 'nitride'
  | 'other';

export interface MaterialLayer {
  id: string;
  material: MaterialKind;
  name: string;
  chemicalFormula?: string;
  thicknessNm?: number;
  thicknessLabel: string;
  relativeHeight: number; // visual height in SVG units
  presenceMask: boolean[]; // 16 discrete conceptual spatial segments
  /**
   * Exposure state is strictly scoped to photosensitive photoresist layers.
   * Invariant: Must remain undefined for non-resist materials (silicon, oxide, metal, etc.).
   */
  exposureMask?: boolean[];
  color: string;
  patternType?: 'crosshatch' | 'dots' | 'stripes';
}

export interface WaferState {
  currentStepId: string;
  layers: MaterialLayer[];
}

export type MaterialTransformAction =
  | {
      type: 'deposit';
      material: MaterialKind;
      thicknessNm?: number;
      scenarioOptions?: {
        displayName?: string;
        formula?: string;
        illustrativeThicknessNm?: number;
      };
    }
  | {
      type: 'coat-resist';
      tone: 'positive'; // Explicit educational assumption for this learning cycle
      thicknessNm?: number;
    }
  | {
      type: 'expose';
      exposureMask: boolean[]; // 16-segment optical exposure stencil
    }
  | {
      type: 'develop';
    }
  | {
      type: 'etch';
      targetLayerId?: string;
    }
  | {
      type: 'strip';
    };

export type MetrologyCheckpointKind = 'ADI' | 'AEI';

export interface MetrologyCheckpointDefinition {
  id: string; // 'adi' | 'aei'
  checkpointKind: MetrologyCheckpointKind;
  name: string;
  shortName: string;
  stage: 'post-develop' | 'post-etch';
  targetLayerMaterial: 'photoresist' | 'oxide';
  stationId: string;
  description: string;
  whyThisCheckpoint: string;
  sourceIds: string[];
}

export type ProcessControlAction = {
  type: 'inspect';
  checkpoint?: MetrologyCheckpointKind;
  targetPattern?: boolean[];
};

export type ProcessAction = MaterialTransformAction | ProcessControlAction;

export interface ProcessChange {
  layerId: string;
  changeType: 'added' | 'removed' | 'modified';
  description: string;
}

export interface MetrologyInspectionData {
  checkpoint: MetrologyCheckpointKind;
  result: 'match' | 'mismatch';
  inspectedLayerMaterial: MaterialKind;
  differingSegments: number[];
  conceptualFeedback: string;
}

export interface ProcessResult {
  valid: boolean;
  previousState: WaferState;
  nextState: WaferState;
  changes: ProcessChange[];
  feedback: string[];
  inspection?: MetrologyInspectionData;
}

export interface ValidationResult {
  allowed: boolean;
  reason?: string;
}

/**
 * Validates domain invariants on a single material layer.
 * Enforces mask length and exposureMask material scoping.
 */
export function validateLayerInvariants(layer: MaterialLayer): void {
  if (layer.presenceMask.length !== SIMULATION_MASK_SEGMENTS) {
    throw new Error(
      `[SIMULATION INVARIANT VIOLATION] presenceMask must have length ${SIMULATION_MASK_SEGMENTS}, got ${layer.presenceMask.length}`,
    );
  }

  if (layer.exposureMask !== undefined) {
    if (layer.material !== 'photoresist') {
      throw new Error(
        `[SCIENTIFIC SCOPE VIOLATION] exposureMask is strictly scoped to 'photoresist' materials. Layer '${layer.id}' of material '${layer.material}' cannot have an exposureMask.`,
      );
    }
    if (layer.exposureMask.length !== SIMULATION_MASK_SEGMENTS) {
      throw new Error(
        `[SIMULATION INVARIANT VIOLATION] exposureMask must have length ${SIMULATION_MASK_SEGMENTS}, got ${layer.exposureMask.length}`,
      );
    }
  }

  if (layer.thicknessNm !== undefined && layer.thicknessNm < 0) {
    throw new Error(
      `[PHYSICAL INVARIANT VIOLATION] layer thickness cannot be negative: ${layer.thicknessNm} nm`,
    );
  }
}

/**
 * Canonical material layer templates.
 * Scenario-specific illustrative dimensions are provided as default examples.
 */
export const SILICON_SUBSTRATE_LAYER: MaterialLayer = {
  id: 'silicon-substrate',
  material: 'silicon',
  name: 'Silicon Substrate',
  chemicalFormula: 'Si',
  thicknessNm: 775000,
  thicknessLabel: '775 µm substrate (illustrative)',
  relativeHeight: 110,
  presenceMask: Array(SIMULATION_MASK_SEGMENTS).fill(true),
  color: '#6B7B8D',
  patternType: 'crosshatch',
};

export const OXIDE_DEPOSITED_LAYER: MaterialLayer = {
  id: 'oxide-film',
  material: 'oxide',
  name: 'Silicon Dioxide',
  chemicalFormula: 'SiO₂',
  thicknessNm: 100,
  thicknessLabel: '~100 nm (illustrative)',
  relativeHeight: 40,
  presenceMask: Array(SIMULATION_MASK_SEGMENTS).fill(true),
  color: '#B0D4E8',
  patternType: 'dots',
};

export const PHOTORESIST_LAYER: MaterialLayer = {
  id: 'photoresist-layer',
  material: 'photoresist',
  name: 'Photoresist',
  chemicalFormula: 'Polymer (Positive Tone)',
  thicknessNm: 300,
  thicknessLabel: '~300 nm (illustrative)',
  relativeHeight: 35,
  presenceMask: Array(SIMULATION_MASK_SEGMENTS).fill(true),
  exposureMask: Array(SIMULATION_MASK_SEGMENTS).fill(false),
  color: '#E0A842',
  patternType: 'stripes',
};

/**
 * Canonical bare silicon wafer substrate baseline.
 */
export const INITIAL_BARE_WAFER_STATE: WaferState = {
  currentStepId: 'start',
  layers: [{ ...SILICON_SUBSTRATE_LAYER }],
};

