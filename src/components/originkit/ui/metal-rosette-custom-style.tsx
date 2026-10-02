"use client";

import * as React from "react";
import { useEffect, useRef } from "react";
import { VERT, FRAG } from "@/components/originkit/rosette/shaders";
import {
  buildRosette,
  CELL,
  type V3,
} from "@/components/originkit/rosette/geometry";
import {
  FORMATIONS,
  armExtension,
  fitScale,
  sampleFormation,
  parseLinearColor,
} from "@/components/originkit/rosette/formations";

const DPR_CAP = 2;
const CYCLE_SEC_AT_50 = 3.45;
const YAW_DEG = 45;
const FOV_DEG = 28;
const TAU = Math.PI * 2;

// ── Tunable constants ──────────────────────────────────────────────────
// CUBE_FIT: target on-screen span, in cells, of a *solid* cube (ext 0).
//   A fixed scale can't serve both ends: the solid cube spans 1 cell and
//   the fully exploded rosette spans ~4.6, so one of the two is always
//   tiny. The scale is normalised by span^FIT_FALLOFF instead — see the
//   frame loop. At distance 32 / FOV 28° the visible frame is ~16 cells.
const CUBE_FIT = 5.0;
// FIT_FALLOFF: 1 = every formation renders at an identical size (dead);
//   0 = no normalisation (the original problem). 0.75 keeps the silhouette
//   stable while still letting the open formations read as bigger.
const FIT_FALLOFF = 0.75;
// FOLLOW_RATE: how fast the rendered progress chases the scroll-written
//   target, in e-folds/sec. Higher = tighter to the finger, lower = more
//   glide. ~9 reads as "connected but not twitchy".
const FOLLOW_RATE = 9;

interface MaterialProps {
  roughness: number;
  reflect: number;
}
interface MotionProps {
  spin: number;
  travel: number;
  hold: number;
}
interface CameraProps {
  tilt: number;
  sideTilt: number;
}

interface Props {
  background: string;
  baseColor: string;
  speed: number;
  distance: number;
  material: Partial<MaterialProps>;
  motion: Partial<MotionProps>;
  camera: Partial<CameraProps>;
  style?: React.CSSProperties;
  /** Continuous formation progress, 0 → FORMATIONS.length - 1. Scroll
   *  writes it; the frame loop smooths it and interpolates between
   *  formations. When provided the rosette is fully scroll-scrubbed —
   *  it has no motion of its own. */
  progressRef?: React.RefObject<number>;
  /** Reverse the rosette's rotation direction. */
  reverse?: boolean;
}

const DEF_MATERIAL: MaterialProps = { roughness: 18, reflect: 90 };
const DEF_MOTION: MotionProps = { spin: 18, travel: 100, hold: 48 };
const DEF_CAMERA: CameraProps = { tilt: 35, sideTilt: 0 };
const DEF_BASE_LINEAR: V3 = [0.68, 0.71, 0.75];

