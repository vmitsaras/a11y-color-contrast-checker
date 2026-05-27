# Custom Events

All events bubble and are composed so they can be heard from outside Shadow DOM.

---

## `a11y-contrast-change`

Fired every time a valid contrast result is calculated.

**`event.detail`**

```js
{
  result: {
    foreground: string,   // e.g. '#777777'
    background: string,   // e.g. '#ffffff'
    ratio: number,        // raw ratio
    roundedRatio: string, // e.g. '4.48:1'
    normalText: { aa: boolean, aaa: boolean },
    largeText:  { aa: boolean, aaa: boolean },
    ui:         { aa: boolean }
  }
}
```

**Example**

```js
document.addEventListener('a11y-contrast-change', (e) => {
  console.log('Ratio:', e.detail.result.roundedRatio);
  console.log('Normal AA:', e.detail.result.normalText.aa);
});
```

---

## `a11y-contrast-error`

Fired when a colour cannot be parsed, a source element is missing, or a background
is transparent.

**`event.detail`**

```js
{
  error: 'foreground' | 'background' | 'source' | 'transparent',
  message: string,      // Human-readable description
  foreground?: string,
  background?: string,
  selector?: string,    // For source errors
  role?: string         // 'foreground' | 'background'
}
```

---

## `a11y-contrast-apply-suggestion`

Fired when the user clicks an **Apply** button in the suggestions panel.

**`event.detail`**

```js
{
  color: string,             // The suggested colour that was applied, e.g. '#595959'
  type: 'foreground' | 'background',
  result: object | null      // Result after applying the suggestion
}
```

---

## `a11y-contrast-copy`

Fired when the user clicks a **Copy** button in the suggestions panel.

**`event.detail`**

```js
{
  color: string   // The colour that was copied, e.g. '#595959'
}
```

---

## Listening from outside Shadow DOM

Because all events are `composed: true` and `bubbles: true`, you can listen on
`document` or any ancestor:

```js
document.addEventListener('a11y-contrast-change', (e) => {
  // e.target is the <a11y-color-contrast-checker> element
  console.log(e.target, e.detail);
});
```

Or on the element itself:

```js
const checker = document.querySelector('a11y-color-contrast-checker');
checker.addEventListener('a11y-contrast-change', (e) => {
  updateMyUI(e.detail.result);
});
```
