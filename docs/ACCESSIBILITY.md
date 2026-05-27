# Accessibility Notes

## Semantic HTML

The component uses semantic HTML elements throughout:

- `<section>` as the outer wrapper
- `<h2>` for the component heading
- `<label>` elements properly associated with every input
- `<output>` for the ratio display
- `<ul>` / `<li>` for the results list
- `<button>` for all interactive controls
- `<code>` for colour hex values in suggestions

No clickable `<div>` elements are used.

---

## Keyboard Navigation

All interactive controls are reachable via the Tab key in a logical order:

1. Foreground text input
2. Foreground colour picker
3. Background text input
4. Background colour picker
5. Swap colours button
6. Reset button
7. Suggestion Apply buttons (if visible)
8. Suggestion Copy buttons (if visible)

No custom keyboard handling is applied; standard browser tab order is preserved.

---

## Focus Styles

Focus outlines are always visible and use the `--a11y-contrast-checker-focus-ring`
custom property (default `#0057b8`). They are never removed without replacement.

---

## Screen Reader Announcements

- A `aria-live="polite"` region (visually hidden) is updated after each valid
  calculation with a summary such as:
  > "Contrast ratio 4.48:1. Normal text: AA fail, AAA fail. Large text: AA pass,
  >  AAA fail. UI: AA pass."
- Announcements are debounced (400 ms) so rapid typing does not flood the
  screen reader with partial results.
- When a suggestion is applied or a colour is copied, a brief confirmation
  message is announced.
- The error container uses `role="alert"` for immediate announcements.

---

## Colour-Only Indicators

Pass / fail states are never communicated by colour alone:

- Result badges show the text **Pass** or **Fail** in addition to green / red backgrounds.
- The colour pair preview (`aria-hidden="true"`) is supplementary only.

---

## Error Messages

Invalid colour inputs produce a visible, understandable error message in the
`role="alert"` container. Errors explain which field failed and why.

---

## Readonly Mode

When the `readonly` attribute is set, all inputs are disabled or set to
`readOnly`, and the Swap / Reset buttons are hidden. The component still
displays all results and suggestions but does not accept user interaction.

---

## Known Limitations

- **Semi-transparent foregrounds** are composited onto the background before
  calculating contrast. Partially transparent text over complex backgrounds
  may produce imprecise results.
- **Transparent backgrounds** are rejected with a clear error — they cannot be
  contrast-checked without knowing the underlying content colour.
- **APCA** (Advanced Perceptual Contrast Algorithm) is not implemented; only
  WCAG 2.x relative-luminance contrast is calculated.
- **CSS variables and `oklch()`** are not parsed directly; they must be resolved
  to a concrete colour value before being passed to the component.
- Named colour parsing relies on a hidden `<canvas>` context; environments
  without canvas support (e.g. some server-side rendering setups) will not
  resolve named colours.

---

## Testing Checklist

Manual testing should verify:

- [ ] All inputs reachable by Tab
- [ ] Focus outlines visible on every focusable element
- [ ] Screen reader announces ratio + pass/fail after colour change
- [ ] Screen reader does not spam during rapid typing
- [ ] Error message announced immediately on invalid input
- [ ] Suggestion Apply / Copy buttons announced correctly
- [ ] `readonly` mode: no editable controls focusable
- [ ] `hide-preview` does not break results
- [ ] `mode` attribute shows only the relevant rows
- [ ] External source integration does not interfere with host page focus
