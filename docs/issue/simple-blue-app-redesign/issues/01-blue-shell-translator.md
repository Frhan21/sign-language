# Blue shell and translator workspace

## What to build

Implement the calm blue visual foundation and the complete beginner-first translator path. Add semantic light/dark/system theme tokens and persistence, the compact responsive header, desktop navigation, mobile bottom navigation, concise intro, and the redesigned translator workspace. Preserve all current camera/model, mode-switching, STT, message, TTS, and MQTT behavior. Group advanced voice options in an accessible disclosure while keeping primary speech actions visible.

## Blocked by

None.

Status: resolved

## Acceptance criteria

- [ ] Light and dark semantic color tokens implement the approved blue direction with WCAG AA text contrast and clear focus states.
- [ ] Initial theme follows the system; explicit user choice persists and the accessible header control updates the applied theme.
- [ ] Header exposes Isyarat identity, desktop links, and theme control; mobile exposes a non-overlapping three-item bottom navigation.
- [ ] Intro is concise and the explicit “Mulai menerjemahkan” action remains visible and is the only trigger for camera/model initialization.
- [ ] Translator workspace has balanced desktop columns and a logical mobile stack without horizontal overflow.
- [ ] Camera idle, loading, switching, ready, low-confidence, no-hand, stable, denied, unsupported, failure, and retry states remain clear and announced.
- [ ] Message is the dominant result; token, confidence, editing, gesture/STT switching, and camera switching remain functional.
- [ ] TTS enable/read/stop actions remain discoverable; mode and auto-read settings live in a keyboard-accessible disclosure.
- [ ] Existing IDs or updated JavaScript references preserve all functional DOM contracts.
- [ ] Static syntax checks relevant to changed files pass.

## Comments

Implemented semantic blue light/dark themes, system-first persisted preference, compact shell, desktop and mobile navigation, explicit camera idle state, redesigned translator workspace, message hierarchy, and grouped voice settings while preserving existing DOM behavior.
