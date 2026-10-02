import { EASE } from "@/components/motion/Reveal";
import { useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  useReducedMotion,
} from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useBooking } from "@/components/BookingModal";
import { RollLabel } from "@/components/motion/RollLabel";
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
// Progress runs 0 → N-1: one unit per transition between formations, not
// one per feature. Formation i is reached exactly at progress i.
const MAX_P = N - 1;

const clamp = (x: number, a: number, b: number) => (x < a ? a : x > b ? b : x);

export function Features() {
  const { open } = useBooking();
  const pinRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const isMobile = useIsMobile();

  // ── Scroll budget ─────────────────────────────────────────────────────
  // Phase A — scrub: MAX_P transitions × STEP_VH. Phase B — hold: the last
  // formation rests on screen briefly before the pin releases. Container
  // height includes the 100svh the sticky stage occupies, so the real
  // scrub distance is (totalVh - 100)vh. Kept deliberately tight: the
  // section is a viewport of content, not a corridor.
  const STEP_VH = isMobile ? 32 : 40;
  const HOLD_VH = isMobile ? 32 : 40;
  const phaseAVh = STEP_VH * MAX_P;
  const totalVh = phaseAVh + HOLD_VH;
  const A_END = phaseAVh / totalVh;

  // Single source of truth. The rosette reads this ref in its own RAF loop
  // and smooths it there — no React re-render sits between scroll and cube.
  const progressRef = useRef(0);

  const { scrollYProgress } = useScroll({
    target: pinRef,
    offset: ["start start", "end end"],
  });

  // Completion line — bound straight to scroll via scaleX. Reaches 1 when
  // the last formation settles.
  const lineScaleX = useTransform(scrollYProgress, [0, A_END], [0, 1]);

  // The intro rides inside the pin, so it would otherwise sit at full
  // strength for the entire scrub. Easing it back over the first sliver of
  // scroll hands the stage to the cube without it ever leaving the screen.
  const introFade = useTransform(scrollYProgress, [0, 0.1], [1, 0.3]);
  const introLift = useTransform(scrollYProgress, [0, 0.1], [0, -10]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const p = clamp(latest / A_END, 0, 1) * MAX_P;
    progressRef.current = p;
    // Nearest formation owns the copy, so the text swaps mid-morph — the
    // moment the cube stops looking like the old shape.
    setActiveIndex(clamp(Math.round(p), 0, MAX_P));
    setIsComplete(latest >= A_END);
  });

  // Click a dot → scroll to that formation's resting point.
  const scrollToStep = (i: number) => {
    const container = pinRef.current;
    if (!container) return;
    const targetProgress = (i / MAX_P) * A_END;
    const containerTop = container.getBoundingClientRect().top + window.scrollY;
    const scrollable = container.offsetHeight - window.innerHeight;
    window.scrollTo({
      top: containerTop + targetProgress * scrollable,
      behavior: reduce ? "auto" : "smooth",
    });
  };

  return (
    <section
      id="features"
      className={`relative isolate bg-background bg-dots ${isComplete ? "is-complete" : ""}`}
    >
      <div ref={pinRef} style={{ height: `${totalVh}vh` }}>
        {/* pt clears the floating navbar, which is fixed and would sit on
            top of the eyebrow otherwise. pb below lg clears the fixed
            MobileCallBar (85px): a pinned stage can't scroll its content
            out from under that bar, so the dots would hide behind it. */}
        <div className="sticky top-0 flex h-[100svh] flex-col overflow-hidden px-6 pb-[6.5rem] pt-24 [@media(max-height:730px)]:pb-[5.75rem] [@media(max-height:730px)]:pt-20 lg:pb-10 lg:pt-28">
          <div className="mx-auto flex min-h-0 w-full max-w-6xl flex-1 flex-col justify-center">
            {/* The intro lives inside the pin. Outside it, the stage centred
                its content in 100svh and you scrolled past the intro into an
                empty half-viewport before the cube arrived. */}
            <motion.div
              style={reduce ? undefined : { opacity: introFade, y: introLift }}
              className="mx-auto max-w-2xl shrink-0 pb-6 text-center [@media(max-height:730px)]:pb-3 lg:max-w-3xl"
            >
              <p className="text-xs font-medium uppercase tracking-[0.25em] text-accent">
                Features
              </p>
              <h2 className="mt-2 font-display text-xl font-medium tracking-tight text-balance [@media(max-height:730px)]:text-base sm:text-2xl lg:text-4xl">
                One connected system to attract, convert, and retain more
                customers.
              </h2>
              <p className="mt-2.5 hidden text-sm leading-relaxed text-muted-foreground sm:block sm:text-base">
                Your website, CRM, follow-up, booking, and reviews — all in one
                system. Fewer opportunities fall through the cracks.
              </p>
            </motion.div>

            {/* Stacked on mobile the cube row is `1fr`: it absorbs whatever
                height the copy leaves, so the stage fits any viewport
                without a height media query and nothing is ever clipped by
                the pin's overflow. From md up the grid is two columns and
                the cube sizes from its width as usual. */}
            <div className="grid min-h-0 flex-1 grid-cols-1 grid-rows-[minmax(0,1fr)_auto] items-center gap-5 [@media(max-height:730px)]:gap-3 md:flex-none md:grid-cols-2 md:grid-rows-1 md:gap-12">
              {/* ════════════ Metal Rosette ════════════
                   No card, border or background — the cube sits on the page.
                   It stays centred at all times; scroll drives spin, tilt and
                   arm extension only, never position. The box is square and
                   contained so the WebGL canvas has real dimensions and
                   nothing escapes at any formation angle. */}
              <div
                className="relative z-10 mx-auto aspect-square h-full max-h-[19rem] w-auto overflow-hidden md:h-auto md:max-h-none md:w-full md:max-w-[24rem] lg:max-w-[28rem]"
                style={{ contain: "layout paint" }}
              >
                <MetalRosette
                  background="transparent"
                  baseColor="#FFD168"
                  distance={32}
                  material={{ reflect: 65, roughness: 90 }}
                  motion={{ hold: 48, spin: 90, travel: 178 }}
                  camera={{ tilt: 35, sideTilt: 0 }}
                  progressRef={progressRef}
                  reverse
                  style={{ width: "100%", height: "100%" }}
                />
              </div>

              {/* ════════════ Labels ════════════ */}
              <div className="relative z-10 flex min-w-0 flex-col justify-center">
                <div className="mb-3 flex items-center gap-3 [@media(max-height:730px)]:mb-2 md:mb-4">
                  <span className="font-mono text-[11px] font-medium tracking-[0.2em] text-accent">
                    {String(activeIndex + 1).padStart(2, "0")} /{" "}
                    {String(N).padStart(2, "0")}
                  </span>
                  {/* Track + gold fill driven by scaleX straight off scroll:
                       no state, no width animation, no lag. */}
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

                {/* Crossfade, not mode="wait" — a queued AnimatePresence
                     lagged several steps behind the counter on fast scroll. */}
                <div className="relative min-h-[140px] [@media(max-height:730px)]:min-h-[104px] sm:min-h-[150px] lg:min-h-[168px]">
                  {features.map((f, i) => (
                    <motion.div
                      key={i}
                      initial={false}
                      animate={{
                        opacity: i === activeIndex ? 1 : 0,
                        y: i === activeIndex ? 0 : reduce ? 0 : 6,
                      }}
                      // The outgoing label clears much faster than the
                      // incoming one arrives. With eight stacked labels a
                      // symmetric crossfade leaves two headings legible on
                      // top of each other during a fast scroll.
                      transition={{
                        duration: reduce ? 0.1 : i === activeIndex ? 0.26 : 0.1,
                        ease: EASE,
                      }}
                      className="absolute inset-x-0"
                      style={{
                        pointerEvents: i === activeIndex ? "auto" : "none",
                      }}
                    >
                      <h3 className="font-display text-xl font-semibold tracking-tight text-foreground [@media(max-height:730px)]:text-base sm:text-2xl lg:text-3xl">
                        {f.title}
                      </h3>
                      <p className="mt-2.5 max-w-md text-sm leading-relaxed text-muted-foreground [@media(max-height:730px)]:mt-1.5 [@media(max-height:730px)]:text-xs">
                        {f.desc}
                      </p>
                    </motion.div>
                  ))}
                </div>

                {/* Pagination dots — one per formation, clickable */}
                <div className="mt-4 flex items-center gap-1 [@media(max-height:730px)]:mt-2 md:mt-5">
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
      </div>

      {/* CTA sits after the pin rather than inside the stage: in the stage
          it would compete with the scrubbing content for the one viewport
          the pin has, and it reads better once all eight have gone past. */}
      <div className="mx-auto flex max-w-xl flex-col items-center gap-4 px-6 pb-16 text-center sm:pb-20">
        <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
          Every one of these ships as one connected system — not eight tools
          you have to wire together.
        </p>
        <button
          onClick={open}
          className="btn-gold px-8 py-4 text-base"
        >
          <RollLabel>Book a Strategy Call</RollLabel>
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>
    </section>
  );
}
