import React from 'react';

export interface ExposureOverlayProps {
  exposureMask?: boolean[];
  resistPresenceMask: boolean[];
  x: number;
  y: number;
  width: number;
  height: number;
}

export const ExposureOverlay: React.FC<ExposureOverlayProps> = ({
  exposureMask,
  resistPresenceMask,
  x,
  y,
  width,
  height,
}) => {
  if (!exposureMask || !exposureMask.some(Boolean)) return null;

  const segmentCount = exposureMask.length || 16;
  const segmentWidth = width / segmentCount;

  // Identify segments that are both present and exposed
  const exposedIndices: number[] = [];
  exposureMask.forEach((isExposed, idx) => {
    if (isExposed && resistPresenceMask[idx]) {
      exposedIndices.push(idx);
    }
  });

  if (exposedIndices.length === 0) return null;

  // Find contiguous exposed segment blocks
  const contiguousExposedBlocks: Array<{ startIdx: number; count: number }> = [];
  let currentBlock: { startIdx: number; count: number } | null = null;

  exposureMask.forEach((isExposed, idx) => {
    const active = isExposed && resistPresenceMask[idx];
    if (active) {
      if (!currentBlock) {
        currentBlock = { startIdx: idx, count: 1 };
      } else {
        currentBlock.count += 1;
      }
    } else if (currentBlock) {
      contiguousExposedBlocks.push(currentBlock);
      currentBlock = null;
    }
  });
  if (currentBlock) {
    contiguousExposedBlocks.push(currentBlock);
  }

  return (
    <g id="layer-exposure-overlay">
      {/* Exposed segment hatch patterns and luminous tint */}
      {contiguousExposedBlocks.map((block) => {
        const blockX = x + block.startIdx * segmentWidth;
        const blockW = block.count * segmentWidth;
        return (
          <g key={`exp-block-${block.startIdx}`}>
            {/* Luminous solarized tint representing UV photon absorption */}
            <rect
              x={blockX}
              y={y}
              width={blockW}
              height={height}
              fill="#FDE047"
              fillOpacity="0.32"
              stroke="#EAB308"
              strokeWidth="1.5"
              strokeDasharray="3,3"
            />
            {/* Dense high-contrast diagonal exposure hatch */}
            <rect
              x={blockX}
              y={y}
              width={blockW}
              height={height}
              fill="url(#exposurePattern)"
              pointerEvents="none"
            />

            {/* Top UV incident radiation arrows */}
            <line
              x1={blockX + blockW / 2}
              y1={y - 18}
              x2={blockX + blockW / 2}
              y2={y - 3}
              stroke="#CA8A04"
              strokeWidth="2"
              markerEnd="url(#uvArrow)"
            />
            <text
              x={blockX + blockW / 2}
              y={y - 22}
              textAnchor="middle"
              fill="#854D0E"
              fontSize="10"
              fontFamily="'Space Grotesk', sans-serif"
              fontWeight="bold"
            >
              UV LIGHT
            </text>

            {/* Central Latent Image text */}
            <rect
              x={blockX + blockW / 2 - 58}
              y={y + height / 2 - 8}
              width="116"
              height="16"
              rx="3"
              fill="#FEF08A"
              fillOpacity="0.9"
            />
            <text
              x={blockX + blockW / 2}
              y={y + height / 2 + 4}
              textAnchor="middle"
              fill="#854D0E"
              fontSize="9.5"
              fontFamily="'Space Grotesk', sans-serif"
              fontWeight="bold"
              letterSpacing="0.04em"
            >
              LATENT IMAGE
            </text>
          </g>
        );
      })}
    </g>
  );
};

export default ExposureOverlay;
