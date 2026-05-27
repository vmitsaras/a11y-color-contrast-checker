/**
 * a11y-color-contrast-checker.js
 *
 * <a11y-color-contrast-checker> — Standalone accessible Web Component for
 * checking WCAG foreground/background colour contrast ratios.
 *
 * Features:
 *  - Internal colour inputs (text + native colour picker)
 *  - Foreground / background attribute initialisation
 *  - mode attribute: 'all' | 'text' | 'large-text' | 'ui'
 *  - show-suggestions, readonly, hide-preview attributes
 *  - External source selectors (foreground-source, background-source)
 *  - Computed-style source selectors (foreground-from, background-from, sample-source)
 *  - auto-update attribute
 *  - Full JavaScript API
 *  - Custom events that bubble + are composed
 *  - Accessible: live region, visible focus, no colour-only indicators
 */

import styles from './styles.css?inline';
import { evaluateContrast } from './contrast-utils.js';
import { getSuggestions } from './suggestion-utils.js';
import { parseColor, rgbToHex } from './color-utils.js';

const DEBOUNCE_MS = 400;

// ── helpers ──────────────────────────────────────────────────────────────────

function hexFromParsed(rgb) {
  return rgbToHex({ r: rgb.r, g: rgb.g, b: rgb.b });
}

// ── component ─────────────────────────────────────────────────────────────────

class A11yColorContrastChecker extends HTMLElement {
  // ---- lifecycle -------------------------------------------------------

  static get observedAttributes() {
    return [
      'foreground',
      'background',
      'mode',
      'show-suggestions',
      'readonly',
      'hide-preview',
      'foreground-source',
      'background-source',
      'foreground-from',
      'background-from',
      'sample-source',
      'auto-update'
    ];
  }

  constructor() {
    super();
    this._shadow = this.attachShadow({ mode: 'open' });
    /** @type {object|null} */
    this._result = null;
    this._debounceTimer = null;
    /** @type {Array<{el: Element, events: string[], handler: Function}>} */
    this._sourceListeners = [];
    this._initialized = false;
    this._mode = 'all';
  }

  connectedCallback() {
    this._render();
    this._bindInternalEvents();
    this._initFromAttributes();
    this._setupExternalSources();
    this._initialized = true;
  }

  disconnectedCallback() {
    this._cleanupSourceListeners();
    if (this._debounceTimer) clearTimeout(this._debounceTimer);
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (!this._initialized || oldVal === newVal) return;
    this._handleAttributeChange(name, newVal);
  }

  // ---- rendering -------------------------------------------------------

