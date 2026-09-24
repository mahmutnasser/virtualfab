import React from 'react';

export interface PhotoresistLayerProps {
  presenceMask: boolean[];
  x: number;
  y: number;
  width: number;
  height: number;
  showLabels?: boolean;
}

export const PhotoresistLayer: React.FC<PhotoresistLayerProps> = ({
  presenceMask,
  x,
  y,
  width,
  height,
  showLabels = true,
}) => {
  const segmentCount = presenceMask.length || 16;
  const segmentWidth = width / segmentCount;

  // Group continuous present segments into contiguous blocks
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
    <g id="layer-photoresist">
      {/* Contiguous photoresist blocks */}
      {contiguousBlocks.map((block) => {
        const blockX = x + block.startIdx * segmentWidth;
        const blockW = block.count * segmentWidth;
        return (
          <g key={`resist-block-${block.startIdx}`}>
            {/* Primary polymer fill (Design Bible Purple) */}
            <rect
              x={blockX}
              y={y}
              width={blockW}
              height={height}
              rx="1.5"
              fill="#7B61FF"
              stroke="#5A32B8"
              strokeWidth="1.25"
            />
            {/* Subtle diagonal micro-texture pattern */}
            <rect
              x={blockX}
              y={y}
              width={blockW}
              height={height}
              rx="1.5"
              fill="url(#resistPattern)"
              pointerEvents="none"
            />
          </g>
        );
      })}

      {/* Internal segment boundaries */}
      {presenceMask.map((present, idx) => {
        if (!present || idx === 0) return null;
        if (presenceMask[idx - 1]) {
          const segX = x + idx * segmentWidth;
          return (
            <line
              key={`resist-seam-${idx}`}
              x1={segX}
              y1={y}
              x2={segX}
              y2={y + height}
              stroke="#5A32B8"
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
        <g id="photoresist-label">
          {contiguousBlocks.map((block, idx) => {
            const blockX = x + block.startIdx * segmentWidth;
            const blockW = block.count * segmentWidth;
            if (block.count < 3) return null;
            return (
              <text
                key={`resist-txt-${idx}`}
                x={blockX + blockW / 2}
                y={y + height / 2 + 4}
                textAnchor="middle"
                fill="#FFFFFF"
                fontSize="11"
                fontFamily="'Space Grotesk', sans-serif"
                fontWeight="700"
                letterSpacing="0.03em"
              >
                PHOTORESIST (PR)
              </text>
            );
          })}
        </g>
      )}
    </g>
  );
};

export default PhotoresistLayer;
