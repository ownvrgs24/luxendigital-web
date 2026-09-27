// Vector Wordmark — Originkit
// Interactive WebGL brand wordmark. Split into focused modules for maintainability.

import * as React from "react";
import { useEffect, useRef } from "react";
import { parseColor, clamp, fract, type RGBA } from "./vectorWordmark/color";
import { VERT, FRAG, compile } from "./vectorWordmark/shaders";
import { buildAtlas, fontString, type FontSpec } from "./vectorWordmark/atlas";

const MAX_DPR = 2;
const REF_WIDTH = 1200;

const HANDLES = 3;
const CELL_ASPECT = 0.6;
const DRIFT_X = 0.08;
const DRIFT_Y = 0.04;
const DRIFT_RATE = 1.3;
const DRIFT_RATE_Y = 1.3 * 1.3;
const SWEEP_RATE = 0.5;

const SWEEP_BAND = 0.28;
const RESNAP = 0.2;
const DAMP_REF = 20;
const SPEED_REF = 50;
const LABEL_MAX = 0.6;

type HandleGroup = { size: number; spread: number; labels: boolean };
const HANDLE_DEFAULTS: HandleGroup = { size: 109, spread: 27, labels: true };

export interface VectorWordmarkProps {
  text?: string;
  font?: React.CSSProperties;
  background?: string;
  textColor?: string;
  shade?: string;
  accent?: string;
  reach?: number;
  speed?: number;
  damping?: number;
  handles?: Partial<HandleGroup>;
  style?: React.CSSProperties;
}