  _render() {
    this._shadow.innerHTML = `
<style>${styles}</style>
<section part="container">
  <h2 class="checker-heading">Color Contrast Checker</h2>

  <div part="form" class="form">
    <div part="field" class="field">
      <label for="fg-text">Foreground color</label>
      <div class="field-row">
        <input type="text"  id="fg-text"  name="foreground"
               autocomplete="off" spellcheck="false"
               placeholder="#000000" value="#000000" />
        <input type="color" id="fg-color" value="#000000"
               aria-label="Foreground color picker" />
      </div>
    </div>

    <div part="field" class="field">
      <label for="bg-text">Background color</label>
      <div class="field-row">
        <input type="text"  id="bg-text"  name="background"
               autocomplete="off" spellcheck="false"
               placeholder="#ffffff" value="#ffffff" />
        <input type="color" id="bg-color" value="#ffffff"
               aria-label="Background color picker" />
      </div>
    </div>

    <div class="button-row">
      <button type="button" id="swap-btn"  part="button">⇄ Swap colors</button>
      <button type="button" id="reset-btn" part="button">Reset</button>
    </div>
  </div>

  <div part="preview" id="preview" class="preview" aria-hidden="true">
    <span class="preview-text-normal">Sample text Aa</span>
    <span class="preview-text-large">Large Aa</span>
  </div>

  <div part="summary" class="summary">
    <output id="ratio-output" class="ratio-value" aria-label="Contrast ratio">—</output>
    <span class="ratio-label" id="ratio-label"></span>
  </div>

  <ul part="result-list" class="results-list" aria-label="WCAG contrast results">
    <li class="result-row" data-check="normal-aa">
      <span class="result-label">Normal text AA (4.5:1)</span>
      <span id="r-normal-aa" class="result-status" aria-label="Normal text AA status">—</span>
    </li>
    <li class="result-row" data-check="normal-aaa">
      <span class="result-label">Normal text AAA (7:1)</span>
      <span id="r-normal-aaa" class="result-status" aria-label="Normal text AAA status">—</span>
    </li>
    <li class="result-row" data-check="large-aa">
      <span class="result-label">Large text AA (3:1)</span>
      <span id="r-large-aa" class="result-status" aria-label="Large text AA status">—</span>
    </li>
    <li class="result-row" data-check="large-aaa">
      <span class="result-label">Large text AAA (4.5:1)</span>
      <span id="r-large-aaa" class="result-status" aria-label="Large text AAA status">—</span>
    </li>
    <li class="result-row" data-check="ui-aa">
      <span class="result-label">UI / non-text AA (3:1)</span>
      <span id="r-ui-aa" class="result-status" aria-label="UI components AA status">—</span>
    </li>
  </ul>

  <section part="suggestions" id="suggestions-section"
           class="suggestions-section" hidden
           aria-label="Suggested color corrections">
    <h3>Suggested color corrections</h3>
    <div id="suggestions-content"></div>
  </section>

  <div part="error" id="error-container" class="error-container"
       role="alert" hidden></div>

  <div id="live-region" aria-live="polite" aria-atomic="true"
       class="visually-hidden"></div>
</section>`;

    // Cache frequently-used element references
    const $ = (id) => this._shadow.getElementById(id);
    this._els = {
      fgText:   this._shadow.querySelector('#fg-text'),
      fgColor:  this._shadow.querySelector('#fg-color'),
      bgText:   this._shadow.querySelector('#bg-text'),
      bgColor:  this._shadow.querySelector('#bg-color'),
      swapBtn:  $('swap-btn'),
      resetBtn: $('reset-btn'),
      preview:  $('preview'),
      ratioOutput:       $('ratio-output'),
      ratioLabel:        $('ratio-label'),
      rNormalAA:         $('r-normal-aa'),
      rNormalAAA:        $('r-normal-aaa'),
      rLargeAA:          $('r-large-aa'),
      rLargeAAA:         $('r-large-aaa'),
      rUiAA:             $('r-ui-aa'),
      suggestionsSection:$('suggestions-section'),
      suggestionsContent:$('suggestions-content'),
      errorContainer:    $('error-container'),
      liveRegion:        $('live-region')
    };
  }

  // ---- internal events -------------------------------------------------

  _bindInternalEvents() {
    const e = this._els;

    // Text inputs — debounced
    e.fgText.addEventListener('input', () => this._debouncedCalculate());
    e.bgText.addEventListener('input', () => this._debouncedCalculate());

    // Colour pickers — immediate sync to text input then calculate
    e.fgColor.addEventListener('input', (ev) => {
      e.fgText.value = ev.target.value;
      this._calculate();
    });
    e.bgColor.addEventListener('input', (ev) => {
      e.bgText.value = ev.target.value;
      this._calculate();
    });

    // On text input blur/change — sync picker if colour is valid
    e.fgText.addEventListener('change', () => this._syncPicker('fg'));
    e.bgText.addEventListener('change', () => this._syncPicker('bg'));

    // Buttons
    e.swapBtn.addEventListener('click',  () => this._swapColors());
    e.resetBtn.addEventListener('click', () => this.reset());
  }

  _syncPicker(which) {
    const text  = this._els[`${which}Text`];
    const color = this._els[`${which}Color`];
    const parsed = parseColor(text.value);
    if (parsed) color.value = hexFromParsed(parsed);
  }

