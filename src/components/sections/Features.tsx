import { useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  useReducedMotion,
} from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import MetalRosette from "@/components/originkit/ui/metal-rosette-custom-style";

type Feature = { title: string; desc: string };

const features: Feature[] = [
  {
    title: "High-Converting Websites",
    desc: "Build trust instantly, explain your services clearly, and turn more visitors into calls, forms, and booked appointments.",
  },
  {
    title: "Lead Capture",
    desc: "Capture every inquiry from your website, forms, chat, and other channels, then organize every lead in one place.",
  },
  {
    title: "Instant Lead Follow-Up",
    desc: "Automatically send the right text and email follow-ups so new leads receive a fast response, even when you are busy.",
  },
  {
    title: "Missed-Call Text Back",
    desc: "When you cannot answer the phone, an automatic text lets the caller know you will follow up, recovering opportunities that would otherwise be lost.",
  },
  {
    title: "Appointment Booking",
    desc: "Let customers view your availability and book appointments without the back-and-forth.",
  },
  {
    title: "CRM & Pipeline Management",
    desc: "See every lead, conversation, appointment, and opportunity from one simple dashboard.",
  },
  {
    title: "Google Review Requests",
    desc: "Automatically request reviews from satisfied customers and build the reputation that wins future business.",
  },
  {
    title: "AI-Powered Communication",
    desc: "Use AI to help answer common questions, respond faster, and keep conversations moving when you are not available.",
  },
];

const N = features.length;

const clamp = (x: number, a: number, b: number) => (x < a ? a : x > b ? b : x);
const ease = [0.22, 1, 0.36, 1] as const;

