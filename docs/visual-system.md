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
- Patterning's Resist Coat "after" state uses `public/images/basics/patterning-01-resist-coat.png`; its other states, CD, Overlay, Yield, and DUV/EUV currently use DOM/SVG visuals. The unused composite posters and crops are retained in `assets/reference/basics/`, outside the served directory.
- The HTML material legend and the SVG cross-section legend serve distinct views. Their names now reflect those different roles.

## Next visual work

1. Validate the Scale device and cutaway material interfaces with a semiconductor subject matter expert before treating them as authoritative. The labeled wafer/field/die insets are illustrative, not a pixel-exact optical crop. Their baked labels may need to be recreated in React/SVG for localization and smaller screens in a later pass.
2. Review Patterning's existing six-state SVG against one scientific geometry and material palette. Refine its shapes instead of reviving cropped poster assets.
3. Rework DUV/EUV into a compact intuitive mode and a separate detailed engineering mode with mobile-appropriate labels.
4. Review the CD SEM representation and CMP / Add / Pattern / Remove visuals against the same no-baked-UI rule.

The archived images are references, not candidate runtime replacements without a new crop and scientific review.
