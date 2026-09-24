# Fab Basics Scale Visual Specification: Wafer → Field → Die → Feature → Layer

**Branch:** `gemini/scale-visuals`  
**Status:** Visual Direction Proposal (Separate from Production Assets)  
**Collaborator Roles:**  
- **Gemini:** Visual direction, scientific graphic specifications, asset generation/curation, zoom continuity, and responsive crop framing.  
- **Codex:** Application architecture, component state, React/SVG overlay integration, unit/integration tests, and build pipeline.

---

## 1. Architectural Philosophy: The Pure Physical Asset Rule

In prior milestones, reference infographics containing baked-in text, arrows, dimension callouts, and HUD frames were accidentally embedded into runtime components, leading to blurry typography, unlocalized strings, and visual clutter.

For the **Scale Visual System**, we enforce a strict separation of concerns:

1. **The Image Asset is Pure Physics / Optics:**
   - Exactly **one physical subject** per visual asset.
   - **ZERO baked text, numbers, Greek letters, labels, or typography.**
   - **ZERO baked arrows, calipers, dimension lines, bounding boxes, or leader lines.**
   - **ZERO baked UI cards, cyan pill buttons, HUD frames, or background widgets.**
   - Rendered or photographed with scientific realism, physical depth, accurate materials, and natural cleanroom/studio lighting.

2. **React and SVG Provide the Educational Intelligence:**
   - Responsive bounding boxes, reticle scan highlights, zoom transition animations.
   - Dynamic measurement calipers, dimension callouts, and scale bars.
   - Step labels, scientific descriptions, interactive scenario toggles, and accessibility tags.
   - Coordinated color coding (Space Grotesk headers, Inter prose, IBM Plex Mono values/metadata, restrained cyan `#00A6A6` accents).

---

## 2. The Five-Stage Visual Journey

To understand semiconductor manufacturing, a student must follow a single physical piece of silicon across **seven orders of magnitude** in spatial scale:

$$\text{Wafer } (3 \times 10^{-1}\text{ m}) \longrightarrow \text{Field } (3 \times 10^{-2}\text{ m}) \longrightarrow \text{Die } (1 \times 10^{-2}\text{ m}) \longrightarrow \text{Feature } (1 \times 10^{-8}\text{ m}) \longrightarrow \text{Layer } (1 \times 10^{-9}\text{ m})$$

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│     STAGE 1     │       │     STAGE 2     │       │     STAGE 3     │
│  300 mm Wafer   │ ────> │ Exposure Field  │ ────> │   Single Die    │
│  Macro Substrate│       │   2×3 Die Grid  │       │ Scribe Streets  │
└─────────────────┘       └─────────────────┘       └─────────────────┘
                                                             │
                                                             ▼
                          ┌─────────────────┐       ┌─────────────────┐
                          │     STAGE 5     │       │     STAGE 4     │
                          │ Thin-Film Layer │ <──── │3D Nanostructure │
                          │ Material Stack  │       │  FinFET Channel │
                          └─────────────────┘       └─────────────────┘
```

---

### Stage 1: 300 mm Silicon Wafer (The Substrate Baseline)

* **Physical Scale:** $300\text{ mm}$ diameter, $\sim 775\ \mu\text{m}$ thickness.
* **Scientific Subject:** A pristine, mirror-polished monocrystalline silicon wafer sitting flat on a cleanroom vacuum chuck or robotic end-effector. The laser-etched orientation notch is located at 6 o'clock. A faint, periodic optical diffraction pattern is visible across the thousands of patterned micro-features under glancing light.
* **Camera & Framing:** High-angle orthographic top-down view (10° tilt from normal). The circular perimeter of the entire 300 mm wafer is centered in frame with generous safety margin (wafer diameter fills ~78–82% of viewport).
* **Perspective & Distortion:** Near-telecentric or orthographic lens ($f \ge 85\text{ mm}$ equivalent) with minimal barrel distortion to preserve accurate circle geometry.
* **Lighting:** Diffuse cleanroom white illumination ($5000\text{ K}$) with a soft glancing directional key light from upper-left (10 o'clock) creating natural, subtle thin-film spectral dispersion across patterned fields.
* **Materials & Colors:**
  - Bulk substrate: Deep gunmetal mirror silicon (`#0F172A` to `#1E293B`).
  - Specular sheen: Subdued silver-gray and slate-blue highlights.
  - Background: Neutral matte dark cleanroom slate (`#0B0F19`) or high-end museum pedestal.
