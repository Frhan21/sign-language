# Simple Blue App Redesign

## Goal

Redesign the complete Isyarat single-page application into a calm, simple, and recognizable blue workspace for beginner users. Preserve every working translation, guide, STT, TTS, model-switching, message, and MQTT behavior while making the primary path easier to scan and operate on desktop and mobile.

## Product and audience

The primary user is a beginner learning or using SIBI/BISINDO. The screen's first question is: **“Bagaimana saya mulai menerjemahkan dan tahu bahwa gestur saya terbaca?”** The largest and earliest working area must therefore be the translator workspace, with an explicit start action, camera/model status, actionable gesture guidance, and a readable assembled message.

## Settled direction

- Surface mode: Operate.
- Visual direction: **Calm utility** with medium blue as the action/selection color, navy text, pale blue-neutral grounds, and flat surfaces.
- Identity device: the supported hand landmark path becomes a restrained brand mark and status motif. It appears in the Isyarat mark, camera idle state, and progress/status feedback without becoming decorative noise.
- Color strategy: restrained but recognizable. Blue carries brand, selection, focus, and the primary action; semantic red/amber/green remain reserved for error/warning/success. Color is never the only state cue.
- Typography: one readable sans-serif family with a compact app scale, clear sentence-case labels, and tabular numeric confidence values.
- Shapes: modest consistent radii, quiet borders/tone steps, no gradients, glass, glow, decorative blobs, or heavy shadows.
- Light and dark themes receive equivalent semantic tokens and contrast. Initial theme follows `prefers-color-scheme`; a header control cycles/sets the user choice and persists it.
- Motion: state feedback and short reveal only, 150–300 ms using opacity and small transforms. `prefers-reduced-motion` renders final states without travel.

## Information architecture and layout

1. A compact sticky header contains the Isyarat mark/name, desktop anchor navigation, and theme control.
2. A short intro explains the product in direct Indonesian and leads to one “Mulai menerjemahkan” action.
3. The translator workspace follows immediately and remains the visual priority.
   - Desktop/tablet: camera and result/message areas form a balanced two-column work surface.
   - Mobile: controls and status precede the camera, then token/message and primary actions; no horizontal overflow.
4. The guide follows the workspace and remains usable before camera permission.
   - Desktop: filterable grid plus persistent selected detail.
   - Mobile: grid/list remains in the page; selecting an item opens an accessible dialog/drawer with focus management and close control.
5. “Cara pakai” explains the real sequence in concise steps.
6. Credits and limitations remain available but visually secondary.
7. Mobile uses a bottom navigation bar for Terjemahkan, Panduan, and Cara pakai. The bar respects safe spacing and never covers content or keyboard focus.

## Translator workspace requirements

- Preserve all existing DOM contracts or update JavaScript references deliberately; no functional regression from markup restructuring.
- Keep SIBI/BISINDO selection, camera selection, gesture/STT switching, camera switching, latest token, confidence, gesture status, message editing, TTS, and STT status.
- Keep camera/model initialization behind the explicit start action.
- Before start, show a purposeful idle camera state explaining that permission will be requested after starting.
- Model loading/switching shows a visible progress treatment plus existing live text. Controls that cannot be used are disabled with a clear reason/state.
- Low confidence, no hand, unsupported browser, denied permission, loading failure, and retry remain visible and actionable.
- The assembled message is the dominant result. Token and confidence support it rather than competing with it.
- Group TTS mode and auto-read options inside a native disclosure labeled “Pengaturan suara”; keep TTS enable, finish/read, and stop actions discoverable.
- Keep STT and TTS status announcements accessible.

## Guide requirements

- Preserve all 71 labels, mode/category/search filtering, active prediction synchronization, asset fallbacks, metadata, and credits.
- Correct stale copy: alphabet photos now exist for SIBI and BISINDO; numbers/phrases may still use fallbacks. Do not imply official linguistic validation.
- Desktop selected detail must not create a confusing dead column or hide the grid.
- Mobile detail uses semantic dialog behavior: named title, close button, focus enters and returns correctly, Escape closes, background cannot receive focus while open.
- Empty filter results retain the guide frame and provide a direct reset action.

## Navigation and themes

- Desktop navigation links to Translator, Guide, and Cara pakai with visible current/hover/focus states.
- Mobile bottom navigation provides the same three destinations; theme control stays in the header.
- Theme preference behavior:
  - with no stored choice, follow system changes;
  - after explicit user choice, persist and honor that choice;
  - expose an accessible control name and visible tooltip/label;
  - update browser `theme-color` when practical.

## Responsive behavior

- Verify at minimum 1440 px, 768 px, 390 px, and 375 px.
- Header, workspace, guide detail, disclosures, toast, and bottom navigation must not overlap content.
- Interactive targets are at least 44×44 CSS px.
- Long messages, long status text, and Indonesian labels wrap without clipping.
- Mobile content includes bottom padding for the sticky navigation and safe area.
- Desktop uses one consistent content frame and gap rhythm. Adjacent panels align and avoid large empty bands.

