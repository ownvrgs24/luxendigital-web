// Color parsing utilities for the Vector Wordmark

export type RGBA = [number, number, number, number];

const clamp = (x: number, a: number, b: number) => (x < a ? a : x > b ? b : x);
const fract = (x: number) => x - Math.floor(x);

export function parseColor(input: string | undefined, fallback: RGBA): RGBA {
  if (!input) return fallback;
  let s = String(input).trim();
  if (s.slice(0, 4).toLowerCase() === "var(") {
    const comma = s.indexOf(",");
    const close = s.lastIndexOf(")");
    if (comma < 0 || close < comma) return fallback;
    s = s.slice(comma + 1, close).trim();
  }
  if (s[0] === "#") {
    let h = s.slice(1);
    if (h.length === 3 || h.length === 4) {
      let x = "";
      for (const c of h) x += c + c;
      h = x;
    }
    if (h.length === 6) h += "ff";
    if (h.length !== 8 || /[^0-9a-f]/i.test(h)) return fallback;
    return [
      parseInt(h.slice(0, 2), 16) / 255,
      parseInt(h.slice(2, 4), 16) / 255,
      parseInt(h.slice(4, 6), 16) / 255,
      parseInt(h.slice(6, 8), 16) / 255,
    ];
  }
  const m = s.match(/^(rgba?|hsla?)\(([^)]*)\)$/i);
  if (!m) return fallback;
  const parts = m[2].split(/[\s,/]+/).filter((p) => p.length > 0);
  if (parts.length < 3) return fallback;
  const num = (t: string, scale: number) => {
    const v = parseFloat(t);
    if (!Number.isFinite(v)) return 0;
    return t.indexOf("%") >= 0 ? (v / 100) * scale : v;
  };
  const alpha = parts.length > 3 ? clamp(num(parts[3], 1), 0, 1) : 1;
  if (m[1].toLowerCase().slice(0, 3) === "rgb") {
    return [
      clamp(num(parts[0], 255) / 255, 0, 1),
      clamp(num(parts[1], 255) / 255, 0, 1),
      clamp(num(parts[2], 255) / 255, 0, 1),
      alpha,
    ];
  }
  const hh = fract(parseFloat(parts[0]) / 360);
  const sat = clamp(num(parts[1], 1), 0, 1);
  const li = clamp(num(parts[2], 1), 0, 1);
  const q = li < 0.5 ? li * (1 + sat) : li + sat - li * sat;
  const p = 2 * li - q;
  const chan = (t: number) => {
    let u = fract(t);
    if (u < 1 / 6) return p + (q - p) * 6 * u;
    if (u < 1 / 2) return q;
    if (u < 2 / 3) return p + (q - p) * (2 / 3 - u) * 6;
    return p;
  };
  return [chan(hh + 1 / 3), chan(hh), chan(hh - 1 / 3), alpha];
}

export { clamp, fract };
