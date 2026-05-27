/**
 * contrast-utils.js
 * WCAG contrast ratio calculation utilities.
 * No DOM dependency.
 */

import { parseColor } from './color-utils.js';

/** WCAG 2.x thresholds */
export const THRESHOLDS = {
  normalAA: 4.5,
  normalAAA: 7,
  largeAA: 3,
  largeAAA: 4.5,
  uiAA: 3
};

/**
 * Convert an 8-bit channel value to its linear-light (sRGB) representation.
 * @param {number} channel - 0–255
 * @returns {number}
 */
export function linearize(channel) {
  const c = channel / 255;
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

/**
 * Calculate the WCAG relative luminance of an RGB colour.
 * @param {number} r - 0–255
 * @param {number} g - 0–255
 * @param {number} b - 0–255
 * @returns {number} Relative luminance (0–1)
 */
export function getRelativeLuminance(r, g, b) {
  return 0.2126 * linearize(r) + 0.7152 * linearize(g) + 0.0722 * linearize(b);
}

/**
 * Calculate the WCAG contrast ratio between two luminance values.
 * @param {number} l1 - Relative luminance of colour 1
 * @param {number} l2 - Relative luminance of colour 2
 * @returns {number} Contrast ratio (1–21)
 */
export function getContrastRatio(l1, l2) {
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Alpha-composite a foreground colour onto an opaque background.
 * @param {{ r, g, b, alpha }} fg
 * @param {{ r, g, b }} bg
 * @returns {{ r, g, b, alpha: 1 }}
 */
function compositeOnBackground(fg, bg) {
  if (fg.alpha >= 1) return fg;
  const a = fg.alpha;
  return {
    r: Math.round(fg.r * a + bg.r * (1 - a)),
    g: Math.round(fg.g * a + bg.g * (1 - a)),
    b: Math.round(fg.b * a + bg.b * (1 - a)),
    alpha: 1
  };
}

/**
 * Evaluate the WCAG contrast between a foreground and background colour string.
 *
 * @param {string} foreground - CSS colour string for foreground
 * @param {string} background - CSS colour string for background
 * @returns {object} Result object or error object
 */
export function evaluateContrast(foreground, background) {
  const fg = parseColor(foreground);
  if (!fg) {
    return {
      error: 'foreground',
      message: `"${foreground}" is not a recognised color.`,
      foreground,
      background
    };
  }

  const bg = parseColor(background);
  if (!bg) {
    return {
      error: 'background',
      message: `"${background}" is not a recognised color.`,
      foreground,
      background
    };
  }

  if (bg.alpha < 1) {
    return {
      error: 'background',
      message: 'Transparent backgrounds are not supported for contrast checking.',
      foreground,
      background
    };
  }

  const effectiveFg = compositeOnBackground(fg, bg);
  const fgLum = getRelativeLuminance(effectiveFg.r, effectiveFg.g, effectiveFg.b);
  const bgLum = getRelativeLuminance(bg.r, bg.g, bg.b);
  const ratio = getContrastRatio(fgLum, bgLum);
  const rounded = Math.round(ratio * 100) / 100;

  return {
    foreground,
    background,
    ratio,
    roundedRatio: `${rounded.toFixed(2)}:1`,
    normalText: {
      aa: ratio >= THRESHOLDS.normalAA,
      aaa: ratio >= THRESHOLDS.normalAAA
    },
    largeText: {
      aa: ratio >= THRESHOLDS.largeAA,
      aaa: ratio >= THRESHOLDS.largeAAA
    },
    ui: {
      aa: ratio >= THRESHOLDS.uiAA
    }
  };
}