## Accessibility

- Maintain semantic landmarks, heading order, labels, status live regions, descriptive alternative text, and keyboard operation.
- Focus indicators meet non-text contrast and remain visible in both themes.
- Text contrast meets WCAG AA; controls and meaningful graphics meet 3:1 where applicable.
- Drawer/dialog, disclosure, theme toggle, and mobile navigation expose correct role/name/state.
- Motion never gates content and respects reduced-motion.
- Status is communicated through icon/text/shape in addition to color.

## Copy

- Use concise, direct Indonesian; remove obsolete statements and duplicated instructions.
- Preserve factual limitations and do not invent model accuracy, linguistic endorsement, users, testimonials, or performance claims.
- Button labels name the action, for example “Mulai menerjemahkan”, “Coba lagi”, “Baca pesan”, and “Atur suara”.

## Technical constraints

- Keep the current plain HTML/CSS/JavaScript stack and Express server.
- Do not add a frontend framework, CSS framework, animation dependency, icon package, or test runner.
- Prefer inline/local SVG for the small icon set and brand mark; keep style and stroke consistent.
- Preserve existing uncommitted feature work and assets as the baseline.
- Do not change model files, prediction thresholds, model output labels, STT/TTS mechanisms, or MQTT contracts.

## States to verify

- Idle before start.
- Model loading, cached activation, switching, ready, failure, and retry.
- Camera ready, no hand, invalid hand count, low confidence, stable prediction, permission denied, unsupported browser, and camera switch failure.
- Empty and populated message; undo, space, clear, long message.
- Gesture and STT modes; STT unsupported/denied/interim/final.
- TTS disabled/enabled, training/communication, no Indonesian voice, speaking/stopped, auto-read.
- Guide loading/populated, search/filter empty result, selected detail, unavailable image fallback.
- MQTT failure remains non-blocking; no new delivery guarantee is claimed.
- Light theme, dark theme, system-following behavior, and stored preference.
- Reduced motion and keyboard-only operation.

## Verification seam

No test runner will be added. The agreed seam is:

1. JavaScript syntax checks for server and browser scripts.
2. Existing model-loader assertion script.
3. Taste/UI static lint and Impeccable detector for changed UI targets.
4. Server/static asset smoke checks.
5. Real-browser interaction and visual checks on desktop and mobile, including keyboard focus, theme switching, dialog/disclosure behavior, reduced motion, and representative loading/error/empty states where they can be simulated safely.
6. Camera, microphone, Indonesian voice availability, and live MQTT depend on browser hardware/services; document any part that cannot be fully exercised.

## Acceptance criteria

- [ ] Whole page uses the approved calm blue design system in light and dark themes.
- [ ] Beginner path from intro to explicit camera start and readable result is unambiguous.
- [ ] Existing translator, model switching, guide, STT, TTS, message, and MQTT behavior is preserved.
- [ ] Voice settings are grouped without hiding primary speech actions.
- [ ] Desktop guide detail and mobile accessible dialog/drawer both work and synchronize with stable predictions.
- [ ] Desktop navigation and mobile bottom navigation expose the three main destinations.
- [ ] All listed idle/loading/error/empty/disabled states remain clear and accessible.
- [ ] Copy reflects available alphabet photos and retains the guide limitation disclaimer.
- [ ] Light/dark/system theme preference works and persists correctly.
- [ ] Motion is subtle, does not delay tasks, and respects reduced motion.
- [ ] Layout passes visual review at 1440, 768, 390, and 375 px without overlap or horizontal overflow.
- [ ] Syntax checks, assertions, static checks, and available browser smoke tests pass.
- [ ] Code review has no unresolved correctness, accessibility, security, or regression findings.

## Direction contract

**THESIS:** Isyarat is a calm translation workspace whose next action and recognition state are always obvious. It refuses the oversized marketing hero and equally weighted control panels that make a working tool feel like a brochure.

**OWN-WORLD:** Pale blue-neutral ground, navy ink, white or deep-navy work surfaces, medium blue selections and actions, modest radii, quiet separators, one sans-serif family, and a small hand-landmark mark. Light and dark themes share the same semantic hierarchy.

**STORY:** A beginner understands what Isyarat does, starts translation knowingly, positions a hand using actionable feedback, verifies the token and message, then speaks or edits the result. The guide remains a nearby learning aid rather than a competing destination.

**FIRST VIEWPORT:** A compact header sits above a short intro and the beginning of the two-column translator workspace. The explicit start action is visible without scrolling at common desktop height. Camera state leads on the left; message and recognition state lead on the right. On mobile, the same sequence stacks above a persistent three-item bottom navigation.

**FORM:** Code-led Operate surface. The brief-pinned calm utility direction wins over catalog worlds; their useful discipline is retained only as strict status legibility and responsive prioritization. seed:f2fd925f22195654.

**FINISH:** unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