  // ---- debounce --------------------------------------------------------

  _debouncedCalculate() {
    if (this._debounceTimer) clearTimeout(this._debounceTimer);
    this._debounceTimer = setTimeout(() => this._calculate(), DEBOUNCE_MS);
  }

  // ---- attribute initialisation ----------------------------------------

  _initFromAttributes() {
    const fg = this.getAttribute('foreground') || '#000000';
    const bg = this.getAttribute('background') || '#ffffff';
    this._mode = this.getAttribute('mode') || 'all';

    this._setInputs(fg, bg);

    if (this.hasAttribute('readonly'))     this._applyReadonly(true);
    if (this.hasAttribute('hide-preview')) this._els.preview.hidden = true;

    this._calculate();
  }

  _setInputs(fg, bg) {
    const e = this._els;
    e.fgText.value = fg;
    e.bgText.value = bg;
    const fgP = parseColor(fg);
    const bgP = parseColor(bg);
    if (fgP) e.fgColor.value = hexFromParsed(fgP);
    if (bgP) e.bgColor.value = hexFromParsed(bgP);
  }

  // ---- attribute changes -----------------------------------------------

  _handleAttributeChange(name, value) {
    const e = this._els;
    switch (name) {
      case 'foreground': {
        const fg = value || '#000000';
        e.fgText.value = fg;
        const p = parseColor(fg);
        if (p) e.fgColor.value = hexFromParsed(p);
        this._calculate();
        break;
      }
      case 'background': {
        const bg = value || '#ffffff';
        e.bgText.value = bg;
        const p = parseColor(bg);
        if (p) e.bgColor.value = hexFromParsed(p);
        this._calculate();
        break;
      }
      case 'mode':
        this._mode = value || 'all';
        this._applyModeVisibility();
        break;
      case 'show-suggestions':
        this._calculate();
        break;
      case 'readonly':
        this._applyReadonly(value !== null);
        break;
      case 'hide-preview':
        e.preview.hidden = value !== null;
        break;
      case 'foreground-source':
      case 'background-source':
      case 'foreground-from':
      case 'background-from':
      case 'sample-source':
      case 'auto-update':
        this._setupExternalSources();
        break;
    }
  }

  _applyReadonly(isReadonly) {
    const e = this._els;
    e.fgText.readOnly  = isReadonly;
    e.bgText.readOnly  = isReadonly;
    e.fgColor.disabled = isReadonly;
    e.bgColor.disabled = isReadonly;
    e.swapBtn.hidden   = isReadonly;
    e.resetBtn.hidden  = isReadonly;
  }

  // ---- calculation & UI update -----------------------------------------

  _calculate() {
    const fg = this._els.fgText.value.trim();
    const bg = this._els.bgText.value.trim();
    if (!fg || !bg) return;

    const result = evaluateContrast(fg, bg);

    if (result.error) {
      this._showError(result.message);
      this._result = null;
      this._dispatchEvent('a11y-contrast-error', {
        error: result.error,
        message: result.message,
        foreground: fg,
        background: bg
      });
      return;
    }

    this._hideError();

    // Attach suggestions if requested
    if (this.hasAttribute('show-suggestions')) {
      result.suggestions = getSuggestions(fg, bg);
    }

    this._result = result;
    this._updateUI(result);
    this._dispatchEvent('a11y-contrast-change', { result: { ...result } });
  }

