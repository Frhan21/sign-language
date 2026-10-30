# Motion, hardening, and final verification

## What to build

Complete the redesign with purposeful state transitions and restrained reveals, then harden responsive behavior, keyboard interaction, themes, long content, and representative loading/error/empty states. Run all agreed static and real-browser checks, inspect desktop and mobile screenshots, fix findings, run code review, and document the finished design system.

## Blocked by

02-adaptive-guide-content.md

Status: resolved

## Acceptance criteria

- [ ] Section reveals, state transitions, disclosure/dialog motion, and control feedback use opacity/short transforms within 150–300 ms and never gate content.
- [ ] `prefers-reduced-motion` removes non-essential travel and leaves every element visible and usable.
- [ ] Touch targets, focus order, focus visibility, live regions, semantic names/states, and non-color state cues pass accessibility review in both themes.
- [ ] Long messages/statuses, empty results, disabled controls, toast, dialog, sticky header, and bottom navigation do not overlap or clip.
- [ ] Layout and screenshots pass visual review at 1440, 768, 390, and 375 px in representative light and dark states.
- [ ] JavaScript syntax checks and `node scripts/check-model-loader.js` pass.
- [ ] Server starts and referenced static assets return successfully.
- [ ] Taste/UI lint and the Impeccable detector run on final changed UI targets; mechanical findings are fixed or explicitly justified.
- [ ] Browser smoke covers navigation, theme persistence/system behavior, explicit start, mode switching, guide filters/detail, message editing, voice disclosure, dialog keyboard behavior, and reduced motion where feasible.
- [ ] Hardware/service-dependent checks that cannot be exercised are listed without claiming full validation.
- [ ] Code review findings are fixed, `DESIGN.md` documents the implemented tokens/components/rules, and no unresolved material UI regression remains.

## Comments

Added restrained reveal/state motion and reduced-motion handling; hardened camera failure cleanup, TTS feature access/status, STT live status, dialog scrolling/focus, and model status cues. Syntax checks, model-loader assertions, static HTTP smoke, TasteSkill lint (0 FAIL, one justified overlay-shadow warning), Impeccable detector (0 findings), and code review completed. Full rendered desktop/mobile browser validation remains blocked because neither browser-use nor Playwright is installed in the environment; camera/audio/MQTT hardware-service flows were not claimed as fully validated.
