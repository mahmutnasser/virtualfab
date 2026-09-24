import {
  type WaferState,
  type ProcessAction,
  type ProcessResult,
  type MetrologyInspectionData,
} from '../engine/types';
import { applyProcess, createBareWafer } from '../engine/process-engine';
import {
  isQuestionAnswerCorrect,
} from '../types/prediction';
import { normalizeCanonicalNodeId } from '../types/process';
import { getStepCurriculum } from '../data/wafer-lab-curriculum';

export type ActiveView = 'fab-overview' | 'station-focus' | 'wafer-lab';

/**
 * Explicit Finite State Machine states for learner application orchestration.
 * Strict separation between primary fabrication operations and conceptual metrology checkpoints.
 */
export type FabMachineState =
  | 'FAB_OVERVIEW'
  | 'STATION_FOCUS'
  | 'WAFER_LAB_PREDICTING'
  | 'WAFER_LAB_READY'
  | 'WAFER_LAB_EXECUTING'
  | 'WAFER_LAB_OBSERVING'
  | 'WAFER_LAB_STEP_COMPLETE'
  | 'CHECKPOINT_FOCUS'
  | 'CHECKPOINT_INSPECTING'
  | 'CHECKPOINT_OBSERVING'
  | 'CHECKPOINT_COMPLETE';

/**
 * Complete Event Vocabulary for Virtual Fab orchestration.
 * Standardized on canonical 'NODE' vocabulary with 'STEP' aliases for backward compatibility.
 */
export type FabEvent =
  | { type: 'SELECT_NODE'; nodeId: string }
  | { type: 'SELECT_STEP'; stepId: string }
  | { type: 'OPEN_STATION'; stepId: string }
  | { type: 'CLOSE_STATION' }
  | { type: 'OPEN_WAFER_LAB' }
  | { type: 'SELECT_PREDICTION'; optionId: string }
  | { type: 'COMMIT_PREDICTION' }
  | { type: 'RUN_PROCESS'; action?: ProcessAction }
  | { type: 'PROCESS_FINISHED'; result?: ProcessResult }
  | { type: 'ANSWER_INTERPRETATION'; optionId: string }
  | { type: 'COMPLETE_STEP' }
  | { type: 'PROCEED_TO_NEXT_NODE'; nextNodeId?: string }
  | { type: 'PROCEED_TO_NEXT_STEP'; nextStepId?: string }
  | { type: 'OPEN_CHECKPOINT'; checkpointId: string }
  | { type: 'RUN_INSPECTION'; checkpointId?: 'adi' | 'aei'; targetPattern?: boolean[] }
  | { type: 'INSPECTION_FINISHED'; result?: MetrologyInspectionData }
  | { type: 'COMPLETE_CHECKPOINT'; checkpointId?: string }
  | { type: 'RETURN_TO_STATION' }
  | { type: 'RETURN_TO_FAB' }
  | { type: 'RESET_JOURNEY' };

/**
 * Progress tracking separated into primary operations and checkpoints.
 * Start is a setup/boundary state, not one of the six fabrication operations.
 */
export interface FabProgress {
  setupCompleted: boolean;
  completedOperationIds: string[]; // only canonical operations: ['deposition', 'coat', 'lithography', 'develop', 'etch', 'strip']
  completedCheckpointIds: string[]; // ['adi', 'aei']
  selectedNodeId: string;
}

export interface MachineContext {
  machineState: FabMachineState;
  activeView: ActiveView;
  selectedNodeId: string; // primary canonical routing identifier
  selectedStepId: string; // compatibility alias for selectedNodeId
  fabProgress: FabProgress;
  completedStepIds: string[]; // unified array for UI compatibility: [...completedOperationIds, ...completedCheckpointIds]
  isStepCompleted: boolean;

  // Wafer Model (Authoritative physical scientific domain state)
  wafer: WaferState;
  processHistory: ProcessResult[];

  // Learning interaction state for active fabrication operation
  predictionSelectedId: string | null;
  predictionCommitted: boolean;
  isProcessExecuted: boolean;
  interpretationAnsweredId: string | null;
  isInterpretationCorrect: boolean;