  _updateUI(result) {
    const e = this._els;
    const { foreground, background, roundedRatio, normalText, largeText, ui } = result;

    // Preview colours
    e.preview.style.color           = foreground;
    e.preview.style.backgroundColor = background;

    // Contrast ratio
    e.ratioOutput.textContent = roundedRatio;
    e.ratioLabel.textContent  = 'contrast ratio';

    // Pass / fail indicators
    this._setStatus(e.rNormalAA,  normalText.aa);
    this._setStatus(e.rNormalAAA, normalText.aaa);
    this._setStatus(e.rLargeAA,   largeText.aa);
    this._setStatus(e.rLargeAAA,  largeText.aaa);
    this._setStatus(e.rUiAA,      ui.aa);

    // Mode-specific visibility
    this._applyModeVisibility();

    // Suggestions panel
    if (this.hasAttribute('show-suggestions') && result.suggestions) {
      this._renderSuggestions(result.suggestions, result);
    } else {
      e.suggestionsSection.hidden = true;
    }

    // Sync pickers in case value came from attribute / API
    const fgP = parseColor(foreground);
    const bgP = parseColor(background);
    if (fgP) e.fgColor.value = hexFromParsed(fgP);
    if (bgP) e.bgColor.value = hexFromParsed(bgP);

    // Announce to screen readers
    this._announce(this._buildAnnouncement(result));
  }

  _setStatus(el, passes) {
    el.textContent = passes ? 'Pass' : 'Fail';
    el.className   = `result-status ${passes ? 'pass' : 'fail'}`;
  }

  _applyModeVisibility() {
    const show = {
      all:        ['normal-aa', 'normal-aaa', 'large-aa', 'large-aaa', 'ui-aa'],
      text:       ['normal-aa', 'normal-aaa'],
      'large-text': ['large-aa', 'large-aaa'],
      ui:         ['ui-aa']
    }[this._mode] || ['normal-aa', 'normal-aaa', 'large-aa', 'large-aaa', 'ui-aa'];

    this._shadow.querySelectorAll('.result-row').forEach((row) => {
      row.hidden = !show.includes(row.dataset.check);
    });
  }

  _buildAnnouncement(result) {
    const p = (b) => (b ? 'pass' : 'fail');
    const { roundedRatio, normalText, largeText, ui } = result;
    return (
      `Contrast ratio ${roundedRatio}. ` +
      `Normal text: AA ${p(normalText.aa)}, AAA ${p(normalText.aaa)}. ` +
      `Large text: AA ${p(largeText.aa)}, AAA ${p(largeText.aaa)}. ` +
      `UI: AA ${p(ui.aa)}.`
    );
  }

  _announce(text) {
    const lr = this._els.liveRegion;
    // Clear first, then set — ensures re-announcement even if text is identical
    lr.textContent = '';
    requestAnimationFrame(() => { lr.textContent = text; });
  }

  // ---- suggestions -------------------------------------------------------

  _renderSuggestions(suggestions, result) {
    const section = this._els.suggestionsSection;
    const content = this._els.suggestionsContent;

    const items = [];

    if (!result.normalText.aa && suggestions.foreground.aa)
      items.push({ label: 'Foreground AA',  color: suggestions.foreground.aa,  type: 'foreground', tier: 'AA'  });
    if (!result.normalText.aaa && suggestions.foreground.aaa)
      items.push({ label: 'Foreground AAA', color: suggestions.foreground.aaa, type: 'foreground', tier: 'AAA' });
    if (!result.normalText.aa && suggestions.background.aa)
      items.push({ label: 'Background AA',  color: suggestions.background.aa,  type: 'background', tier: 'AA'  });
    if (!result.normalText.aaa && suggestions.background.aaa)
      items.push({ label: 'Background AAA', color: suggestions.background.aaa, type: 'background', tier: 'AAA' });

    if (items.length === 0) { section.hidden = true; return; }

    content.innerHTML = items
      .map(
        (item) => `
<div class="suggestion-item">
  <span class="suggestion-swatch"
        style="background:${_escAttr(item.color)}"
        aria-hidden="true"></span>
  <span class="suggestion-label">${_escText(item.label)}:</span>
  <code  class="suggestion-color">${_escText(item.color)}</code>
  <div class="suggestion-actions">
    <button type="button"
            data-action="apply"
            data-type="${_escAttr(item.type)}"
            data-color="${_escAttr(item.color)}"
            part="button"
            aria-label="Apply ${_escAttr(item.color)} as ${_escAttr(item.type)} color">Apply</button>
    <button type="button"
            data-action="copy"
            data-color="${_escAttr(item.color)}"
            part="button"
            aria-label="Copy color ${_escAttr(item.color)}">Copy</button>
  </div>
</div>`
      )
      .join('');

    // Bind suggestion button clicks
    content.querySelectorAll('[data-action]').forEach((btn) => {
      btn.addEventListener('click', (ev) => this._onSuggestionAction(ev));
    });

    section.hidden = false;
  }

