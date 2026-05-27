# API Reference

## `<a11y-color-contrast-checker>`

A standalone, dependency-free Web Component for checking WCAG foreground/background
colour contrast ratios.

---

## HTML Attributes

| Attribute           | Type      | Default   | Description                                              |
| ------------------- | --------- | --------- | -------------------------------------------------------- |
| `foreground`        | string    | `#000000` | Initial foreground (text) colour                         |
| `background`        | string    | `#ffffff` | Initial background colour                                |
| `mode`              | string    | `all`     | Which result rows to show: `all` \| `text` \| `large-text` \| `ui` |
| `show-suggestions`  | boolean   | false     | Show colour correction suggestions                       |
| `readonly`          | boolean   | false     | Result-only mode; hides inputs and controls              |
| `hide-preview`      | boolean   | false     | Hide the colour preview block                            |
| `foreground-source` | selector  | —         | CSS selector for an external input to read foreground from |
| `background-source` | selector  | —         | CSS selector for an external input to read background from |
| `foreground-from`   | selector  | —         | CSS selector to read computed `color` from               |
| `background-from`   | selector  | —         | CSS selector to read computed `background-color` from    |
| `sample-source`     | selector  | —         | CSS selector to read both `color` and `background-color` |
| `auto-update`       | boolean   | false     | Re-check whenever the external source inputs change      |

### Example

```html
<a11y-color-contrast-checker
  foreground="#777777"
  background="#ffffff"
  mode="all"
  show-suggestions
></a11y-color-contrast-checker>
```

---

## CSS Custom Properties

| Property                                    | Default          | Purpose                         |
| ------------------------------------------- | ---------------- | ------------------------------- |
| `--a11y-contrast-checker-font-family`       | system-ui        | Component font                  |
| `--a11y-contrast-checker-background`        | `#ffffff`        | Component panel background      |
| `--a11y-contrast-checker-foreground`        | `#1a1a1a`        | Component text colour           |
| `--a11y-contrast-checker-border-color`      | `#d0d0d0`        | Border / divider colour         |
| `--a11y-contrast-checker-radius`            | `8px`            | Border radius                   |
| `--a11y-contrast-checker-focus-ring`        | `#0057b8`        | Focus outline colour            |
| `--a11y-contrast-checker-pass-color`        | `#006600`        | Pass badge text colour          |
| `--a11y-contrast-checker-pass-bg`           | `#e8f5e9`        | Pass badge background           |
| `--a11y-contrast-checker-fail-color`        | `#a30000`        | Fail badge text colour          |
| `--a11y-contrast-checker-fail-bg`           | `#fff0f0`        | Fail badge background           |
| `--a11y-contrast-checker-warning-color`     | `#a30000`        | Error message colour            |

---

## Part Attributes (::part())

| Part         | Element                    |
| ------------ | -------------------------- |
| `container`  | Outer `<section>`          |
| `form`       | Input controls wrapper     |
| `field`      | Individual field wrapper   |
| `preview`    | Colour preview block       |
| `summary`    | Ratio output container     |
| `result-list`| `<ul>` of WCAG results     |
| `suggestions`| Suggestions `<section>`    |
| `error`      | Error message container    |
| `button`     | All `<button>` elements    |

### Example

```css
a11y-color-contrast-checker::part(container) {
  box-shadow: 0 2px 8px rgba(0,0,0,0.12);
}
a11y-color-contrast-checker::part(button) {
  font-weight: 700;
}
```

---

## JavaScript API

All methods are available directly on the element reference.

### `setColors({ foreground?, background? })`

Set one or both colours programmatically.

```js
const checker = document.querySelector('a11y-color-contrast-checker');
checker.setColors({ foreground: '#0057b8', background: '#ffffff' });
```

### `setForeground(color)`

Set the foreground colour only.

```js
checker.setForeground('#cc0000');
```

### `setBackground(color)`

Set the background colour only.

```js
checker.setBackground('#f0f8ff');
```

### `check()`

Re-run the calculation and return the current result object.

```js
const result = checker.check();
console.log(result.roundedRatio); // e.g. "4.52:1"
```

### `getResult()`

Return the current result object without recalculating.

```js
const result = checker.getResult();
```

### `suggestFixes()`

Return AA / AAA colour suggestions for the current colour pair.

```js
const fixes = checker.suggestFixes();
// fixes.foreground.aa, fixes.foreground.aaa
// fixes.background.aa, fixes.background.aaa
```

### `reset()`

Reset inputs to initial attribute values (or defaults).

```js
checker.reset();
```

---

## Result Object Shape

```js
{
  foreground: '#777777',
  background: '#ffffff',
  ratio: 4.478,
  roundedRatio: '4.48:1',
  normalText: { aa: false, aaa: false },
  largeText:  { aa: true,  aaa: false },
  ui:         { aa: true },
  // Only present when show-suggestions is set:
  suggestions: {
    foreground: { aa: '#767676', aaa: '#595959' },
    background: { aa: '#ffffff', aaa: '#f7f7f7' }
  }
}
```

---

## Supported Colour Formats

- `#rgb` — short hex
- `#rrggbb` — long hex
- `#rrggbbaa` — hex with alpha
- `rgb(r, g, b)` — RGB
- `rgba(r, g, b, a)` — RGB with alpha
- `hsl(h, s%, l%)` — HSL
- `hsla(h, s%, l%, a)` — HSL with alpha
- Named CSS colours (e.g. `red`, `cornflowerblue`) where the browser can parse them