* **Zoom Target Anchor:** Upper-right quadrant (Field coordinate `Row 4, Col 5` from wafer center), oriented orthogonally to prepare for the Stage 2 plunge.

---

### Stage 2: Exposure Field (The Scanner Window)

* **Physical Scale:** Illustrative step-and-scan rectangular window (nominal $\sim 26\text{ mm X} \times 33\text{ mm Y}$, portrait aspect ratio $\approx 0.788$).
* **Scientific Subject:** Exactly **one complete lithography exposure field** patterned during a single scanner pass. The field contains an illustrative grid of **2 dies in X by 3 dies in Y (TOTAL = 6 dies)**. Subtle dicing streets / scribe lanes ($\sim 80\ \mu\text{m}$ width) separate each die. No die is cut off.
* **Camera & Framing:** Direct top-down orthographic perspective, aligned precisely with the zoom target identified in Stage 1. The outer field rectangle occupies 75–85% of the visual pane.
* **Perspective:** True 2D plan-view (zero angular distortion), matching optical lithography reticle aerial imaging.
* **Lighting:** Neutral, flat telecentric illumination with subtle micro-relief shadows revealing dicing streets and major functional circuit blocks.
* **Materials & Colors:**
  - Wafer substrate baseline: Deep reflective dark slate (`#1E293B`).
  - Scribe lanes: Subtle matte silicon trench (`#0F172A`).
  - Micro-patterned die surfaces: Microscopic integrated circuit texture rendered as uniform optical density with distinct internal block contrasts (dense cache arrays appear darker; sparser logic/bus routing appears lighter slate).
* **Zoom Target Anchor:** **Die #4** (located at lower-left of the 2×3 field grid, Column 1, Row 2) serves as the persistent focal target for Stage 3.

---

### Stage 3: Die / Chip (The Independent Functional Unit)

* **Physical Scale:** Single integrated circuit chip (nominal $\sim 8\text{--}13\text{ mm X} \times 10\text{--}11\text{ mm Y}$).
* **Scientific Subject:** **One complete standalone die**, fully bounded on all four outer edges by dicing streets. Visible peripheral bond pads / micro-bumps along the perimeter for external electrical connection. The internal layout displays functional floorplan partitions (multi-core processing units, SRAM cache banks, power rings, clock trees) rendered as genuine physical structures, not graphic symbols.
* **Camera & Framing:** Plan-view orthographic perspective (top-down), matching the orientation of Die #4 from Stage 2. All 4 outer perimeter dicing edges and corner dicing intersections are completely visible within the frame.
* **Perspective:** Parallel orthographic projection.
* **Lighting:** High-resolution macro illumination highlighting the subtle metallic and dielectric reflectance differences between metal routing layers and silicon substrate.
* **Materials & Colors:**
  - Perimeter bond pads: Polished metallic copper / gold alloy sheen (`#D97706` / `#B45309`).
  - Core logic regions: Deep indigo/cobalt textured silicon (`#1E1B4B` to `#312E81`).
  - SRAM arrays: Regular microscopic geometric matrix with soft slate reflectance (`#334155`).
  - Dicing street border: Deep matte silicon channel (`#090D16`).
