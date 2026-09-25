# Fab Basics visual system

## Runtime rules

- New source imagery should depict one physical subject without baked labels or measurement graphics. The retained Gemini field and die hierarchy images are exceptions: their labels and cyan zoom frames are part of the supplied images.
- React and SVG own annotation, interaction, captions, and measurement states.
- A set of process states should share camera, geometry, crop, and material colors. A scientific cutaway may be authored directly in SVG when that gives more reliable consistency.
- Every new visual needs a mobile-safe crop and a descriptive alternative text or SVG label.
- Avoid presenting illustrative dimensions as a universal device specification.

## Current inventory

- Fab World plates remain in `public/images/plates/`. The fallback overview now uses the same file as the WebGL overview.
- The Fab Basics hero and Scale Stage 1 share the updated `public/images/basics/hero-wafer-cleanroom.jpg`. The Scale sequence is Wafer → Field → Die → Layer → Nanoscale Feature. Gemini's two labeled hierarchy images illustrate a four-die, 2×2 field; they already contain their own labels and zoom frames. The cutaway and intact FinFET are microscopy-inspired conceptual renders, not raw SEM data.
- Patterning's six "after" states use `public/images/basics/patterning-01` through `patterning-06` PNGs. A step's "before" view reuses the preceding frame; the first uncoated "before" view remains SVG. CD, Overlay, Yield, and DUV/EUV currently use DOM/SVG visuals. The unused composite posters and crops are retained in `assets/reference/basics/`, outside the served directory.
- The HTML material legend and the SVG cross-section legend serve distinct views. Their names now reflect those different roles.

## Next visual work

1. Validate the Scale device and cutaway material interfaces with a semiconductor subject matter expert before treating them as authoritative. The labeled wafer/field/die insets are illustrative, not a pixel-exact optical crop. Their baked labels may need to be recreated in React/SVG for localization and smaller screens in a later pass.
2. Review the six Patterning frames at mobile size and check that their repeated substrate, dielectric, and resist geometry remains continuous through Develop, Etch, and Strip. Validate the material assignments before describing them as measured process imagery.
3. Rework DUV/EUV into a compact intuitive mode and a separate detailed engineering mode with mobile-appropriate labels.
4. Review the CD SEM representation and CMP / Add / Pattern / Remove visuals against the same no-baked-UI rule.

The archived images are references, not candidate runtime replacements without a new crop and scientific review.
