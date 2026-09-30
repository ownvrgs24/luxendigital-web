import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { Reveal } from "@/components/motion/Reveal";
import { useBooking } from "@/components/BookingModal";

// ── Wave constants ──────────────────────────────────────────────────────
/** How fast a wavefront travels outward, px/sec. Slow enough to read. */
const WAVE_SPEED = 118;
/** One wavefront emitted this often, ms. Sets the spacing between rings. */
const EMIT_MS = 430;
/** e-folds/sec the circle chases the pointer. Higher = tighter to the hand. */
const FOLLOW = 11;
/** Peak stroke alpha of a freshly emitted ring. */
const WAVE_ALPHA = 0.2;

type Wave = { x: number; y: number; born: number };

export function FinalCTA() {
  const { open } = useBooking();
  const reduce = useReducedMotion();

  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Where the circle should be (pointer, or its resting spot) and where it
  // actually is. Both live in refs: this runs per animation frame and must
  // never re-render React.
  const targetRef = useRef({ x: 0, y: 0 });
  const posRef = useRef({ x: 0, y: 0 });
  const homeRef = useRef({ x: 0, y: 0 });
  const seededRef = useRef(false);

  // The circle only replaces the cursor where there *is* a cursor, and only
  // when the visitor hasn't asked for less motion.
  const [tracking, setTracking] = useState(false);

  // Only a real cursor gets replaced by the circle. Without one (touch) or
  // with reduced motion, the circle is an ordinary in-flow button under the
  // copy instead of an overlay parked on top of the headline.
  const [fine, setFine] = useState(
    () => window.matchMedia("(hover: hover) and (pointer: fine)").matches,
  );
  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const sync = () => setFine(mq.matches);
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  const floating = fine && !reduce;

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    const heading = headingRef.current;
    const button = buttonRef.current;
    if (!section || !canvas || !heading || !button) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;

    /** The circle's resting spot: the middle of the headline. */
    const measure = () => {
      const s = section.getBoundingClientRect();
      const hd = heading.getBoundingClientRect();
      w = s.width;
      h = s.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      homeRef.current = {
        x: hd.left - s.left + hd.width / 2,
        y: hd.top - s.top + hd.height / 2,
      };
      if (!seededRef.current) {
        seededRef.current = true;
        posRef.current = { ...homeRef.current };
        targetRef.current = { ...homeRef.current };
      }
    };
    const place = () => {
      const { x, y } = posRef.current;
      button.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
    };

    // ── No cursor to replace (touch), or reduced motion: no travelling
    //    waves, no chase. Draw the rings once as a static set.
    if (!floating) {
      // Drop any transform a previous cursor-chase left behind.
      button.style.transform = "";
      const render = () => {
        measure();
        ctx.clearRect(0, 0, w, h);
        const { x, y } = homeRef.current;
        for (let r = 180; r < Math.hypot(w, h) * 0.62; r += 155) {
          ctx.beginPath();
          ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.strokeStyle = "rgba(255,255,255,0.055)";
          ctx.stroke();
        }
      };
      render();
      const roStatic = new ResizeObserver(render);
      roStatic.observe(section);
      return () => roStatic.disconnect();
    }

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(section);

    // ── Pointer ───────────────────────────────────────────────────────
    const onMove = (e: PointerEvent) => {
      const s = section.getBoundingClientRect();
      targetRef.current = { x: e.clientX - s.left, y: e.clientY - s.top };
      setTracking(true);
    };
    const onLeave = () => {
      targetRef.current = { ...homeRef.current };
      setTracking(false);
    };
    section.addEventListener("pointermove", onMove);
    section.addEventListener("pointerleave", onLeave);

    // ── Frame loop ────────────────────────────────────────────────────
    const waves: Wave[] = [];
    let raf = 0;
    let last = -1;
    let lastEmit = 0;

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = last < 0 ? 0 : Math.min(Math.max((now - last) / 1000, 0), 0.1);
      last = now;

      // Chase the pointer. Exponential follow, framed in dt so it feels the
      // same at 60Hz and 120Hz.
      const p = posRef.current;
      const t = targetRef.current;
      const k = 1 - Math.exp(-dt * FOLLOW);
      p.x += (t.x - p.x) * k;
      p.y += (t.y - p.y) * k;
      place();

      // Emit a wavefront at wherever the source is *right now*, and leave it
      // anchored there forever. That single detail is the Doppler effect:
      // a moving source leaves each ring behind at its birthplace, so the
      // rings crowd together ahead of the motion and stretch out behind it.
      if (now - lastEmit >= EMIT_MS) {
        lastEmit = now;
        waves.push({ x: p.x, y: p.y, born: now });
      }

      const maxR = Math.hypot(w, h) * 0.62;
      ctx.clearRect(0, 0, w, h);
      for (let i = waves.length - 1; i >= 0; i--) {
        const wv = waves[i];
        const r = ((now - wv.born) / 1000) * WAVE_SPEED;
        if (r > maxR) {
          waves.splice(i, 1);
          continue;
        }
        // Fade as it travels, and ease the first moments in so a new ring
        // doesn't pop into existence under the circle.
        const life = r / maxR;
        const a = WAVE_ALPHA * (1 - life) * Math.min(r / 60, 1);
        ctx.beginPath();
        ctx.arc(wv.x, wv.y, r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255,255,255,${a})`;
        ctx.stroke();
      }
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      section.removeEventListener("pointermove", onMove);
      section.removeEventListener("pointerleave", onLeave);
    };
  }, [floating]);

  return (
    <section
      id="contact"
      ref={sectionRef}
      // The circle stands in for the pointer while it is over the section.
      style={tracking ? { cursor: "none" } : undefined}
      className="relative isolate select-none overflow-hidden bg-primary py-24 text-primary-foreground sm:py-32"
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 h-full w-full"
      />

      <div className="mx-auto max-w-3xl px-6 text-center">
        <Reveal>
          <h2
            ref={headingRef}
            className="mx-auto max-w-[16ch] font-display text-4xl leading-[0.95] tracking-tight text-balance sm:text-6xl lg:text-7xl"
          >
            Ready to build a business that never stops working?
          </h2>
        </Reveal>

        <Reveal delay={0.15}>
          <p className="mx-auto mt-10 max-w-sm text-base leading-relaxed text-primary-foreground/55 sm:mt-12">
            Let's build something your competitors can't copy. No pressure, no
            obligation — just a real conversation about your business.
          </p>
        </Reveal>
      </div>

      {/* The circle itself. Positioned from the section's top-left and moved
          only by transform, so following the pointer never triggers layout.
          It stays a real button: reachable by Tab, and the click target
          wherever it happens to be. */}
      <button
        ref={buttonRef}
        onClick={open}
        className={`group flex h-24 w-24 items-center justify-center rounded-full text-center font-display text-[11px] leading-[1.15] tracking-[0.08em] text-accent-foreground transition-[box-shadow,scale] duration-500 ease-out hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-[hsl(var(--primary))] motion-reduce:transition-none sm:h-32 sm:w-32 sm:text-xs lg:h-36 lg:w-36 lg:text-sm ${
          floating ? "absolute left-0 top-0" : "relative mx-auto mt-14 sm:mt-16"
        }`}
        style={{
          // The same gradient as .btn-gold, applied directly rather than via
          // the class: .btn-gold carries `transition: all`, which would fight
          // the per-frame transform the cursor loop writes and smear the follow.
          backgroundImage:
            "linear-gradient(120deg, hsl(40 85% 44%) 0%, hsl(45 92% 56%) 50%, hsl(42 88% 50%) 100%)",
          boxShadow:
            "0 0 90px 26px hsl(var(--accent) / 0.42), 0 0 180px 60px hsl(var(--accent) / 0.16)",
        }}
      >
        Let's
        <br />
        Talk
      </button>
    </section>
  );
}