export function Features() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const isMobile = useIsMobile();

  // ── Scroll distances (named constants) ────────────────────────────────
  // Phase A — Slides: 8 × STEP_VH. Phase B — Hold: HOLD_VH.
  // No Phase C scroll distance: CSS sticky releases the pin naturally when
  // the container ends — the section scrolls away at 1:1 speed, no fade.
  const STEP_VH = isMobile ? 45 : 70;
  const HOLD_VH = isMobile ? 50 : 70;
  const phaseAVh = STEP_VH * N;
  const totalVh = phaseAVh + HOLD_VH;
  // A_END = fraction of total scroll progress where Phase A ends.
  const A_END = phaseAVh / totalVh;

  // ── Single source of truth ────────────────────────────────────────────
  // One scroll progress value drives EVERYTHING: counter, heading, dots,
  // completion line (scaleX), and the cube formation. The MetalRosette
  // reads these refs directly in its WebGL RAF loop — no React re-renders,
  // never lags.
  const formationRef = useRef(0); // 0-7: which formation
  const localTRef = useRef(0); // 0-1: morph progress within formation
  const exitTRef = useRef(0); // 0-1: eases idle rotation to a stop

  const { scrollYProgress } = useScroll({
    target: pinRef,
    offset: ["start start", "end end"],
  });

  // ── Completion line — bound DIRECTLY to scroll progress via scaleX ─────
  // No React state, no width animation, no lag. Reaches scaleX(1) exactly
  // when step 08's formation finishes settling (start of Phase B).
  const lineScaleX = useTransform(scrollYProgress, [0, A_END], [0, 1]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    // ── Derive everything from one value ──────────────────────────────
    const phaseA = clamp(latest / A_END, 0, 1); // 0-1 across slides
    const rawStep = phaseA * N; // 0-8
    const idx = clamp(Math.floor(rawStep), 0, N - 1); // 0-7
    const lt = rawStep - idx; // 0-1 within step

    // Once Phase A is done, lock to the final formation.
    if (latest >= A_END) {
      formationRef.current = N - 1;
      localTRef.current = 1;
    } else {
      formationRef.current = idx;
      localTRef.current = lt;
    }

    // Exit progress — eases idle rotation to a stop during the hold.
    exitTRef.current = clamp((latest - A_END) / (1 - A_END), 0, 1);

    // UI state (same value; discrete toggles are safe in React state).
    setActiveIndex(latest >= A_END ? N - 1 : idx);
    setIsComplete(latest >= A_END);
  });

  // Click a dot → scroll to that step's hold zone (localT ≈ 0.7)
  const scrollToStep = (i: number) => {
    const container = pinRef.current;
    if (!container) return;
    const pap = (i + 0.7) / N;
    const targetProgress = pap * A_END;
    const rect = container.getBoundingClientRect();
    const containerTop = rect.top + window.scrollY;
    const scrollable = container.offsetHeight - window.innerHeight;
    window.scrollTo({
      top: containerTop + targetProgress * scrollable,
      behavior: reduce ? "auto" : "smooth",
    });
  };

  return (
    <section
      id="features"
      ref={sectionRef}
      className={`relative isolate bg-background ${isComplete ? "is-complete" : ""}`}
    >
      {/* Intro — scrolls away naturally before the pin starts. No fade hack. */}
      <div className="mx-auto max-w-3xl px-6 pt-14 pb-10 text-center lg:pt-16">
        <p className="text-sm font-medium uppercase tracking-[0.25em] text-accent">
          Features
        </p>
        <h2 className="mt-3 font-display text-3xl font-medium tracking-tight text-balance sm:text-4xl lg:text-5xl">
          One connected system to attract, convert, and retain more customers.
        </h2>
        <p className="mt-3 text-base leading-relaxed text-muted-foreground">
          Your website, CRM, follow-up, booking, and reviews — all in one
          system. Fewer opportunities fall through the cracks.
        </p>
      </div>

      {/* Pinned scroll-controlled stage.
          The container height = Phase A + Phase B scroll distance.
          CSS sticky pins the inner grid for that distance, then releases
          naturally — the section scrolls away at 1:1 speed with no fade,
          no gap, no overlap with the next section. */}
      <div ref={pinRef} style={{ height: `${totalVh}vh` }}>
        <div className="sticky top-0 flex h-[100svh] flex-col items-center justify-center overflow-hidden px-6">
          <div className="grid w-full max-w-6xl grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-14">
            {/* ════════════ LEFT COLUMN — Metal Rosette ════════════
                 No card, box, border, shadow, or background. The rosette
                 stays centered here at ALL times — only spin / tilt / morph
                 animations are driven by scroll. No translateY, top/bottom
                 offsets, or scroll-linked position changes. Col 1 has an
                 explicit aspect-square size so the WebGL canvas has real
                 dimensions to fill, and is contained so nothing escapes. */}
            <div
              className="relative z-10 mx-auto aspect-square w-full max-w-[22rem] overflow-hidden md:max-w-[30rem] lg:max-w-[34rem]"
              style={{ contain: "layout paint" }}
            >
              <MetalRosette
                background="transparent"
                baseColor="#FFD168"
                distance={32}
                material={{ reflect: 65, roughness: 90 }}
                motion={{ hold: 48, spin: 90, travel: 178 }}
                camera={{ tilt: 35, sideTilt: 0 }}
                formationRef={formationRef}
                localTRef={localTRef}
                exitTRef={exitTRef}
                reverse
                style={{ width: "100%", height: "100%" }}
              />
            </div>

            {/* ════════════ RIGHT COLUMN — Labels / text ════════════ */}
            <div className="relative z-10 flex flex-col justify-center">
              {/* Step counter + completion line (typographic structure, no container) */}
              <div className="mb-5 flex items-center gap-3">
                <span
                  className={`font-mono text-[11px] font-medium tracking-[0.2em] transition-colors duration-300 ${
                    isComplete ? "text-accent" : "text-accent"
                  }`}
                >
                  {String(activeIndex + 1).padStart(2, "0")} /{" "}
                  {String(N).padStart(2, "0")}
                </span>
                {/* Completion line — track (neutral) + fill (gold) via scaleX.
                     Bound directly to scroll progress: no React state, no
                     width animation, no lag. Reaches scaleX(1) exactly when
                     step 08 settles. A restrained line, not a glowing border. */}
                <div className="relative h-px flex-1 overflow-hidden bg-border">
                  <motion.div
                    className="absolute inset-y-0 left-0 w-full bg-accent"
                    style={{
                      scaleX: lineScaleX,
                      transformOrigin: "left center",
                    }}
                  />
                </div>
              </div>

              {/* Active label — outgoing fully leaves before incoming arrives.
                    mode="wait" guarantees no two headings visible at once.
                    Text swap happens at the same threshold as the cube morph
                    start (step boundary = localT 0). */}
              <div className="relative min-h-[160px] sm:min-h-[200px] lg:min-h-[220px]">
                {/* Synced text — NO mode="wait". A crossfade keeps the heading
                     locked to activeIndex. mode="wait" queued transitions and
                     lagged several steps behind the counter on fast scroll. */}
                {features.map((f, i) => (
                  <motion.div
                    key={i}
                    initial={false}
                    animate={{
                      opacity: i === activeIndex ? 1 : 0,
                      y: i === activeIndex ? 0 : reduce ? 0 : 12,
                    }}
                    transition={{ duration: reduce ? 0.15 : 0.3, ease }}
                    className="absolute inset-x-0"
                    style={{
                      pointerEvents: i === activeIndex ? "auto" : "none",
                    }}
                  >
                    <h3 className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
                      {f.title}
                    </h3>
                    <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
                      {f.desc}
                    </p>
                  </motion.div>
                ))}
              </div>

              {/* Pagination dots — one per stage, clickable, restrained */}
              <div className="mt-6 flex items-center gap-1">
                {features.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => scrollToStep(i)}
                    aria-label={`Go to step ${i + 1}: ${features[i].title}`}
                    className="group flex h-6 w-6 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    <span
                      className={`block rounded-full transition-all duration-300 ${
                        i === activeIndex
                          ? "h-1.5 w-8 bg-accent"
                          : i < activeIndex || isComplete
                            ? "h-1.5 w-1.5 bg-accent/50"
                            : "h-1.5 w-1.5 bg-muted-foreground/30 group-hover:bg-muted-foreground/50"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
