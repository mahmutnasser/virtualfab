import React, { useEffect, useRef, useState } from 'react';
import { useVirtualFabStore } from '../../store/virtual-fab-store';
import { CANONICAL_PROCESS_STEPS_DATA } from '../../data/process-steps';
import { useOptionalLiveAnnouncer } from '../a11y/LiveAnnouncerContext';
import { FabWorldScene, STATION_PLATES } from './three/FabWorldScene';
import { isWebGLAvailable } from './three/webgl-detect';
import { getEquipmentForStep } from '../../data/equipment';

export interface FabViewportProps {
  className?: string;
  forceFallback?: boolean;
}

export const FabViewport: React.FC<FabViewportProps> = ({
  className = '',
  forceFallback = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<FabWorldScene | null>(null);

  const selectedNodeId = useVirtualFabStore((s) => s.selectedNodeId || s.selectedStepId);
  const activeView = useVirtualFabStore((s) => s.activeView);
  const openStation = useVirtualFabStore((s) => s.openStation);
  const startTransition = useVirtualFabStore((s) => s.startTransition);
  const finishTransition = useVirtualFabStore((s) => s.finishTransition);
  const transitionStatus = useVirtualFabStore((s) => s.transitionStatus);

  const activeStationPlate =
    activeView === 'station-focus'
      ? (STATION_PLATES[selectedNodeId] || '/images/plates/fab_overview.jpg')
      : '/images/plates/fab_overview.jpg';
  const equipment = getEquipmentForStep(selectedNodeId);

  const announcer = useOptionalLiveAnnouncer();
  const announceRef = useRef(announcer?.announce);
  announceRef.current = announcer?.announce;

  const openStationRef = useRef(openStation);
  openStationRef.current = openStation;

  const startTransitionRef = useRef(startTransition);
  startTransitionRef.current = startTransition;

  const finishTransitionRef = useRef(finishTransition);
  finishTransitionRef.current = finishTransition;

  const [webGLSupported, setWebGLSupported] = useState<boolean>(() => {
    if (forceFallback) return false;
    return isWebGLAvailable();
  });

  const showDiagnostics =
    typeof window !== 'undefined' &&
    (new URLSearchParams(window.location.search).get('diag') === 'true' ||
      new URLSearchParams(window.location.search).get('debug') === 'true');

  // Mount and manage Three.js FabWorldScene
  useEffect(() => {
    if (!webGLSupported || !containerRef.current) return;

    try {
      const prefersReducedMotion =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      const searchParams =
        typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
      const renderParam = searchParams?.get('render');
      const renderMode = renderParam === 'procedural' ? 'procedural-3d' : 'photoreal-2.5d';

      const scene = new FabWorldScene({
        container: containerRef.current,
        initialNodeId: selectedNodeId,
        reducedMotion: prefersReducedMotion,
        renderMode,
        showDiagnostics,
        onTransitionStart: () => {
          startTransitionRef.current?.();
        },
        onTransitionComplete: (nodeId: string, viewMode: string) => {
          finishTransitionRef.current?.();
          if (viewMode === 'station-focus') {
            const step = CANONICAL_PROCESS_STEPS_DATA.find((s) => s.id === nodeId);
            if (step) {
              if (step.id === 'adi') {
                announceRef.current?.('ADI Inspection. After Develop checkpoint. Inline Metrology.');
              } else if (step.id === 'aei') {
                announceRef.current?.('AEI Inspection. After Etch checkpoint. Inline Metrology.');
              } else if (step.id === 'etch') {
                announceRef.current?.('Etch. Step 5 of 6. Reactive Ion Etch System.');
              } else if (typeof step.stepNumber === 'number') {
                announceRef.current?.(
                  `${step.name}. Step ${step.stepNumber} of 6. ${step.stationName}.`,
                );
              } else {
                announceRef.current?.(`${step.name}. ${step.stationName}.`);
              }
            }
            // Move focus appropriately to StationPanel heading without stealing focus during animation
            const titleHeading = document.getElementById('station-panel-title');
            if (titleHeading) {
              titleHeading.setAttribute('tabindex', '-1');
              titleHeading.focus();
            }
          }
        },
        onSelectNode: (nodeId: string) => {
          openStationRef.current(nodeId);
          const step = CANONICAL_PROCESS_STEPS_DATA.find((s) => s.id === nodeId);
          if (step) {
            if (step.isCheckpoint && step.checkpointKind) {
              announceRef.current?.(
                `Selected Process Control Checkpoint ${step.checkpointKind}: ${step.name}.`,
              );
            } else if (typeof step.stepNumber === 'number') {
              announceRef.current?.(
                `Selected Step ${step.stepNumber} of 6: ${step.name}.`,
              );
            } else {
              announceRef.current?.(`Selected ${step.name}.`);
            }
          }
        },
      });

      sceneRef.current = scene;

      // Set initial camera pose based on current activeView
      if (activeView === 'station-focus') {
        scene.setActiveNode(selectedNodeId, 'STATION_APPROACH');
      } else {
        scene.setActiveNode(selectedNodeId, 'OVERVIEW');
      }

      return () => {
        scene.dispose();
        sceneRef.current = null;
      };
    } catch (err) {
      console.warn(
        'Three.js FabWorldScene initialization failed; falling back to 2D view:',
        err,
      );
      setWebGLSupported(false);
    }
    // Only re-mount when WebGL availability toggles
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [webGLSupported]);

  // Sync node changes
  useEffect(() => {
    if (!sceneRef.current) return;
    const pose = activeView === 'station-focus' ? 'STATION_APPROACH' : 'OVERVIEW';
    sceneRef.current.setActiveNode(selectedNodeId, pose);
  }, [selectedNodeId, activeView]);

  // Sync view mode transitions (overview vs station approach)
  useEffect(() => {
    if (!sceneRef.current) return;
    if (activeView === 'fab-overview') {
      sceneRef.current.setViewMode('fab-overview');
    } else if (activeView === 'station-focus') {
      sceneRef.current.setViewMode('station-focus');
    }
  }, [activeView]);

  // If WebGL is disabled or unavailable, immediately clear transition state
  useEffect(() => {
    if (!webGLSupported) {
      finishTransitionRef.current?.();
    }
  }, [webGLSupported, selectedNodeId, activeView]);

  // If WebGL is not available, render the approved static cleanroom fallback
  if (!webGLSupported) {
    return (
      <div
        data-testid="fab-viewport-fallback"
        className={`relative flex-1 w-full h-full bg-[#081524] overflow-hidden select-none ${className}`.trim()}
      >
        {/* Photorealistic Cleanroom Background Scene */}
        <img
          src={activeStationPlate}
          alt={equipment ? equipment.name : 'Semiconductor fabrication cleanroom'}
          className="absolute inset-0 w-full h-full object-cover object-center"
        />

        {/* Subtle lightening gradient (15% lighter for cleanroom brightness) */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#F6F9FE]/10 via-transparent to-[#0C1E33]/20 pointer-events-none" />

        {/* SVG Guided Route & Wafer Marker Overlay */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 1440 840"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <filter id="routeGlowFallback" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <path
            d="M 410 700 L 880 645 L 1260 630"
            fill="none"
            stroke="#00a6a6"
            strokeWidth="3"
            strokeLinecap="round"
            filter="url(#routeGlowFallback)"
            className="opacity-90"
          />

          <g transform="translate(860, 647) rotate(-7)">
            <path
              d="M -16 -10 L 0 0 L -16 10 M -6 -10 L 10 0 L -6 10 M 4 -10 L 20 0 L 4 10"
              fill="none"
              stroke="#00a6a6"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#routeGlowFallback)"
            />
          </g>

          <g transform="translate(290, 695)">
            <ellipse
              cx="0"
              cy="0"
              rx="120"
              ry="45"
              fill="none"
              stroke="#00a6a6"
              strokeWidth="3"
              filter="url(#routeGlowFallback)"
              className="animate-pulse"
            />
            <ellipse
              cx="0"
              cy="0"
              rx="110"
              ry="40"
              fill="#00a6a6"
              fillOpacity="0.12"
            />
            <line
              x1="120"
              y1="-20"
              x2="170"
              y2="-70"
              stroke="#00a6a6"
              strokeWidth="2"
              filter="url(#routeGlowFallback)"
            />
            <circle cx="120" cy="-20" r="3" fill="#00a6a6" />
          </g>
        </svg>

        {/* Wafer Start Callout Box */}
        <div className="absolute left-[31%] bottom-[23%] hidden md:flex items-center pointer-events-none z-10">
          <div className="bg-[#0c1f33]/90 border border-brand-cyan/60 backdrop-blur-md rounded-lg px-4 py-2.5 shadow-xl shadow-black/40">
            <span className="block font-display font-bold text-sm text-white leading-tight">
              Start
            </span>
            <span className="block font-body text-xs text-slate-300 mt-0.5">
              Bare silicon wafer
            </span>
          </div>
        </div>

        {/* Right Pillar Text */}
        <div className="absolute right-6 top-[42%] hidden xl:flex flex-col items-start gap-1 font-mono text-[9px] uppercase tracking-widest text-slate-400 select-none pointer-events-none">
          <span className="font-bold text-slate-300">CLEANER</span>
          <span className="font-bold text-slate-300">IDEAS</span>
          <span className="font-bold text-slate-300">BRIGHTER</span>
          <span className="font-bold text-slate-300">TOMORROWS</span>
          <div className="w-6 h-0.5 bg-brand-cyan mt-1" />
        </div>

        {/* Active Equipment Badge */}
        {activeView === 'station-focus' && equipment && (
          <div className="absolute bottom-6 left-6 z-20 pointer-events-none max-w-xs sm:max-w-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="bg-[#0b1a2c]/90 border border-[#166fe5]/40 backdrop-blur-md rounded-xl p-3 shadow-xl shadow-black/40 text-white">
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="font-mono text-[10px] font-bold tracking-wider uppercase text-emerald-400">
                  {equipment.cleanroomBay}
                </span>
              </div>
              <p className="mt-1 font-display text-sm font-bold text-white tracking-tight">
                {equipment.name}
              </p>
              {equipment.realEquipmentReference && (
                <p className="mt-0.5 text-[11px] font-mono text-cyan-300/90 truncate">
                  Tool: {equipment.realEquipmentReference}
                </p>
              )}
            </div>
          </div>
        )}

        {/* AMHS Wafer Transit Banner */}
        {transitionStatus === 'transitioning' && (
          <div className="absolute inset-x-0 top-1/3 flex justify-center items-center z-30 pointer-events-none">
            <div className="bg-[#0a192f]/95 border-2 border-[#00a6a6] shadow-2xl shadow-[#00a6a6]/30 px-5 py-3 rounded-2xl flex items-center gap-3 backdrop-blur-lg animate-pulse">
              <div className="w-8 h-8 rounded-xl bg-[#00a6a6]/20 border border-[#00a6a6] flex items-center justify-center text-[#00a6a6]">
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="12" cy="12" r="9" strokeWidth="2" strokeDasharray="32" strokeLinecap="round" />
                </svg>
              </div>
              <div>
                <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#00a6a6]">
                  Automated Material Handling (AMHS)
                </p>
                <p className="text-xs sm:text-sm font-semibold text-white">
                  Wafer in transit via OHT ➔ {equipment?.shortName || 'Next Tool'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // WebGL 3D Interactive Fab Scene
  return (
    <div
      data-testid="fab-viewport-3d"
      className={`relative flex-1 w-full h-full bg-[#081524] overflow-hidden select-none ${className}`.trim()}
    >
      {/* 3D WebGL Canvas Container */}
      <div
        ref={containerRef}
        tabIndex={0}
        aria-label="Interactive 3D cleanroom scene. Use the process track above or click stations to navigate."
        className="w-full h-full focus:outline-none focus:ring-2 focus:ring-brand-cyan/40"
      />

      {/* Subtle overlay gradient at top for header readability & bottom for overlays (brightened by 15%) */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0c1e33]/50 via-transparent to-[#081524]/40 pointer-events-none" />

      {/* Right Pillar Text: CLEANER IDEAS BRIGHTER TOMORROWS */}
      <div className="absolute right-6 top-[42%] hidden xl:flex flex-col items-start gap-1 font-mono text-[9px] uppercase tracking-widest text-slate-400 select-none pointer-events-none">
        <span className="font-bold text-slate-300">CLEANER</span>
        <span className="font-bold text-slate-300">IDEAS</span>
        <span className="font-bold text-slate-300">BRIGHTER</span>
        <span className="font-bold text-slate-300">TOMORROWS</span>
        <div className="w-6 h-0.5 bg-brand-cyan mt-1" />
      </div>

      {/* Active Equipment Badge */}
      {activeView === 'station-focus' && equipment && (
        <div className="absolute bottom-6 left-6 z-20 pointer-events-none max-w-xs sm:max-w-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="bg-[#0b1a2c]/90 border border-[#166fe5]/40 backdrop-blur-md rounded-xl p-3 shadow-xl shadow-black/40 text-white">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="font-mono text-[10px] font-bold tracking-wider uppercase text-emerald-400">
                {equipment.cleanroomBay}
              </span>
            </div>
            <p className="mt-1 font-display text-sm font-bold text-white tracking-tight">
              {equipment.name}
            </p>
            {equipment.realEquipmentReference && (
              <p className="mt-0.5 text-[11px] font-mono text-cyan-300/90 truncate">
                Tool: {equipment.realEquipmentReference}
              </p>
            )}
          </div>
        </div>
      )}

      {/* AMHS Wafer Transit Banner */}
      {transitionStatus === 'transitioning' && (
        <div className="absolute inset-x-0 top-1/3 flex justify-center items-center z-30 pointer-events-none">
          <div className="bg-[#0a192f]/95 border-2 border-[#00a6a6] shadow-2xl shadow-[#00a6a6]/30 px-5 py-3 rounded-2xl flex items-center gap-3 backdrop-blur-lg animate-pulse">
            <div className="w-8 h-8 rounded-xl bg-[#00a6a6]/20 border border-[#00a6a6] flex items-center justify-center text-[#00a6a6]">
              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="9" strokeWidth="2" strokeDasharray="32" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#00a6a6]">
                Automated Material Handling (AMHS)
              </p>
              <p className="text-xs sm:text-sm font-semibold text-white">
                Wafer in transit via OHT ➔ {equipment?.shortName || 'Next Tool'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Proof-of-Runtime Verification Badge (Available under development/debug flag ?diag=true) */}
      {showDiagnostics && (
        <div
          data-testid="runtime-diagnostic-badge"
          className="absolute bottom-6 right-6 z-40 px-3.5 py-2 bg-slate-900/90 backdrop-blur border border-rose-500 rounded-md font-mono text-xs pointer-events-none shadow-xl"
        >
          <div className="font-bold text-rose-400 tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            LIVE RUNTIME • VF-010.4
          </div>
          <div className="text-slate-300 text-[11px] mt-0.5">
            Plate:{' '}
            {activeView === 'station-focus'
              ? selectedNodeId === 'start'
                ? 'start_foop.jpg'
                : selectedNodeId === 'deposition'
                  ? 'deposition.jpg'
                  : selectedNodeId === 'coat' || selectedNodeId === 'develop'
                    ? 'coat_develop_track.jpg'
                    : selectedNodeId === 'lithography'
                      ? 'asml_twinscan.jpg'
                      : selectedNodeId === 'adi'
                        ? 'asml_yieldstar.jpg'
                        : selectedNodeId === 'aei' || selectedNodeId === 'metrology'
                          ? 'metrology.jpg'
                          : selectedNodeId === 'etch'
                            ? 'etch.jpg'
                            : selectedNodeId === 'strip'
                              ? 'strip.jpg'
                              : 'fab_overview.jpg'
              : 'fab_overview.jpg'}
          </div>
        </div>
      )}
    </div>
  );
};

export default FabViewport;
