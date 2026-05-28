# a11y-color-contrast-checker

A standalone, dependency-free Web Component for checking WCAG color contrast
between foreground and background colors.

It is built with native Web Components + Shadow DOM (no React/Vue/Lit runtime),
and supports both interactive input and programmatic usage.

[Open the demo](https://vmitsaras.github.io/a11y-color-contrast-checker/)

## Features

- WCAG ratio calculation with pass/fail statuses for normal text AA/AAA,
  large text AA/AAA, and UI/non-text AA
- Supports common CSS color formats: hex, rgb/rgba, hsl/hsla, named colors
- Optional suggestion engine for AA/AAA-compliant color alternatives
- Accessible UI with labels, live region announcements, and visible focus styles
- Custom events for integration with host applications
- External source modes (bind to other inputs/elements and auto-update)

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

Vite will start a local dev server for [index.html](index.html).

## Build

```bash
npm run build
```

Production output is generated in docs/.

## Preview Production Build

```bash
npm run preview
```

## GitHub Pages (Deploy From A Branch)

This repository is ready for GitHub Pages using the built-in branch source:

1. Go to Settings -> Pages.
2. Under Build and deployment, set Source to Deploy from a branch.
3. Select Branch: main and Folder: /docs.
4. Save and wait a few minutes for publishing.

Published URL:

- https://vmitsaras.github.io/a11y-color-contrast-checker/

Notes:

- The Pages entry file is docs/index.html.
- The Pages demo module is docs/a11y-color-contrast-checker.js (built from src/).
- Rebuild the docs bundle after component changes:

```bash
npm run build
```

## Basic Usage

Import the component module once, then use the custom element in HTML.

```html
<script type="module">
	import './src/a11y-color-contrast-checker.js';
</script>

<a11y-color-contrast-checker
	foreground="#777777"
	background="#ffffff"
	mode="all"
	show-suggestions
></a11y-color-contrast-checker>
```

## JavaScript API

```js
const checker = document.querySelector('a11y-color-contrast-checker');

checker.setForeground('#0057b8');
checker.setBackground('#ffffff');

const result = checker.check();
console.log(result.roundedRatio); // e.g. "4.52:1"
```

Available methods:

- setColors({ foreground?, background? })
- setForeground(color)
- setBackground(color)
- check()
- getResult()
- suggestFixes()
- reset()

## Attributes

Common attributes:

- foreground
- background
- mode: all | text | large-text | ui
- show-suggestions
- readonly
- hide-preview
- foreground-source / background-source
- foreground-from / background-from / sample-source
- auto-update

See full details in [docs/API.md](docs/API.md).

## Events

The component dispatches bubbling + composed custom events:

- a11y-contrast-change
- a11y-contrast-error
- a11y-contrast-apply-suggestion
- a11y-contrast-copy

Event payloads are documented in [docs/EVENTS.md](docs/EVENTS.md).

## Accessibility Notes

Accessibility design and checks are documented in
[docs/ACCESSIBILITY.md](docs/ACCESSIBILITY.md).

## Project Structure

- [src/a11y-color-contrast-checker.js](src/a11y-color-contrast-checker.js): Custom element implementation
- [src/color-utils.js](src/color-utils.js): Color parsing and conversions
- [src/contrast-utils.js](src/contrast-utils.js): WCAG contrast math and thresholds
- [src/suggestion-utils.js](src/suggestion-utils.js): Suggested color calculation logic
- [src/styles.css](src/styles.css): Shadow DOM component styles
- [demo/index.html](demo/index.html): Minimal demo page
- [index.html](index.html): Vite dev/demo entry

## License

MIT

## Releasing

For npm publishing and Git tag versioning steps, see [RELEASE.md](RELEASE.md).