# Preload and cache models

## What to build
Load the selected TFJS model first, preload the alternate model in the background, reuse one in-flight/ready model per mode, preserve latest-selection-wins activation, record concise performance timings, and cache model assets for one day in Express and Vercel.

## Blocked by
None.

Status: resolved

## Acceptance criteria
- [x] Selected model becomes usable before alternate-model preload completes.
- [x] Alternate model preloads in background without pausing active inference or disabling mode controls.
- [x] Preload and activation share one loader call per mode; ready switches make no new model request.
- [x] Rapid switches cannot activate a stale mode.
- [x] Failed background preload leaves active mode usable and can be retried by selection.
- [x] Inference only resumes after model, mode, MediaPipe options, and prediction state agree.
- [x] Load/preload and activation durations are visible in structured console debug entries.
- [x] Express and Vercel model responses specify one-day revalidating cache headers.
- [x] Node regression assertions, syntax checks, static HTTP smoke, and code review pass.

## Comments
Added single-flight background preload, ready-cache timing, stale activation protection, failure fallback to the prior model, and one-day model cache headers. Node assertions, syntax/JSON checks, diff checks, and Express HTTP header smoke passed. Code review findings about selector locking, active-model loss, and in-flight timing classification were fixed. Real camera inference and the 500 ms target still require browser/device measurement.
