# Guide catalog and assets

## What to build
Create the single source of truth for all 71 model labels, including guide instructions, natural TTS text, asset metadata, and one local educational illustration per label. Add the visible credit/license source data and accuracy limitation.

## Blocked by
None.

Status: resolved

## Acceptance criteria
- [x] Registry exactly matches 24 SIBI and 47 BISINDO model outputs in their model order.
- [x] Every entry has category, speech text, hand count, motion/static cue, instructions, asset path, alt text, source/process/date/license.
- [x] Every entry points to an existing optimized local image.
- [x] Dynamic gestures have an explicit motion/frame cue.
- [x] Credits and non-validation disclaimer are represented in data/UI-ready copy.
- [x] Script-level completeness checks pass.

## Comments
Added 71 local SVG educational diagrams and validated registry counts, metadata, and paths with Node assertions. Diagrams remain explicitly marked as schematic and unvalidated.
