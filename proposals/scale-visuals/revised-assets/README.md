# Revised Scale imagery for visual review

This is a five-image alternative to the earlier `../assets/` set. It follows the supplied reference direction: a bright cleanroom wafer, iridescent top-down circuitry, and restrained grayscale microscopy-inspired views at device scale. The images contain no educational labels or UI. All callouts and measurements belong in React/SVG.

| Stage | Image | Intended relationship |
| --- | --- | --- |
| Wafer | `01_wafer_cleanroom.jpg` | Patterned wafer held in a cleanroom; a field on the wafer is the next zoom target. |
| Field | `02_field_2x3.jpg` | Exactly two columns by three rows of complete dies, with row 2, column 2 as Die #4. |
| Die | `03_die_4.jpg` | Enlarged die with the same major floorplan and color language as Die #4 in the field. |
| Feature | `04_feature_finfet.jpg` | Three-fin, transverse-gate FinFET scientific illustration inspired by grayscale micrographs. |
| Layer | `05_layer_gate_cutaway.jpg` | Cutaway of the same three-fin feature, revealing the gate-to-channel interface. |

## Review limits

- These are generated illustrations, **not photographs of a particular physical wafer or actual SEM measurements**. Scientific details and material boundaries require expert validation before presenting them as authoritative process imagery.
- The wafer pattern does not literally resolve into the exact six-die field. The notch is obscured by the glove/holder. Use this image for the cleanroom visual direction; replace it if a precise orientation-notch lesson requires a clearly visible notch.
- The field and die share the major circuit arrangement, but they are not a pixel-exact crop of one physical design. Use a zoom transition/crossfade rather than claiming exact optical continuity.
- The feature-to-layer pair is visually related and uses three fins, yet the cutaway is an explanatory rendering. Any live material labels must be checked against an engineer-reviewed layer map.
- Verify responsive crops in the actual viewer before promotion to `public/images/basics/`; the wafer image is wide, and the entire circular rim needs a contained rather than cover crop on narrow screens.

The existing `../assets/`, production images, and `src/` files are untouched. Choose an approved final set after visual and scientific review, then update the specification and runtime together.
