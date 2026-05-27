/**
 * suggestion-utils.js
 * Generate colour suggestions that meet WCAG AA / AAA contrast targets.
 * Adjusts lightness in HSL space via binary search.
 * No DOM dependency.
 */

import { parseColor, rgbToHsl, hslToRgb, rgbToHex } from './color-utils.js';
import { getRelativeLuminance, getContrastRatio } from './contrast-utils.js';

/**
 * Generate suggested foreground and background colours that meet AA and AAA
 * thresholds for normal text (4.5 and 7).
 *
 * @param {string} foreground - Current foreground CSS colour
 * @param {string} background - Current background CSS colour
 * @returns {{
 *   foreground: { aa: string|null, aaa: string|null },
 *   background: { aa: string|null, aaa: string|null }
 * } | null}
 */
export function getSuggestions(foreground, background) {
  const fg = parseColor(foreground);
  const bg = parseColor(background);
  if (!fg || !bg) return null;

  return {
    foreground: {
      aa: _adjustToTarget(fg, bg, 4.5),
      aaa: _adjustToTarget(fg, bg, 7)
    },
    background: {
      aa: _adjustToTarget(bg, fg, 4.5),
      aaa: _adjustToTarget(bg, fg, 7)
    }
  };
}

/**
 * Adjust `adjustRgb` until its contrast against `fixedRgb` reaches `target`.
 * Returns the hex string of the adjusted colour, or null if impossible.
 */
function _adjustToTarget(adjustRgb, fixedRgb, target) {
  const fixedLum = getRelativeLuminance(fixedRgb.r, fixedRgb.g, fixedRgb.b);
  const { h, s, l: currentL } = rgbToHsl(adjustRgb.r, adjustRgb.g, adjustRgb.b);

  // If the current colour already passes, return it as-is
  const adjustLum = getRelativeLuminance(adjustRgb.r, adjustRgb.g, adjustRgb.b);
  if (getContrastRatio(adjustLum, fixedLum) >= target) {
    return rgbToHex(adjustRgb);
  }

  // Try both extremes to see which direction can achieve the target
  const darkResult = _binarySearchLightness(h, s, fixedLum, target, 0);
  const lightResult = _binarySearchLightness(h, s, fixedLum, target, 1);

  // Prefer the result that requires the smallest change in lightness
  if (darkResult && lightResult) {
    const darkHsl = rgbToHsl(darkResult.r, darkResult.g, darkResult.b);
    const lightHsl = rgbToHsl(lightResult.r, lightResult.g, lightResult.b);
    const darkDelta = Math.abs(currentL - darkHsl.l);
    const lightDelta = Math.abs(currentL - lightHsl.l);
    return rgbToHex(darkDelta <= lightDelta ? darkResult : lightResult);
  }

  if (darkResult) return rgbToHex(darkResult);
  if (lightResult) return rgbToHex(lightResult);
  return null;
}

/**
 * Binary-search for a lightness value that achieves `target` contrast against `fixedLum`.
 *
 * @param {number} h - Hue (0–360)
 * @param {number} s - Saturation (0–1)
 * @param {number} fixedLum - Fixed colour luminance
 * @param {number} target - Required contrast ratio
 * @param {number} extremeL - The extreme end: 0 (darkest) or 1 (lightest)
 * @returns {{ r, g, b } | null}
 */
function _binarySearchLightness(h, s, fixedLum, target, extremeL) {
  const extremeRgb = hslToRgb(h, s, extremeL);
  const extremeLum = getRelativeLuminance(extremeRgb.r, extremeRgb.g, extremeRgb.b);
  if (getContrastRatio(extremeLum, fixedLum) < target) return null;

  // passingL is always the lightness that passes; failingL always fails.
  let passing = extremeL;
  let failing = extremeL === 0 ? 1 : 0;

  for (let i = 0; i < 24; i++) {
    const mid = (passing + failing) / 2;
    const midRgb = hslToRgb(h, s, mid);
    const midLum = getRelativeLuminance(midRgb.r, midRgb.g, midRgb.b);
    if (getContrastRatio(midLum, fixedLum) >= target) {
      passing = mid;
    } else {
      failing = mid;
    }
  }

  return hslToRgb(h, s, passing);
}