  // Conceptual Metrology Checkpoint Data (strictly isolated from wafer.layers)
  activeCheckpointId: 'adi' | 'aei' | null;
  checkpointInspectionData: MetrologyInspectionData | null;
  isCheckpointInspected: boolean;

  // Diagnostic / transition telemetry
  lastError?: string;
  lastActionResult?: ProcessResult;
}

export const CANONICAL_NODE_ORDER = [
  'start',
  'deposition',
  'coat',
  'lithography',
  'develop',
  'adi',
  'etch',
  'aei',
  'strip',
  'repeat',
] as const;

export const CANONICAL_STEP_ORDER = CANONICAL_NODE_ORDER;

export const CANONICAL_OPERATIONS = [
  'deposition',
  'coat',
  'lithography',
  'develop',
  'etch',
  'strip',
] as const;

export const CANONICAL_CHECKPOINTS = ['adi', 'aei'] as const;

/**
 * Creates the initial baseline MachineContext.
 */
export function createInitialContext(initialWafer?: WaferState): MachineContext {
  const wafer = initialWafer ?? createBareWafer();
  const hasOxide = wafer.layers.some((l) => l.material === 'oxide');

  // Start is a setup state, not an operation. Completed operations only track canonical operations.
  const completedOps = hasOxide ? ['deposition'] : [];
  const completedChecks: string[] = [];

  return {
    machineState: 'FAB_OVERVIEW',
    activeView: 'fab-overview',
    selectedNodeId: 'deposition',
    selectedStepId: 'deposition',
    fabProgress: {
      setupCompleted: true,
      completedOperationIds: completedOps,
      completedCheckpointIds: completedChecks,
      selectedNodeId: 'deposition',
    },
    completedStepIds: Array.from(new Set([...completedOps, ...completedChecks])),
    isStepCompleted: hasOxide,
    wafer,
    processHistory: [],
    predictionSelectedId: hasOxide ? 'opt_add_layer' : null,
    predictionCommitted: hasOxide,
    isProcessExecuted: hasOxide,
    interpretationAnsweredId: hasOxide ? 'interp_blanket_additive' : null,
    isInterpretationCorrect: hasOxide,
    activeCheckpointId: null,
    checkpointInspectionData: null,
    isCheckpointInspected: false,
  };
}

/**
 * Pure, deterministic Finite State Machine reducer.
 * Contract: (MachineContext, FabEvent) -> MachineContext
 * Invariant: Never mutates incoming context.
 * Invariant: Scientific wafer.layers changes are dispatched ONLY via ProcessEngine on RUN_PROCESS.
 * Invariant: Metrology checkpoints NEVER mutate wafer.layers.
 */
