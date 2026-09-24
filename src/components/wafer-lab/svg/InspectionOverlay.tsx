import React from 'react';

export interface InspectionOverlayProps {
  checkpointKind?: 'ADI' | 'AEI';
  x: number;
  y: number;
  width: number;
  height: number;
}

export const InspectionOverlay: React.FC<InspectionOverlayProps> = ({
  checkpointKind = 'ADI',
  x,
  y,
  width,
  height,
}) => {
  const isADI = checkpointKind === 'ADI';
  const accentColor = isADI ? '#0284C7' : '#059669'; // Sky blue for ADI, Emerald for AEI
  const badgeBg = isADI ? '#E0F2FE' : '#D1FAE5';
  const badgeText = isADI ? '#0369A1' : '#065F46';

  const label = isADI
    ? 'ADI METROLOGY CHECKPOINT: RESIST PATTERN INSPECTION [PASS]'
    : 'AEI METROLOGY CHECKPOINT: DIELECTRIC PATTERN TRANSFER [PASS]';

  const subLabel = isADI
    ? 'Non-destructive • Pre-etch pattern inspection'
    : 'Non-destructive • Post-etch pattern verified';

  return (
    <g id="layer-inspection-overlay">
      {/* Precision metrology scan frame overlay */}
      <rect
        x={x - 8}
        y={y - 8}
        width={width + 16}
        height={height + 16}
        rx="4"
        fill="none"
        stroke={accentColor}
        strokeWidth="1.5"
        strokeDasharray="4,3"
      />

      {/* Corner optical alignment crosshairs */}
      <g stroke={accentColor} strokeWidth="1.5">
        {/* Top-left */}
        <line x1={x - 12} y1={y - 8} x2={x - 2} y2={y - 8} />
        <line x1={x - 8} y1={y - 12} x2={x - 8} y2={y - 2} />
        {/* Top-right */}
        <line x1={x + width + 2} y1={y - 8} x2={x + width + 12} y2={y - 8} />
        <line x1={x + width + 8} y1={y - 12} x2={x + width + 8} y2={y - 2} />
      </g>

      {/* Metrology Inspection Banner at top of wafer */}
      <g transform={`translate(${x + width / 2}, ${y - 24})`}>
        <rect
          x="-180"
          y="-14"
          width="360"
          height="32"
          rx="6"
          fill={badgeBg}
          stroke={accentColor}
          strokeWidth="1"
        />
        <text
          x="0"
          y="-1"
          textAnchor="middle"
          fill={badgeText}
          fontSize="9.5"
          fontFamily="'Space Grotesk', sans-serif"
          fontWeight="bold"
          letterSpacing="0.04em"
        >
          {label}
        </text>
        <text
          x="0"
          y="11.5"
          textAnchor="middle"
          fill={badgeText}
          fontSize="8"
          fontFamily="'IBM Plex Mono', monospace"
          fontWeight="500"
        >
          {subLabel}
        </text>
      </g>
    </g>
  );
};

export default InspectionOverlay;
