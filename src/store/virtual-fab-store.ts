import { create } from 'zustand';
import {
  type WaferState,
  type ProcessAction,
  type ProcessResult,
  type MetrologyInspectionData,
  OXIDE_DEPOSITED_LAYER,
} from '../engine/types';
import { createBareWafer } from '../engine/process-engine';
import {
  type FabMachineState,
  type FabEvent,
  type MachineContext,
  type FabProgress,
  machineReducer,
  createInitialContext,
} from './state-machine';

export {
  type FabMachineState,
  type FabEvent,
  type ActiveView,
  type FabProgress,
} from './state-machine';

export const FAB_STORAGE_KEY_V2 = 'SILICON_JOURNEY_FAB_V2';
export const LEGACY_FAB_STORAGE_KEY_V1 = 'SILICON_JOURNEY_FAB_V1';
export const FAB_STORAGE_KEY = FAB_STORAGE_KEY_V2;

export interface CurriculumProgress {
  currentLesson: number;
  totalLessons: number;
  courseTitle: string;
  lessonTitle: string;
}

export interface VirtualFabState extends MachineContext {
  // Curriculum Progress (Silicon Journey Course)
  curriculumProgress: CurriculumProgress;
  currentLessons: number;
  totalLessons: number;

  // Transition Guard & Status
  isTransitioning: boolean;
  transitionStatus: 'idle' | 'transitioning';
  startTransition: () => void;
  finishTransition: () => void;
  returnToStation: () => void;

  // Primary State-Machine Dispatcher
  send: (event: FabEvent) => void;

  // UI ergonomics & backward compatibility wrappers
  setActiveView: (view: 'fab-overview' | 'station-focus' | 'wafer-lab') => void;
  selectNode: (nodeId: string) => void;
  proceedToNextNode: (nextNodeId?: string) => void;
  selectStep: (stepId: string) => void;
  openStation: (stepId: string) => void;
  closeStation: () => void;
  openWaferLab: () => void;
  returnToFab: () => void;
  startTour: () => void;
  selectPrediction: (optionId: string) => void;
  commitPrediction: () => void;
  runProcess: (action?: ProcessAction) => ProcessResult;
  processFinished: (result?: ProcessResult) => void;
  answerInterpretation: (optionId: string) => boolean;
  completeStep: () => void;
  proceedToNextStep: (nextStepId?: string) => void;
  openCheckpoint: (checkpointId: string) => void;
  runInspection: (targetPattern?: boolean[]) => void;
  inspectionFinished: (result?: MetrologyInspectionData) => void;
  completeCheckpoint: (checkpointId?: string) => void;
  resetJourney: () => void;
}

export interface PersistedStateV2 {
  schemaVersion: 2;
  fabProgress: FabProgress;
  completedStepIds: string[];
  currentLessons: number;
  selectedNodeId: string;
  selectedStepId: string;
  wafer: WaferState;
  isProcessExecuted: boolean;
  isStepCompleted: boolean;
  predictionSelectedId: string | null;
  predictionCommitted: boolean;
  interpretationAnsweredId: string | null;
  isInterpretationCorrect: boolean;
  activeCheckpointId: 'adi' | 'aei' | null;
  checkpointInspectionData: MetrologyInspectionData | null;
  isCheckpointInspected: boolean;
  machineState?: FabMachineState;
}

