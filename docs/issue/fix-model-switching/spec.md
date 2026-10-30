# Fix model switching and defer guide images

## Goal
Make SIBI/BISINDO switching bounded, race-safe, and fast after first load. Stop showing generated diagrams until user supplies a real dataset.

## Behavior
- Cache one loaded GraphModel per mode for session lifetime.
- Pause inference and disable mode/input controls while switching.
- Latest mode selection wins when loads overlap.
- Wait without a timeout and show elapsed loading seconds; show retry only when the loader returns an actual error.
- Reset prediction buffer and configure MediaPipe only after target model is active.
- Keep guide labels/search structure, but show dataset-pending placeholders and no generated gesture image.

## Verification seam
A small model-loader state helper receives an injected async loader. Deterministic Node assertions verify caching, latest-request-wins, and timeout recovery. Browser syntax/server/static smoke checks remain required.