* **Zoom Target Anchor:** Logic Core 0 (upper-left quadrant of the die's active area), focusing on a dense standard-cell logic row.

---

### Stage 4: Nanoscale Feature (The 3D Transistor)

* **Physical Scale:** Nanoscale ($\sim 10\text{ nm}$ fin width, $\sim 45\text{ nm}$ fin pitch, $\sim 60\text{ nm}$ fin height).
* **Scientific Subject:** A 3D FinFET or Gate-All-Around (GAA) nanoribbon transistor architecture. Displays vertical crystalline silicon fins rising from the bulk substrate, enveloped by the high-k metal gate stack, flanked by epitaxial source and drain blocks.
* **Camera & Framing:** Isometric 30° / 3D cutaway perspective. The 3D transistor channel and wrap-around gate fill 75–90% of the viewport.
* **Perspective:** 3D isometric or gentle 24mm perspective cutaway that reveals three dimensions simultaneously: fin length, fin height, and gate width.
* **Lighting:** Cinematic studio edge-lighting from high-right, casting controlled micro-shadows into fin trenches to emphasize 3D depth and topography.
* **Materials & Colors:**
  - Bulk silicon substrate: Monocrystalline charcoal slate (`#1E293B`).
  - Silicon fin channel: Vibrant crystalline semiconductor tint (`#0284C7` to `#38BDF8`).
  - High-k metal gate stack: Luminous indigo/titanium nitride metallic (`#4F46E5` to `#818CF8`).
  - Source / Drain epitaxy: Doped raised crystalline lattice (`#0D9488` to `#2DD4BF`).
* **Zoom Target Anchor:** The vertical interface where the metal gate wraps around the crystalline silicon fin, preparing the viewer to slice open the material layers.

---

### Stage 5: Thin-Film Layer (The Vertical Material Stack)

* **Physical Scale:** Vertical thin-film stack ($1\text{ nm}$ gate oxide up to $\sim 1\ \mu\text{m}$ multi-level metallization).
* **Scientific Subject:** A high-resolution cross-sectional cutaway illustrating how semiconductor devices are physically built from the bottom up through repeated deposition, patterning, etching, and planarization. Shows:
  1. Monocrystalline silicon base substrate.
  2. Shallow Trench Isolation (STI) oxide trenches.
  3. 3D Fin channel & atomic-scale high-k gate dielectric interface ($\text{HfO}_2$, $\sim 1\text{--}2\text{ nm}$).
  4. Workfunction metal gate stack ($\text{TiN} / \text{TaN} / \text{W}$).
  5. Inter-Layer Dielectric (ILD) glass matrix ($\text{SiO}_2$ / low-k fluorosilicate).
  6. Vertical tungsten contact plugs (plugs connecting transistor terminals to wiring).
  7. Multi-tier copper interconnect lines (M1, M2, M3 with barrier seed cladding).
* **Camera & Framing:** Clean 2.5D prism cutaway or STEM (Scanning Transmission Electron Microscopy) cross-sectional plane.
* **Perspective:** Orthographic profile slice with an isometric top facet showing trace runs.
* **Lighting:** Studio back-illumination on dielectric matrix, crisp front-key on metallic traces and vertical contact plugs.
* **Materials & Colors:**
  - Silicon Substrate: Textured crystalline dark slate (`#0F172A`).
  - STI Oxide: Translucent pale silica blue (`#94A3B8` / `#CBD5E1`).
  - High-K Dielectric: Ultra-thin luminous turquoise boundary line (`#06B6D4`).
  - Tungsten Plugs: Dense, brushed metallic silver/titanium (`#64748B` / `#94A3B8`).
  - Copper Interconnects: Warm, polished authentic copper sheen (`#EA580C` to `#B45309`).
  - ILD Matrix: High-purity dielectric low-k glass (`#F1F5F9` / `#E2E8F0`).
* **Visual Narrative Payoff:** Closes the loop from the macro wafer to the atomic thin films, answering: *"A chip is not just a flat drawing; it is a 3D skyscraper of 50–80 stacked, nanometer-precise material layers."*

---

## 3. Spatial Zoom Continuity & Transition Matrix

To prevent disorienting jumps, every transition uses an animated zoom target anchor:

| From Stage | To Stage | Anchor Coordinates | Optical Transition Logic |
| :--- | :--- | :--- | :--- |
| **1. Wafer** | **2. Field** | `X: 68%, Y: 32%` (Row 4, Col 5) | React overlays a pulsating cyan reticle box ($26 \times 33\text{ mm}$ aspect). On zoom, the camera glides into this box, expanding the single field to fill the frame. |
| **2. Field** | **3. Die** | Die #4 (`Col 1, Row 2` of 2×3 grid) | Die #4 is highlighted with a gold/amber border. The camera plunges smoothly into Die #4, expanding it into the single complete die view. |
| **3. Die** | **4. Feature** | Core 0 active logic cluster (`X: 30%, Y: 35%`) | React highlights a microscopic logic block ($<1\ \mu\text{m}$). The camera transitions from macro circuit layout into 3D nanoscale FinFET architecture. |
| **4. Feature** | **5. Layer** | Gate-to-channel cross-section plane | A vertical slicing plane animates downward through the gate, tilting into the multi-layer thin-film cross-section stack. |

---

## 4. Responsive Framing & Crop Guidance

Visual assets must render crisply across Desktop (ultrawide down to standard 1440×900) and Mobile (390×844 portrait):

### Desktop (Viewport Width $\ge 1024\text{ px}$)
- **Container Aspect:** `4:3` or `16:10` dominant visual pane occupying **70–75% of section width**.
- **Object Occupancy:** Subject fills **75–85%** of the container interior.
- **Padding / Safe Area:** Minimum $10\%$ margin on all four sides to accommodate floating SVG badges, calipers, and coordinate indicators without overlapping the physical subject.

### Mobile (Viewport Width $\le 640\text{ px}$)
- **Container Aspect:** `1:1` square or `4:5` portrait card occupying full viewport width minus container padding ($24\text{ px}$).
- **Crop Rule:** **Center-weighted object lock**. No critical edge (such as wafer rim, dicing streets, or fin tips) may be clipped.
- **Minimum Tap Targets:** SVG overlay controls and zoom trigger buttons must maintain $\ge 44 \times 44\text{ px}$ interactive touch targets.

---

## 5. Geometry Calibration Note (2×3 Die Arrangement)

* **Arrangement:** Exactly **2 columns in X by 3 rows in Y = 6 complete dies per exposure field**.
* **Orientation:** Portrait orientation ($26\text{ mm X} : 33\text{ mm Y} \approx 1 : 1.27$).
* **Guidance on Exact Dimensions:**
  - Avoid baking hardcoded millimeter numbers into the image assets.
  - In React UI, label field dimensions as:  
    `"Illustrative scenario: ~26 mm (X) × 33 mm (Y) field with 2×3 die grid (6 dies total)"`
  - This avoids conflicts with specific fab process nodes while preserving geometric consistency.

---

## 6. Review Sample Visuals

The following sample visuals have been generated strictly according to this pure physical discipline and saved in `proposals/scale-visuals/assets/`:

1. **`sample_field_2x3_clean.jpg` (Exposure Field Sample):**
   - Pure physical 2×3 die array in portrait orientation.
   - Clean dicing streets separating all 6 dies.
   - Genuine microchip surface texture on dark polished silicon.
   - **Zero baked text, zero numbers, zero arrows, zero UI elements.**
2. **`sample_feature_transistor_clean.jpg` (3D Nanoscale Feature Sample):**
   - Pure physical 3D monolithic block with nanoscale vertical fins and micro-machined bus interconnects.
   - Neutral studio background with realistic depth of field.
   - **Zero baked text, zero UI overlays.**

---

## 7. Next Steps for Collaborative Implementation

1. **Review & Approval:** User reviews the visual specification and sample asset `sample_field_2x3_clean.jpg`.
2. **Asset Generation:** Once approved, generate the complete 5-stage pure-physical asset set (`01_wafer_clean.jpg`, `02_field_2x3_clean.jpg`, `03_die_clean.jpg`, `04_feature_finfet_clean.jpg`, `05_layer_stack_clean.jpg`).
3. **Integration Handoff:**
   - Production code (`ScaleZoomViewer.tsx`) and runtime image folders remain untouched on `gemini/scale-visuals`.
   - Codex merges `dbdb9b8`, updates `ScaleStage` to include `'layer'`, and connects the approved assets with interactive React/SVG overlays.