function useVectorWordmark(
  hostRef: React.RefObject<HTMLDivElement>,
  canvasRef: React.RefObject<HTMLCanvasElement>,
  labelRefs: React.MutableRefObject<(HTMLDivElement | null)[]>,
  live: React.MutableRefObject<{
    text: string;
    fontSpec: FontSpec;
    textColor: string;
    shade: string;
    background: string;
    accentRGBA: RGBA;
    reach: number;
    speed: number;
    damping: number;
    hg: HandleGroup;
  }>,
) {
  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return;

    const attrs: WebGLContextAttributes = {
      alpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      premultipliedAlpha: true,
      powerPreference: "high-performance",
    };
    const gl = (canvas.getContext("webgl2", attrs) ||
      canvas.getContext("webgl", attrs)) as WebGLRenderingContext | null;
    if (!gl) return;
    const isGL2 =
      typeof WebGL2RenderingContext !== "undefined" &&
      gl instanceof WebGL2RenderingContext;

    const prog = compile(gl, VERT, FRAG);
    const U = {
      map: gl.getUniformLocation(prog, "uMap"),
      res: gl.getUniformLocation(prog, "uRes"),
      atlas: gl.getUniformLocation(prog, "uAtlas"),
      ptr: gl.getUniformLocation(prog, "uPtr"),
      reach: gl.getUniformLocation(prog, "uReach"),
      text: gl.getUniformLocation(prog, "uText"),
      shade: gl.getUniformLocation(prog, "uShade"),
      accent: gl.getUniformLocation(prog, "uAccent"),
      v0: gl.getUniformLocation(prog, "uV0"),
      v1: gl.getUniformLocation(prog, "uV1"),
      v2: gl.getUniformLocation(prog, "uV2"),
      half: gl.getUniformLocation(prog, "uHalf"),
    };

    const quad = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW,
    );
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.disable(gl.BLEND);

    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      1,
      1,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      new Uint8Array([0, 0, 0, 255]),
    );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    let alive = true;
    let boxW = Math.max(1, host.offsetWidth);
    let boxH = Math.max(1, host.offsetHeight);
    let boxDirty = true;
    let dpr = 1;
    let bufW = 0;
    let bufH = 0;
    let atlasRatioW = 1;
    let atlasRatioH = 1;
    let atlasKey = "";

    const drawFontPx = () => live.current.fontSpec.size * (boxW / REF_WIDTH);

    const resize = () => {
      boxW = Math.max(1, host!.offsetWidth);
      boxH = Math.max(1, host!.offsetHeight);
      dpr = Math.min(MAX_DPR, window.devicePixelRatio || 1);
      const w = Math.max(1, Math.round(boxW * dpr));
      const h = Math.max(1, Math.round(boxH * dpr));
      if (w === bufW && h === bufH) return;
      bufW = w;
      bufH = h;
      canvas!.width = w;
      canvas!.height = h;
    };

    const rebuildAtlas = () => {
      const L = live.current;
      const f = L.fontSpec;
      const px = Math.max(8, drawFontPx());
      const atlas = buildAtlas(L.text || " ", f, px, dpr);
      if (!atlas) return;
      atlasRatioW = Math.max(1e-4, atlas.cssW / px);
      atlasRatioH = Math.max(1e-4, atlas.cssH / px);

      if (typeof document !== "undefined" && document.fonts) {
        try {
          const probe = fontString(f, 64);
          if (!document.fonts.check(probe)) {
            const again = () => {
              if (alive) atlasKey = "";
            };
            document.fonts.load(probe, L.text).then(again, again);
          }
        } catch (e) {
          /* noop */
        }
      }
      gl!.bindTexture(gl!.TEXTURE_2D, tex);
      gl!.pixelStorei(gl!.UNPACK_FLIP_Y_WEBGL, true);
      gl!.texImage2D(
        gl!.TEXTURE_2D,
        0,
        gl!.RGBA,
        gl!.RGBA,
        gl!.UNSIGNED_BYTE,
        atlas.canvas,
      );
      gl!.pixelStorei(gl!.UNPACK_FLIP_Y_WEBGL, false);
      const cw = atlas.canvas.width;
      const ch = atlas.canvas.height;
      const pot = (cw & (cw - 1)) === 0 && (ch & (ch - 1)) === 0;

      if (isGL2 || pot) {
        gl!.generateMipmap(gl!.TEXTURE_2D);
        gl!.texParameteri(
          gl!.TEXTURE_2D,
          gl!.TEXTURE_MIN_FILTER,
          gl!.LINEAR_MIPMAP_LINEAR,
        );
      } else {
        gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MIN_FILTER, gl!.LINEAR);
      }
    };

    const target = { x: -0.5, y: 0.5 };
    const eased = { x: -0.5, y: 0.5 };
    const cells: { x: number; y: number }[] = [];
    const verts: { x: number; y: number }[] = [];
    for (let i = 0; i < HANDLES; i += 1) {
      cells.push({ x: -0.5, y: 0.5 });
      verts.push({ x: -0.5, y: 0.5 });
    }
    let hasPointer = false;
    let sweepClock = 0;
    let driftT = 0;

    const snap = (x: number, y: number, cw: number, ch: number) => {
      const cx = Math.floor(x / cw);
      const cy = Math.floor(y / ch);
      const found: { x: number; y: number; d: number }[] = [];
      for (let i = -1; i <= 1; i += 1) {
        for (let j = -1; j <= 1; j += 1) {
          const px = (cx + i + 0.5) * cw;
          const py = (cy + j + 0.5) * ch;
          found.push({ x: px, y: py, d: Math.hypot(px - x, py - y) });
        }
      }
      found.sort((a, b) => a.d - b.d);
      for (let i = 0; i < HANDLES; i += 1) {
        cells[i].x = found[i + 1].x;
        cells[i].y = found[i + 1].y;
      }
    };

    const onMove = (e: PointerEvent) => {
      hasPointer = true;
      const r = host!.getBoundingClientRect();
      if (r.width <= 0 || r.height <= 0) return;
      target.x = (e.clientX - r.left) / r.width;
      target.y = 1 - (e.clientY - r.top) / r.height;
    };
    host.addEventListener("pointermove", onMove);

    let raf = 0;
    let last = 0;
    let running = true;

    const sync = () => {
      const L = live.current;
      if (boxDirty) {
        boxDirty = false;
        resize();
      }
      const f = L.fontSpec;
      const key = [
        L.text,
        f.family,
        f.weight,
        f.style,
        f.letterSpacing,
        dpr,
        Math.ceil(Math.max(8, drawFontPx()) / 64),
      ].join("|");
      if (key !== atlasKey) {
        atlasKey = key;
        rebuildAtlas();
      }
    };

    const step = (dt: number) => {
      const L = live.current;
      const rate = Math.max(0, L.speed) / SPEED_REF;
      const cw = Math.max(0.01, L.hg.spread / 100);
      const ch = cw * CELL_ASPECT;
      const aspect = boxW / boxH;

      if (!hasPointer) {
        const band = (atlasRatioH * Math.max(8, drawFontPx())) / boxH;
        target.x += dt * SWEEP_RATE * rate;
        target.y = (1 - band) / 2 + SWEEP_BAND * band;
        if (target.x > 1.5) {
          target.x = -0.5;
          eased.x = -0.5;
        }
        sweepClock += dt;
        if (sweepClock >= RESNAP) {
          sweepClock = 0;
          snap(target.x * aspect, target.y, cw, ch);
        }
      } else {
        snap(target.x * aspect, target.y, cw, ch);
      }

      const damp = clamp((L.damping / 100) * DAMP_REF * dt, 0, 1);
      eased.x += (target.x - eased.x) * damp;
      eased.y += (target.y - eased.y) * damp;

      driftT += dt * rate;
      for (let i = 0; i < HANDLES; i += 1) {
        const c = cells[i];
        const sx = Math.round(c.x / cw - 0.5);
        const sy = Math.round(c.y / ch - 0.5);
        const h1 = fract(Math.sin(sx * 127.1 + sy * 311.7) * 43758.5453);
        const h2 = fract(Math.sin(sx * 269.5 + sy * 183.3) * 43758.5453);
        verts[i].x =
          c.x + DRIFT_X * cw * Math.sin(driftT * DRIFT_RATE + h1 * Math.PI * 2);
        verts[i].y =
          c.y +
          DRIFT_Y * ch * Math.sin(driftT * DRIFT_RATE_Y + h2 * Math.PI * 2);
      }
    };

    const writeLabels = () => {
      const L = live.current;
      const aspect = boxW / boxH;
      const half = L.hg.size / 2;
      for (let i = 0; i < HANDLES; i += 1) {
        const el = labelRefs.current[i];
        if (!el) continue;
        const bx = verts[i].x / aspect;
        const by = verts[i].y;
        const gx = Math.round(clamp(bx * 100, 0, 100));
        const gy = Math.round(clamp(by * 100, 0, 100));
        el.style.transform = `translate(${bx * boxW - half}px, ${
          (1 - by) * boxH - half
        }px)`;
        el.style.opacity = String(LABEL_MAX);
        el.textContent = `${gx}, ${gy}`;
      }
    };

    const draw = () => {
      const L = live.current;
      const tc = parseColor(L.textColor, [0.859, 0.918, 0.992, 1]);
      const sc = parseColor(L.shade, [0.035, 0.063, 0.102, 1]);
      const ac = L.accentRGBA;

      gl!.viewport(0, 0, bufW, bufH);
      gl!.useProgram(prog);
      gl!.uniform1i(U.map, 0);
      gl!.activeTexture(gl!.TEXTURE0);
      gl!.bindTexture(gl!.TEXTURE_2D, tex);
      gl!.uniform2f(U.res, boxW, boxH);
      const px = Math.max(8, drawFontPx());
      gl!.uniform2f(U.atlas, atlasRatioW * px, atlasRatioH * px);
      gl!.uniform2f(U.ptr, eased.x, eased.y);
      gl!.uniform1f(U.reach, Math.max(1, L.reach) / boxW);
      gl!.uniform3f(U.text, tc[0], tc[1], tc[2]);
      gl!.uniform3f(U.shade, sc[0], sc[1], sc[2]);
      gl!.uniform4f(U.accent, ac[0], ac[1], ac[2], ac[3]);
      gl!.uniform2f(U.v0, verts[0].x, verts[0].y);
      gl!.uniform2f(U.v1, verts[1].x, verts[1].y);
      gl!.uniform2f(U.v2, verts[2].x, verts[2].y);
      gl!.uniform1f(U.half, L.hg.size / 2 / boxH);
      gl!.drawArrays(gl!.TRIANGLE_STRIP, 0, 4);
    };

    const frame = (now: number) => {
      const dt = last ? Math.min(0.1, (now - last) / 1000) : 0;
      last = now;
      sync();
      step(dt);
      writeLabels();
      draw();
      raf = requestAnimationFrame(frame);
    };

    const gate = () => {
      if (running && !document.hidden) {
        if (!raf) {
          last = 0;
          raf = requestAnimationFrame(frame);
        }
      } else if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };

    const ro = new ResizeObserver(() => {
      boxDirty = true;
    });
    ro.observe(host);
    document.addEventListener("visibilitychange", gate);

    if (typeof document !== "undefined" && document.fonts) {
      document.fonts.ready.then(
        () => {
          if (alive) atlasKey = "";
        },
        () => {},
      );
    }

    gate();

    return () => {
      alive = false;
      running = false;
      if (raf) cancelAnimationFrame(raf);
      ro.disconnect();
      host.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", gate);
    };
  }, [hostRef, canvasRef, labelRefs, live]);
}

