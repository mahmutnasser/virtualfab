import { describe, it, expect, beforeEach } from 'vitest';
import {
  useVirtualFabStore,
  FAB_STORAGE_KEY_V2,
  LEGACY_FAB_STORAGE_KEY_V1,
  loadPersistedState,
  migrateV1ToV2,
} from '../../src/store/virtual-fab-store';
import { type FabMachineState, CANONICAL_NODE_ORDER } from '../../src/store/state-machine';
import { applyProcess, createBareWafer } from '../../src/engine/process-engine';
import { SIMULATION_MASK_SEGMENTS } from '../../src/engine/types';

describe('Virtual Fab State-Machine & Zustand Store (Task VF-009 / VF-009.1 / VF-009.2)', () => {
  beforeEach(() => {
    localStorage.clear();
    useVirtualFabStore.getState().resetJourney();
  });

  describe('Initial Baseline State (VF-009.2 Point 3)', () => {
    it('initializes in FAB_OVERVIEW with bare silicon wafer, setup completed, and Start absent from completedOperationIds', () => {
      const state = useVirtualFabStore.getState();
      expect(state.machineState).toBe<FabMachineState>('FAB_OVERVIEW');
      expect(state.activeView).toBe('fab-overview');
      expect(state.selectedNodeId).toBe('deposition');
      expect(state.selectedStepId).toBe('deposition');
      expect(state.fabProgress.setupCompleted).toBe(true);
      // VF-009.2 Point 3: Start is NOT a completed operation
      expect(state.fabProgress.completedOperationIds).toEqual([]);
      expect(state.fabProgress.completedOperationIds).not.toContain('start');
      expect(state.fabProgress.completedCheckpointIds).toEqual([]);
      expect(state.completedStepIds).toEqual([]);
      expect(state.wafer.layers).toHaveLength(1);
      expect(state.wafer.layers[0].material).toBe('silicon');
      expect(state.isProcessExecuted).toBe(false);
      expect(state.curriculumProgress.currentLesson).toBe(2);
      expect(state.curriculumProgress.totalLessons).toBe(12);
    });
  });

  describe('Canonical Node Routing & Traversal (VF-009.2 Point 4)', () => {
    it('verifies SELECT_NODE selects valid canonical nodes and NEVER alters WaferState', () => {
      const { send } = useVirtualFabStore.getState();
      const initialWafer = useVirtualFabStore.getState().wafer;

      for (const node of CANONICAL_NODE_ORDER) {
        send({ type: 'SELECT_NODE', nodeId: node });
        const current = useVirtualFabStore.getState();
        expect(current.selectedNodeId).toBe(node);
        expect(current.selectedStepId).toBe(node);
        expect(current.fabProgress.selectedNodeId).toBe(node);
        // WaferState must remain strictly untouched
        expect(current.wafer).toBe(initialWafer);
      }
    });

    it('verifies PROCEED_TO_NEXT_NODE traverses operations and checkpoints in canonical order', () => {
      const { send } = useVirtualFabStore.getState();

      // Start at deposition in Wafer Lab
      send({ type: 'OPEN_STATION', stepId: 'deposition' });
      send({ type: 'OPEN_WAFER_LAB' });
      send({ type: 'SELECT_PREDICTION', optionId: 'opt_add_layer' });
      send({ type: 'COMMIT_PREDICTION' });
      send({ type: 'RUN_PROCESS' });
      send({ type: 'PROCESS_FINISHED' });
      send({ type: 'ANSWER_INTERPRETATION', optionId: 'interp_blanket_additive' });

      expect(useVirtualFabStore.getState().machineState).toBe<FabMachineState>('WAFER_LAB_STEP_COMPLETE');

      // 1. Deposition -> Coat Resist
      send({ type: 'PROCEED_TO_NEXT_NODE' });
      expect(useVirtualFabStore.getState().selectedNodeId).toBe('coat');
      expect(useVirtualFabStore.getState().fabProgress.completedOperationIds).toContain('deposition');
      expect(useVirtualFabStore.getState().fabProgress.completedOperationIds).not.toContain('start');

      // 2. From Develop -> ADI Checkpoint
      useVirtualFabStore.setState({
        selectedNodeId: 'develop',
        selectedStepId: 'develop',
        machineState: 'WAFER_LAB_STEP_COMPLETE',
      });
      send({ type: 'PROCEED_TO_NEXT_NODE' });
      expect(useVirtualFabStore.getState().selectedNodeId).toBe('adi');
      expect(useVirtualFabStore.getState().machineState).toBe<FabMachineState>('CHECKPOINT_FOCUS');

      // 3. From ADI complete -> Etch
      useVirtualFabStore.setState({
        selectedNodeId: 'adi',
        selectedStepId: 'adi',
        machineState: 'CHECKPOINT_OBSERVING',
      });
      send({ type: 'PROCEED_TO_NEXT_NODE' });
      expect(useVirtualFabStore.getState().selectedNodeId).toBe('etch');
      expect(useVirtualFabStore.getState().machineState).toBe<FabMachineState>('STATION_FOCUS');
      expect(useVirtualFabStore.getState().fabProgress.completedCheckpointIds).toContain('adi');

      // 4. From Etch -> AEI Checkpoint
      useVirtualFabStore.setState({
        selectedNodeId: 'etch',
        selectedStepId: 'etch',
        machineState: 'WAFER_LAB_STEP_COMPLETE',
      });
      send({ type: 'PROCEED_TO_NEXT_NODE' });
      expect(useVirtualFabStore.getState().selectedNodeId).toBe('aei');
      expect(useVirtualFabStore.getState().machineState).toBe<FabMachineState>('CHECKPOINT_FOCUS');

      // 5. From AEI complete -> Strip
      useVirtualFabStore.setState({
        selectedNodeId: 'aei',
        selectedStepId: 'aei',
        machineState: 'CHECKPOINT_OBSERVING',
      });
      send({ type: 'PROCEED_TO_NEXT_NODE' });
      expect(useVirtualFabStore.getState().selectedNodeId).toBe('strip');
      expect(useVirtualFabStore.getState().machineState).toBe<FabMachineState>('STATION_FOCUS');
      expect(useVirtualFabStore.getState().fabProgress.completedCheckpointIds).toContain('aei');
    });
  });

  describe('Prediction & Execution Lifecycle (Points 8, 9)', () => {
    it('verifies SELECT_PREDICTION does not commit, COMMIT_PREDICTION enters READY, RUN_PROCESS enters EXECUTING, and PROCESS_FINISHED enters OBSERVING', () => {
      const { send } = useVirtualFabStore.getState();

      // Navigate to Wafer Lab
      send({ type: 'OPEN_STATION', stepId: 'deposition' });
      send({ type: 'OPEN_WAFER_LAB' });
      expect(useVirtualFabStore.getState().machineState).toBe<FabMachineState>('WAFER_LAB_PREDICTING');

      // 1. SELECT_PREDICTION: updates predictionSelectedId, but does NOT commit
      send({ type: 'SELECT_PREDICTION', optionId: 'opt_add_layer' });
      expect(useVirtualFabStore.getState().machineState).toBe<FabMachineState>('WAFER_LAB_PREDICTING');
      expect(useVirtualFabStore.getState().predictionSelectedId).toBe('opt_add_layer');
      expect(useVirtualFabStore.getState().predictionCommitted).toBe(false);

      // Attempting RUN_PROCESS before commit must be rejected
      send({ type: 'RUN_PROCESS' });
      expect(useVirtualFabStore.getState().machineState).toBe<FabMachineState>('WAFER_LAB_PREDICTING');
      expect(useVirtualFabStore.getState().lastError).toMatch(/Prediction must be committed before running the process/i);

      // 2. COMMIT_PREDICTION: transitions to WAFER_LAB_READY
      send({ type: 'COMMIT_PREDICTION' });
      expect(useVirtualFabStore.getState().machineState).toBe<FabMachineState>('WAFER_LAB_READY');
      expect(useVirtualFabStore.getState().predictionCommitted).toBe(true);

      // 3. RUN_PROCESS: is the ONLY event that invokes applyProcess() and enters WAFER_LAB_EXECUTING
      send({ type: 'RUN_PROCESS', action: { type: 'deposit', material: 'oxide', thicknessNm: 100 } });
      expect(useVirtualFabStore.getState().machineState).toBe<FabMachineState>('WAFER_LAB_EXECUTING');
      expect(useVirtualFabStore.getState().isProcessExecuted).toBe(true);
      expect(useVirtualFabStore.getState().wafer.layers).toHaveLength(2);
      expect(useVirtualFabStore.getState().wafer.layers[1].material).toBe('oxide');
      expect(useVirtualFabStore.getState().processHistory).toHaveLength(1);

      // 4. PROCESS_FINISHED: lifecycle-only transition into WAFER_LAB_OBSERVING
      send({ type: 'PROCESS_FINISHED' });
      expect(useVirtualFabStore.getState().machineState).toBe<FabMachineState>('WAFER_LAB_OBSERVING');

      // 5. Interpretation & completion
      send({ type: 'ANSWER_INTERPRETATION', optionId: 'interp_blanket_additive' });
      expect(useVirtualFabStore.getState().machineState).toBe<FabMachineState>('WAFER_LAB_STEP_COMPLETE');
      expect(useVirtualFabStore.getState().isInterpretationCorrect).toBe(true);

      send({ type: 'COMPLETE_STEP' });
      expect(useVirtualFabStore.getState().fabProgress.completedOperationIds).toContain('deposition');
      expect(useVirtualFabStore.getState().fabProgress.completedOperationIds).not.toContain('start');
      expect(useVirtualFabStore.getState().completedStepIds).toContain('deposition');
    });
  });

  describe('Metrology Checkpoint Lifecycle (Point 10)', () => {
    it('runs inspection without mutating wafer.layers and tracks completedCheckpointIds separately', () => {
      const { send } = useVirtualFabStore.getState();

      // Build a wafer through Develop to reach ADI
      // 1. Deposition
      let w = applyProcess(createBareWafer(), { type: 'deposit', material: 'oxide', thicknessNm: 100 }).nextState;
      // 2. Coat resist
      w = applyProcess(w, { type: 'coat-resist', tone: 'positive', thicknessNm: 300 }).nextState;
      // 3. Lithography / Exposure
      const exposureMask = Array(SIMULATION_MASK_SEGMENTS).fill(false);
      exposureMask[6] = true;
      exposureMask[7] = true;
      w = applyProcess(w, { type: 'expose', exposureMask }).nextState;
      // 4. Develop
      w = applyProcess(w, { type: 'develop' }).nextState;

      const targetPattern = Array(SIMULATION_MASK_SEGMENTS).fill(true);
      targetPattern[6] = false;
      targetPattern[7] = false;

      // Set wafer in store
      useVirtualFabStore.setState({
        wafer: w,
        selectedNodeId: 'adi',
        selectedStepId: 'adi',
        activeCheckpointId: 'adi',
        machineState: 'CHECKPOINT_FOCUS',
        activeView: 'station-focus',
      });

      const layersBeforeInspection = useVirtualFabStore.getState().wafer.layers;

      // RUN_INSPECTION enters CHECKPOINT_INSPECTING
      send({
        type: 'RUN_INSPECTION',
        checkpointId: 'adi',
        targetPattern,
      });

      const stateInspecting = useVirtualFabStore.getState();
      expect(stateInspecting.machineState).toBe<FabMachineState>('CHECKPOINT_INSPECTING');
      expect(stateInspecting.isCheckpointInspected).toBe(true);
      expect(stateInspecting.checkpointInspectionData).not.toBeNull();
      expect(stateInspecting.checkpointInspectionData?.checkpoint).toBe('ADI');
      expect(stateInspecting.checkpointInspectionData?.result).toBe('match');

      // INVARIANT: Checkpoint inspection MUST NEVER mutate wafer.layers!
      expect(stateInspecting.wafer.layers).toBe(layersBeforeInspection);

      // INSPECTION_FINISHED transitions to CHECKPOINT_OBSERVING
      send({ type: 'INSPECTION_FINISHED' });
      expect(useVirtualFabStore.getState().machineState).toBe<FabMachineState>('CHECKPOINT_OBSERVING');
      expect(useVirtualFabStore.getState().wafer.layers).toBe(layersBeforeInspection);

      // COMPLETE_CHECKPOINT tracks progress in completedCheckpointIds separately from completedOperationIds
      send({ type: 'COMPLETE_CHECKPOINT', checkpointId: 'adi' });
      const stateComplete = useVirtualFabStore.getState();
      expect(stateComplete.machineState).toBe<FabMachineState>('CHECKPOINT_COMPLETE');
      expect(stateComplete.fabProgress.completedCheckpointIds).toContain('adi');
      expect(stateComplete.fabProgress.completedOperationIds).not.toContain('adi');
      expect(stateComplete.completedStepIds).toContain('adi');
      expect(stateComplete.wafer.layers).toBe(layersBeforeInspection);
    });
  });

  describe('Invalid Transition Handling', () => {
    it('rejects RUN_PROCESS in FAB_OVERVIEW and sets lastError without mutating wafer', () => {
      const { send } = useVirtualFabStore.getState();
      const originalWafer = useVirtualFabStore.getState().wafer;

      send({ type: 'RUN_PROCESS' });

      expect(useVirtualFabStore.getState().machineState).toBe<FabMachineState>('FAB_OVERVIEW');
      expect(useVirtualFabStore.getState().lastError).toMatch(/Invalid event 'RUN_PROCESS' in state 'FAB_OVERVIEW'/i);
      expect(useVirtualFabStore.getState().wafer).toBe(originalWafer);
      expect(useVirtualFabStore.getState().wafer.layers).toHaveLength(1);
    });

    it('rejects RUN_PROCESS in WAFER_LAB_PREDICTING before prediction is committed', () => {
      const { send } = useVirtualFabStore.getState();
      send({ type: 'OPEN_STATION', stepId: 'deposition' });
      send({ type: 'OPEN_WAFER_LAB' });
      expect(useVirtualFabStore.getState().machineState).toBe<FabMachineState>('WAFER_LAB_PREDICTING');

      send({ type: 'RUN_PROCESS' });
      expect(useVirtualFabStore.getState().machineState).toBe<FabMachineState>('WAFER_LAB_PREDICTING');
      expect(useVirtualFabStore.getState().lastError).toMatch(/Prediction must be committed before running the process/i);
      expect(useVirtualFabStore.getState().wafer.layers).toHaveLength(1);
    });
  });

  describe('Scientific Isolation Guarantees', () => {
    it('guarantees navigation events NEVER modify the scientific wafer state', () => {
      const { send } = useVirtualFabStore.getState();
      const initialLayers = useVirtualFabStore.getState().wafer.layers;

      // Dispatch navigation actions
      send({ type: 'SELECT_NODE', nodeId: 'coat' });
      send({ type: 'OPEN_STATION', stepId: 'coat' });
      send({ type: 'CLOSE_STATION' });
      send({ type: 'OPEN_STATION', stepId: 'deposition' });
      send({ type: 'OPEN_WAFER_LAB' });
      send({ type: 'RETURN_TO_FAB' });

      // Wafer layers must be completely unchanged
      expect(useVirtualFabStore.getState().wafer.layers).toBe(initialLayers);
      expect(useVirtualFabStore.getState().wafer.layers).toHaveLength(1);
    });
  });

  describe('State Persistence & Recovery (VF-009.2 Points 2, 3)', () => {
    it('persists complete V2 machine state and wafer model to localStorage without Start in completedOperationIds', () => {
      const {
        openStation,
        openWaferLab,
        selectPrediction,
        commitPrediction,
        runProcess,
        processFinished,
        answerInterpretation,
        completeStep,
      } = useVirtualFabStore.getState();

      openStation('deposition');
      openWaferLab();
      selectPrediction('opt_add_layer');
      commitPrediction();
      runProcess();
      processFinished();
      answerInterpretation('interp_blanket_additive');
      completeStep();

      const storedRaw = localStorage.getItem(FAB_STORAGE_KEY_V2);
      expect(storedRaw).not.toBeNull();
      const parsed = JSON.parse(storedRaw!);
      expect(parsed.schemaVersion).toBe(2);
      expect(parsed.fabProgress.completedOperationIds).toContain('deposition');
      // VF-009.2 Point 3: Start must not be in completedOperationIds
      expect(parsed.fabProgress.completedOperationIds).not.toContain('start');
      expect(parsed.completedStepIds).toContain('deposition');
      expect(parsed.completedStepIds).not.toContain('start');
      expect(parsed.wafer.layers).toHaveLength(2);
      expect(parsed.machineState).toBe<FabMachineState>('WAFER_LAB_STEP_COMPLETE');
    });

    it('safely migrates legacy V1 state to V2: does NOT map metrology to aei, excludes start from operations, and initializes completedCheckpointIds to empty', () => {
      const legacyV1 = {
        selectedStepId: 'metrology',
        completedStepIds: ['start', 'deposition', 'coat', 'lithography', 'develop', 'etch', 'strip', 'metrology'],
        currentLessons: 8,
        wafer: createBareWafer(),
        isProcessExecuted: true,
        isStepCompleted: false,
        machineState: 'FAB_OVERVIEW',
      };

      const migrated = migrateV1ToV2(JSON.stringify(legacyV1));
      expect(migrated).not.toBeNull();
      expect(migrated!.schemaVersion).toBe(2);

      // VF-009.2 Point 2: Does NOT map obsolete metrology to aei, normalizes to strip
      expect(migrated!.selectedNodeId).toBe('strip');
      expect(migrated!.selectedStepId).toBe('strip');
      expect(migrated!.activeCheckpointId).toBeNull();

      // VF-009.2 Point 2: completedCheckpointIds initialized strictly empty
      expect(migrated!.fabProgress.completedCheckpointIds).toEqual([]);

      // VF-009.2 Point 3: Start and obsolete metrology absent from completedOperationIds
      expect(migrated!.fabProgress.completedOperationIds).toEqual([
        'deposition',
        'coat',
        'lithography',
        'develop',
        'etch',
        'strip',
      ]);
      expect(migrated!.fabProgress.completedOperationIds).not.toContain('start');
      expect(migrated!.fabProgress.completedOperationIds).not.toContain('metrology');
      expect(migrated!.completedStepIds).not.toContain('start');
      expect(migrated!.completedStepIds).not.toContain('metrology');

      // Also verify loadPersistedState handles localStorage transition
      localStorage.removeItem(FAB_STORAGE_KEY_V2);
      localStorage.setItem(LEGACY_FAB_STORAGE_KEY_V1, JSON.stringify(legacyV1));
      const autoMigrated = loadPersistedState();
      expect(autoMigrated).not.toBeNull();
      expect(autoMigrated!.selectedNodeId).toBe('strip');
      expect(autoMigrated!.fabProgress.completedCheckpointIds).toEqual([]);
      expect(autoMigrated!.fabProgress.completedOperationIds).not.toContain('start');
      expect(localStorage.getItem(LEGACY_FAB_STORAGE_KEY_V1)).toBeNull();
      expect(localStorage.getItem(FAB_STORAGE_KEY_V2)).not.toBeNull();
    });

    it('enforces rehydration safety rule: WAFER_LAB_EXECUTING is normalized to WAFER_LAB_OBSERVING or WAFER_LAB_READY and never rehydrated directly', () => {
      // 1. When isProcessExecuted is true, normalize to WAFER_LAB_OBSERVING
      const stateExecutingDone = {
        schemaVersion: 2,
        fabProgress: { setupCompleted: true, completedOperationIds: [], completedCheckpointIds: [], selectedNodeId: 'deposition' },
        completedStepIds: [],
        currentLessons: 2,
        selectedNodeId: 'deposition',
        selectedStepId: 'deposition',
        wafer: createBareWafer(),
        isProcessExecuted: true,
        isStepCompleted: false,
        predictionSelectedId: 'opt_add_layer',
        predictionCommitted: true,
        interpretationAnsweredId: null,
        isInterpretationCorrect: false,
        activeCheckpointId: null,
        checkpointInspectionData: null,
        isCheckpointInspected: false,
        machineState: 'WAFER_LAB_EXECUTING',
      };

      localStorage.setItem(FAB_STORAGE_KEY_V2, JSON.stringify(stateExecutingDone));
      const loaded = loadPersistedState();
      expect(loaded).not.toBeNull();
      expect(loaded!.machineState).toBe<FabMachineState>('WAFER_LAB_OBSERVING');

      // 2. When isProcessExecuted is false, normalize to WAFER_LAB_READY
      stateExecutingDone.isProcessExecuted = false;
      localStorage.setItem(FAB_STORAGE_KEY_V2, JSON.stringify(stateExecutingDone));
      const loadedNotDone = loadPersistedState();
      expect(loadedNotDone).not.toBeNull();
      expect(loadedNotDone!.machineState).toBe<FabMachineState>('WAFER_LAB_READY');

      // 3. When CHECKPOINT_INSPECTING, normalize to CHECKPOINT_OBSERVING
      stateExecutingDone.machineState = 'CHECKPOINT_INSPECTING';
      localStorage.setItem(FAB_STORAGE_KEY_V2, JSON.stringify(stateExecutingDone));
      const loadedInspecting = loadPersistedState();
      expect(loadedInspecting).not.toBeNull();
      expect(loadedInspecting!.machineState).toBe<FabMachineState>('CHECKPOINT_OBSERVING');
    });

    it('preserves strict semantic separation between RETURN_TO_STATION and PROCEED_TO_NEXT_STEP (VF-011)', () => {
      const { send } = useVirtualFabStore.getState();

      // Start at Deposition Station Focus -> enter Wafer Lab
      send({ type: 'OPEN_STATION', stepId: 'deposition' });
      send({ type: 'OPEN_WAFER_LAB' });
      expect(useVirtualFabStore.getState().activeView).toBe('wafer-lab');
      expect(useVirtualFabStore.getState().selectedNodeId).toBe('deposition');
      expect(useVirtualFabStore.getState().isStepCompleted).toBe(false);

      // Branch A: RETURN_TO_STATION returns to same physical station without completing step
      send({ type: 'RETURN_TO_STATION' });
      expect(useVirtualFabStore.getState().activeView).toBe('station-focus');
      expect(useVirtualFabStore.getState().selectedNodeId).toBe('deposition');
      expect(useVirtualFabStore.getState().isStepCompleted).toBe(false);
      expect(useVirtualFabStore.getState().fabProgress.completedOperationIds).not.toContain('deposition');

      // Now enter Wafer Lab again, complete prediction, process, and interpretation
      send({ type: 'OPEN_WAFER_LAB' });
      send({ type: 'SELECT_PREDICTION', optionId: 'opt_add_layer' });
      send({ type: 'COMMIT_PREDICTION' });
      send({ type: 'RUN_PROCESS' });
      send({ type: 'PROCESS_FINISHED' });
      send({ type: 'ANSWER_INTERPRETATION', optionId: 'interp_blanket_additive' });
      expect(useVirtualFabStore.getState().machineState).toBe<FabMachineState>('WAFER_LAB_STEP_COMPLETE');

      // Branch B: PROCEED_TO_NEXT_STEP completes step and transitions to Coat Resist (Track)
      send({ type: 'PROCEED_TO_NEXT_STEP' });
      expect(useVirtualFabStore.getState().activeView).toBe('station-focus');
      expect(useVirtualFabStore.getState().selectedNodeId).toBe('coat');
      expect(useVirtualFabStore.getState().isStepCompleted).toBe(true);
      expect(useVirtualFabStore.getState().fabProgress.completedOperationIds).toContain('deposition');
    });

    it('guards against rapid concurrent clicks during active transition (VF-011)', () => {
      const { send, startTransition, finishTransition } = useVirtualFabStore.getState();

      startTransition();
      expect(useVirtualFabStore.getState().isTransitioning).toBe(true);
      expect(useVirtualFabStore.getState().transitionStatus).toBe('transitioning');

      // Attempt to open another station during transition
      send({ type: 'OPEN_STATION', stepId: 'lithography' });
      // Should be ignored by guard
      expect(useVirtualFabStore.getState().selectedNodeId).toBe('deposition');

      finishTransition();
      expect(useVirtualFabStore.getState().isTransitioning).toBe(false);
      expect(useVirtualFabStore.getState().transitionStatus).toBe('idle');

      // After transition unlocks, navigation succeeds
      send({ type: 'OPEN_STATION', stepId: 'lithography' });
      expect(useVirtualFabStore.getState().selectedNodeId).toBe('lithography');
    });
  });
});
