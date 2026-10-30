# Gesture Guide & Realtime TTS

## Goal
Transform the existing single-page sign-language detector into an accessible learning and communication workspace. Users can browse all labels supported by both models before granting camera access, start gesture translation explicitly, assemble/edit a message, and hear stable predictions through realtime TTS.

## Scope
- SIBI: all 24 current model labels.
- BISINDO: all 47 current model labels (9 numbers, 12 words/phrases, 26 letters).
- 71 local illustrated guide assets with source/process/license metadata and a visible accuracy disclaimer.
- One responsive Indonesian interface combining translator, guide, usage instructions, STT, TTS, and asset credits.
- Camera/model initialization only after an explicit user action.
- Guide search/category filters and automatic highlighting/detail for a stable prediction.
- Separate latest token and assembled message; undo last token, add space, clear all, finish/read.
- TTS defaults off and supports training (speak each stable token) and communication (manual finish or optional 3-second idle) modes.
- Persist language, TTS enabled state, TTS mode, and auto-read preference in localStorage.
- Keep STT and per-token MQTT behavior; also publish final messages.

## Non-goals
- Changing or retraining either ML model.
- Claiming linguistic or model validation for generated illustrations.
- Adding a test framework, account system, cloud TTS, or backend asset management.

## UX and accessibility
- Indonesian copy throughout.
- Mobile and desktop are equally supported.
- Guide remains usable without camera permission or loaded models.
- Semantic controls, visible focus, status announcements, descriptive alt text, reduced-motion support.
- Every guide item states hand count and motion/static guidance. Dynamic items may use frame/arrow cues.
- UI visibly states illustrations are learning aids, not an official linguistic standard or recognition guarantee.

## Guide data and assets
A single guide registry is the source of truth for mode labels, category, speech text, hand count, motion cue, instructions, asset path, source/reference, creation process, date, and license. The registry must exactly match model output dimensions (24 and 47). Assets are local, lightweight SVG illustrations produced for this application and credited as project-created educational diagrams. Source references and limitations are disclosed in the credits view.

## Detection and message behavior
- Confidence threshold remains 0.8 and prediction stabilization remains majority-based.
- A newly stable label updates latest token, guide detail, message, MQTT token event, and optionally TTS.
- Duplicate labels remain suppressed until another stable label is accepted or state is reset, preserving current behavior.
- SIBI letters concatenate; BISINDO letters concatenate while number/word labels append as tokens. Explicit “Tambah spasi” always adds one normalized separator.
- Undo removes the most recently accepted message operation; clear resets message and prediction state.

## TTS behavior
- Browser SpeechSynthesis only; prefer an `id-ID` voice, otherwise use browser default and show a status.
- Training mode speaks a natural label (`A` → `huruf A`, `1` → `angka satu`, `Terimakasih` → `terima kasih`).
- Communication mode speaks the assembled message on “Selesai & baca” or after 3 seconds idle when auto-read is enabled.
- Prevent overlapping speech through cancellation/queue control. User can stop speech and disable TTS.

## MQTT compatibility
Continue posting plain text tokens to `/prediction`. Final messages are posted to the same endpoint with headers `X-Prediction-Type: message`; token calls use `X-Prediction-Type: token`. Server publishes token payloads unchanged for compatibility and final messages as JSON containing `type` and `text`.

## Verification seam
Pure browser-independent logic: guide registry completeness, speech normalization, message operations, and idle-read decision. No test runner will be added; verify through JS syntax checks/assertions plus integration smoke tests.

## Acceptance verification
- `node --check` passes for server and browser scripts.
- Server starts and static assets return successfully.
- Chrome smoke test covers guide without camera, explicit camera start, mode switching, guide filtering/highlight, token/message editing, both TTS modes, fallback status, STT, MQTT token/final message, responsive widths, keyboard focus, and reduced motion.
- Final full review has no unresolved correctness, security, accessibility, or regression finding.
