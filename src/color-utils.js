/**
 * color-utils.js
 * Color parsing and conversion utilities.
 * No DOM dependency except for named color parsing via canvas.
 */

/**
 * Parse a CSS color string.
 * @param {string} colorString
 * @returns {{ r: number, g: number, b: number, alpha: number } | null}
 */
export function parseColor(colorString) {
  if (!colorString || typeof colorString !== 'string') return null;
  const s = colorString.trim();
  if (!s) return null;

  if (s.startsWith('#')) return _parseHex(s);
  if (/^rgba?\s*\(/i.test(s)) return _parseRgb(s);
  if (/^hsla?\s*\(/i.test(s)) return _parseHsl(s);
  return _parseNamed(s);
}

function _parseHex(hex) {
  let h = hex.slice(1);
  // Expand shorthand forms
  if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
  else if (h.length === 4) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2] + h[3] + h[3];

  if ((h.length !== 6 && h.length !== 8) || !/^[0-9a-f]+$/i.test(h)) return null;

  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  const alpha = h.length === 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1;
  return { r, g, b, alpha };
}

function _parseRgb(str) {
  // Supports: rgb(r, g, b) / rgba(r, g, b, a) / modern space / slash notation
  const m = str.match(
    /rgba?\(\s*([\d.]+%?)\s*[,\s]\s*([\d.]+%?)\s*[,\s]\s*([\d.]+%?)\s*(?:[,/]\s*([\d.]+%?))?\s*\)/i
  );
  if (!m) return null;

  const ch = (v) => (v.endsWith('%') ? Math.round(parseFloat(v) * 2.55) : +v);
  const r = ch(m[1]);
  const g = ch(m[2]);
  const b = ch(m[3]);
  if ([r, g, b].some(isNaN)) return null;

  let alpha = 1;
  if (m[4] !== undefined) {
    alpha = m[4].endsWith('%') ? parseFloat(m[4]) / 100 : +m[4];
  }

  return {
    r: _clamp(r, 0, 255),
    g: _clamp(g, 0, 255),
    b: _clamp(b, 0, 255),
    alpha: _clamp(alpha, 0, 1)
  };
}

function _parseHsl(str) {
  const m = str.match(
    /hsla?\(\s*([\d.]+(?:deg|rad|grad|turn)?)\s*[,\s]\s*([\d.]+%?)\s*[,\s]\s*([\d.]+%?)\s*(?:[,/]\s*([\d.]+%?))?\s*\)/i
  );
  if (!m) return null;

  let h = parseFloat(m[1]);
  if (/rad$/i.test(m[1])) h = (h * 180) / Math.PI;
  else if (/grad$/i.test(m[1])) h = h * 0.9;
  else if (/turn$/i.test(m[1])) h = h * 360;
  h = ((h % 360) + 360) % 360;

  const s = parseFloat(m[2]) / 100;
  const l = parseFloat(m[3]) / 100;
  if ([h, s, l].some(isNaN)) return null;

  let alpha = 1;
  if (m[4] !== undefined) {
    alpha = m[4].endsWith('%') ? parseFloat(m[4]) / 100 : +m[4];
  }

  return { ...hslToRgb(h, s, l), alpha: _clamp(alpha, 0, 1) };
}

function _parseNamed(name) {
  if (typeof document === 'undefined') return null;
  try {
    const ctx = document.createElement('canvas').getContext('2d');
    // Use a sentinel that is extremely unlikely to be the input value
    ctx.fillStyle = '#010203';
    ctx.fillStyle = name;
    const result1 = ctx.fillStyle;

    if (result1 === '#010203') {
      // Cross-check: maybe the name literally IS #010203
      ctx.fillStyle = '#030201';
      ctx.fillStyle = name;
      if (ctx.fillStyle === '#030201') return null; // Browser didn't accept it
      return _parseHex(ctx.fillStyle) || _parseRgb(ctx.fillStyle);
    }

    if (result1.startsWith('#')) return _parseHex(result1);
    if (/^rgba?\s*\(/i.test(result1)) return _parseRgb(result1);
    return null;
  } catch {
    return null;
  }
}

/**
 * Convert HSL values to an RGB object.
 * @param {number} h - Hue in degrees (0–360)
 * @param {number} s - Saturation (0–1)
 * @param {number} l - Lightness (0–1)
 * @returns {{ r: number, g: number, b: number }}
 */
export function hslToRgb(h, s, l) {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;

  if (h < 60) { r = c; g = x; }
  else if (h < 120) { r = x; g = c; }
  else if (h < 180) { g = c; b = x; }
  else if (h < 240) { g = x; b = c; }
  else if (h < 300) { r = x; b = c; }
  else { r = c; b = x; }

  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255)
  };
}

/**
 * Convert an RGB object to HSL values.
 * @param {number} r
 * @param {number} g
 * @param {number} b
 * @returns {{ h: number, s: number, l: number }}
 */
export function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0, s = 0;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }

  return { h: h * 360, s, l };
}

/**
 * Convert an RGB object to a CSS hex string.
 * @param {{ r: number, g: number, b: number }} rgb
 * @returns {string}
 */
export function rgbToHex({ r, g, b }) {
  return (
    '#' +
    [r, g, b]
      .map((v) => _clamp(Math.round(v), 0, 255).toString(16).padStart(2, '0'))
      .join('')
  );
}

function _clamp(v, lo, hi) {
  return Math.max(lo, Math.min(hi, v));
}
