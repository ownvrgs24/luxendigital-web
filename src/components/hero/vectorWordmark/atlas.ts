// Atlas builder — renders text to a canvas texture for the Vector Wordmark

export type Atlas = { canvas: HTMLCanvasElement; cssW: number; cssH: number };

export type FontSpec = {
  family: string;
  weight: string;
  style: string;
  size: number;
  letterSpacing: string;
};

const MAX_TEX = 4096;
const DOT_DIAMETER = 4 / 440;
const DOT_PITCH = 12 / 440;

export function fontString(f: FontSpec, px: number) {
  return `${f.style} ${f.weight} ${px}px ${f.family}`;
}

export function buildAtlas(
  text: string,
  f: FontSpec,
  drawFontPx: number,
  dpr: number,
): Atlas | null {
  const probe = document.createElement("canvas").getContext("2d");
  if (!probe) return null;

  const setFont = (ctx: CanvasRenderingContext2D, px: number) => {
    ctx.font = fontString(f, px);
    try {
      if ("letterSpacing" in ctx) {
        (ctx as unknown as { letterSpacing: string }).letterSpacing =
          f.letterSpacing;
      }
    } catch (e) {
      /* noop */
    }
  };

  const measure = (px: number) => {
    setFont(probe, px);
    const m = probe.measureText(text);
    const asc = m.actualBoundingBoxAscent || px * 0.8;
    const desc = m.actualBoundingBoxDescent || px * 0.22;
    return { w: Math.max(1, m.width), asc, desc };
  };

  let fpx = Math.max(8, drawFontPx * dpr);
  let m = measure(fpx);
  let pad = fpx * 0.12;
  const over = Math.max(
    (m.w + pad * 2) / MAX_TEX,
    (m.asc + m.desc + pad * 2) / MAX_TEX,
  );
  if (over > 1) {
    fpx = Math.max(8, fpx / over);
    m = measure(fpx);
    pad = fpx * 0.12;
  }

  const w = Math.max(1, Math.ceil(m.w + pad * 2));
  const h = Math.max(1, Math.ceil(m.asc + m.desc + pad * 2));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, w, h);
  setFont(ctx, fpx);
  ctx.textBaseline = "alphabetic";
  ctx.textAlign = "left";
  ctx.globalCompositeOperation = "lighter";

  ctx.fillStyle = "#ff0000";
  ctx.fillText(text, pad, pad + m.asc);

  const block = m.asc + m.desc;
  ctx.strokeStyle = "#00ff00";
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.lineWidth = Math.max(1, block * DOT_DIAMETER);
  ctx.setLineDash([0, Math.max(2, block * DOT_PITCH)]);
  ctx.strokeText(text, pad, pad + m.asc);

  const cssPerPx = drawFontPx / fpx;
  return { canvas, cssW: w * cssPerPx, cssH: h * cssPerPx };
}
