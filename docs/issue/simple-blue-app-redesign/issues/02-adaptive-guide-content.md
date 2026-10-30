# Adaptive guide and supporting content

## What to build

Redesign the complete guide, usage instructions, credits, and footer within the blue system. Preserve all 71 catalog entries, filters, search, prediction synchronization, source metadata, and fallbacks. Keep desktop selected detail beside the catalog; use an accessible dialog/drawer for mobile detail. Correct stale guide copy to reflect available alphabet photos while retaining the limitation disclaimer.

## Blocked by

01-blue-shell-translator.md

Status: resolved

## Acceptance criteria

- [ ] Guide remains usable before camera permission and renders all mode/category/search states from the existing registry.
- [ ] Desktop grid and selected detail form a clear layout without dead columns or hidden controls.
- [ ] Mobile selection opens a named modal drawer/dialog with close control, Escape handling, focus entry, focus return, and background focus containment.
- [ ] Stable predictions continue to highlight and open the matching guide entry without disrupting the user's current task.
- [ ] Empty filter results keep their context and offer a clear reset action.
- [ ] Missing image fallbacks and all alt text/source/license metadata remain truthful and accessible.
- [ ] Copy states that alphabet photos are available, distinguishes remaining fallbacks, and preserves the non-official/non-guarantee disclaimer.
- [ ] “Cara pakai” presents the actual beginner sequence concisely; credits and limitations remain available but secondary.
- [ ] Desktop and mobile navigation anchors land on visible section headings without content being obscured by sticky UI.
- [ ] Static syntax checks relevant to changed files pass.

## Comments

Implemented the responsive guide catalog, sticky desktop detail, mobile native dialog with focus restoration, resettable empty search, truthful photo/fallback copy, authored guide metadata, concise usage steps, and secondary credits treatment.
