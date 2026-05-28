const M = ":host{display:block;font-family:var(--a11y-contrast-checker-font-family, system-ui, -apple-system, sans-serif);font-size:1rem;line-height:1.5;color:var(--a11y-contrast-checker-foreground, #1a1a1a);background:var(--a11y-contrast-checker-background, #ffffff);border:1px solid var(--a11y-contrast-checker-border-color, #d0d0d0);border-radius:var(--a11y-contrast-checker-radius, 8px);padding:1.5rem;max-width:480px;box-sizing:border-box}:host([hidden]){display:none}*,*:before,*:after{box-sizing:border-box}.checker-heading{margin:0 0 1.25rem;font-size:1.25rem;font-weight:700}h3{margin:0 0 .75rem;font-size:1rem;font-weight:600}.form{margin-bottom:1rem}.field{display:flex;flex-direction:column;gap:.25rem;margin-bottom:.875rem}.field label{font-weight:600;font-size:.875rem}.field-row{display:flex;gap:.5rem;align-items:center}.field-row input[type=text]{flex:1}input[type=text]{width:100%;padding:.5rem .625rem;border:2px solid var(--a11y-contrast-checker-border-color, #c0c0c0);border-radius:calc(var(--a11y-contrast-checker-radius, 8px) / 2);font-size:.9375rem;font-family:monospace;color:inherit;background:var(--a11y-contrast-checker-background, #ffffff)}input[type=text]:focus{outline:3px solid var(--a11y-contrast-checker-focus-ring, #0057b8);outline-offset:2px;border-color:var(--a11y-contrast-checker-focus-ring, #0057b8)}input[type=text]:read-only{background:#f6f6f6;color:#555;cursor:default}input[type=color]{-webkit-appearance:none;-moz-appearance:none;appearance:none;width:2.75rem;height:2.5rem;border:2px solid var(--a11y-contrast-checker-border-color, #c0c0c0);border-radius:calc(var(--a11y-contrast-checker-radius, 8px) / 2);padding:2px;background:none;cursor:pointer;flex-shrink:0}input[type=color]:focus{outline:3px solid var(--a11y-contrast-checker-focus-ring, #0057b8);outline-offset:2px}input[type=color]:disabled{opacity:.5;cursor:default}button{padding:.4375rem .875rem;border:2px solid currentColor;border-radius:calc(var(--a11y-contrast-checker-radius, 8px) / 2);background:transparent;color:inherit;font-size:.875rem;font-family:inherit;cursor:pointer;line-height:1.4;transition:background .15s ease}button:focus{outline:3px solid var(--a11y-contrast-checker-focus-ring, #0057b8);outline-offset:2px}button:hover:not(:disabled){background:#0000000f}button:disabled{opacity:.5;cursor:default}.button-row{display:flex;flex-wrap:wrap;gap:.5rem}.preview{display:flex;align-items:center;justify-content:center;gap:1rem;padding:1.5rem;border-radius:calc(var(--a11y-contrast-checker-radius, 8px) / 2);border:2px solid var(--a11y-contrast-checker-border-color, #d0d0d0);margin-bottom:1.25rem;min-height:80px}.preview-text-normal{font-size:1rem}.preview-text-large{font-size:1.5rem;font-weight:700}.summary{margin-bottom:1.25rem;display:flex;align-items:baseline;gap:.5rem;flex-wrap:wrap}.ratio-value{font-size:2rem;font-weight:700;line-height:1;font-variant-numeric:tabular-nums}.ratio-label{font-size:.875rem;color:#555}.results-list{list-style:none;padding:0;margin:0 0 1.25rem;border-top:1px solid var(--a11y-contrast-checker-border-color, #e0e0e0)}.results-list li{display:flex;justify-content:space-between;align-items:center;padding:.5rem 0;border-bottom:1px solid var(--a11y-contrast-checker-border-color, #e0e0e0);gap:.5rem}.result-label{font-size:.9rem}.result-status{font-weight:700;font-size:.8125rem;padding:.125rem .5rem;border-radius:3px;white-space:nowrap;flex-shrink:0}.result-status.pass{color:var(--a11y-contrast-checker-pass-color, #006600);background:var(--a11y-contrast-checker-pass-bg, #e8f5e9)}.result-status.fail{color:var(--a11y-contrast-checker-fail-color, #a30000);background:var(--a11y-contrast-checker-fail-bg, #fff0f0)}.suggestions-section{padding-top:1rem;border-top:1px solid var(--a11y-contrast-checker-border-color, #e0e0e0);margin-bottom:.5rem}.suggestion-item{display:flex;align-items:center;gap:.5rem;padding:.5rem 0;border-bottom:1px solid var(--a11y-contrast-checker-border-color, #f0f0f0);flex-wrap:wrap}.suggestion-swatch{width:1.5rem;height:1.5rem;border-radius:3px;border:1px solid rgba(0,0,0,.2);flex-shrink:0}.suggestion-label{font-size:.875rem;font-weight:600;min-width:120px}.suggestion-color{font-family:monospace;font-size:.875rem;flex:1}.suggestion-actions{display:flex;gap:.25rem;flex-shrink:0}.suggestion-actions button{padding:.25rem .625rem;font-size:.75rem}.error-container{padding:.75rem 1rem;border-radius:calc(var(--a11y-contrast-checker-radius, 8px) / 2);border:2px solid var(--a11y-contrast-checker-warning-color, #a30000);color:var(--a11y-contrast-checker-warning-color, #a30000);background:#fff8f8;font-size:.9rem;margin-top:.5rem}.visually-hidden{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}";
function u(s) {
  if (!s || typeof s != "string") return null;
  const e = s.trim();
  return e ? e.startsWith("#") ? w(e) : /^rgba?\s*\(/i.test(e) ? S(e) : /^hsla?\s*\(/i.test(e) ? F(e) : z(e) : null;
}
function w(s) {
  let e = s.slice(1);
  if (e.length === 3 ? e = e[0] + e[0] + e[1] + e[1] + e[2] + e[2] : e.length === 4 && (e = e[0] + e[0] + e[1] + e[1] + e[2] + e[2] + e[3] + e[3]), e.length !== 6 && e.length !== 8 || !/^[0-9a-f]+$/i.test(e)) return null;
  const t = parseInt(e.slice(0, 2), 16), r = parseInt(e.slice(2, 4), 16), a = parseInt(e.slice(4, 6), 16), o = e.length === 8 ? parseInt(e.slice(6, 8), 16) / 255 : 1;
  return { r: t, g: r, b: a, alpha: o };
}
function S(s) {
  const e = s.match(
    /rgba?\(\s*([\d.]+%?)\s*[,\s]\s*([\d.]+%?)\s*[,\s]\s*([\d.]+%?)\s*(?:[,/]\s*([\d.]+%?))?\s*\)/i
  );
  if (!e) return null;
  const t = (i) => i.endsWith("%") ? Math.round(parseFloat(i) * 2.55) : +i, r = t(e[1]), a = t(e[2]), o = t(e[3]);
  if ([r, a, o].some(isNaN)) return null;
  let n = 1;
  return e[4] !== void 0 && (n = e[4].endsWith("%") ? parseFloat(e[4]) / 100 : +e[4]), {
    r: p(r, 0, 255),
    g: p(a, 0, 255),
    b: p(o, 0, 255),
    alpha: p(n, 0, 1)
  };
}
function F(s) {
  const e = s.match(
    /hsla?\(\s*([\d.]+(?:deg|rad|grad|turn)?)\s*[,\s]\s*([\d.]+%?)\s*[,\s]\s*([\d.]+%?)\s*(?:[,/]\s*([\d.]+%?))?\s*\)/i
  );
  if (!e) return null;
  let t = parseFloat(e[1]);
  /rad$/i.test(e[1]) ? t = t * 180 / Math.PI : /grad$/i.test(e[1]) ? t = t * 0.9 : /turn$/i.test(e[1]) && (t = t * 360), t = (t % 360 + 360) % 360;
  const r = parseFloat(e[2]) / 100, a = parseFloat(e[3]) / 100;
  if ([t, r, a].some(isNaN)) return null;
  let o = 1;
  return e[4] !== void 0 && (o = e[4].endsWith("%") ? parseFloat(e[4]) / 100 : +e[4]), { ...A(t, r, a), alpha: p(o, 0, 1) };
}
function z(s) {
  if (typeof document > "u") return null;
  try {
    const e = document.createElement("canvas").getContext("2d");
    e.fillStyle = "#010203", e.fillStyle = s;
    const t = e.fillStyle;
    return t === "#010203" ? (e.fillStyle = "#030201", e.fillStyle = s, e.fillStyle === "#030201" ? null : w(e.fillStyle) || S(e.fillStyle)) : t.startsWith("#") ? w(t) : /^rgba?\s*\(/i.test(t) ? S(t) : null;
  } catch {
    return null;
  }
}
function A(s, e, t) {
  const r = (1 - Math.abs(2 * t - 1)) * e, a = r * (1 - Math.abs(s / 60 % 2 - 1)), o = t - r / 2;
  let n = 0, i = 0, l = 0;
  return s < 60 ? (n = r, i = a) : s < 120 ? (n = a, i = r) : s < 180 ? (i = r, l = a) : s < 240 ? (i = a, l = r) : s < 300 ? (n = a, l = r) : (n = r, l = a), {
    r: Math.round((n + o) * 255),
    g: Math.round((i + o) * 255),
    b: Math.round((l + o) * 255)
  };
}
function k(s, e, t) {
  s /= 255, e /= 255, t /= 255;
  const r = Math.max(s, e, t), a = Math.min(s, e, t), o = (r + a) / 2;
  let n = 0, i = 0;
  if (r !== a) {
    const l = r - a;
    switch (i = o > 0.5 ? l / (2 - r - a) : l / (r + a), r) {
      case s:
        n = ((e - t) / l + (e < t ? 6 : 0)) / 6;
        break;
      case e:
        n = ((t - s) / l + 2) / 6;
        break;
      case t:
        n = ((s - e) / l + 4) / 6;
        break;
    }
  }
  return { h: n * 360, s: i, l: o };
}
function _({ r: s, g: e, b: t }) {
  return "#" + [s, e, t].map((r) => p(Math.round(r), 0, 255).toString(16).padStart(2, "0")).join("");
}
function p(s, e, t) {
  return Math.max(e, Math.min(t, s));
}
const m = {
  normalAA: 4.5,
  normalAAA: 7,
  largeAA: 3,
  largeAAA: 4.5,
  uiAA: 3
};
function C(s) {
  const e = s / 255;
  return e <= 0.04045 ? e / 12.92 : Math.pow((e + 0.055) / 1.055, 2.4);
}
function f(s, e, t) {
  return 0.2126 * C(s) + 0.7152 * C(e) + 0.0722 * C(t);
}
function v(s, e) {
  const t = Math.max(s, e), r = Math.min(s, e);
  return (t + 0.05) / (r + 0.05);
}
function I(s, e) {
  if (s.alpha >= 1) return s;
  const t = s.alpha;
  return {
    r: Math.round(s.r * t + e.r * (1 - t)),
    g: Math.round(s.g * t + e.g * (1 - t)),
    b: Math.round(s.b * t + e.b * (1 - t)),
    alpha: 1
  };
}
function N(s, e) {
  const t = u(s);
  if (!t)
    return {
      error: "foreground",
      message: `"${s}" is not a recognised color.`,
      foreground: s,
      background: e
    };
  const r = u(e);
  if (!r)
    return {
      error: "background",
      message: `"${e}" is not a recognised color.`,
      foreground: s,
      background: e
    };
  if (r.alpha < 1)
    return {
      error: "background",
      message: "Transparent backgrounds are not supported for contrast checking.",
      foreground: s,
      background: e
    };
  const a = I(t, r), o = f(a.r, a.g, a.b), n = f(r.r, r.g, r.b), i = v(o, n), l = Math.round(i * 100) / 100;
  return {
    foreground: s,
    background: e,
    ratio: i,
    roundedRatio: `${l.toFixed(2)}:1`,
    normalText: {
      aa: i >= m.normalAA,
      aaa: i >= m.normalAAA
    },
    largeText: {
      aa: i >= m.largeAA,
      aaa: i >= m.largeAAA
    },
    ui: {
      aa: i >= m.uiAA
    }
  };
}
function T(s, e) {
  const t = u(s), r = u(e);
  return !t || !r ? null : {
    foreground: {
      aa: y(t, r, 4.5),
      aaa: y(t, r, 7)
    },
    background: {
      aa: y(r, t, 4.5),
      aaa: y(r, t, 7)
    }
  };
}
function y(s, e, t) {
  const r = f(e.r, e.g, e.b), { h: a, s: o, l: n } = k(s.r, s.g, s.b), i = f(s.r, s.g, s.b);
  if (v(i, r) >= t)
    return _(s);
  const l = E(a, o, r, t, 0), c = E(a, o, r, t, 1);
  if (l && c) {
    const g = k(l.r, l.g, l.b), b = k(c.r, c.g, c.b), x = Math.abs(n - g.l), $ = Math.abs(n - b.l);
    return _(x <= $ ? l : c);
  }
  return l ? _(l) : c ? _(c) : null;
}
function E(s, e, t, r, a) {
  const o = A(s, e, a), n = f(o.r, o.g, o.b);
  if (v(n, t) < r) return null;
  let i = a, l = a === 0 ? 1 : 0;
  for (let c = 0; c < 24; c++) {
    const g = (i + l) / 2, b = A(s, e, g), x = f(b.r, b.g, b.b);
    v(x, t) >= r ? i = g : l = g;
  }
  return A(s, e, i);
}
const B = 400;
function d(s) {
  return _({ r: s.r, g: s.g, b: s.b });
}
class H extends HTMLElement {
  // ---- lifecycle -------------------------------------------------------
  static get observedAttributes() {
    return [
      "foreground",
      "background",
      "mode",
      "show-suggestions",
      "readonly",
      "hide-preview",
      "foreground-source",
      "background-source",
      "foreground-from",
      "background-from",
      "sample-source",
      "auto-update"
    ];
  }
  constructor() {
    super(), this._shadow = this.attachShadow({ mode: "open" }), this._result = null, this._debounceTimer = null, this._sourceListeners = [], this._initialized = !1, this._mode = "all";
  }
  connectedCallback() {
    this._render(), this._bindInternalEvents(), this._initFromAttributes(), this._setupExternalSources(), this._initialized = !0;
  }
  disconnectedCallback() {
    this._cleanupSourceListeners(), this._debounceTimer && clearTimeout(this._debounceTimer);
  }
  attributeChangedCallback(e, t, r) {
    !this._initialized || t === r || this._handleAttributeChange(e, r);
  }
  // ---- rendering -------------------------------------------------------
  _render() {
    this._shadow.innerHTML = `
<style>${M}</style>
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
    const e = (t) => this._shadow.getElementById(t);
    this._els = {
      fgText: this._shadow.querySelector("#fg-text"),
      fgColor: this._shadow.querySelector("#fg-color"),
      bgText: this._shadow.querySelector("#bg-text"),
      bgColor: this._shadow.querySelector("#bg-color"),
      swapBtn: e("swap-btn"),
      resetBtn: e("reset-btn"),
      preview: e("preview"),
      ratioOutput: e("ratio-output"),
      ratioLabel: e("ratio-label"),
      rNormalAA: e("r-normal-aa"),
      rNormalAAA: e("r-normal-aaa"),
      rLargeAA: e("r-large-aa"),
      rLargeAAA: e("r-large-aaa"),
      rUiAA: e("r-ui-aa"),
      suggestionsSection: e("suggestions-section"),
      suggestionsContent: e("suggestions-content"),
      errorContainer: e("error-container"),
      liveRegion: e("live-region")
    };
  }
  // ---- internal events -------------------------------------------------
  _bindInternalEvents() {
    const e = this._els;
    e.fgText.addEventListener("input", () => this._debouncedCalculate()), e.bgText.addEventListener("input", () => this._debouncedCalculate()), e.fgColor.addEventListener("input", (t) => {
      e.fgText.value = t.target.value, this._calculate();
    }), e.bgColor.addEventListener("input", (t) => {
      e.bgText.value = t.target.value, this._calculate();
    }), e.fgText.addEventListener("change", () => this._syncPicker("fg")), e.bgText.addEventListener("change", () => this._syncPicker("bg")), e.swapBtn.addEventListener("click", () => this._swapColors()), e.resetBtn.addEventListener("click", () => this.reset());
  }
  _syncPicker(e) {
    const t = this._els[`${e}Text`], r = this._els[`${e}Color`], a = u(t.value);
    a && (r.value = d(a));
  }
  // ---- debounce --------------------------------------------------------
  _debouncedCalculate() {
    this._debounceTimer && clearTimeout(this._debounceTimer), this._debounceTimer = setTimeout(() => this._calculate(), B);
  }
  // ---- attribute initialisation ----------------------------------------
  _initFromAttributes() {
    const e = this.getAttribute("foreground") || "#000000", t = this.getAttribute("background") || "#ffffff";
    this._mode = this.getAttribute("mode") || "all", this._setInputs(e, t), this.hasAttribute("readonly") && this._applyReadonly(!0), this.hasAttribute("hide-preview") && (this._els.preview.hidden = !0), this._calculate();
  }
  _setInputs(e, t) {
    const r = this._els;
    r.fgText.value = e, r.bgText.value = t;
    const a = u(e), o = u(t);
    a && (r.fgColor.value = d(a)), o && (r.bgColor.value = d(o));
  }
  // ---- attribute changes -----------------------------------------------
  _handleAttributeChange(e, t) {
    const r = this._els;
    switch (e) {
      case "foreground": {
        const a = t || "#000000";
        r.fgText.value = a;
        const o = u(a);
        o && (r.fgColor.value = d(o)), this._calculate();
        break;
      }
      case "background": {
        const a = t || "#ffffff";
        r.bgText.value = a;
        const o = u(a);
        o && (r.bgColor.value = d(o)), this._calculate();
        break;
      }
      case "mode":
        this._mode = t || "all", this._applyModeVisibility();
        break;
      case "show-suggestions":
        this._calculate();
        break;
      case "readonly":
        this._applyReadonly(t !== null);
        break;
      case "hide-preview":
        r.preview.hidden = t !== null;
        break;
      case "foreground-source":
      case "background-source":
      case "foreground-from":
      case "background-from":
      case "sample-source":
      case "auto-update":
        this._setupExternalSources();
        break;
    }
  }
  _applyReadonly(e) {
    const t = this._els;
    t.fgText.readOnly = e, t.bgText.readOnly = e, t.fgColor.disabled = e, t.bgColor.disabled = e, t.swapBtn.hidden = e, t.resetBtn.hidden = e;
  }
  // ---- calculation & UI update -----------------------------------------
  _calculate() {
    const e = this._els.fgText.value.trim(), t = this._els.bgText.value.trim();
    if (!e || !t) return;
    const r = N(e, t);
    if (r.error) {
      this._showError(r.message), this._result = null, this._dispatchEvent("a11y-contrast-error", {
        error: r.error,
        message: r.message,
        foreground: e,
        background: t
      });
      return;
    }
    this._hideError(), this.hasAttribute("show-suggestions") && (r.suggestions = T(e, t)), this._result = r, this._updateUI(r), this._dispatchEvent("a11y-contrast-change", { result: { ...r } });
  }
  _updateUI(e) {
    const t = this._els, { foreground: r, background: a, roundedRatio: o, normalText: n, largeText: i, ui: l } = e;
    t.preview.style.color = r, t.preview.style.backgroundColor = a, t.ratioOutput.textContent = o, t.ratioLabel.textContent = "contrast ratio", this._setStatus(t.rNormalAA, n.aa), this._setStatus(t.rNormalAAA, n.aaa), this._setStatus(t.rLargeAA, i.aa), this._setStatus(t.rLargeAAA, i.aaa), this._setStatus(t.rUiAA, l.aa), this._applyModeVisibility(), this.hasAttribute("show-suggestions") && e.suggestions ? this._renderSuggestions(e.suggestions, e) : t.suggestionsSection.hidden = !0;
    const c = u(r), g = u(a);
    c && (t.fgColor.value = d(c)), g && (t.bgColor.value = d(g)), this._announce(this._buildAnnouncement(e));
  }
  _setStatus(e, t) {
    e.textContent = t ? "Pass" : "Fail", e.className = `result-status ${t ? "pass" : "fail"}`;
  }
  _applyModeVisibility() {
    const e = {
      all: ["normal-aa", "normal-aaa", "large-aa", "large-aaa", "ui-aa"],
      text: ["normal-aa", "normal-aaa"],
      "large-text": ["large-aa", "large-aaa"],
      ui: ["ui-aa"]
    }[this._mode] || ["normal-aa", "normal-aaa", "large-aa", "large-aaa", "ui-aa"];
    this._shadow.querySelectorAll(".result-row").forEach((t) => {
      t.hidden = !e.includes(t.dataset.check);
    });
  }
  _buildAnnouncement(e) {
    const t = (i) => i ? "pass" : "fail", { roundedRatio: r, normalText: a, largeText: o, ui: n } = e;
    return `Contrast ratio ${r}. Normal text: AA ${t(a.aa)}, AAA ${t(a.aaa)}. Large text: AA ${t(o.aa)}, AAA ${t(o.aaa)}. UI: AA ${t(n.aa)}.`;
  }
  _announce(e) {
    const t = this._els.liveRegion;
    t.textContent = "", requestAnimationFrame(() => {
      t.textContent = e;
    });
  }
  // ---- suggestions -------------------------------------------------------
  _renderSuggestions(e, t) {
    const r = this._els.suggestionsSection, a = this._els.suggestionsContent, o = [];
    if (!t.normalText.aa && e.foreground.aa && o.push({ label: "Foreground AA", color: e.foreground.aa, type: "foreground", tier: "AA" }), !t.normalText.aaa && e.foreground.aaa && o.push({ label: "Foreground AAA", color: e.foreground.aaa, type: "foreground", tier: "AAA" }), !t.normalText.aa && e.background.aa && o.push({ label: "Background AA", color: e.background.aa, type: "background", tier: "AA" }), !t.normalText.aaa && e.background.aaa && o.push({ label: "Background AAA", color: e.background.aaa, type: "background", tier: "AAA" }), o.length === 0) {
      r.hidden = !0;
      return;
    }
    a.innerHTML = o.map(
      (n) => `
<div class="suggestion-item">
  <span class="suggestion-swatch"
        style="background:${h(n.color)}"
        aria-hidden="true"></span>
  <span class="suggestion-label">${L(n.label)}:</span>
  <code  class="suggestion-color">${L(n.color)}</code>
  <div class="suggestion-actions">
    <button type="button"
            data-action="apply"
            data-type="${h(n.type)}"
            data-color="${h(n.color)}"
            part="button"
            aria-label="Apply ${h(n.color)} as ${h(n.type)} color">Apply</button>
    <button type="button"
            data-action="copy"
            data-color="${h(n.color)}"
            part="button"
            aria-label="Copy color ${h(n.color)}">Copy</button>
  </div>
</div>`
    ).join(""), a.querySelectorAll("[data-action]").forEach((n) => {
      n.addEventListener("click", (i) => this._onSuggestionAction(i));
    }), r.hidden = !1;
  }
  _onSuggestionAction(e) {
    const t = e.currentTarget, r = t.dataset.action, a = t.dataset.color, o = t.dataset.type;
    if (r === "apply") {
      const n = u(a);
      o === "foreground" ? (this._els.fgText.value = a, n && (this._els.fgColor.value = d(n))) : (this._els.bgText.value = a, n && (this._els.bgColor.value = d(n))), this._calculate(), this._announce(`Applied ${a} as ${o} color.`), this._dispatchEvent("a11y-contrast-apply-suggestion", {
        color: a,
        type: o,
        result: this._result ? { ...this._result } : null
      });
    } else r === "copy" && (navigator.clipboard ? navigator.clipboard.writeText(a).then(
      () => {
        this._announce(`Copied ${a}.`);
      },
      () => {
        this._announce(`Copy failed. Color is ${a}.`);
      }
    ) : this._announce(`Color is ${a}.`), this._dispatchEvent("a11y-contrast-copy", { color: a }));
  }
  // ---- error handling --------------------------------------------------
  _showError(e) {
    const t = this._els.errorContainer;
    t.textContent = e, t.hidden = !1, this._clearResults();
  }
  _hideError() {
    const e = this._els.errorContainer;
    e.textContent = "", e.hidden = !0;
  }
  _clearResults() {
    const e = this._els;
    e.ratioOutput.textContent = "—", e.ratioLabel.textContent = "", [e.rNormalAA, e.rNormalAAA, e.rLargeAA, e.rLargeAAA, e.rUiAA].forEach((t) => {
      t.textContent = "—", t.className = "result-status";
    }), e.suggestionsSection.hidden = !0;
  }
  // ---- swap ------------------------------------------------------------
  _swapColors() {
    const e = this._els, t = e.fgText.value, r = e.bgText.value, a = e.fgColor.value, o = e.bgColor.value;
    e.fgText.value = r, e.bgText.value = t, e.fgColor.value = o, e.bgColor.value = a, this._calculate();
  }
  // ---- external sources ------------------------------------------------
  _setupExternalSources() {
    this._cleanupSourceListeners();
    const e = this.hasAttribute("auto-update"), t = this.getAttribute("foreground-source"), r = this.getAttribute("background-source"), a = this.getAttribute("foreground-from"), o = this.getAttribute("background-from"), n = this.getAttribute("sample-source");
    t && this._bindInputSource(t, "foreground", e), r && this._bindInputSource(r, "background", e), a && this._readComputedStyle(a, "foreground", "color"), o && this._readComputedStyle(o, "background", "backgroundColor"), n && (this._readComputedStyle(n, "foreground", "color"), this._readComputedStyle(n, "background", "backgroundColor"));
  }
  _bindInputSource(e, t, r) {
    const a = document.querySelector(e);
    if (!a) {
      this._dispatchEvent("a11y-contrast-error", {
        error: "source",
        message: `Source element "${e}" was not found.`,
        selector: e,
        role: t
      });
      return;
    }
    if (this._readValueFromElement(a, t), r) {
      const o = () => this._readValueFromElement(a, t);
      ["input", "change"].forEach((n) => a.addEventListener(n, o)), this._sourceListeners.push({ el: a, events: ["input", "change"], handler: o });
    }
  }
  _readValueFromElement(e, t) {
    const r = ("value" in e ? e.value : e.textContent || "").trim();
    r && (this._applyColor(r, t), this._calculate());
  }
  _readComputedStyle(e, t, r) {
    const a = document.querySelector(e);
    if (!a) {
      this._dispatchEvent("a11y-contrast-error", {
        error: "source",
        message: `Element "${e}" was not found for computed style reading.`,
        selector: e,
        role: t
      });
      return;
    }
    const o = getComputedStyle(a)[r];
    if (!o || o === "transparent" || /rgba\(\s*0,\s*0,\s*0,\s*0\s*\)/.test(o)) {
      this._dispatchEvent("a11y-contrast-error", {
        error: "transparent",
        message: `Element "${e}" has a transparent ${t} color — cannot check contrast.`,
        selector: e,
        role: t
      });
      return;
    }
    this._applyColor(o, t), this._calculate();
  }
  _applyColor(e, t) {
    const r = this._els, a = u(e);
    t === "foreground" ? (r.fgText.value = e, a && (r.fgColor.value = d(a))) : (r.bgText.value = e, a && (r.bgColor.value = d(a)));
  }
  _cleanupSourceListeners() {
    this._sourceListeners.forEach(({ el: e, events: t, handler: r }) => {
      t.forEach((a) => e.removeEventListener(a, r));
    }), this._sourceListeners = [];
  }
  // ---- public API -------------------------------------------------------
  /**
   * Set both foreground and background colours.
   * @param {{ foreground?: string, background?: string }} options
   */
  setColors({ foreground: e, background: t } = {}) {
    e !== void 0 && this._applyColor(e, "foreground"), t !== void 0 && this._applyColor(t, "background"), this._calculate();
  }
  /**
   * Set the foreground colour.
   * @param {string} color
   */
  setForeground(e) {
    this._applyColor(e, "foreground"), this._calculate();
  }
  /**
   * Set the background colour.
   * @param {string} color
   */
  setBackground(e) {
    this._applyColor(e, "background"), this._calculate();
  }
  /**
   * Re-run the contrast calculation and return the result.
   * @returns {object|null}
   */
  check() {
    return this._calculate(), this._result ? { ...this._result } : null;
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
    return this._result ? T(this._result.foreground, this._result.background) : null;
  }
  /**
   * Reset inputs to attribute defaults (or #000000 / #ffffff).
   */
  reset() {
    const e = this.getAttribute("foreground") || "#000000", t = this.getAttribute("background") || "#ffffff";
    this._setInputs(e, t), this._calculate();
  }
  // ---- event dispatch --------------------------------------------------
  _dispatchEvent(e, t) {
    this.dispatchEvent(
      new CustomEvent(e, { bubbles: !0, composed: !0, detail: t })
    );
  }
}
function L(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function h(s) {
  return String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
customElements.get("a11y-color-contrast-checker") || customElements.define("a11y-color-contrast-checker", H);