function OriginkitBaseMetalRosette(props: Partial<Props>) {
  const {
    background = "#000000",
    baseColor = "#A5A5A5",
    speed = 50,
    distance = 30,
    style,
    progressRef,
    reverse = false,
  } = props;

  const material = { ...DEF_MATERIAL, ...(props.material || {}) };
  const motion = { ...DEF_MOTION, ...(props.motion || {}) };
  const camera = { ...DEF_CAMERA, ...(props.camera || {}) };

  const hostRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const live = useRef({
    baseColor,
    speed,
    distance,
    roughness: material.roughness,
    reflect: material.reflect,
    spin: motion.spin,
    travel: motion.travel,
    hold: motion.hold,
    tilt: camera.tilt,
    sideTilt: camera.sideTilt,
    progressRef,
    reverse,
  });
  live.current = {
    baseColor,
    speed,
    distance,
    roughness: material.roughness,
    reflect: material.reflect,
    spin: motion.spin,
    travel: motion.travel,
    hold: motion.hold,
    tilt: camera.tilt,
    sideTilt: camera.sideTilt,
    progressRef,
    reverse,
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", {
      alpha: true,
      antialias: true,
      depth: true,
      premultipliedAlpha: true,
    }) as WebGLRenderingContext | null;
    if (!gl) return;

    const compile = (type: number, src: string) => {
      const sh = gl.createShader(type)!;
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        console.error("MetalRosette shader:", gl.getShaderInfoLog(sh));
      }
      return sh;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error("MetalRosette link:", gl.getProgramInfoLog(prog));
      return;
    }
    gl.useProgram(prog);

    const geo = buildRosette();
    const mkBuf = (data: Float32Array, name: string, size: number) => {
      const b = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, b);
      gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
      const loc = gl.getAttribLocation(prog, name);
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 0, 0);
      return b;
    };
    mkBuf(geo.pos, "aPos", 3);
    mkBuf(geo.nrm, "aNrm", 3);
    mkBuf(geo.arm, "aArm", 3);
    const ibo = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, geo.idx, gl.STATIC_DRAW);

    const U = (n: string) => gl.getUniformLocation(prog, n);
    const uSpin = U("uSpin");
    const uYaw = U("uYaw");
    const uPitch = U("uPitch");
    const uRoll = U("uRoll");
    const uDist = U("uDist");
    const uFov = U("uFov");
    const uTravel = U("uTravel");
    const uAspect = U("uAspect");
    const uScale = U("uScale");
    const uCamPos = U("uCamPos");
    const uBase = U("uBase");
    const uRough = U("uRough");
    const uReflect = U("uReflect");

    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LESS);
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);
    gl.frontFace(gl.CCW);
    gl.clearColor(0, 0, 0, 0);

    let bw = 0;
    let bh = 0;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP);
      const w = Math.max(1, Math.round(canvas.clientWidth * dpr));
      const h = Math.max(1, Math.round(canvas.clientHeight * dpr));
      if (w === bw && h === bh) return;
      bw = w;
      bh = h;
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    let raf = 0;
    let last = -1;
    let spinAngle = 0;
    let cycle = 0;
    let smoothP = -1; // < 0 = not yet seeded from the scroll target
    let ext = 0;
    let pitchDeg = 35;
    const D2R = Math.PI / 180;
    const MAX_P = FORMATIONS.length - 1;

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = last < 0 ? 0 : Math.min(Math.max((now - last) / 1000, 0), 0.1);
      last = now;
      const L = live.current;

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const dir = L.reverse ? -1 : 1;

      // ── Scroll-scrubbed mode ─────────────────────────────────────
      // One continuous progress value (0 → MAX_P) is the only input.
      // There is no motion of the rosette's own: stop scrolling and it
      // settles. Scroll back and the morph reverses exactly.
      if (L.progressRef) {
        const target = Math.max(
          0,
          Math.min(MAX_P, L.progressRef.current ?? 0),
        );

        // Exponential follow, framed in dt so it behaves the same at
        // 60Hz and 120Hz. This is what turns a stepwise scroll signal
        // (and a trackpad's spiky deltas) into continuous motion.
        if (smoothP < 0 || reduceMotion) smoothP = target;
        else smoothP += (target - smoothP) * (1 - Math.exp(-dt * FOLLOW_RATE));

        const shape = sampleFormation(smoothP);
        ext = shape.ext;
        pitchDeg = shape.pitch;
        spinAngle = shape.spin * TAU * dir;
      } else {
        // ── Autoplay fallback ──
        spinAngle = (spinAngle + dt * L.spin * D2R * dir) % TAU;
        const rate = L.speed / 50;
        if (rate > 0) cycle = (cycle + (dt * rate) / CYCLE_SEC_AT_50) % 1;
        ext = armExtension(cycle, L.hold / 100);
        pitchDeg = L.tilt;
      }

      resize();
      const pitch = pitchDeg * D2R;
      const yaw = YAW_DEG * D2R;
      const d = L.distance;
      gl.uniform1f(uSpin, spinAngle);
      gl.uniform1f(uYaw, yaw);
      gl.uniform1f(uPitch, pitch);
      gl.uniform1f(uRoll, L.sideTilt * D2R);
      gl.uniform1f(uDist, d);
      gl.uniform1f(uFov, FOV_DEG * D2R);
      const travel = ext * (L.travel / 100) * CELL;
      gl.uniform1f(uTravel, travel);
      gl.uniform1f(uAspect, bw / Math.max(bh, 1));
      gl.uniform1f(uScale, fitScale(travel, CUBE_FIT, FIT_FALLOFF, CELL));
      gl.uniform3f(
        uCamPos,
        Math.sin(yaw) * Math.cos(pitch) * d,
        Math.sin(pitch) * d,
        Math.cos(yaw) * Math.cos(pitch) * d,
      );
      const base = parseLinearColor(L.baseColor, DEF_BASE_LINEAR);
      gl.uniform3f(uBase, base[0], base[1], base[2]);
      gl.uniform1f(uRough, Math.min(Math.max(L.roughness / 100, 0), 1));
      gl.uniform1f(uReflect, Math.min(Math.max(L.reflect / 100, 0), 1));

      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.drawElements(gl.TRIANGLES, geo.idx.length, gl.UNSIGNED_SHORT, 0);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return (
    <div
      ref={hostRef}
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "hidden",
        background,
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
    </div>
  );
}

const __originkitPresetProps = {
  background: "#FFFFFF",
  baseColor: "#FFD168",
  speed: 50,
  distance: 30,
  material: { reflect: 50, roughness: 100 },
  motion: { hold: 48, spin: 90, travel: 178 },
  camera: { tilt: 35, sideTilt: 0 },
};

export default function MetalRosette(props: Record<string, unknown>) {
  return (
    <OriginkitBaseMetalRosette
      {...(__originkitPresetProps as Record<string, unknown>)}
      {...props}
    />
  );
}