export function migrateV1ToV2(oldRaw: string): PersistedStateV2 | null {
  try {
    const data = JSON.parse(oldRaw);
    if (!data || !data.wafer?.layers) return null;

    // Normalize old selectedStepId / selectedNodeId
    let selectedNodeId = data.selectedNodeId ?? data.selectedStepId ?? 'deposition';
    if (selectedNodeId === 'metrology') {
      // Obsolete final metrology step is normalized to a valid canonical node (strip)
      selectedNodeId = 'strip';
    }

    // Filter out obsolete 'metrology' and setup 'start' from completedOperationIds
    const rawCompleted: string[] = Array.isArray(data.completedStepIds)
      ? data.completedStepIds
      : [];

    const validOperations = ['deposition', 'coat', 'lithography', 'develop', 'etch', 'strip'];
    const completedOperationIds = rawCompleted.filter(
      (id: string) => validOperations.includes(id),
    );

    const validCheckpoints = ['adi', 'aei'];
    const rawCheckpoints: string[] = Array.isArray(data.fabProgress?.completedCheckpointIds)
      ? data.fabProgress.completedCheckpointIds
      : rawCompleted;
    const completedCheckpointIds: string[] = rawCheckpoints.filter((id: string) =>
      validCheckpoints.includes(id),
    );

    let machineState: FabMachineState = data.machineState ?? 'FAB_OVERVIEW';
    // Rehydration safety rule: EXECUTING/INSPECTING never restored directly
    if (machineState === 'WAFER_LAB_EXECUTING') {
      machineState = data.isProcessExecuted ? 'WAFER_LAB_OBSERVING' : 'WAFER_LAB_READY';
    } else if (machineState === 'CHECKPOINT_INSPECTING') {
      machineState = 'CHECKPOINT_OBSERVING';
    }

    return {
      schemaVersion: 2,
      fabProgress: {
        setupCompleted: true,
        completedOperationIds,
        completedCheckpointIds,
        selectedNodeId,
      },
      completedStepIds: [...completedOperationIds, ...completedCheckpointIds],
      currentLessons: data.currentLessons ?? 2,
      selectedNodeId,
      selectedStepId: selectedNodeId,
      wafer: data.wafer,
      isProcessExecuted: Boolean(data.isProcessExecuted),
      isStepCompleted: Boolean(data.isStepCompleted),
      predictionSelectedId: data.predictionSelectedId ?? null,
      predictionCommitted: Boolean(data.predictionCommitted ?? data.isProcessExecuted),
      interpretationAnsweredId: data.interpretationAnsweredId ?? null,
      isInterpretationCorrect: Boolean(data.isInterpretationCorrect),
      activeCheckpointId: null,
      checkpointInspectionData: null,
      isCheckpointInspected: false,
      machineState,
    };
  } catch {
    return null;
  }
}

export function loadPersistedState(): PersistedStateV2 | null {
  if (typeof window === 'undefined' || !window.localStorage) return null;
  try {
    const rawV2 = window.localStorage.getItem(FAB_STORAGE_KEY_V2);
    if (rawV2) {
      const data = JSON.parse(rawV2) as PersistedStateV2;
      if (data && data.schemaVersion === 2 && data.wafer?.layers) {
        // Enforce rehydration safety rule: WAFER_LAB_EXECUTING must NEVER be restored directly
        if (data.machineState === 'WAFER_LAB_EXECUTING') {
          data.machineState = data.isProcessExecuted
            ? 'WAFER_LAB_OBSERVING'
            : 'WAFER_LAB_READY';
        }
        if (data.machineState === 'CHECKPOINT_INSPECTING') {
          data.machineState = 'CHECKPOINT_OBSERVING';
        }
        // Normalize selectedNodeId / selectedStepId
        if (data.selectedStepId === 'metrology' || data.selectedNodeId === 'metrology') {
          data.selectedStepId = 'strip';
          data.selectedNodeId = 'strip';
        }
        // Ensure start is not counted in completedOperationIds
        if (data.fabProgress?.completedOperationIds) {
          data.fabProgress.completedOperationIds = data.fabProgress.completedOperationIds.filter(
            (id) => id !== 'start' && id !== 'metrology',
          );
        }
        return data;
      }
    }

    // Attempt migration from V1
    const rawV1 = window.localStorage.getItem(LEGACY_FAB_STORAGE_KEY_V1);
    if (rawV1) {
      const migrated = migrateV1ToV2(rawV1);
      if (migrated) {
        window.localStorage.setItem(FAB_STORAGE_KEY_V2, JSON.stringify(migrated));
        window.localStorage.removeItem(LEGACY_FAB_STORAGE_KEY_V1);
        return migrated;
      }
    }
  } catch {
    // Fallback on corrupt storage
  }
  return null;
}

function persistState(state: VirtualFabState): void {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    const payload: PersistedStateV2 = {
      schemaVersion: 2,
      fabProgress: state.fabProgress,
      completedStepIds: state.completedStepIds,
      currentLessons: state.currentLessons,
      selectedNodeId: state.selectedNodeId,
      selectedStepId: state.selectedStepId,
      wafer: state.wafer,
      isProcessExecuted: state.isProcessExecuted,
      isStepCompleted: state.isStepCompleted,
      predictionSelectedId: state.predictionSelectedId,
      predictionCommitted: state.predictionCommitted,
      interpretationAnsweredId: state.interpretationAnsweredId,
      isInterpretationCorrect: state.isInterpretationCorrect,
      activeCheckpointId: state.activeCheckpointId,
      checkpointInspectionData: state.checkpointInspectionData,
      isCheckpointInspected: state.isCheckpointInspected,
      machineState: state.machineState,
    };
    window.localStorage.setItem(FAB_STORAGE_KEY_V2, JSON.stringify(payload));
  } catch {
    // Ignore write errors (e.g. quota exceeded)
  }
}

