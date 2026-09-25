import React from 'react';

export interface MetalLayerProps {
  x: number;
  oxideY: number;
  oxideHeight: number;
  width: number;
  highlightLevel?: 'all' | 'level1' | 'level2' | 'level3' | 'level4';
  showLabels?: boolean;
}

export const MetalLayer: React.FC<MetalLayerProps> = ({
  x,
  oxideY,
  oxideHeight,
  width,
  highlightLevel = 'all',
  showLabels = true,
}) => {
  const segmentWidth = width / 16;

  // Geometry calculations:
  // Substrate is at oxideY + oxideHeight (140)
  // M1 Plugs fill the central contact opening (segments 4 to 11) from substrate up to oxideY
  // M1 Planar line sits at oxideY with thickness 26px -> m1Top = oxideY - 26
  const m1Height = 26;
  const m1Top = oxideY - m1Height;

  // Inter-Layer Dielectric (ILD) sits on top of M1 -> ildHeight = 28px -> ildTop = m1Top - ildHeight
  const ildHeight = 28;
  const ildTop = m1Top - ildHeight;

  // Metal 2 (M2) sits on top of ILD -> m2Height = 26px -> m2Top = ildTop - m2Height
  const m2Height = 26;
  const m2Top = ildTop - m2Height;

  // Highlight filters
  const hlM1 = highlightLevel === 'all' || highlightLevel === 'level2';
  const hlIld = highlightLevel === 'all' || highlightLevel === 'level3';
  const hlM2 = highlightLevel === 'all' || highlightLevel === 'level4';

  return (
    <g id="multi-layer-interconnect-stack">
      <defs>
        {/* Metal Copper Linear Gradient */}
        <linearGradient id="copperGradientM1" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#F59E0B" />
          <stop offset="50%" stopColor="#D97706" />
          <stop offset="100%" stopColor="#B45309" />
        </linearGradient>

        <linearGradient id="copperGradientM2" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FBBF24" />
          <stop offset="50%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>

        {/* Metal Hatch Pattern */}
        <pattern id="metalHatch" width="6" height="6" patternUnits="userSpaceOnUse">
          <path d="M0 6 L6 0" stroke="#78350F" strokeWidth="0.75" strokeOpacity="0.3" />
        </pattern>

        {/* CMP Planarization Dotted Line Marker */}
        <filter id="highlightGlow" x="-5%" y="-10%" width="110%" height="130%">
          <feDropShadow dx="0" dy="0" stdDeviation="2.5" floodColor="#00A6A6" floodOpacity="0.8" />
        </filter>
      </defs>

      {/* ── 1. METAL 1 (M1) CONTACT PLUGS & WIRING ── */}
      <g
        id="layer-metal-m1"
        filter={hlM1 && highlightLevel === 'level2' ? 'url(#highlightGlow)' : undefined}
        opacity={hlM1 ? 1 : 0.4}
        className="transition-opacity duration-300"
      >
        {/* M1 Plugs filling etched contact windows into dielectric (segments 4 to 11) */}
        <rect
          x={x + 4 * segmentWidth}
          y={oxideY}
          width={8 * segmentWidth}
          height={oxideHeight}
          fill="url(#copperGradientM1)"
          stroke="#78350F"
          strokeWidth="1.2"
        />
        <rect
          x={x + 4 * segmentWidth}
          y={oxideY}
          width={8 * segmentWidth}
          height={oxideHeight}
          fill="url(#metalHatch)"
          pointerEvents="none"
        />

        {/* M1 Horizontal Wiring Tracks after CMP Planarization */}
        {/* Track A: segments 2 to 7 */}
        <rect
          x={x + 2 * segmentWidth}
          y={m1Top}
          width={5 * segmentWidth}
          height={m1Height}
          rx="2"
          fill="url(#copperGradientM1)"
          stroke="#78350F"
          strokeWidth="1.2"
        />
        <rect
          x={x + 2 * segmentWidth}
          y={m1Top}
          width={5 * segmentWidth}
          height={m1Height}
          rx="2"
          fill="url(#metalHatch)"
          pointerEvents="none"
        />

        {/* Track B: segments 8 to 13 */}
        <rect
          x={x + 8 * segmentWidth}
          y={m1Top}
          width={5 * segmentWidth}
          height={m1Height}
          rx="2"
          fill="url(#copperGradientM1)"
          stroke="#78350F"
          strokeWidth="1.2"
        />
        <rect
          x={x + 8 * segmentWidth}
          y={m1Top}
          width={5 * segmentWidth}
          height={m1Height}
          rx="2"
          fill="url(#metalHatch)"
          pointerEvents="none"
        />

        {/* Dielectric fill between M1 tracks */}
        <rect
          x={x + 7 * segmentWidth}
          y={m1Top}
          width={1 * segmentWidth}
          height={m1Height}
          fill="#B0D4E8"
          stroke="#0284C7"
          strokeWidth="0.8"
        />
        <rect
          x={x + 7 * segmentWidth}
          y={m1Top}
          width={1 * segmentWidth}
          height={m1Height}
          fill="url(#oxidePattern)"
          pointerEvents="none"
        />

        {/* CMP Planar Surface Reference Line */}
        <line
          x1={x}
          y1={m1Top}
          x2={x + width}
          y2={m1Top}
          stroke="#00A6A6"
          strokeWidth="1"
          strokeDasharray="3 3"
        />

        {showLabels && (
          <text
            x={x + 4.5 * segmentWidth}
            y={m1Top + m1Height / 2 + 3.5}
            fill="#451A03"
            fontSize="9"
            fontFamily="'Space Grotesk', sans-serif"
            fontWeight="bold"
          >
            M1 (Cu)
          </text>
        )}
      </g>

      {/* ── 2. INTER-LAYER DIELECTRIC (ILD) & VIAS (V1) ── */}
      <g
        id="layer-ild"
        filter={hlIld && highlightLevel === 'level3' ? 'url(#highlightGlow)' : undefined}
        opacity={hlIld ? 1 : 0.4}
        className="transition-opacity duration-300"
      >
        {/* Blanket ILD layer */}
        <rect
          x={x + 1 * segmentWidth}
          y={ildTop}
          width={14 * segmentWidth}
          height={ildHeight}
          rx="1"
          fill="#B0D4E8"
          stroke="#0284C7"
          strokeWidth="1"
        />
        <rect
          x={x + 1 * segmentWidth}
          y={ildTop}
          width={14 * segmentWidth}
          height={ildHeight}
          rx="1"
          fill="url(#oxidePattern)"
          pointerEvents="none"
        />

        {/* Via 1 Plugs (V1) connecting M1 to M2 */}
        {/* Via Left: segment 4 */}
        <rect
          x={x + 4 * segmentWidth + 4}
          y={ildTop}
          width={segmentWidth - 8}
          height={ildHeight}
          fill="url(#copperGradientM1)"
          stroke="#78350F"
          strokeWidth="1"
        />
        {/* Via Right: segment 11 */}
        <rect
          x={x + 11 * segmentWidth + 4}
          y={ildTop}
          width={segmentWidth - 8}
          height={ildHeight}
          fill="url(#copperGradientM1)"
          stroke="#78350F"
          strokeWidth="1"
        />

        {showLabels && (
          <>
            <text
              x={x + 8 * segmentWidth}
              y={ildTop + ildHeight / 2 + 3.5}
              textAnchor="middle"
              fill="#0F172A"
              fontSize="9"
              fontFamily="'Space Grotesk', sans-serif"
              fontWeight="bold"
            >
              INTER-LAYER DIELECTRIC (ILD)
            </text>
            <text
              x={x + 4 * segmentWidth + segmentWidth / 2}
              y={ildTop - 3}
              textAnchor="middle"
              fill="#D97706"
              fontSize="8"
              fontFamily="'IBM Plex Mono', monospace"
              fontWeight="bold"
            >
              V1
            </text>
            <text
              x={x + 11 * segmentWidth + segmentWidth / 2}
              y={ildTop - 3}
              textAnchor="middle"
              fill="#D97706"
              fontSize="8"
              fontFamily="'IBM Plex Mono', monospace"
              fontWeight="bold"
            >
              V1
            </text>
          </>
        )}
      </g>

      {/* ── 3. METAL 2 (M2) HORIZONTAL ROUTING ── */}
      <g
        id="layer-metal-m2"
        filter={hlM2 && highlightLevel === 'level4' ? 'url(#highlightGlow)' : undefined}
        opacity={hlM2 ? 1 : 0.4}
        className="transition-opacity duration-300"
      >
        {/* M2 Line 1: segments 3 to 6 */}
        <rect
          x={x + 3 * segmentWidth}
          y={m2Top}
          width={4 * segmentWidth}
          height={m2Height}
          rx="2"
          fill="url(#copperGradientM2)"
          stroke="#78350F"
          strokeWidth="1.2"
        />
        <rect
          x={x + 3 * segmentWidth}
          y={m2Top}
          width={4 * segmentWidth}
          height={m2Height}
          rx="2"
          fill="url(#metalHatch)"
          pointerEvents="none"
        />

        {/* M2 Line 2: segments 10 to 13 */}
        <rect
          x={x + 10 * segmentWidth}
          y={m2Top}
          width={4 * segmentWidth}
          height={m2Height}
          rx="2"
          fill="url(#copperGradientM2)"
          stroke="#78350F"
          strokeWidth="1.2"
        />
        <rect
          x={x + 10 * segmentWidth}
          y={m2Top}
          width={4 * segmentWidth}
          height={m2Height}
          rx="2"
          fill="url(#metalHatch)"
          pointerEvents="none"
        />

        {showLabels && (
          <>
            <text
              x={x + 5 * segmentWidth}
              y={m2Top + m2Height / 2 + 3.5}
              textAnchor="middle"
              fill="#451A03"
              fontSize="9"
              fontFamily="'Space Grotesk', sans-serif"
              fontWeight="bold"
            >
              M2 Routing
            </text>
            <text
              x={x + 12 * segmentWidth}
              y={m2Top + m2Height / 2 + 3.5}
              textAnchor="middle"
              fill="#451A03"
              fontSize="9"
              fontFamily="'Space Grotesk', sans-serif"
              fontWeight="bold"
            >
              M2 Routing
            </text>
          </>
        )}
      </g>

      {/* ── 4. RIGHT SIDE LEADER LINES & CALLOUTS ── */}
      <g id="multilayer-leader-lines">
        {/* M2 Leader */}
        <line
          x1={x + width}
          y1={m2Top + m2Height / 2}
          x2={x + width + 30}
          y2={m2Top + m2Height / 2}
          stroke="#D97706"
          strokeWidth="1.2"
        />
        <circle cx={x + width + 30} cy={m2Top + m2Height / 2} r="2.5" fill="#D97706" />
        <text
          x={x + width + 36}
          y={m2Top + m2Height / 2 + 3}
          fill="#D97706"
          fontSize="9"
          fontFamily="'Space Grotesk', sans-serif"
          fontWeight="bold"
        >
          Metal 2 (Cu)
        </text>

        {/* ILD Leader */}
        <line
          x1={x + width}
          y1={ildTop + ildHeight / 2}
          x2={x + width + 30}
          y2={ildTop + ildHeight / 2}
          stroke="#00A6A6"
          strokeWidth="1"
        />
        <circle cx={x + width + 30} cy={ildTop + ildHeight / 2} r="2" fill="#00A6A6" />
        <text
          x={x + width + 36}
          y={ildTop + ildHeight / 2 + 3}
          fill="#00A6A6"
          fontSize="9"
          fontFamily="'Space Grotesk', sans-serif"
          fontWeight="bold"
        >
          ILD & Vias
        </text>

        {/* M1 Leader */}
        <line
          x1={x + width}
          y1={m1Top + m1Height / 2}
          x2={x + width + 30}
          y2={m1Top + m1Height / 2}
          stroke="#B45309"
          strokeWidth="1.2"
        />
        <circle cx={x + width + 30} cy={m1Top + m1Height / 2} r="2.5" fill="#B45309" />
        <text
          x={x + width + 36}
          y={m1Top + m1Height / 2 + 3}
          fill="#B45309"
          fontSize="9"
          fontFamily="'Space Grotesk', sans-serif"
          fontWeight="bold"
        >
          Metal 1 & CMP
        </text>
      </g>
    </g>
  );
};

export default MetalLayer;
