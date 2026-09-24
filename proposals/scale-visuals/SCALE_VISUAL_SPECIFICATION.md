# Fab Basics Scale Visual Specification: Wafer → Field → Die → Feature → Layer

> **Historical proposal:** This document specifies the earlier six-die, 2×3 visual concept and its quarantined assets. The selected Gemini field and die hierarchy images now illustrate a four-die, 2×2 field with the upper-right die highlighted. See `src/components/basics/scale/ScaleZoomViewer.tsx` and `docs/visual-system.md` for the current runtime mapping and copy. Keep this document for provenance; do not apply its die numbering or crop coordinates to the selected images.

**Branch:** `gemini/scale-visuals`  
**Status:** Visual Direction Proposal (Separate from Production Assets)  
**Baseline:** `origin/main` (`5cd7916` / PR #1 merged)  
**Collaborator Roles:**  
- **Gemini:** Visual direction, scientific graphic specifications, asset generation/curation, zoom continuity, and responsive crop framing.  
- **Codex:** Application architecture, component state, React/SVG overlay integration, unit/integration tests, and build pipeline.

---

## 1. Architectural Philosophy: Pure Physical Asset Rule

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

$$\text{Wafer } (300\text{ mm}) \longrightarrow \text{Field } (\text{Scanner shot}) \longrightarrow \text{Die } (\text{Single chip}) \longrightarrow \text{Feature } (\text{Nanoscale FinFET}) \longrightarrow \text{Layer } (\text{FinFET cutaway stack})$$

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│     STAGE 1     │       │     STAGE 2     │       │     STAGE 3     │
│ Patterned Wafer │ ────> │ Exposure Field  │ ────> │   Single Die    │
│ Visible Fields  │       │ 2×3 Die Grid    │       │ Die #4 (R2, C2) │
└─────────────────┘       └─────────────────┘       └─────────────────┘
                                                             │
                                                             ▼
                          ┌─────────────────┐       ┌─────────────────┐
                          │     STAGE 5     │       │     STAGE 4     │
                          │ Layer Cutaway   │ <──── │ 3D Feature      │
                          │ SAME FinFET Cut │       │ FinFET Channel  │
                          └─────────────────┘       └─────────────────┘
```

---

### Stage 1: 300 mm Patterned Silicon Wafer (The Substrate Baseline)

* **Physical Scale:** $300\text{ mm}$ diameter, $\sim 775\ \mu\text{m}$ thickness.
* **Scientific Subject:** A completed, fully patterned production wafer sitting centered on a cleanroom vacuum chuck. The wafer is distinctly patterned with a regular grid of hundreds of repeating rectangular exposure fields across its entire surface, displaying vivid prismatic rainbow diffraction patterns under directional cleanroom light. A laser-cut orientation notch is clearly visible at the 6 o'clock position on the bottom edge.
* **Camera & Framing:** High-angle orthographic top-down perspective (10° tilt from normal). The circular perimeter of the entire 300 mm wafer is centered in frame with a safety margin (wafer diameter fills ~78–82% of viewport).
* **Perspective & Distortion:** Near-telecentric telephoto framing ($f \ge 85\text{ mm}$ equivalent) with minimal barrel distortion to preserve true circular geometry.
* **Lighting:** Diffuse cleanroom white illumination ($5000\text{ K}$) with a directional key creating natural thin-film spectral dispersion across the patterned field grid.
* **Materials & Colors:**
  - Bulk substrate: Deep gunmetal mirror silicon with crystalline diffraction sheen.
  - Surface grid: Distinctly visible repeating exposure fields.
  - Background: Cleanroom chuck and dark neutral slate background.
* **Zoom Target Anchor:** Upper-right quadrant (Field coordinate `Row 4, Col 5` from wafer center), preparing the visitor for the Stage 2 plunge into one exposure field.

---

### Stage 2: Exposure Field (The Scanner Window)

* **Physical Scale:** Illustrative step-and-scan rectangular window (aspect ratio $\approx 0.75$, portrait orientation). Field dimensions are intentionally left unspecified in the image asset to accommodate variable scanner and product geometries.
* **Scientific Subject:** Exactly **one complete lithography exposure field** patterned during a single scanner pass. The field contains an illustrative grid of **2 dies horizontally by 3 dies vertically (TOTAL = 6 dies)**. Clean dicing streets / scribe lanes separate all six dies without any edge clipping. Each die features golden peripheral bond pads along its outer edges and internal multi-core circuit floorplan architecture with reflective copper traces and dark slate silicon.
* **Die Numbering & Layout (Row-by-Row Grid):**
  - **Row 1:** Die #1 (Column 1), Die #2 (Column 2)
  - **Row 2:** Die #3 (Column 1), **Die #4 (Column 2)** $\longleftarrow$ *Zoom Target*
  - **Row 3:** Die #5 (Column 1), Die #6 (Column 2)
* **Camera & Framing:** Direct top-down orthographic plan-view perspective, matching the optical projection of a scanner reticle. The outer field rectangle occupies 75–85% of the visual pane.
* **Lighting:** Neutral, flat telecentric macro illumination highlighting dicing streets and circuit blocks.
* **Materials & Colors:**
  - Wafer substrate baseline: Deep reflective dark slate (`#1E293B`).
  - Scribe lanes: Clean matte dicing streets.
  - Die surfaces: Golden peripheral bond pads, copper trace routing, and dark silicon processing blocks.
* **Zoom Target Anchor:** **Die #4 at row 2, column 2** (highlighted by React/SVG as `NEXT STAGE` to foreshadow Stage 3).

---

### Stage 3: Die / Chip (The Independent Functional Unit)

* **Physical Scale:** Single integrated circuit chip. Specific dimensions are left unspecified in the asset to reflect product-dependent designs.
* **Scientific Subject:** **One complete standalone die**, representing the exact Die #4 (row 2, column 2) from Stage 2. **All four outer perimeter dicing edges and corners are 100% visible**, framed by a clean dicing street margin. Square golden bond pads neatly line all four perimeters. The internal floorplan matches the field die: top section contains multi-core processing units and cache arrays, lower left features a dense memory block, lower right features copper bus routing interconnects on dark reflective silicon.
* **Camera & Framing:** Plan-view orthographic perspective (top-down), matching the orientation of Die #4 from Stage 2. All 4 outer perimeter dicing edges and corner intersections are completely visible within the frame.
* **Lighting:** High-resolution macro illumination highlighting the metallic gold bond pads and copper routing layers.
* **Materials & Colors:**
  - Perimeter bond pads: Polished metallic gold alloy sheen.
  - Core logic regions: Deep indigo/cobalt textured silicon.
  - Memory arrays: Regular microscopic geometric matrix.
  - Dicing street border: Deep matte silicon channel.
* **Zoom Target Anchor:** Upper active logic/transistor cluster, focusing into a standard-cell row to prepare for the nanoscale feature.

---

### Stage 4: Nanoscale Feature (The 3D FinFET Transistor)

* **Physical Scale:** Nanoscale ($\sim 10\text{--}50\text{ nm}$ fin width/pitch).
* **Scientific Subject:** A 3D multi-fin FinFET transistor architecture. Three parallel vertical crystalline silicon fins emerge from a dark monocrystalline silicon substrate with shallow trench isolation (STI) oxide between their bases. A continuous metallic wrap-around gate electrode (deep indigo/cobalt metallic) runs across and tightly drapes over the top and sidewalls of all three fins (tri-gate configuration). Flanked by source and drain crystalline regions.
* **Camera & Framing:** 30° isometric high-angle cutaway perspective that clearly reveals three dimensions simultaneously: fin length, fin height, and gate wrap width. The transistor architecture fills 75–90% of the viewport.
* **Lighting:** Studio edge-lighting from high-right, casting controlled micro-shadows into fin trenches to emphasize 3D topography.
* **Materials & Colors:**
  - Bulk silicon substrate: Monocrystalline charcoal slate (`#1E293B`).
  - Silicon fin channels: Crystalline semiconductor silicon with soft brushed texture.
  - Metal gate electrode: Conformal deep indigo metallic wrap-around gate.
  - STI oxide: Recessed insulating baseline between fin roots.
* **Zoom Target Anchor:** Transverse cut plane directly through the gate electrode and the three fin channels, preparing the viewer to slice open the material layers.

---

### Stage 5: Thin-Film Layer (Cross-Section of the SAME FinFET Gate and Channel)

* **Physical Scale:** Nanoscale vertical thin-film stack ($1\text{--}2\text{ nm}$ gate oxide up to gate stack height).
* **Scientific Subject:** A vertical cross-sectional cutaway sliced directly through the transverse metal gate and three vertical silicon fins of the **exact same 3D FinFET transistor shown in Stage 4**. The camera, angle, lighting, substrate, and indigo gate are identical to Stage 4, but the front face is sliced cleanly open to reveal the layered internal anatomy:
  1. Dark monocrystalline silicon substrate at the bottom foundation.
  2. Shallow Trench Isolation (STI) oxide insulating the trenches between the fin roots.
  3. The three upright rectangular crystalline silicon fin channel cross-sections.
  4. The ultra-thin conformal high-k gate dielectric interface lining each fin's top and vertical sidewalls.
  5. The wrap-around indigo metal gate electrode encasing all three fins.
  6. Upper dielectric/ILD layer with contact interfaces.
* **Camera & Framing:** Clean 3D isometric cutaway perspective, matching the exact orientation and framing of Stage 4.
* **Lighting & Materials:** Identical to Stage 4. The sliced front plane exposes the crisp material interfaces with high contrast between dielectric and metal.
* **Visual Narrative Payoff:** Directly answers *"What is a layer?"* by revealing that the 3D FinFET seen in Stage 4 is not a monolithic block, but an atomically precise stack of deposited, patterned, and etched thin-film materials.

---

## 3. Spatial Zoom Continuity & Transition Matrix

To prevent disorienting jumps, every transition uses an animated zoom target anchor:

| From Stage | To Stage | Anchor Coordinates | Optical Transition Logic |
| :--- | :--- | :--- | :--- |
| **1. Wafer** | **2. Field** | `X: 68%, Y: 32%` (Row 4, Col 5) | React overlays a pulsating cyan reticle box. On zoom, the camera glides into this box, expanding the single 2×3 field to fill the frame. |
| **2. Field** | **3. Die** | **Die #4 at row 2, column 2** | Die #4 is highlighted with a gold border and `NEXT STAGE` badge. Camera plunges smoothly into Die #4, expanding it into the single complete die view. |
| **3. Die** | **4. Feature** | Active logic/transistor cluster | React highlights an active transistor group. The camera transitions from macro circuit layout into the 3D nanoscale FinFET architecture. |
| **4. Feature** | **5. Layer** | Gate-to-channel vertical plane | A vertical slicing plane animates through the indigo gate, cleanly revealing the internal thin-film cross-section of the **exact same FinFET**. |

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
* **Orientation:** Portrait orientation.
* **Guidance on Exact Dimensions:**
  - No hardcoded millimeter numbers are baked into the image assets.
  - In React UI, field and die dimensions follow the approved copy on `main`:  
    `"Illustrative layout: 2 columns × 3 rows · Dimensions vary by product"` and `"Die size varies by design · Separated along scribe lanes"`.
  - This avoids conflicts with specific fab process nodes while preserving geometric consistency.

---

## 6. Complete 5-Stage Physical Asset Catalog

All five clean physical assets are saved in `proposals/scale-visuals/assets/`:

| Stage | Asset Filename | Physical Scale | Subject & Framing |
| :--- | :--- | :--- | :--- |
| **1. Wafer** | [`01_wafer_clean.jpg`](file:///C:/Users/Utente/Desktop/Virtual%20Fab/virtual-fab/proposals/scale-visuals/assets/01_wafer_clean.jpg) | $300\text{ mm}$ | Patterned production wafer with visible exposure fields and rainbow diffraction rings on cleanroom chuck. Notch at 6 o'clock. |
| **2. Field** | [`02_field_2x3_clean.jpg`](file:///C:/Users/Utente/Desktop/Virtual%20Fab/virtual-fab/proposals/scale-visuals/assets/02_field_2x3_clean.jpg) | Scanner shot | Exactly 2 dies in X by 3 dies in Y (6 dies total) in portrait orientation. Scribe streets separate all 6 dies cleanly. Die #4 at row 2, col 2. |
| **3. Die** | [`03_die_clean.jpg`](file:///C:/Users/Utente/Desktop/Virtual%20Fab/virtual-fab/proposals/scale-visuals/assets/03_die_clean.jpg) | Single die | Single complete die matching Die #4. All 4 dicing edges and corners visible. Perimeter gold bond pads, multi-core and memory floorplan. |
| **4. Feature** | [`04_feature_finfet_clean.jpg`](file:///C:/Users/Utente/Desktop/Virtual%20Fab/virtual-fab/proposals/scale-visuals/assets/04_feature_finfet_clean.jpg) | $\sim 10\text{--}50\text{ nm}$ | 3D multi-fin FinFET transistor: 3 vertical crystalline silicon fins, STI oxide, and conformal indigo wrap-around gate. |
| **5. Layer** | [`05_layer_stack_clean.jpg`](file:///C:/Users/Utente/Desktop/Virtual%20Fab/virtual-fab/proposals/scale-visuals/assets/05_layer_stack_clean.jpg) | Thin-film stack | Vertical cutaway of the **exact same FinFET** from Stage 4, showing substrate, STI, 3 fin cross-sections, gate dielectric interface, and wrap gate. |

---

## 7. Next Steps for Collaborative Implementation

1. **Review & Approval:** Codex and User verify the five physical assets against the visual specification and crop rules.
2. **Handoff to Codex:**
   - Production code (`ScaleZoomViewer.tsx`), types, and runtime image directories remain completely untouched on `gemini/scale-visuals`.
   - Codex can integrate the five clean assets from `proposals/scale-visuals/assets/` into runtime `/public/images/basics/`, wire the responsive React/SVG overlays (pulsing reticle box, calipers, bond pad highlights, and material layer tooltips), and verify all test suites.
