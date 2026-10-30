# Isyarat Design System

## Direction

Isyarat uses a calm utility design for a beginner-facing translation workspace. The interface prioritizes the explicit start action, camera/model state, assembled message, and recovery guidance. Expression comes from a restrained blue system and a hand-landmark mark rather than decorative effects.

## Color tokens

All interface colors use semantic CSS custom properties in `public/style.css`.

- `--bg`: page ground.
- `--surface`, `--surface-soft`, `--surface-strong`: increasing surface emphasis.
- `--text`, `--text-soft`: primary and supporting copy.
- `--primary`, `--primary-hover`, `--on-primary`: brand action, selection, and focus-adjacent emphasis.
- `--border`, `--border-strong`: structure and control boundaries.
- `--success`, `--warning`, `--danger`: semantic states only.
- `--focus`: keyboard focus ring.
- `--camera`, `--camera-text`: camera stage.

Light and dark mappings live under `:root` and `html[data-theme="dark"]`. Do not hardcode theme-specific colors in components. The initial mode follows the operating system until the user chooses light or dark; that choice persists in `localStorage`.

## Typography

Manrope is the sole interface family, with system sans-serif fallback. Use sentence case.

- Page title: fluid 44–78 px, weight 800, tight tracking.
- Section title: fluid 28–44 px, weight 700–800.
- Message result: fluid 21–30 px, weight 700.
- Body: 16 px / 1.55.
- Labels and statuses: 13–14 px, weight 600–700.
- Confidence and changing measurements use tabular numerals.

Avoid uppercase tracking, decorative monospace, and oversized marketing typography inside the workspace.

## Layout

The global frame is capped at 1240 px with equal margins. Desktop uses a short intro followed by a two-column translator workspace. The camera leads; message and recognition state form the second column. At 1000 px the workspace stacks. At 700 px the workspace becomes edge-to-edge and mobile bottom navigation appears.

Section spacing is larger than spacing within a component. Adjacent panels share edges and one gap rhythm. Sticky controls must account for the 72 px desktop or 60 px mobile header. Mobile content and toasts reserve space for the bottom navigation and safe-area inset.

## Shape and depth

- Primary containers: 18–24 px radius.
- Controls and compact status surfaces: 8–12 px radius.
- Surfaces separate through tone and quiet borders.
- Shadows are reserved for floating UI: dialog, toast, and mobile navigation.
- No gradients, glass panels, glows, decorative blobs, or resting card shadows.

## Components

### Brand mark

The Isyarat mark is an authored line drawing of a hand and landmark points. Keep its stroke weight and medium-blue role consistent. It may appear in the header, footer, and camera idle state.

### Buttons

One filled primary action per task region. Secondary buttons use soft surfaces and borders. Destructive text actions use `--danger` without turning the whole surrounding panel red. Every control has visible hover, active, focus, disabled, and loading-related states.

### Status

Status combines text with a dot/shape and `data-state`; color never carries the meaning alone. Loading may pulse unless reduced motion is enabled. Preserve live-region semantics.

### Translator

The camera stage uses a dark field in both themes so video and landmarks remain legible. Before start, it explains that camera permission follows an explicit action. The assembled message receives more visual weight than token and confidence. Voice mode/auto-read live in a native disclosure; enable/read/stop remain visible.

### Guide

Desktop uses a sticky detail panel and a responsive catalog grid. Mobile hides the inline detail and opens a native modal dialog. The dialog must restore focus on every close path and scroll internally. Each detail presents authored alt text, instruction, hand count, motion, speech form, and available source credit.

### Mobile navigation

The bottom bar exposes Terjemahkan, Panduan, and Cara pakai. It appears at 700 px and below, respects safe areas, and never covers page content or toasts.

## Motion

Motion supports comprehension:

- 150–300 ms for control and state feedback.
- Short opacity/vertical reveal for major sections.
- Loading pulse for the status motif.
- Dialog uses native open/close behavior.

All content is visible without animation. `prefers-reduced-motion` removes travel and shortens transitions.

## Accessibility

- Body text targets WCAG AA contrast in both themes.
- Focus uses a 3 px ring with offset.
- Touch targets are at least 44 px.
- Use native buttons, inputs, selects, details, and dialog where possible.
- Keep heading order, labels, live regions, descriptive alternative text, and keyboard behavior intact.
- Do not announce every interim STT character; announce meaningful state changes and accepted results.

## Copy

Use direct Indonesian. Actions describe what happens: “Mulai menerjemahkan”, “Baca pesan”, “Coba muat model lagi”. Errors name the problem and recovery. Do not claim official linguistic validation, guaranteed recognition, model accuracy beyond the actual confidence reading, or unsupported product evidence.
