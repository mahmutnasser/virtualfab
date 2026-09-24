import React from 'react';

export interface SiliconSubstrateProps {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const SiliconSubstrate: React.FC<SiliconSubstrateProps> = ({
  x,
  y,
  width,
  height,
}) => {
  return (
    <g id="layer-silicon-substrate">
      {/* Base Solid Substrate */}
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx="2"
        fill="#6B7B8D"
        stroke="#4A5568"
        strokeWidth="1.5"
      />
      {/* Microstructure stipple pattern overlay */}
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx="2"
        fill="url(#siliconPattern)"
        pointerEvents="none"
      />

      {/* Primary Label */}
      <text
        x={x + width / 2}
        y={y + height / 2 - 4}
        textAnchor="middle"
        fill="#FFFFFF"
        fontSize="13"
        fontFamily="'Space Grotesk', sans-serif"
        fontWeight="bold"
        letterSpacing="0.05em"
      >
        SILICON SUBSTRATE (Si)
      </text>

      {/* Secondary Subtitle */}
      <text
        x={x + width / 2}
        y={y + height / 2 + 14}
        textAnchor="middle"
        fill="#E2E8F0"
        fontSize="10"
        fontFamily="'IBM Plex Mono', monospace"
      >
        Bulk Monocrystalline Wafer &bull; ~775 µm
      </text>
    </g>
  );
};

export default SiliconSubstrate;