function __OriginkitBase_VectorWordmark(props: VectorWordmarkProps) {
  const {
    text = "VECTOR",
    font = {
      fontFamily: "Inter",
      fontWeight: 800,
      fontSize: "200px",
      lineHeight: "1em",
      letterSpacing: "-0.02em",
      textAlign: "left",
    } as React.CSSProperties,
    background = "#000000",
    textColor = "#FFFFFF",
    shade = "#FFFFFF",
    accent = "#FFFFFF",
    reach = 290,
    speed = 50,
    damping = 60,
    handles,
    style,
  } = props;

  const hg: HandleGroup = { ...HANDLE_DEFAULTS, ...(handles ?? {}) };

  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const labelRefs = useRef<(HTMLDivElement | null)[]>([null, null, null]);

  const rawSize = font?.fontSize;
  const fontSpec: FontSpec = {
    family: (font?.fontFamily as string) || "Inter, system-ui, sans-serif",
    weight: String(font?.fontWeight ?? 500),
    style: font?.fontStyle === "italic" ? "italic" : "normal",
    size: Math.max(8, parseFloat(String(rawSize ?? 240)) || 240),
    letterSpacing: String(font?.letterSpacing ?? "0px"),
  };

  const accentRGBA = parseColor(accent, [1, 1, 1, 0.4]);
  const labelColor = `rgb(${Math.round(accentRGBA[0] * 255)}, ${Math.round(
    accentRGBA[1] * 255,
  )}, ${Math.round(accentRGBA[2] * 255)})`;

  const live = useRef({
    text,
    fontSpec,
    textColor,
    shade,
    background,
    accentRGBA,
    reach,
    speed,
    damping,
    hg,
  });
  live.current.text = text;
  live.current.fontSpec = fontSpec;
  live.current.textColor = textColor;
  live.current.shade = shade;
  live.current.background = background;
  live.current.accentRGBA = accentRGBA;
  live.current.reach = reach;
  live.current.speed = speed;
  live.current.damping = damping;
  live.current.hg = hg;

  useVectorWordmark(hostRef, canvasRef, labelRefs, live);

  return (
    <div
      ref={hostRef}
      style={{
        position: "relative",
        overflow: "hidden",
        background,
        minWidth: 1200,
        minHeight: 800,
        width: "100%",
        height: "100%",
        ...style,
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          display: "block",
        }}
      />
      {hg.labels
        ? [0, 1, 2].map((i) => (
            <div
              key={i}
              ref={(el) => {
                labelRefs.current[i] = el;
              }}
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                opacity: LABEL_MAX,
                pointerEvents: "none",
                whiteSpace: "nowrap",
                fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                fontSize: 11,
                letterSpacing: "0.08em",
                color: labelColor,
              }}
            />
          ))
        : null}
    </div>
  );
}

const __originkitPresetProps = {
  text: "LUXEN\nDIGITAL",
  handles: {
    size: 109,
    spread: 27,
    labels: true,
  },
};

export default function VectorWordmark(props: Record<string, unknown>) {
  return (
    <__OriginkitBase_VectorWordmark
      {...(__originkitPresetProps as Record<string, unknown>)}
      {...props}
    />
  );
}