  _onSuggestionAction(ev) {
    const btn    = ev.currentTarget;
    const action = btn.dataset.action;
    const color  = btn.dataset.color;
    const type   = btn.dataset.type;

    if (action === 'apply') {
      const parsed = parseColor(color);
      if (type === 'foreground') {
        this._els.fgText.value = color;
        if (parsed) this._els.fgColor.value = hexFromParsed(parsed);
      } else {
        this._els.bgText.value = color;
        if (parsed) this._els.bgColor.value = hexFromParsed(parsed);
      }
      this._calculate();
      this._announce(`Applied ${color} as ${type} color.`);
      this._dispatchEvent('a11y-contrast-apply-suggestion', {
        color, type, result: this._result ? { ...this._result } : null
      });
    } else if (action === 'copy') {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(color).then(
          ()  => { this._announce(`Copied ${color}.`); },
          ()  => { this._announce(`Copy failed. Color is ${color}.`); }
        );
      } else {
        this._announce(`Color is ${color}.`);
      }
      this._dispatchEvent('a11y-contrast-copy', { color });
    }
  }

  // ---- error handling --------------------------------------------------

  _showError(message) {
    const ec = this._els.errorContainer;
    ec.textContent = message;
    ec.hidden = false;
    this._clearResults();
  }

  _hideError() {
    const ec = this._els.errorContainer;
    ec.textContent = '';
    ec.hidden = true;
  }

  _clearResults() {
    const e = this._els;
    e.ratioOutput.textContent = '—';
    e.ratioLabel.textContent  = '';
    [e.rNormalAA, e.rNormalAAA, e.rLargeAA, e.rLargeAAA, e.rUiAA].forEach((el) => {
      el.textContent = '—';
      el.className   = 'result-status';
    });
    e.suggestionsSection.hidden = true;
  }

  // ---- swap ------------------------------------------------------------

  _swapColors() {
    const e   = this._els;
    const fg  = e.fgText.value;
    const bg  = e.bgText.value;
    const fgC = e.fgColor.value;
    const bgC = e.bgColor.value;
    e.fgText.value  = bg;
    e.bgText.value  = fg;
    e.fgColor.value = bgC;
    e.bgColor.value = fgC;
    this._calculate();
  }

  // ---- external sources ------------------------------------------------

  _setupExternalSources() {
    this._cleanupSourceListeners();

    const auto = this.hasAttribute('auto-update');

    const fgSource    = this.getAttribute('foreground-source');
    const bgSource    = this.getAttribute('background-source');
    const fgFrom      = this.getAttribute('foreground-from');
    const bgFrom      = this.getAttribute('background-from');
    const sampleSrc   = this.getAttribute('sample-source');

    if (fgSource)  this._bindInputSource(fgSource, 'foreground', auto);
    if (bgSource)  this._bindInputSource(bgSource, 'background', auto);
    if (fgFrom)    this._readComputedStyle(fgFrom, 'foreground', 'color');
    if (bgFrom)    this._readComputedStyle(bgFrom, 'background', 'backgroundColor');
    if (sampleSrc) {
      this._readComputedStyle(sampleSrc, 'foreground', 'color');
      this._readComputedStyle(sampleSrc, 'background', 'backgroundColor');
    }
  }

  _bindInputSource(selector, role, autoUpdate) {
    const el = document.querySelector(selector);
    if (!el) {
      this._dispatchEvent('a11y-contrast-error', {
        error: 'source',
        message: `Source element "${selector}" was not found.`,
        selector, role
      });
      return;
    }

    // Read current value
    this._readValueFromElement(el, role);

    if (autoUpdate) {
      const handler = () => this._readValueFromElement(el, role);
      ['input', 'change'].forEach((evt) => el.addEventListener(evt, handler));
      this._sourceListeners.push({ el, events: ['input', 'change'], handler });
    }
  }

  _readValueFromElement(el, role) {
    const value = ('value' in el ? el.value : el.textContent || '').trim();
    if (!value) return;
    this._applyColor(value, role);
    this._calculate();
  }

  _readComputedStyle(selector, role, property) {
    const el = document.querySelector(selector);
    if (!el) {
      this._dispatchEvent('a11y-contrast-error', {
        error: 'source',
        message: `Element "${selector}" was not found for computed style reading.`,
        selector, role
      });
      return;
    }
    const computed = getComputedStyle(el)[property];
    if (!computed || computed === 'transparent' || /rgba\(\s*0,\s*0,\s*0,\s*0\s*\)/.test(computed)) {
      this._dispatchEvent('a11y-contrast-error', {
        error: 'transparent',
        message: `Element "${selector}" has a transparent ${role} color — cannot check contrast.`,
        selector, role
      });
      return;
    }
    this._applyColor(computed, role);
    this._calculate();
  }

  _applyColor(value, role) {
    const e = this._els;
    const parsed = parseColor(value);
    if (role === 'foreground') {
      e.fgText.value = value;
      if (parsed) e.fgColor.value = hexFromParsed(parsed);
    } else {
      e.bgText.value = value;
      if (parsed) e.bgColor.value = hexFromParsed(parsed);
    }
  }

  _cleanupSourceListeners() {
    this._sourceListeners.forEach(({ el, events, handler }) => {
      events.forEach((evt) => el.removeEventListener(evt, handler));
    });
    this._sourceListeners = [];
  }

  // ---- public API -------------------------------------------------------

  /**
   * Set both foreground and background colours.
   * @param {{ foreground?: string, background?: string }} options
   */
  setColors({ foreground, background } = {}) {
    if (foreground !== undefined) this._applyColor(foreground, 'foreground');
    if (background !== undefined) this._applyColor(background, 'background');
    this._calculate();
  }

  /**
   * Set the foreground colour.
   * @param {string} color
   */
  setForeground(color) {
    this._applyColor(color, 'foreground');
    this._calculate();
  }

  /**
   * Set the background colour.
   * @param {string} color
   */
  setBackground(color) {
    this._applyColor(color, 'background');
    this._calculate();
  }

  /**
   * Re-run the contrast calculation and return the result.
   * @returns {object|null}
   */
  check() {
    this._calculate();
    return this._result ? { ...this._result } : null;
  }

  /**
   * Return a copy of the current result object.
   * @returns {object|null}
   */
  getResult() {
    return this._result ? { ...this._result } : null;
  }

  /**
   * Generate AA / AAA colour suggestions for the current colour pair.
   * @returns {object|null}
   */
  suggestFixes() {
    if (!this._result) return null;
    return getSuggestions(this._result.foreground, this._result.background);
  }

  /**
   * Reset inputs to attribute defaults (or #000000 / #ffffff).
   */
  reset() {
    const fg = this.getAttribute('foreground') || '#000000';
    const bg = this.getAttribute('background') || '#ffffff';
    this._setInputs(fg, bg);
    this._calculate();
  }

  // ---- event dispatch --------------------------------------------------

  _dispatchEvent(name, detail) {
    this.dispatchEvent(
      new CustomEvent(name, { bubbles: true, composed: true, detail })
    );
  }
}

// ── safety helpers ───────────────────────────────────────────────────────────

/** Escape a string for safe use as HTML text content. */
function _escText(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/** Escape a string for safe use inside an HTML attribute value. */
function _escAttr(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// ── register ─────────────────────────────────────────────────────────────────

if (!customElements.get('a11y-color-contrast-checker')) {
  customElements.define('a11y-color-contrast-checker', A11yColorContrastChecker);
}