const persisted = loadPersistedState();
const initialBareWafer = createBareWafer();
const initialWafer = persisted?.wafer ?? initialBareWafer;
const hasOxide = initialWafer.layers.some(
  (l) => l.material === 'oxide' || l.id === OXIDE_DEPOSITED_LAYER.id,
);

const baseContext = createInitialContext(initialWafer);
if (persisted) {
  baseContext.selectedNodeId = persisted.selectedNodeId ?? persisted.selectedStepId ?? baseContext.selectedNodeId;
  baseContext.selectedStepId = baseContext.selectedNodeId;
  baseContext.fabProgress = persisted.fabProgress ?? baseContext.fabProgress;
  baseContext.completedStepIds = persisted.completedStepIds ?? baseContext.completedStepIds;
  baseContext.isStepCompleted = persisted.isStepCompleted ?? baseContext.isStepCompleted;
  baseContext.isProcessExecuted = persisted.isProcessExecuted ?? hasOxide;
  baseContext.predictionSelectedId = persisted.predictionSelectedId ?? baseContext.predictionSelectedId;
  baseContext.predictionCommitted = persisted.predictionCommitted ?? baseContext.predictionCommitted;
  baseContext.interpretationAnsweredId = persisted.interpretationAnsweredId ?? baseContext.interpretationAnsweredId;
  baseContext.isInterpretationCorrect = persisted.isInterpretationCorrect ?? baseContext.isInterpretationCorrect;
  baseContext.activeCheckpointId = persisted.activeCheckpointId ?? baseContext.activeCheckpointId;
  baseContext.checkpointInspectionData = persisted.checkpointInspectionData ?? baseContext.checkpointInspectionData;
  baseContext.isCheckpointInspected = persisted.isCheckpointInspected ?? baseContext.isCheckpointInspected;
  baseContext.machineState = persisted.machineState ?? 'FAB_OVERVIEW';
  baseContext.activeView =
    baseContext.machineState === 'STATION_FOCUS' || baseContext.machineState === 'CHECKPOINT_FOCUS'
      ? 'station-focus'
      : baseContext.machineState.startsWith('WAFER_LAB')
        ? 'wafer-lab'
        : 'fab-overview';
}

