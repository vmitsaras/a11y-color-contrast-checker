# AGENTS.md

Guidelines for AI agents (Copilot Coding Agent, Codex, etc.) working on this project.

---

## Project Summary

`<a11y-color-contrast-checker>` is a standalone accessible Web Component that checks
WCAG colour contrast ratios. It is written in vanilla JavaScript using native Web
Components and Shadow DOM. No framework, no external runtime dependencies.

---

## Core Rules

1. **No external dependencies** — the runtime component must be dependency-free.
2. **No React, Vue, Svelte, Lit, or similar** — use native Web Components only.
3. **Vite is for development only** — it is listed under `devDependencies`.
4. **Separate concerns** — colour parsing lives in `color-utils.js`, contrast
   maths in `contrast-utils.js`, and suggestion logic in `suggestion-utils.js`.
5. **Keep utilities pure** — utility functions must not import from the component
   file and should have no side effects except where browser APIs are unavoidable
   (e.g., canvas for named-colour parsing).
6. **Shadow DOM first** — all internal markup and styles are scoped to Shadow DOM.

---

## File Responsibilities

| File                               | Responsibility                                         |
| ---------------------------------- | ------------------------------------------------------ |
| `src/color-utils.js`               | Parse CSS colour strings → `{r,g,b,alpha}`             |
| `src/contrast-utils.js`            | WCAG luminance + contrast ratio + result object        |
| `src/suggestion-utils.js`          | Binary-search lightness for AA / AAA suggestions       |
| `src/styles.css`                   | Shadow DOM styles; CSS custom props; part attributes   |
| `src/a11y-color-contrast-checker.js` | Custom element definition; all rendering + event logic |
| `demo/index.html`                  | Standalone demo (no build step required if using CDN)  |
| `index.html`                       | Vite dev server entry / richer demo                    |
| `docs/API.md`                      | Public attribute, method, and CSS API                  |
| `docs/EVENTS.md`                   | Custom event names, payloads, and usage                |
| `docs/ACCESSIBILITY.md`            | Accessibility design decisions and test checklist      |

---

## Coding Conventions

- ES modules (`type: "module"` in `package.json`).
- `const`/`let` only — no `var`.
- Private component methods are prefixed with `_`.
- HTML generated inside the component must escape user-controlled strings.
- Use `requestAnimationFrame` when clearing and re-setting the live region to
  ensure screen readers re-announce even identical text.
- Debounce text input at 400 ms before announcing via the live region.

---

## WCAG Thresholds

| Check           | Ratio |
| --------------- | ----: |
| Normal text AA  |   4.5 |
| Normal text AAA |   7.0 |
| Large text AA   |   3.0 |
| Large text AAA  |   4.5 |
| UI / non-text   |   3.0 |

These values live in `contrast-utils.js → THRESHOLDS`.

---

## Accessibility Rules

**Required:**
- `<label>` for every input
- `<button>` for every interactive action
- `aria-live="polite"` live region for results
- `role="alert"` for errors
- Visible focus styles — never remove them

**Forbidden:**
- Clickable `<div>` elements
- Icon-only buttons without an accessible name
- Placeholder-only labels
- Colour as the sole pass/fail indicator

---

## Development Commands

```bash
npm install        # install Vite dev dependency
npm run dev        # start Vite dev server
npm run build      # build library bundle to dist/
npm run preview    # preview the production build
```

---

## What NOT to Build

- APCA contrast algorithm (post-MVP)
- `oklch()`, `lab()`, or `display-p3` colour spaces (post-MVP)
- Batch palette checking
- Full colour design-token platform
- Any runtime dependencies beyond standard browser APIs
