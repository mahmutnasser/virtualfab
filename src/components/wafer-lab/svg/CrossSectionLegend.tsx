import React from 'react';

export interface CrossSectionLegendProps {
  hasOxide: boolean;
  hasResist: boolean;
  hasExposure: boolean;
}

export const CrossSectionLegend: React.FC<CrossSectionLegendProps> = ({
  hasOxide,
  hasResist,
  hasExposure,
}) => {
  return (
    <g id="cross-section-legend" transform="translate(20, 292)">
      {/* Silicon Substrate Chip */}
      <g transform="translate(0, 0)">
        <rect
          x="0"
          y="0"
          width="11"
          height="11"
          rx="2"
          fill="#6B7B8D"
          stroke="#4A5568"
          strokeWidth="1"
        />
        <text
          x="16"
          y="9"
          fill="#475569"
          fontSize="9.5"
          fontFamily="'Space Grotesk', sans-serif"
          fontWeight="600"
        >
          Silicon (Si)
        </text>
      </g>

      {/* Dielectric Film Chip */}
      {hasOxide && (
        <g transform="translate(95, 0)">
          <rect
            x="0"
            y="0"
            width="11"
            height="11"
            rx="2"
            fill="#B0D4E8"
            stroke="#0284C7"
            strokeWidth="1"
          />
          <text
            x="16"
            y="9"
            fill="#475569"
            fontSize="9.5"
            fontFamily="'Space Grotesk', sans-serif"
            fontWeight="600"
          >
            Dielectric (SiO₂)
          </text>
        </g>
      )}

      {/* Photoresist Chip */}
      {hasResist && (
        <g transform={`translate(${hasOxide ? 215 : 95}, 0)`}>
          <rect
            x="0"
            y="0"
            width="11"
            height="11"
            rx="2"
            fill="#7B61FF"
            stroke="#5A32B8"
            strokeWidth="1"
          />
          <text
            x="16"
            y="9"
            fill="#475569"
            fontSize="9.5"
            fontFamily="'Space Grotesk', sans-serif"
            fontWeight="600"
          >
            Photoresist (PR)
          </text>
        </g>
      )}

      {/* Latent UV Exposure Chip */}
      {hasExposure && (
        <g transform={`translate(${hasOxide ? 335 : 215}, 0)`}>
          <rect
            x="0"
            y="0"
            width="11"
            height="11"
            rx="2"
            fill="#FDE047"
            stroke="#CA8A04"
            strokeWidth="1"
            strokeDasharray="2,2"
          />
          <text
            x="16"
            y="9"
            fill="#475569"
            fontSize="9.5"
            fontFamily="'Space Grotesk', sans-serif"
            fontWeight="600"
          >
            Latent UV Image
          </text>
        </g>
      )}
    </g>
  );
};

export default CrossSectionLegend;