export const useVirtualFabStore = create<VirtualFabState>((set, get) => ({
  ...baseContext,

  // Curriculum Progress (Silicon Journey Course)
  curriculumProgress: {
    currentLesson: persisted?.currentLessons ?? 2,
    totalLessons: 12,
    courseTitle: 'Silicon Journey',
    lessonTitle: 'The Virtual Fab',
  },
  currentLessons: persisted?.currentLessons ?? 2,
  totalLessons: 12,

  // Transition Guard & Status
  isTransitioning: false,
  transitionStatus: 'idle',
  startTransition: () => set({ isTransitioning: true, transitionStatus: 'transitioning' }),
  finishTransition: () => set({ isTransitioning: false, transitionStatus: 'idle' }),
  returnToStation: () => get().send({ type: 'RETURN_TO_STATION' }),

  // Primary State-Machine Dispatcher
  send: (event: FabEvent) => {
    // Guard against race conditions during visual plate/camera transitions
    if (get().isTransitioning) {
      if (
        event.type === 'OPEN_STATION' ||
        event.type === 'SELECT_NODE' ||
        event.type === 'SELECT_STEP' ||
        event.type === 'PROCEED_TO_NEXT_NODE' ||
        event.type === 'PROCEED_TO_NEXT_STEP'
      ) {
        return;
      }
    }

    const currentContext: MachineContext = {
      machineState: get().machineState,
      activeView: get().activeView,
      selectedNodeId: get().selectedNodeId,
      selectedStepId: get().selectedStepId,
      fabProgress: get().fabProgress,
      completedStepIds: get().completedStepIds,
      isStepCompleted: get().isStepCompleted,
      wafer: get().wafer,
      processHistory: get().processHistory,
      predictionSelectedId: get().predictionSelectedId,
      predictionCommitted: get().predictionCommitted,
      isProcessExecuted: get().isProcessExecuted,
      interpretationAnsweredId: get().interpretationAnsweredId,
      isInterpretationCorrect: get().isInterpretationCorrect,
      activeCheckpointId: get().activeCheckpointId,
      checkpointInspectionData: get().checkpointInspectionData,
      isCheckpointInspected: get().isCheckpointInspected,
      lastError: get().lastError,
      lastActionResult: get().lastActionResult,
    };

    const nextContext = machineReducer(currentContext, event);
    set(nextContext);
    persistState(get());
  },

  // Action helper wrappers mapping to state-machine events
  setActiveView: (view: 'fab-overview' | 'station-focus' | 'wafer-lab') => {
    if (view === 'fab-overview') {
      get().send({ type: 'RETURN_TO_FAB' });
    } else if (view === 'station-focus') {
      get().send({ type: 'OPEN_STATION', stepId: get().selectedNodeId });
    } else if (view === 'wafer-lab') {
      get().send({ type: 'OPEN_WAFER_LAB' });
    }
  },

  selectNode: (nodeId: string) => {
    get().send({ type: 'SELECT_NODE', nodeId });
  },

  selectStep: (stepId: string) => {
    get().send({ type: 'SELECT_NODE', nodeId: stepId });
  },

  openStation: (stepId: string) => {
    get().send({ type: 'OPEN_STATION', stepId });
  },

  closeStation: () => {
    get().send({ type: 'CLOSE_STATION' });
  },

  openWaferLab: () => {
    get().send({ type: 'OPEN_WAFER_LAB' });
  },

  returnToFab: () => {
    get().send({ type: 'RETURN_TO_FAB' });
  },

  startTour: () => {
    get().send({ type: 'OPEN_STATION', stepId: 'deposition' });
  },

  selectPrediction: (optionId: string) => {
    get().send({ type: 'SELECT_PREDICTION', optionId });
  },

  commitPrediction: () => {
    get().send({ type: 'COMMIT_PREDICTION' });
  },

  runProcess: (action?: ProcessAction) => {
    get().send({ type: 'RUN_PROCESS', action });
    const lastResult = get().lastActionResult;
    if (lastResult) {
      return lastResult;
    }
    // Fallback if rejected
    return {
      valid: false,
      previousState: get().wafer,
      nextState: get().wafer,
      changes: [],
      feedback: [get().lastError ?? 'Process execution failed.'],
    };
  },

  processFinished: (result?: ProcessResult) => {
    get().send({ type: 'PROCESS_FINISHED', result });
  },

  answerInterpretation: (optionId: string) => {
    get().send({ type: 'ANSWER_INTERPRETATION', optionId });
    return get().isInterpretationCorrect;
  },

  completeStep: () => {
    get().send({ type: 'COMPLETE_STEP' });
  },

  proceedToNextNode: (nextNodeId?: string) => {
    get().send({ type: 'PROCEED_TO_NEXT_NODE', nextNodeId });
  },

  proceedToNextStep: (nextStepId?: string) => {
    get().send({ type: 'PROCEED_TO_NEXT_NODE', nextNodeId: nextStepId });
  },

  openCheckpoint: (checkpointId: string) => {
    get().send({ type: 'OPEN_CHECKPOINT', checkpointId });
  },

  runInspection: (targetPattern?: boolean[]) => {
    get().send({ type: 'RUN_INSPECTION', targetPattern });
  },

  inspectionFinished: (result?: MetrologyInspectionData) => {
    get().send({ type: 'INSPECTION_FINISHED', result });
  },

  completeCheckpoint: (checkpointId?: string) => {
    get().send({ type: 'COMPLETE_CHECKPOINT', checkpointId });
  },

  resetJourney: () => {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        window.localStorage.removeItem(FAB_STORAGE_KEY_V2);
        window.localStorage.removeItem(LEGACY_FAB_STORAGE_KEY_V1);
      } catch {
        // Ignore
      }
    }
    set({ isTransitioning: false, transitionStatus: 'idle' });
    get().send({ type: 'RESET_JOURNEY' });
  },
}));

if (typeof window !== 'undefined') {
  (window as unknown as { __VIRTUAL_FAB_STORE__?: typeof useVirtualFabStore }).__VIRTUAL_FAB_STORE__ = useVirtualFabStore;
}
