# Integrated responsive guide UI

## What to build
Redesign the page into one Indonesian learning/translation workspace. Render searchable/filterable guide content and active detail from the catalog. Keep guide available before permission; start camera/model only after explicit action. Preserve SIBI/BISINDO and STT modes.

## Blocked by
01-guide-catalog-assets.md

Status: resolved

## Acceptance criteria
- [x] Responsive mobile/desktop layout contains translator, guide, how-to, and credits.
- [x] Guide works without camera permission and supports mode/category/search filters.
- [x] Stable detections highlight/open matching guide detail.
- [x] Camera/model starts only from “Mulai penerjemahan”; streams are not duplicated.
- [x] Loading, idle, no-hand, permission error, and unsupported browser states are clear.
- [x] Semantic controls, visible focus, live regions, alt text, and reduced-motion support exist.
- [x] STT remains available as a distinct input mode.

## Comments
Implemented responsive integrated translator/guide/how-to/credits UI, explicit camera start, single-stream frame loop, filtering, active detail, STT, focus states, and reduced-motion CSS.
