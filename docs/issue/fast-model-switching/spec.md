# Fast model switching

## Goal
Make every SIBI/BISINDO switch fast after startup by loading the selected model first, preloading the other model in the background, and caching model assets across browser sessions.

## Behavior
- Load and activate the selected model first after the user starts translation.
- Preload the other model without pausing the active model or blocking controls.
- Share one in-flight load and one GraphModel instance per mode for the browser session.
- A mode switch reuses the ready/in-flight model; latest selection wins.
- Inference pauses while activating a different model and resumes only after MediaPipe configuration and prediction state match that model.
- Background preload failure does not interrupt the active model; selecting the failed mode retries it.
- Model assets use `Cache-Control: public, max-age=86400, must-revalidate` in Express and Vercel.
- Console performance entries distinguish load/preload from activation. Ready cached switches target 500 ms or less on a reference desktop and make no new model request.

## Verification seam
Use the existing dependency-injected `createModelLoader` public API and Node assertion script. Verify single-flight preload, cache reuse, retry, and latest-request-wins without adding a test framework. Verify JavaScript syntax, Express cache headers, static model responses, and browser smoke behavior where available.

## Out of scope
- Retraining, converting, quantizing, or renaming model files.
- Persistent IndexedDB model storage.
- Changing prediction thresholds, labels, MQTT, STT, or TTS behavior.
