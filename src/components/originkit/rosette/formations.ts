// Metal Rosette — color parsing + formations + easing

import type { V3 } from "./geometry";

export const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
export const easeIn = (t: number) => t * t * t;
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const F_EXPAND = 0.31;
const F_COLLAPSE = 0.29;
const F_REST = 0.4;

// ── 8 formations — each a distinct, intentional cube shape ──────────────
// spin:  rotation in turns (× TAU = radians)
// ext:   arm extension 0-1 (0 = solid cube, 1 = fully exploded rosette)
// pitch: camera tilt in degrees
export const FORMATIONS = [
  { spin: 0.0, ext: 0.0, pitch: 35 }, // 01 Solid cube — the foundation
  { spin: 0.12, ext: 0.22, pitch: 35 }, // 02 Arms reach out — lead capture
  { spin: 0.28, ext: 0.42, pitch: 32 }, // 03 Expanding — follow-up
  { spin: 0.45, ext: 0.6, pitch: 30 }, // 04 Reaching further — missed calls
  { spin: 0.62, ext: 0.5, pitch: 28 }, // 05 Contracted, rotated — booking
  { spin: 0.8, ext: 0.8, pitch: 28 }, // 06 Wide open — CRM, everything visible
  { spin: 0.92, ext: 0.7, pitch: 32 }, // 07 Radiating — reviews
  { spin: 1.05, ext: 1.0, pitch: 35 }, // 08 Fully connected — AI
] as const;

export function armExtension(u: number, hold: number): number {
  const h = Math.min(Math.max(hold, 0), 1);
  const rem = 1 - h;
  if (rem <= 1e-6) return 1;
  const tRest = rem * F_REST;
  const tExp = rem * F_EXPAND;
  const tCol = rem * F_COLLAPSE;
  const p = u - Math.floor(u);
  if (p < tRest) return 0;
  if (p < tRest + tExp) return easeOut((p - tRest) / tExp);
  if (p < tRest + tExp + h) return 1;
  return 1 - easeIn(Math.min((p - tRest - tExp - h) / tCol, 1));
}

export function parseLinearColor(css: string, fallback: V3): V3 {
  const s = (css || "").trim();
  if (!s) return fallback;
  const varMatch = s.match(/^var\([^,]+,\s*(.+)\)$/i);
  if (varMatch) return parseLinearColor(varMatch[1], fallback);
  const toLinear = (c: number) =>
    c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  const hex = s.match(/^#([0-9a-f]{3,8})$/i);
  if (hex) {
    let d = hex[1];
    if (d.length === 3 || d.length === 4)
      d = d
        .split("")
        .map((c) => c + c)
        .join("");
    if (d.length >= 6) {
      return [
        toLinear(parseInt(d.slice(0, 2), 16) / 255),
        toLinear(parseInt(d.slice(2, 4), 16) / 255),
        toLinear(parseInt(d.slice(4, 6), 16) / 255),
      ];
    }
    return fallback;
  }
  const rgb = s.match(/^rgba?\(([^)]+)\)$/i);
  if (rgb) {
    const parts = rgb[1].split(/[\s,/]+/).filter(Boolean);
    if (parts.length >= 3) {
      const ch = (t: string) =>
        t.endsWith("%") ? parseFloat(t) / 100 : parseFloat(t) / 255;
      return [
        toLinear(ch(parts[0])),
        toLinear(ch(parts[1])),
        toLinear(ch(parts[2])),
      ];
    }
    return fallback;
  }
  const hsl = s.match(/^hsla?\(([^)]+)\)$/i);
  if (hsl) {
    const parts = hsl[1].split(/[\s,/]+/).filter(Boolean);
    if (parts.length >= 3) {
      const hDeg = ((parseFloat(parts[0]) % 360) + 360) % 360;
      const sat = parseFloat(parts[1]) / 100;
      const lig = parseFloat(parts[2]) / 100;
      const c = (1 - Math.abs(2 * lig - 1)) * sat;
      const x = c * (1 - Math.abs(((hDeg / 60) % 2) - 1));
      const m = lig - c / 2;
      const seg = Math.floor(hDeg / 60) % 6;
      const table: V3[] = [
        [c, x, 0],
        [x, c, 0],
        [0, c, x],
        [0, x, c],
        [x, 0, c],
        [c, 0, x],
      ];
      const t = table[seg];
      return [toLinear(t[0] + m), toLinear(t[1] + m), toLinear(t[2] + m)];
    }
    return fallback;
  }
  return fallback;
}

// ── Scroll-scrubbed sampling ────────────────────────────────────────────
// Both helpers are pure so the scrub can be reasoned about (and tested)
// without a WebGL context; the rosette's frame loop calls them per frame.

/** Sample the formation table at a continuous progress value
 *  (0 → FORMATIONS.length - 1). Shape eases into each formation with a
 *  smoothstep so the eight states stay legible; spin stays mostly linear
 *  in progress so angular velocity never falls to zero at a boundary. */
export function sampleFormation(p: number) {
  const max = FORMATIONS.length - 1;
  const clamped = Math.max(0, Math.min(max, p));
  const i = Math.max(0, Math.min(max - 1, Math.floor(clamped)));
  const f = Math.max(0, Math.min(1, clamped - i));
  const a = FORMATIONS[i];
  const b = FORMATIONS[i + 1];
  const s = f * f * (3 - 2 * f);
  return {
    spin: lerp(a.spin, b.spin, 0.65 * f + 0.35 * s),
    ext: lerp(a.ext, b.ext, s),
    pitch: lerp(a.pitch, b.pitch, s),
  };
}

/** Scale that keeps the rosette a roughly constant on-screen size as its
 *  arms extend. A solid cube spans 1 cell and the fully exploded rosette
 *  ~4.6, so a fixed scale renders one of the two far too small.
 *  `falloff` 1 = every formation identical, 0 = no normalisation. */
export function fitScale(
  travel: number,
  fit: number,
  falloff: number,
  cell = 1,
): number {
  return fit / Math.pow(cell + 2 * travel, falloff);
}
