import React from 'react';
import type { WaferState as EngineWaferState } from '../../engine/types';
import type { WaferState as LegacyWaferState } from '../../types/wafer';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import SiliconSubstrate from './svg/SiliconSubstrate';
import DielectricLayer from './svg/DielectricLayer';
import PhotoresistLayer from './svg/PhotoresistLayer';
import ExposureOverlay from './svg/ExposureOverlay';
import InspectionOverlay from './svg/InspectionOverlay';
import LayerLegend from './svg/LayerLegend';

export type SupportedWaferState = EngineWaferState | LegacyWaferState;

export interface WaferCrossSectionSVGProps {
  waferState: SupportedWaferState;
  activeCheckpoint?: 'ADI' | 'AEI' | null;
  className?: string;
}

export const WaferCrossSectionSVG: React.FC<WaferCrossSectionSVGProps> = ({
  waferState,
  activeCheckpoint = null,
  className = '',
}) => {
  const prefersReducedMotion = useReducedMotion();

  // Dimensions in SVG coordinate space (ViewBox: 0 0 640 320)
  const waferLeft = 40;
  const waferWidth = 440;
  const substrateY = 140;
  const substrateHeight = 110;
  const oxideHeight = 36;
  const oxideY = substrateY - oxideHeight; // 104
  const resistHeight = 44;
  const resistY = oxideY - resistHeight; // 60

  // 1. Resolve Dielectric (Oxide) Layer
  const rawOxide = waferState.layers.find(
    (l) => ('material' in l ? l.material === 'oxide' : l.type === 'oxide') || l.id === 'oxide-film',
  );
  const oxidePresenceMask: boolean[] = rawOxide
    ? 'presenceMask' in rawOxide && Array.isArray(rawOxide.presenceMask)
      ? rawOxide.presenceMask
      : Array(16).fill(true)
    : Array(16).fill(false);
  const hasOxide = rawOxide ? oxidePresenceMask.some(Boolean) : false;

  // 2. Resolve Photoresist Layer
  const rawResist = waferState.layers.find(
    (l) => ('material' in l ? l.material === 'photoresist' : l.type === 'photoresist') || l.id === 'photoresist-film',
  );
  const resistPresenceMask: boolean[] = rawResist
    ? 'presenceMask' in rawResist && Array.isArray(rawResist.presenceMask)
      ? rawResist.presenceMask
      : Array(16).fill(true)
    : Array(16).fill(false);
  const hasResist = rawResist ? resistPresenceMask.some(Boolean) : false;

  // 3. Resolve Optical Exposure (Latent Image)
  const exposureMask: boolean[] | undefined =
    rawResist && 'exposureMask' in rawResist && Array.isArray(rawResist.exposureMask)
      ? rawResist.exposureMask
      : undefined;
  const hasExposure = Boolean(exposureMask && exposureMask.some(Boolean));

  // 4. Resolve Active Metrology Checkpoint
  const legacyStepId = 'currentStepId' in waferState ? waferState.currentStepId : undefined;
  const inferredCheckpoint =
    activeCheckpoint ||
    (legacyStepId === 'adi'
      ? 'ADI'
      : legacyStepId === 'aei'
        ? 'AEI'
        : null);

  // Dynamic accessible text describing current physical stack
  let accessibleTitle = 'Wafer Cross-Section: Silicon Substrate Present; 0 Added Process Layers';
  let accessibleDesc =
    'Silicon substrate present; 0 added process layers. Polished monocrystalline silicon substrate wafer with exposed upper surface before thin film deposition.';

  if (hasResist && hasExposure && !resistPresenceMask.some((p, i) => !p && exposureMask?.[i])) {
    accessibleTitle = 'Wafer Cross-Section: Photoresist Layer with UV Latent Image Pattern';
    accessibleDesc =
      'A multi-layer semiconductor cross-section showing silicon substrate, continuous silicon dioxide dielectric film, and purple photoresist with an optical latent image pattern exposed by ultraviolet light.';
  } else if (hasResist && resistPresenceMask.some((p) => !p)) {
    accessibleTitle = 'Wafer Cross-Section: Developed Photoresist Stencil Mask';
    accessibleDesc =
      'A multi-layer semiconductor cross-section showing exposed photoresist dissolved away, opening stencil windows that reveal the underlying silicon dioxide dielectric film.';
  } else if (hasResist) {
    accessibleTitle = 'Wafer Cross-Section: Silicon Substrate with Dielectric and Uniform Photoresist Layer';
    accessibleDesc =
      'A multi-layer semiconductor cross-section showing silicon substrate, continuous silicon dioxide dielectric film, and a uniform purple photoresist polymer layer coated across the upper surface.';
  } else if (hasOxide && oxidePresenceMask.some((p) => !p)) {
    accessibleTitle = 'Wafer Cross-Section: Patterned Silicon Dioxide Dielectric Film on Silicon';
    accessibleDesc =
      'A semiconductor cross-section showing patterned silicon dioxide dielectric structures on top of the silicon substrate base after etching and resist stripping.';
  } else if (hasOxide) {
    accessibleTitle = 'Wafer Cross-Section: Silicon Substrate with Deposited Silicon Dioxide Thin Film';
    accessibleDesc =
      'A two-layer semiconductor cross-section showing a blue-grey silicon substrate base with an added pale cyan dielectric silicon dioxide thin film across the entire upper surface.';
  }

  return (
    <div className={`w-full flex flex-col items-center select-none ${className}`.trim()}>
      <svg
        viewBox="0 0 640 320"
        role="img"
        aria-labelledby="cross-section-title cross-section-desc"
        className="w-full max-w-[640px] h-auto drop-shadow-sm transition-all"
        xmlns="http://www.w3.org/2000/svg"
      >
        <title id="cross-section-title">{accessibleTitle}</title>
        <desc id="cross-section-desc">{accessibleDesc}</desc>

        <defs>
          {/* Pattern 1: Subtle diagonal crosshatch for Silicon Substrate */}
          <pattern
            id="siliconPattern"
            width="8"
            height="8"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M0 8 L8 0 M0 0 L8 8"
              stroke="#485b6e"
              strokeWidth="0.75"
              strokeOpacity="0.35"
            />
          </pattern>

          {/* Pattern 2: Dotted stipple for Silicon Dioxide (Dielectric Film) */}
          <pattern
            id="oxidePattern"
            width="8"
            height="8"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="4" cy="4" r="1.25" fill="#00a6a6" fillOpacity="0.45" />
          </pattern>

          {/* Pattern 3: Fine micro-texture for Photoresist */}
          <pattern
            id="resistPattern"
            width="6"
            height="6"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M0 6 L6 0"
              stroke="#FFFFFF"
              strokeWidth="0.6"
              strokeOpacity="0.25"
            />
          </pattern>

          {/* Pattern 4: High-contrast diagonal exposure hatch */}
          <pattern
            id="exposurePattern"
            width="6"
            height="6"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M0 0 L6 6 M6 0 L0 6"
              stroke="#CA8A04"
              strokeWidth="1.2"
              strokeOpacity="0.6"
            />
          </pattern>

          {/* UV Radiation Arrow Marker */}
          <marker
            id="uvArrow"
            viewBox="0 0 6 6"
            refX="3"
            refY="3"
            markerWidth="5"
            markerHeight="5"
            orient="auto"
          >
            <path d="M 0 0 L 6 3 L 0 6 z" fill="#CA8A04" />
          </marker>

          {/* Subtle glow filter for newly transformed layers */}
          <filter id="layerGlow" x="-5%" y="-10%" width="110%" height="130%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#00a6a6" floodOpacity="0.25" />
          </filter>
        </defs>

        {/* Clean diagram background panel */}
        <rect
          x="10"
          y="10"
          width="620"
          height="300"
          rx="12"
          fill="#FFFFFF"
          stroke="#E2E8F0"
          strokeWidth="1.5"
        />

        {/* ── LAYER 1: SILICON SUBSTRATE (Base Layer) ── */}
        <SiliconSubstrate
          x={waferLeft}
          y={substrateY}
          width={waferWidth}
          height={substrateHeight}
        />

        {/* Substrate Leader Line and Dimension Callout */}
        <line
          x1={waferLeft + waferWidth}
          y1={substrateY + substrateHeight / 2}
          x2={waferLeft + waferWidth + 30}
          y2={substrateY + substrateHeight / 2}
          stroke="#94A3B8"
          strokeWidth="1"
          strokeDasharray="3 3"
        />
        <text
          x={waferLeft + waferWidth + 36}
          y={substrateY + substrateHeight / 2 + 4}
          fill="#64748B"
          fontSize="10"
          fontFamily="'IBM Plex Mono', monospace"
        >
          Substrate base
        </text>

        {/* ── LAYER 2: SILICON DIOXIDE (Dielectric Film) ── */}
        {hasOxide && (
          <g
            id="layer-oxide-group"
            filter={prefersReducedMotion ? undefined : 'url(#layerGlow)'}
            className={prefersReducedMotion ? '' : 'transition-opacity duration-500 animate-in fade-in'}
          >
            <DielectricLayer
              presenceMask={oxidePresenceMask}
              x={waferLeft}
              y={oxideY}
              width={waferWidth}
              height={oxideHeight}
              showLabels={true}
            />

            {/* Oxide Leader Line & Callout on Right (Preserves baseline test assertion) */}
            <line
              x1={waferLeft + waferWidth}
              y1={oxideY + oxideHeight / 2}
              x2={waferLeft + waferWidth + 30}
              y2={oxideY + oxideHeight / 2}
              stroke="#00A6A6"
              strokeWidth="1.5"
            />
            <circle
              cx={waferLeft + waferWidth + 30}
              cy={oxideY + oxideHeight / 2}
              r="2.5"
              fill="#00A6A6"
            />
            <text
              x={waferLeft + waferWidth + 36}
              y={oxideY + oxideHeight / 2 + 3}
              fill="#00A6A6"
              fontSize="10"
              fontFamily="'Space Grotesk', sans-serif"
              fontWeight="bold"
            >
              Deposited Film (SiO₂)
            </text>
          </g>
        )}

        {/* ── LAYER 3: PHOTORESIST (Polymer Mask) ── */}
        {hasResist && (
          <g
            id="layer-resist-group"
            className={prefersReducedMotion ? '' : 'transition-opacity duration-500 animate-in fade-in'}
          >
            <PhotoresistLayer
              presenceMask={resistPresenceMask}
              x={waferLeft}
              y={resistY}
              width={waferWidth}
              height={resistHeight}
              showLabels={true}
            />

            {/* Exposure Overlay on top of resist */}
            <ExposureOverlay
              exposureMask={exposureMask}
              resistPresenceMask={resistPresenceMask}
              x={waferLeft}
              y={resistY}
              width={waferWidth}
              height={resistHeight}
            />

            {/* Photoresist Leader Line & Callout on Right */}
            <line
              x1={waferLeft + waferWidth}
              y1={resistY + resistHeight / 2}
              x2={waferLeft + waferWidth + 30}
              y2={resistY + resistHeight / 2}
              stroke="#7B61FF"
              strokeWidth="1.5"
            />
            <circle
              cx={waferLeft + waferWidth + 30}
              cy={resistY + resistHeight / 2}
              r="2.5"
              fill="#7B61FF"
            />
            <text
              x={waferLeft + waferWidth + 36}
              y={resistY + resistHeight / 2 + 3}
              fill="#7B61FF"
              fontSize="10"
              fontFamily="'Space Grotesk', sans-serif"
              fontWeight="bold"
            >
              Photoresist Mask
            </text>
          </g>
        )}

        {/* ── METROLOGY CHECKPOINT INSPECTION OVERLAY ── */}
        {inferredCheckpoint && (
          <InspectionOverlay
            checkpointKind={inferredCheckpoint}
            x={waferLeft}
            y={resistY - 10}
            width={waferWidth}
            height={substrateY + substrateHeight - resistY + 20}
          />
        )}

        {/* ── BARE SURFACE INDICATOR (When no layers deposited) ── */}
        {!hasOxide && !hasResist && (
          <g id="surface-indicator">
            <line
              x1={waferLeft}
              y1={substrateY}
              x2={waferLeft + waferWidth}
              y2={substrateY}
              stroke="#00A6A6"
              strokeWidth="1.5"
              strokeDasharray="4 3"
            />
            <line
              x1={waferLeft + waferWidth}
              y1={substrateY}
              x2={waferLeft + waferWidth + 30}
              y2={substrateY - 20}
              stroke="#00A6A6"
              strokeWidth="1"
            />
            <circle
              cx={waferLeft + waferWidth}
              cy={substrateY}
              r="2.5"
              fill="#00A6A6"
            />
            <text
              x={waferLeft + waferWidth + 36}
              y={substrateY - 16}
              fill="#00A6A6"
              fontSize="10"
              fontFamily="'IBM Plex Mono', monospace"
              fontWeight="bold"
            >
              Silicon Substrate Present
            </text>
            <text
              x={waferLeft + waferWidth + 36}
              y={substrateY - 4}
              fill="#64748B"
              fontSize="9"
              fontFamily="'Inter', sans-serif"
            >
              0 added process layers
            </text>
          </g>
        )}

        {/* ── LEGEND & NOT TO SCALE CALLOUTS ── */}
        <LayerLegend
          hasOxide={hasOxide}
          hasResist={hasResist}
          hasExposure={hasExposure}
        />

        {/* Orientation & Scale Watermark */}
        <text
          x="615"
          y="299"
          textAnchor="end"
          fill="#94A3B8"
          fontSize="9"
          fontFamily="'IBM Plex Mono', monospace"
          fontWeight="500"
          letterSpacing="0.05em"
        >
          NOT TO SCALE • Z-AXIS DEPTH PROFILE
        </text>
      </svg>
    </div>
  );
};

export default WaferCrossSectionSVG;
