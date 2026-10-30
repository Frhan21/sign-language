# Fix model switching and defer guide images

## What to build
Cache both TFJS models, make transitions race-safe with timeout/retry and paused inference, then replace generated guide diagrams with honest dataset-pending placeholders.

## Blocked by
None.

Status: resolved

## Acceptance criteria
- [x] First load per model invokes network loader once; later switches reuse cached instance.
- [x] Inference never runs during switching or with a model from another mode.
- [x] Rapid switches cannot let stale loads overwrite latest selection.
- [x] Loading has no timeout, shows elapsed seconds, and actual errors restore usable controls with retry.
- [x] Prediction state resets after successful switch.
- [x] Generated diagrams are no longer displayed as gesture guidance.
- [x] Node regression assertions, syntax checks, and server/static smoke pass.

## Comments
Added session model cache, latest-request guard, 15-second timeout, retry UI, stale inference protection, and late-model disposal. Guide now shows dataset-pending placeholders. Regression assertions and static/server checks pass.
