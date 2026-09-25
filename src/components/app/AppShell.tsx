import React, { useEffect, useState } from 'react';
import SiteHeader from './SiteHeader';
import FabViewport from '../fab/FabViewport';
import FabHUD from '../fab/FabHUD';
import ProcessMapDisclosure from '../fab/ProcessMapDisclosure';
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
      className={`${activeView === 'fab-overview' ? 'min-h-screen' : 'h-screen'} w-full flex flex-col bg-[#F6F9FE] ${activeView === 'fab-overview' ? '' : 'overflow-hidden'} font-body`}
    >
      <SiteHeader activeSection="fab" onOpenHome={onOpenHome ?? (() => {})} onOpenBasics={() => onOpenBasics?.()} onOpenFab={handleBackToFab} />

      {/* Main Content Area */}
      <main
        id="main-content"
        tabIndex={-1}
        className={`relative flex-1 flex flex-col focus:outline-none ${activeView === 'fab-overview' ? '' : 'overflow-hidden'}`}
      >
        {/* The tour uses the interactive scene; the overview uses its approved cleanroom photograph. */}
        {activeView === 'station-focus' && <div className="absolute inset-0 z-0">
          <FabViewport />
        </div>}

        {/* VIEW 1: FAB OVERVIEW (State A) */}
        {activeView === 'fab-overview' && (
          <div className="relative z-10 w-full">
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
            {/* Local process controls stay separate from the global site navigation. */}
            <div className="absolute top-0 left-0 right-0 md:right-[400px] lg:right-[440px] p-2 sm:p-3 lg:p-4 z-40 pointer-events-none">
              <div className="pointer-events-auto">
                <ProcessMapDisclosure
                  activeStepId={selectedStepId}
                  completedStepIds={completedStepIds}
                  onSelectStep={handleSelectStep}
                  onBackToFab={handleBackToFab}
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
            <WaferLab
              onReturnToStation={handleReturnFromWaferLab}
              onReturnToFab={handleBackToFab}
              onNextStep={handleNextFromWaferLab}
            />
          </div>
        )}
      </main>

    </div>
  );
};

export default AppShell;
