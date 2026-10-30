# Realtime TTS, message editing, and MQTT

## What to build
Separate latest token from assembled message; add undo, space, clear, and finish controls. Implement persisted realtime TTS training/communication modes and final-message MQTT while keeping token compatibility.

## Blocked by
02-integrated-guide-ui.md

Status: resolved

## Acceptance criteria
- [x] Stable labels update latest token and assembled message using documented spacing rules.
- [x] Undo last operation, add normalized space, clear, and finish/read work.
- [x] TTS defaults off; training and communication modes behave as specified.
- [x] Optional communication auto-read occurs after 3 seconds idle without overlap/repeat loops.
- [x] Indonesian voice is preferred; fallback state is shown.
- [x] Preferences persist locally without an account.
- [x] MQTT token payload remains compatible and final messages are distinguishable.
- [x] STT interaction does not trigger gesture TTS or corrupt message state.

## Comments
Implemented message operations, persisted dual-mode TTS, Indonesian voice fallback, 3-second idle read, and distinguishable final-message MQTT while retaining plain token payloads.
