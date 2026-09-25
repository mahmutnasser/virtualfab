import React, { useEffect, useState } from 'react';
import TopBar from './TopBar';
import BottomNav from './BottomNav';
import FabViewport from '../fab/FabViewport';
import FabHUD from '../fab/FabHUD';
import ProcessJourneyTrack from '../fab/ProcessJourneyTrack';
import StationPanel from '../process/StationPanel';
import { CANONICAL_PROCESS_STEPS, type ProcessStep } from '../../types/process';
import { useLiveAnnouncer } from '../a11y/LiveAnnouncerContext';
import WaferLab from '../wafer-lab/WaferLab';
import { useVirtualFabStore, type ActiveView } from '../../store/virtual-fab-store';
import { CANONICAL_NODE_ORDER } from '../../store/state-machine';

export type { ActiveView };

export interface AppShellProps {
  initialView?: ActiveView;
  initialStepId?: string;
  onOpenBasics?: (termId?: string) => void;
  onOpenHome?: () => void;
}

export const AppShell: React.FC<AppShellProps> = ({
  initialView,
  initialStepId,
  onOpenBasics,
  onOpenHome,
}) => {
  const activeView = useVirtualFabStore((s) => s.activeView);
  const selectedStepId = useVirtualFabStore((s) => s.selectedStepId);
  const selectedNodeId = useVirtualFabStore((s) => s.selectedNodeId);
  const completedStepIds = useVirtualFabStore((s) => s.completedStepIds);
  const currentLessons = useVirtualFabStore((s) => s.currentLessons);
  const totalLessons = useVirtualFabStore((s) => s.totalLessons);

  const openStation = useVirtualFabStore((s) => s.openStation);
  const openWaferLab = useVirtualFabStore((s) => s.openWaferLab);
  const returnToFab = useVirtualFabStore((s) => s.returnToFab);
  const startTour = useVirtualFabStore((s) => s.startTour);
  const setActiveView = useVirtualFabStore((s) => s.setActiveView);
  const transitionStatus = useVirtualFabStore((s) => s.transitionStatus);
  const returnToStation = useVirtualFabStore((s) => s.returnToStation);
  const proceedToNextStep = useVirtualFabStore((s) => s.proceedToNextStep);

  const [isExitingLab, setIsExitingLab] = useState(false);

  // Sync test/prop overrides if provided
  useEffect(() => {
    if (initialView) {
      setActiveView(initialView);
    }
    if (initialStepId) {
      openStation(initialStepId);
    }
  }, [initialView, initialStepId, setActiveView, openStation]);

  // Safe accessor for LiveAnnouncer
  let announce: ((msg: string) => void) | undefined;
  try {
    const announcer = useLiveAnnouncer();
    announce = announcer.announce;
  } catch {
    announce = undefined;
  }

  const selectedStep: ProcessStep =
    CANONICAL_PROCESS_STEPS.find((s) => s.id === selectedStepId) ??
    CANONICAL_PROCESS_STEPS[1]; // fallback to Deposition

  const handleStartTour = () => {
    startTour();
    announce?.('Starting the tour at Step 1 of 6: Deposition.');
  };

  const handleSelectStep = (stepId: string) => {
    openStation(stepId);
    const step = CANONICAL_PROCESS_STEPS.find((s) => s.id === stepId);
    if (step) {
      if (step.isCheckpoint && step.checkpointKind) {
        announce?.(`Selected Process Control Checkpoint ${step.checkpointKind}: ${step.name}.`);
      } else if (typeof step.stepNumber === 'number') {
        announce?.(`Selected Step ${step.stepNumber} of 6: ${step.name}.`);
      } else {
        announce?.(`Selected ${step.name}.`);
      }
    }
  };

  const handleBackToFab = () => {
    returnToFab();
    announce?.('Returned to Fab Overview.');
  };

  /**
   * Smooth visual bridge when exiting the bright Wafer Lab (~200ms surface fade).
   * Snaps immediately without delay when prefers-reduced-motion is active or in tests.
   */
  const performLabExit = (action: () => void) => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const isTest =
      typeof process !== 'undefined' &&
      (process.env?.NODE_ENV === 'test' || Boolean(process.env?.VITEST));

    if (prefersReducedMotion || isTest) {
      action();
      return;
    }

    setIsExitingLab(true);
    setTimeout(() => {
      action();
      setIsExitingLab(false);
    }, 200);
  };

  const handleReturnFromWaferLab = () => {
    performLabExit(() => {
      returnToStation();
      announce?.(`Returned to ${selectedStep.name} station.`);
      requestAnimationFrame(() => {
        const openLabBtn = (document.getElementById('open-wafer-lab-btn') ||
          document.querySelector('[data-testid="station-panel"] button')) as HTMLElement | null;
        if (openLabBtn) {
          openLabBtn.focus();
        } else {
          const heading = document.getElementById('station-panel-title') as HTMLElement | null;
          heading?.focus();
        }
      });
    });
  };

  const handleNextFromWaferLab = () => {
    const targetId = selectedNodeId || selectedStepId;
    const currentIndex = CANONICAL_NODE_ORDER.indexOf(
      targetId as (typeof CANONICAL_NODE_ORDER)[number],
    );
    const nextNode =
      currentIndex >= 0 && currentIndex < CANONICAL_NODE_ORDER.length - 1
        ? CANONICAL_NODE_ORDER[currentIndex + 1]
        : 'repeat';

    performLabExit(() => {
      proceedToNextStep(nextNode);
      const nextStep = CANONICAL_PROCESS_STEPS.find((s) => s.id === nextNode);
      if (nextStep) {
        if (nextStep.isCheckpoint && nextStep.checkpointKind) {
          announce?.(`Proceeding to Process Control Checkpoint ${nextStep.checkpointKind}: ${nextStep.name}.`);
        } else if (typeof nextStep.stepNumber === 'number') {
          announce?.(`Proceeding to Step ${nextStep.stepNumber} of 6: ${nextStep.name}.`);
        } else {
          announce?.(`Proceeding to ${nextStep.name}.`);
        }
      }
    });
  };

  const handleInspectWafer = () => {
    openWaferLab();
    announce?.(`Opening Wafer Lab for ${selectedStep.name}.`);
  };

  return (
    <div
      id="vf-root"
      data-transition-state={transitionStatus}
      data-active-view={activeView}
      data-selected-step={selectedStepId}
      className="h-screen w-screen flex flex-col bg-[#F6F9FE] overflow-hidden font-body select-none"
    >
      {/* Top Header with Contextual Back button (Shown during Fab World modes) */}
      {activeView !== 'wafer-lab' && (
        <TopBar
          activeView={activeView}
          onBackToFab={handleBackToFab}
          onOpenBasics={() => onOpenBasics?.()}
          onOpenHome={onOpenHome}
          currentLessons={currentLessons}
          totalLessons={totalLessons}
        />
      )}

      {/* Main Content Area */}
      <main
        id="main-content"
        tabIndex={-1}
        className="relative flex-1 flex flex-col overflow-hidden focus:outline-none"
      >
        {/* Persistent 3D / Fallback Cleanroom Scene (Kept mounted for warm WebGL state & seamless bridge) */}
        <div
          className={`absolute inset-0 z-0 transition-[filter] duration-500 ${
            activeView === 'station-focus' ? 'brightness-90' : ''
          }`}
          aria-hidden={activeView === 'wafer-lab'}
        >
          <FabViewport />
        </div>

        {/* VIEW 1: FAB OVERVIEW (State A) */}
        {activeView === 'fab-overview' && (
          <div className="relative flex-1 w-full h-full flex flex-col overflow-hidden pointer-events-none z-10">
            <FabHUD
              activeStepId={selectedStepId}
              completedStepIds={completedStepIds}
              onSelectStep={handleSelectStep}
              onStartTour={handleStartTour}
              onOpenBasics={() => onOpenBasics?.()}
            />
          </div>
        )}

        {/* VIEW 2: STATION FOCUS (State B) */}
        {activeView === 'station-focus' && (
          <div className="relative flex-1 w-full h-full flex flex-col overflow-hidden pointer-events-none z-10">
            {/* Persistent Top Process Sequence Track (constrained to clear the right StationPanel on desktop) */}
            <div className="absolute top-0 left-0 right-0 md:right-[400px] lg:right-[440px] p-2 sm:p-3 lg:p-4 z-40 pointer-events-none">
              <div className="pointer-events-auto bg-white/95 border border-slate-200/80 backdrop-blur-xl rounded-xl md:rounded-2xl p-1 sm:p-1.5 lg:p-2 shadow-xl shadow-slate-900/10">
                <ProcessJourneyTrack
                  activeStepId={selectedStepId}
                  completedStepIds={completedStepIds}
                  onSelectStep={handleSelectStep}
                />
              </div>
            </div>

            {/* Station Focus Side Panel (Desktop right sidebar / Mobile bottom sheet) */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-end z-30">
              <div className="pointer-events-auto w-full md:w-auto h-full flex items-center">
                <StationPanel
                  step={selectedStep}
                  onInspect={handleInspectWafer}
                  onBack={handleBackToFab}
                  onOpenBasics={onOpenBasics}
                />
              </div>
            </div>
          </div>
        )}

        {/* VIEW 3: WAFER LAB (State C - Bright Scientific Learning Surface with smooth exit bridge) */}
        {activeView === 'wafer-lab' && (
          <div
            className={`relative flex-1 w-full h-full overflow-y-auto transition-opacity duration-200 ease-out z-20 ${
              isExitingLab ? 'opacity-0' : 'opacity-100'
            }`}
          >
            <nav aria-label="Explore sections" className="sticky top-0 z-40 flex justify-end gap-2 border-b border-[#DCE5F2] bg-white/95 px-4 py-2 backdrop-blur">
              <button type="button" onClick={onOpenHome} className="min-h-[44px] rounded-lg px-4 text-sm font-semibold text-[#145DB4] hover:bg-[#EAF2FF] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#166FE5]">
                Home
              </button>
              <button
                type="button"
                onClick={() => onOpenBasics?.()}
                className="min-h-[44px] rounded-lg bg-[#166FE5] px-4 text-sm font-semibold text-white hover:bg-[#145DB4] transition-colors cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#145DB4] focus-visible:outline-offset-2"
              >
                Fab Basics →
              </button>
            </nav>
            <WaferLab
              onReturnToStation={handleReturnFromWaferLab}
              onReturnToFab={handleBackToFab}
              onNextStep={handleNextFromWaferLab}
            />
          </div>
        )}
      </main>

      {/* Mobile Bottom Navigation Bar (Visible on mobile only during overview) */}
      {activeView === 'fab-overview' && <BottomNav onOpenHome={onOpenHome} onOpenBasics={() => onOpenBasics?.()} />}
    </div>
  );
};

export default AppShell;
