import React from 'react';

export interface DielectricLayerProps {
  presenceMask: boolean[];
  x: number;
  y: number;
  width: number;
  height: number;
  showLabels?: boolean;
}

export const DielectricLayer: React.FC<DielectricLayerProps> = ({
  presenceMask,
  x,
  y,
  width,
  height,
  showLabels = true,
}) => {
  const segmentCount = presenceMask.length || 16;
  const segmentWidth = width / segmentCount;

  // Group continuous present segments into contiguous blocks for crisp borders
  const contiguousBlocks: Array<{ startIdx: number; count: number }> = [];
  let currentBlock: { startIdx: number; count: number } | null = null;

  presenceMask.forEach((present, idx) => {
    if (present) {
      if (!currentBlock) {
        currentBlock = { startIdx: idx, count: 1 };
      } else {
        currentBlock.count += 1;
      }
    } else if (currentBlock) {
      contiguousBlocks.push(currentBlock);
      currentBlock = null;
    }
  });
  if (currentBlock) {
    contiguousBlocks.push(currentBlock);
  }

  const hasAny = contiguousBlocks.length > 0;
  if (!hasAny) return null;

  return (
    <g id="layer-dielectric-oxide">
      {/* Contiguous oxide blocks */}
      {contiguousBlocks.map((block) => {
        const blockX = x + block.startIdx * segmentWidth;
        const blockW = block.count * segmentWidth;
        return (
          <g key={`oxide-block-${block.startIdx}`}>
            {/* Solid film fill */}
            <rect
              x={blockX}
              y={y}
              width={blockW}
              height={height}
              rx="1"
              fill="#B0D4E8"
              stroke="#0284C7"
              strokeWidth="1.25"
            />
            {/* Fine oxide stipple pattern */}
            <rect
              x={blockX}
              y={y}
              width={blockW}
              height={height}
              rx="1"
              fill="url(#oxidePattern)"
              pointerEvents="none"
            />
          </g>
        );
      })}

      {/* Internal segment boundary lines for 16-segment spatial clarity */}
      {presenceMask.map((present, idx) => {
        if (!present || idx === 0) return null;
        // If prior is also present, draw a subtle segment boundary
        if (presenceMask[idx - 1]) {
          const segX = x + idx * segmentWidth;
          return (
            <line
              key={`oxide-seam-${idx}`}
              x1={segX}
              y1={y}
              x2={segX}
              y2={y + height}
              stroke="#0284C7"
              strokeWidth="0.5"
              strokeDasharray="2,2"
              strokeOpacity="0.4"
            />
          );
        }
        return null;
      })}

      {/* Primary layer text label */}
      {showLabels && (
        <g id="dielectric-label">
          {contiguousBlocks.map((block, idx) => {
            const blockX = x + block.startIdx * segmentWidth;
            const blockW = block.count * segmentWidth;
            // Only render label on blocks wide enough (at least 3 segments wide)
            if (block.count < 3) return null;
            return (
              <text
                key={`oxide-txt-${idx}`}
                x={blockX + blockW / 2}
                y={y + height / 2 + 4}
                textAnchor="middle"
                fill="#0F172A"
                fontSize="11"
                fontFamily="'Space Grotesk', sans-serif"
                fontWeight="700"
                letterSpacing="0.03em"
              >
                SILICON DIOXIDE (SiO₂) FILM
              </text>
            );
          })}
        </g>
      )}
    </g>
  );
};

export default DielectricLayer;
