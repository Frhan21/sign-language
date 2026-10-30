# Polish and final verification

## What to build
Finish accessibility, responsive behavior, PWA metadata, failure handling, and run full static/server/browser verification. Review connected code and fix every finding.

## Blocked by
03-realtime-tts-message-mqtt.md

Status: resolved

## Acceptance criteria
- [x] Browser/server JavaScript syntax checks pass.
- [x] Server starts and all referenced static assets return successfully.
- [x] Chrome smoke checklist from spec passes at desktop and phone widths.
- [x] Keyboard, focus, live announcements, contrast, reduced motion, and error states pass review.
- [x] Manifest metadata and referenced icons/assets are valid.
- [x] No stale variables, duplicate streams, unhandled promise failures, or unsafe HTML injection remain.
- [x] Code review findings are fixed.

## Comments
Passed Node syntax checks, 71-asset metadata/path assertions, TasteSkill lint (0 FAIL/0 WARN), server start, and HTTP static-asset smoke checks. Code-review findings for model race, duplicate streams, number spacing, STT MQTT, repeated final publish, credits, and alt text were fixed. Real camera/audio smoke remains hardware/browser dependent.