export function machineReducer(
  ctx: MachineContext,
  rawEvent: FabEvent,
): MachineContext {
  // Normalize any incoming event node/step/checkpoint aliases to canonical IDs
  const event = { ...rawEvent } as any;
  if ('nodeId' in event && typeof event.nodeId === 'string') {
    const normalized = normalizeCanonicalNodeId(event.nodeId);
    if (normalized) event.nodeId = normalized;
  }
  if ('stepId' in event && typeof event.stepId === 'string') {
    const normalized = normalizeCanonicalNodeId(event.stepId);
    if (normalized) event.stepId = normalized;
  }
  if ('checkpointId' in event && typeof event.checkpointId === 'string') {
    const normalized = normalizeCanonicalNodeId(event.checkpointId);
    if (normalized) event.checkpointId = normalized;
  }
  if ('nextNodeId' in event && typeof event.nextNodeId === 'string') {
    const normalized = normalizeCanonicalNodeId(event.nextNodeId);
    if (normalized) event.nextNodeId = normalized;
  }
  if ('nextStepId' in event && typeof event.nextStepId === 'string') {
    const normalized = normalizeCanonicalNodeId(event.nextStepId);
    if (normalized) event.nextStepId = normalized;
  }

  // Global event: RESET_JOURNEY resets entire system to baseline
  if (event.type === 'RESET_JOURNEY') {
    const freshBare = createBareWafer();
    return createInitialContext(freshBare);
  }

  // Global navigation: RETURN_TO_FAB returns learner to neutral overview
  if (event.type === 'RETURN_TO_FAB') {
    return {
      ...ctx,
      machineState: 'FAB_OVERVIEW',
      activeView: 'fab-overview',
      lastError: undefined,
    };
  }

  // Station navigation: RETURN_TO_STATION returns from Wafer Lab to the same physical station without completing step
  if (event.type === 'RETURN_TO_STATION') {
    const isCheckpoint = ctx.selectedNodeId === 'adi' || ctx.selectedNodeId === 'aei';
    return {
      ...ctx,
      machineState: isCheckpoint ? 'CHECKPOINT_FOCUS' : 'STATION_FOCUS',
      activeView: 'station-focus',
      lastError: undefined,
    };
  }

  // Global navigation: OPEN_STATION opens physical station or checkpoint focus
  if (event.type === 'OPEN_STATION') {
    const isCheckpoint = event.stepId === 'adi' || event.stepId === 'aei';
    const isCompleted =
      ctx.fabProgress.completedOperationIds.includes(event.stepId) ||
      ctx.fabProgress.completedCheckpointIds.includes(event.stepId);
    return {
      ...ctx,
      machineState: isCheckpoint ? 'CHECKPOINT_FOCUS' : 'STATION_FOCUS',
      activeView: 'station-focus',
      selectedNodeId: event.stepId,
      selectedStepId: event.stepId,
      activeCheckpointId: isCheckpoint ? (event.stepId as 'adi' | 'aei') : null,
      fabProgress: {
        ...ctx.fabProgress,
        selectedNodeId: event.stepId,
      },
      isStepCompleted: isCompleted,
      isProcessExecuted: isCompleted,
      predictionSelectedId: isCompleted ? ctx.predictionSelectedId : null,
      predictionCommitted: isCompleted,
      interpretationAnsweredId: isCompleted ? ctx.interpretationAnsweredId : null,
      isInterpretationCorrect: isCompleted,
      isCheckpointInspected: isCompleted,
      lastError: undefined,
    };
  }

  switch (ctx.machineState) {
    case 'FAB_OVERVIEW': {
      switch (event.type) {
        case 'SELECT_NODE':
        case 'SELECT_STEP': {
          const targetId = 'nodeId' in event ? event.nodeId : event.stepId;
          const isCheckpoint = targetId === 'adi' || targetId === 'aei';
          return {
            ...ctx,
            selectedNodeId: targetId,
            selectedStepId: targetId,
            fabProgress: {
              ...ctx.fabProgress,
              selectedNodeId: targetId,
            },
            activeCheckpointId: isCheckpoint ? (targetId as 'adi' | 'aei') : null,
            lastError: undefined,
          };
        }


        case 'OPEN_CHECKPOINT': {
          return {
            ...ctx,
            machineState: 'CHECKPOINT_FOCUS',
            activeView: 'station-focus',
            selectedNodeId: event.checkpointId,
            selectedStepId: event.checkpointId,
            activeCheckpointId: event.checkpointId as 'adi' | 'aei',
            fabProgress: {
              ...ctx.fabProgress,
              selectedNodeId: event.checkpointId,
            },
            lastError: undefined,
          };
        }

        case 'OPEN_WAFER_LAB': {
          const targetState: FabMachineState = ctx.isStepCompleted
            ? 'WAFER_LAB_STEP_COMPLETE'
            : ctx.isProcessExecuted
              ? 'WAFER_LAB_OBSERVING'
              : ctx.predictionCommitted
                ? 'WAFER_LAB_READY'
                : 'WAFER_LAB_PREDICTING';

          return {
            ...ctx,
            machineState: targetState,
            activeView: 'wafer-lab',
            lastError: undefined,
          };
        }

        case 'SELECT_PREDICTION': {
          return {
            ...ctx,
            predictionSelectedId: event.optionId,
            predictionCommitted: false,
            machineState: 'WAFER_LAB_PREDICTING',
            activeView: 'wafer-lab',
            lastError: undefined,
          };
        }

        default:
          return {
            ...ctx,
            lastError: `Invalid event '${event.type}' in state 'FAB_OVERVIEW'.`,
          };
      }
    }

    case 'STATION_FOCUS': {
      switch (event.type) {
        case 'SELECT_NODE':
        case 'SELECT_STEP': {
          const targetId = 'nodeId' in event ? event.nodeId : event.stepId;
          const isCheckpoint = targetId === 'adi' || targetId === 'aei';
          if (isCheckpoint) {
            return {
              ...ctx,
              machineState: 'CHECKPOINT_FOCUS',
              selectedNodeId: targetId,
              selectedStepId: targetId,
              activeCheckpointId: targetId as 'adi' | 'aei',
              fabProgress: {
                ...ctx.fabProgress,
                selectedNodeId: targetId,
              },
              lastError: undefined,
            };
          }
          return {
            ...ctx,
            selectedNodeId: targetId,
            selectedStepId: targetId,
            activeCheckpointId: null,
            fabProgress: {
              ...ctx.fabProgress,
              selectedNodeId: targetId,
            },
            lastError: undefined,
          };
        }

        case 'CLOSE_STATION': {
          return {
            ...ctx,
            machineState: 'FAB_OVERVIEW',
            activeView: 'fab-overview',
            lastError: undefined,
          };
        }

        case 'SELECT_PREDICTION': {
          return {
            ...ctx,
            predictionSelectedId: event.optionId,
            predictionCommitted: false,
            machineState: 'WAFER_LAB_PREDICTING',
            activeView: 'wafer-lab',
            lastError: undefined,
          };
        }

        case 'OPEN_WAFER_LAB': {
          const isTargetCompleted =
            ctx.fabProgress.completedOperationIds.includes(ctx.selectedNodeId) ||
            ctx.fabProgress.completedCheckpointIds.includes(ctx.selectedNodeId);

          const targetState: FabMachineState = isTargetCompleted || ctx.selectedNodeId === 'repeat'
            ? 'WAFER_LAB_STEP_COMPLETE'
            : ctx.isProcessExecuted
              ? 'WAFER_LAB_OBSERVING'
              : ctx.predictionCommitted
                ? 'WAFER_LAB_READY'
                : 'WAFER_LAB_PREDICTING';

          return {
            ...ctx,
            machineState: targetState,
            activeView: 'wafer-lab',
            lastError: undefined,
          };
        }

        default:
          return {
            ...ctx,
            lastError: `Invalid event '${event.type}' in state 'STATION_FOCUS'.`,
          };
      }
    }

    case 'WAFER_LAB_PREDICTING': {
      switch (event.type) {
        case 'SELECT_PREDICTION': {
          // Point 9: SELECT_PREDICTION only stores editable selection. Does NOT commit!
          return {
            ...ctx,
            predictionSelectedId: event.optionId,
            predictionCommitted: false,
            lastError: undefined,
          };
        }

        case 'COMMIT_PREDICTION': {
          // Point 9: COMMIT_PREDICTION locks hypothesis -> transitions to READY
          if (!ctx.predictionSelectedId) {
            return {
              ...ctx,
              lastError: 'Cannot commit prediction: no prediction selected.',
            };
          }
          return {
            ...ctx,
            predictionCommitted: true,
            machineState: 'WAFER_LAB_READY',
            lastError: undefined,
          };
        }

        case 'RUN_PROCESS': {
          return {
            ...ctx,
            lastError: 'Prediction must be committed before running the process.',
          };
        }

        default:
          return {
            ...ctx,
            lastError: `Invalid event '${event.type}' in state 'WAFER_LAB_PREDICTING'.`,
          };
      }
    }

    case 'WAFER_LAB_READY': {
      switch (event.type) {
        case 'SELECT_PREDICTION': {
          // Learner may change prediction before executing
          return {
            ...ctx,
            predictionSelectedId: event.optionId,
            predictionCommitted: false,
            machineState: 'WAFER_LAB_PREDICTING',
            lastError: undefined,
          };
        }

        case 'COMMIT_PREDICTION': {
          return ctx;
        }

        case 'RUN_PROCESS': {
          // Point 8: RUN_PROCESS is the ONLY event permitted to invoke applyProcess().
          // Immediately produces authoritative nextState and enters WAFER_LAB_EXECUTING.
          const defaultAction = getStepCurriculum(ctx.selectedNodeId).defaultAction;
          const action: ProcessAction = event.action ?? defaultAction;

          const result = applyProcess(ctx.wafer, action);

          if (result.valid) {
            return {
              ...ctx,
              wafer: result.nextState,
              processHistory: [...ctx.processHistory, result],
              isProcessExecuted: true,
              machineState: 'WAFER_LAB_EXECUTING',
              lastActionResult: result,
              lastError: undefined,
            };
          } else {
            return {
              ...ctx,
              lastActionResult: result,
              lastError: result.feedback[0] ?? 'Process action failed validation.',
            };
          }
        }

        default:
          return {
            ...ctx,
            lastError: `Invalid event '${event.type}' in state 'WAFER_LAB_READY'.`,
          };
      }
    }

    case 'WAFER_LAB_EXECUTING': {
      switch (event.type) {
        case 'PROCESS_FINISHED': {
          // Point 8: PROCESS_FINISHED is lifecycle-only, transitions to OBSERVING
          return {
            ...ctx,
            machineState: 'WAFER_LAB_OBSERVING',
            lastActionResult: event.result ?? ctx.lastActionResult,
            lastError: undefined,
          };
        }

        default:
          return {
            ...ctx,
            lastError: `Invalid event '${event.type}' in state 'WAFER_LAB_EXECUTING'.`,
          };
      }
    }

    case 'WAFER_LAB_OBSERVING': {
      switch (event.type) {
        case 'ANSWER_INTERPRETATION': {
          const curriculum = getStepCurriculum(ctx.selectedNodeId);
          const isCorrect = curriculum.interpretationQuestion
            ? isQuestionAnswerCorrect(
                curriculum.interpretationQuestion,
                event.optionId,
              )
            : true;

          if (isCorrect) {
            return {
              ...ctx,
              interpretationAnsweredId: event.optionId,
              isInterpretationCorrect: true,
              machineState: 'WAFER_LAB_STEP_COMPLETE',
              lastError: undefined,
            };
          }

          return {
            ...ctx,
            interpretationAnsweredId: event.optionId,
            isInterpretationCorrect: false,
            lastError: undefined,
          };
        }

        case 'RUN_PROCESS': {
          return {
            ...ctx,
            lastError: 'Process has already been executed for this operation.',
          };
        }

        default:
          return {
            ...ctx,
            lastError: `Invalid event '${event.type}' in state 'WAFER_LAB_OBSERVING'.`,
          };
      }
    }

    case 'WAFER_LAB_STEP_COMPLETE': {
      switch (event.type) {
        case 'ANSWER_INTERPRETATION': {
          const curriculum = getStepCurriculum(ctx.selectedNodeId);
          const isCorrect = curriculum.interpretationQuestion
            ? isQuestionAnswerCorrect(
                curriculum.interpretationQuestion,
                event.optionId,
              )
            : true;
          return {
            ...ctx,
            interpretationAnsweredId: event.optionId,
            isInterpretationCorrect: isCorrect,
          };
        }

        case 'COMPLETE_STEP': {
          const isOperation = (CANONICAL_OPERATIONS as readonly string[]).includes(ctx.selectedNodeId);
          const updatedOps = isOperation && !ctx.fabProgress.completedOperationIds.includes(ctx.selectedNodeId)
            ? [...ctx.fabProgress.completedOperationIds, ctx.selectedNodeId]
            : ctx.fabProgress.completedOperationIds;

          const isCheckpoint = (CANONICAL_CHECKPOINTS as readonly string[]).includes(ctx.selectedNodeId);
          const updatedChecks = isCheckpoint && !ctx.fabProgress.completedCheckpointIds.includes(ctx.selectedNodeId)
            ? [...ctx.fabProgress.completedCheckpointIds, ctx.selectedNodeId]
            : ctx.fabProgress.completedCheckpointIds;

          const unified = Array.from(
            new Set([...updatedOps, ...updatedChecks]),
          );

          return {
            ...ctx,
            fabProgress: {
              ...ctx.fabProgress,
              completedOperationIds: updatedOps,
              completedCheckpointIds: updatedChecks,
            },
            completedStepIds: unified,
            isStepCompleted: true,
            lastError: undefined,
          };
        }

        case 'PROCEED_TO_NEXT_NODE':
        case 'PROCEED_TO_NEXT_STEP': {
          const targetNext = 'nextNodeId' in event ? event.nextNodeId : 'nextStepId' in event ? event.nextStepId : undefined;
          const currentIndex = CANONICAL_NODE_ORDER.indexOf(
            ctx.selectedNodeId as (typeof CANONICAL_NODE_ORDER)[number],
          );
          const defaultNext =
            currentIndex >= 0 && currentIndex < CANONICAL_NODE_ORDER.length - 1
              ? CANONICAL_NODE_ORDER[currentIndex + 1]
              : 'coat';
          const nextNodeId = targetNext ?? defaultNext;

          const isOperation = (CANONICAL_OPERATIONS as readonly string[]).includes(ctx.selectedNodeId);
          const updatedOps = isOperation && !ctx.fabProgress.completedOperationIds.includes(ctx.selectedNodeId)
            ? [...ctx.fabProgress.completedOperationIds, ctx.selectedNodeId]
            : ctx.fabProgress.completedOperationIds;

          const isCheckpoint = (CANONICAL_CHECKPOINTS as readonly string[]).includes(ctx.selectedNodeId);
          const updatedChecks = isCheckpoint && !ctx.fabProgress.completedCheckpointIds.includes(ctx.selectedNodeId)
            ? [...ctx.fabProgress.completedCheckpointIds, ctx.selectedNodeId]
            : ctx.fabProgress.completedCheckpointIds;

          const unified = Array.from(
            new Set([...updatedOps, ...updatedChecks]),
          );

          const isNextCheckpoint = nextNodeId === 'adi' || nextNodeId === 'aei';
          const isTargetCompleted =
            updatedOps.includes(nextNodeId) ||
            updatedChecks.includes(nextNodeId);

          return {
            ...ctx,
            fabProgress: {
              ...ctx.fabProgress,
              completedOperationIds: updatedOps,
              completedCheckpointIds: updatedChecks,
              selectedNodeId: nextNodeId,
            },
            completedStepIds: unified,
            isStepCompleted: true,
            isProcessExecuted: isTargetCompleted,
            predictionSelectedId: null,
            predictionCommitted: isTargetCompleted,
            interpretationAnsweredId: null,
            isInterpretationCorrect: isTargetCompleted,
            isCheckpointInspected: isTargetCompleted,
            selectedNodeId: nextNodeId,
            selectedStepId: nextNodeId,
            activeCheckpointId: isNextCheckpoint ? (nextNodeId as 'adi' | 'aei') : null,
            machineState: isNextCheckpoint ? 'CHECKPOINT_FOCUS' : 'STATION_FOCUS',
            activeView: 'station-focus',
            lastError: undefined,
          };
        }

        default:
          return {
            ...ctx,
            lastError: `Invalid event '${event.type}' in state 'WAFER_LAB_STEP_COMPLETE'.`,
          };
      }
    }

    // ── CHECKPOINT STATES (Point 10: Metrology Checkpoint Lifecycle) ──
    case 'CHECKPOINT_FOCUS': {
      switch (event.type) {
        case 'SELECT_NODE':
        case 'SELECT_STEP': {
          const targetId = 'nodeId' in event ? event.nodeId : event.stepId;
          const isCheckpoint = targetId === 'adi' || targetId === 'aei';
          if (!isCheckpoint) {
            return {
              ...ctx,
              machineState: 'STATION_FOCUS',
              selectedNodeId: targetId,
              selectedStepId: targetId,
              activeCheckpointId: null,
              fabProgress: {
                ...ctx.fabProgress,
                selectedNodeId: targetId,
              },
            };
          }
          return {
            ...ctx,
            selectedNodeId: targetId,
            selectedStepId: targetId,
            activeCheckpointId: targetId as 'adi' | 'aei',
            fabProgress: {
              ...ctx.fabProgress,
              selectedNodeId: targetId,
            },
          };
        }

        case 'CLOSE_STATION': {
          return {
            ...ctx,
            machineState: 'FAB_OVERVIEW',
            activeView: 'fab-overview',
            lastError: undefined,
          };
        }

        case 'OPEN_WAFER_LAB':
        case 'OPEN_CHECKPOINT': {
          const isTargetCompleted =
            ctx.fabProgress.completedCheckpointIds.includes(ctx.selectedNodeId) ||
            ctx.fabProgress.completedOperationIds.includes(ctx.selectedNodeId);

          const targetState: FabMachineState = isTargetCompleted
            ? 'WAFER_LAB_STEP_COMPLETE'
            : ctx.isProcessExecuted || ctx.isCheckpointInspected
              ? 'WAFER_LAB_OBSERVING'
              : 'WAFER_LAB_READY';

          return {
            ...ctx,
            machineState: targetState,
            activeView: 'wafer-lab',
            lastError: undefined,
          };
        }

        case 'RUN_INSPECTION': {
          // Point 10: Checkpoint inspection evaluates pattern conceptually without modifying wafer.layers!
          const checkpointKind: 'ADI' | 'AEI' =
            event.checkpointId?.toUpperCase() === 'ADI' || ctx.selectedNodeId === 'adi'
              ? 'ADI'
              : 'AEI';

          const action: ProcessAction = {
            type: 'inspect',
            checkpoint: checkpointKind,
            targetPattern: event.targetPattern,
          };

          const result = applyProcess(ctx.wafer, action);

          if (result.valid && result.inspection) {
            return {
              ...ctx,
              // INVARIANT: ctx.wafer.layers is NEVER modified by checkpoint inspection!
              checkpointInspectionData: result.inspection,
              isCheckpointInspected: true,
              machineState: 'CHECKPOINT_INSPECTING',
              lastActionResult: result,
              lastError: undefined,
            };
          }

          return {
            ...ctx,
            lastError: result.feedback[0] ?? 'Inspection action failed validation.',
          };
        }

        default:
          return {
            ...ctx,
            lastError: `Invalid event '${event.type}' in state 'CHECKPOINT_FOCUS'.`,
          };
      }
    }

    case 'CHECKPOINT_INSPECTING': {
      switch (event.type) {
        case 'INSPECTION_FINISHED': {
          return {
            ...ctx,
            machineState: 'CHECKPOINT_OBSERVING',
            lastError: undefined,
          };
        }

        default:
          return {
            ...ctx,
            lastError: `Invalid event '${event.type}' in state 'CHECKPOINT_INSPECTING'.`,
          };
      }
    }

    case 'CHECKPOINT_OBSERVING': {
      switch (event.type) {
        case 'COMPLETE_CHECKPOINT': {
          const checkpointId = event.checkpointId ?? ctx.selectedNodeId;
          const updatedChecks = ctx.fabProgress.completedCheckpointIds.includes(checkpointId)
            ? ctx.fabProgress.completedCheckpointIds
            : [...ctx.fabProgress.completedCheckpointIds, checkpointId];

          const unified = Array.from(
            new Set([...ctx.fabProgress.completedOperationIds, ...updatedChecks]),
          );

          return {
            ...ctx,
            fabProgress: {
              ...ctx.fabProgress,
              completedCheckpointIds: updatedChecks,
            },
            completedStepIds: unified,
            machineState: 'CHECKPOINT_COMPLETE',
            lastError: undefined,
          };
        }

        case 'PROCEED_TO_NEXT_NODE':
        case 'PROCEED_TO_NEXT_STEP': {
          const checkpointId = ctx.selectedNodeId;
          const updatedChecks = ctx.fabProgress.completedCheckpointIds.includes(checkpointId)
            ? ctx.fabProgress.completedCheckpointIds
            : [...ctx.fabProgress.completedCheckpointIds, checkpointId];

          const unified = Array.from(
            new Set([...ctx.fabProgress.completedOperationIds, ...updatedChecks]),
          );

          const currentIndex = CANONICAL_NODE_ORDER.indexOf(
            checkpointId as (typeof CANONICAL_NODE_ORDER)[number],
          );
          const defaultNext =
            currentIndex >= 0 && currentIndex < CANONICAL_NODE_ORDER.length - 1
              ? CANONICAL_NODE_ORDER[currentIndex + 1]
              : 'etch';
          const targetNext = 'nextNodeId' in event ? event.nextNodeId : 'nextStepId' in event ? event.nextStepId : undefined;
          const nextNodeId = targetNext ?? defaultNext;

          const isNextCheckpoint = nextNodeId === 'adi' || nextNodeId === 'aei';
          const isTargetCompleted =
            ctx.fabProgress.completedOperationIds.includes(nextNodeId) ||
            updatedChecks.includes(nextNodeId);

          return {
            ...ctx,
            fabProgress: {
              ...ctx.fabProgress,
              completedCheckpointIds: updatedChecks,
              selectedNodeId: nextNodeId,
            },
            completedStepIds: unified,
            isStepCompleted: true,
            isProcessExecuted: isTargetCompleted,
            predictionSelectedId: null,
            predictionCommitted: isTargetCompleted,
            interpretationAnsweredId: null,
            isInterpretationCorrect: isTargetCompleted,
            isCheckpointInspected: isTargetCompleted,
            selectedNodeId: nextNodeId,
            selectedStepId: nextNodeId,
            activeCheckpointId: isNextCheckpoint ? (nextNodeId as 'adi' | 'aei') : null,
            machineState: isNextCheckpoint ? 'CHECKPOINT_FOCUS' : 'STATION_FOCUS',
            activeView: 'station-focus',
            lastError: undefined,
          };
        }

        default:
          return {
            ...ctx,
            lastError: `Invalid event '${event.type}' in state 'CHECKPOINT_OBSERVING'.`,
          };
      }
    }

    case 'CHECKPOINT_COMPLETE': {
      switch (event.type) {
        case 'OPEN_WAFER_LAB':
        case 'OPEN_CHECKPOINT': {
          return {
            ...ctx,
            machineState: 'WAFER_LAB_STEP_COMPLETE',
            activeView: 'wafer-lab',
            lastError: undefined,
          };
        }

        case 'PROCEED_TO_NEXT_NODE':
        case 'PROCEED_TO_NEXT_STEP': {
          const currentIndex = CANONICAL_NODE_ORDER.indexOf(
            ctx.selectedNodeId as (typeof CANONICAL_NODE_ORDER)[number],
          );
          const defaultNext =
            currentIndex >= 0 && currentIndex < CANONICAL_NODE_ORDER.length - 1
              ? CANONICAL_NODE_ORDER[currentIndex + 1]
              : 'etch';
          const targetNext = 'nextNodeId' in event ? event.nextNodeId : 'nextStepId' in event ? event.nextStepId : undefined;
          const nextNodeId = targetNext ?? defaultNext;

          const isNextCheckpoint = nextNodeId === 'adi' || nextNodeId === 'aei';

          return {
            ...ctx,
            selectedNodeId: nextNodeId,
            selectedStepId: nextNodeId,
            fabProgress: {
              ...ctx.fabProgress,
              selectedNodeId: nextNodeId,
            },
            activeCheckpointId: isNextCheckpoint ? (nextNodeId as 'adi' | 'aei') : null,
            machineState: isNextCheckpoint ? 'CHECKPOINT_FOCUS' : 'STATION_FOCUS',
            activeView: 'station-focus',
            lastError: undefined,
          };
        }

        default:
          return {
            ...ctx,
            lastError: `Invalid event '${event.type}' in state 'CHECKPOINT_COMPLETE'.`,
          };
      }
    }

    default:
      return ctx;
  }
}
