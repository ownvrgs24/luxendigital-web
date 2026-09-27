import { useEffect, useState, useCallback } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, RotateCcw } from "lucide-react";
import { useBooking } from "@/components/BookingModal";
import { useInView } from "@/hooks/use-in-view";
import { ChatPhone, type ChatMsg } from "@/components/sections/ChatPhone";

const ease = [0.22, 1, 0.36, 1] as const;

// ── Chat script ────────────────────────────────────────────────────────
// A real missed-call → booked-job conversation. Timestamps are grouped
// (shown only when the time changes). The final row is a system booking
// confirmation, visually distinct from bubbles.
const MESSAGES: ChatMsg[] = [
  {
    type: "ai",
    text: "Hi! Sorry we missed your call. How can we help you today?",
    time: "9:41",
  },
  {
    type: "customer",
    text: "Hey, my AC stopped working and I need someone out here fast.",
    time: "9:42",
  },
  {
    type: "ai",
    text: "No problem. We have a technician free this afternoon. Would 2:00 PM work?",
    time: "9:42",
  },
  { type: "customer", text: "Perfect, book it.", time: "9:43" },
  {
    type: "ai",
    text: "Done. You're booked for 2:00 PM today. A text reminder is on the way.",
    time: "9:43",
  },
  { type: "system", text: "Booked · AC repair · Today 2:00 PM" },
];

// ── Timeline ───────────────────────────────────────────────────────────
const TIMELINE = [
  {
    time: "9:41",
    title: "Missed call answered",
    desc: "AI texts back instantly.",
  },
  {
    time: "9:42",
    title: "Lead qualified",
    desc: "AI collects the problem and details.",
  },
  {
    time: "9:43",
    title: "Appointment booked",
    desc: "Confirmed on the calendar, SMS reminder sent.",
  },
];

// One source of truth: the number of visible chat messages drives which
// timeline step is active. No separate timers.
function stepForCount(c: number): number {
  if (c <= 0) return -1;
  if (c <= 1) return 0; // msg 0 → missed call answered
  if (c <= 3) return 1; // msg 1–3 → lead qualified
  return 2; // msg 4–6 → appointment booked
}

// ── Section ────────────────────────────────────────────────────────────
export function WhoWeHelp() {
  const { open } = useBooking();
  const reduce = useReducedMotion();
  const { ref: phoneRef, inView } = useInView<HTMLDivElement>({
    threshold: 0.35,
    rootMargin: "0px 0px -10% 0px",
  });

  const [visibleCount, setVisibleCount] = useState(0);
  const [typing, setTyping] = useState(false);
  const [runKey, setRunKey] = useState(0);
  const [islandExpanded, setIslandExpanded] = useState(false);

  const replay = useCallback(() => setRunKey((k) => k + 1), []);

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setVisibleCount(MESSAGES.length);
      setTyping(false);
      setIslandExpanded(true);
      return;
    }

    setVisibleCount(0);
    setTyping(false);
    setIslandExpanded(false);
    const timers: number[] = [];
    const at = (delay: number, fn: () => void) =>
      timers.push(window.setTimeout(fn, delay));

    at(300, () => setTyping(true)); // typing → msg 0
    at(1100, () => {
      setVisibleCount(1);
      setTyping(false);
    }); // msg 0 (AI)
    at(2000, () => setVisibleCount(2)); // msg 1 (customer)
    at(2700, () => setTyping(true)); // typing → msg 2
    at(3500, () => {
      setVisibleCount(3);
      setTyping(false);
    }); // msg 2 (AI)
    at(4400, () => setVisibleCount(4)); // msg 3 (customer)
    at(5100, () => setTyping(true)); // typing → msg 4
    at(5900, () => {
      setVisibleCount(5);
      setTyping(false);
    }); // msg 4 (AI)
    at(6300, () => setVisibleCount(6)); // msg 5 (system)
    // Dynamic Island expands when booking is confirmed
    at(6600, () => setIslandExpanded(true));
    at(9100, () => setIslandExpanded(false)); // collapse after ~2.5s

    return () => timers.forEach((t) => clearTimeout(t));
  }, [inView, reduce, runKey]);

  const activeStep = stepForCount(visibleCount);
  const ruleFill = activeStep < 0 ? 0 : activeStep / (TIMELINE.length - 1);

  return (
    <section
      id="who-we-help"
      className="relative border-t border-border bg-background py-16 sm:py-20"
    >
      <div className="mx-auto max-w-[1040px] px-[clamp(20px,5vw,40px)]">
        {/* Headline — full width, left-aligned, one headline + one line */}
        <div className="mx-auto max-w-[720px] text-center">
          <motion.h2
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-3xl font-extrabold tracking-tight text-foreground text-balance sm:text-4xl lg:text-5xl"
          >
            Missed call at 9:41. Booked by{" "}
            <span className="text-accent">9:43.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08 }}
            className="mt-3 text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            Your AI assistant texts back every missed call, answers questions,
            and books the job into your calendar while you work.
          </motion.p>
        </div>

        {/* 2-column grid: phone | timeline + CTA */}
        <div className="mt-10 grid grid-cols-1 items-center justify-items-center gap-10 min-[960px]:grid-cols-[minmax(300px,380px)_minmax(0,420px)] min-[960px]:justify-center min-[960px]:gap-[clamp(48px,6vw,96px)]">
          {/* Col 1 — phone (decorative demo) */}
          <div ref={phoneRef} className="flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, ease }}
              aria-hidden="true"
            >
              <ChatPhone
                messages={MESSAGES}
                visibleCount={visibleCount}
                typing={typing}
                reduce={reduce}
                islandExpanded={islandExpanded}
              />
            </motion.div>
            {!reduce && (
              <button
                onClick={replay}
                className="replay-link mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                <RotateCcw className="h-3 w-3" />
                Replay
              </button>
            )}
          </div>

          {/* Col 2 — timeline + CTA (text alone tells the full story) */}
          <div className="flex w-full max-w-[340px] flex-col items-center justify-center min-[960px]:max-w-none min-[960px]:items-start">
            <ol className="relative w-full">
              {/* Vertical rule track */}
              <div className="absolute left-[5px] top-1 bottom-1 w-px bg-border" />
              {/* Gold fill — scaleY, not height */}
              <div
                className="absolute left-[5px] top-1 w-px bg-accent"
                style={{
                  height: "calc(100% - 8px)",
                  transform: `scaleY(${ruleFill})`,
                  transformOrigin: "top center",
                  transition: "transform 0.4s cubic-bezier(0.22,1,0.36,1)",
                }}
              />

              {TIMELINE.map((item, i) => {
                const completed = i < activeStep;
                const active = i === activeStep;
                const upcoming = i > activeStep;
                return (
                  <li key={i} className="relative pl-7 pb-7 last:pb-0">
                    {/* Marker */}
                    <span
                      className={`absolute left-0 top-1 h-[11px] w-[11px] rounded-full ring-2 ring-background transition-all duration-300 ${
                        completed || active
                          ? "bg-accent"
                          : "bg-transparent border border-muted-foreground/40"
                      }`}
                    />
                    <p className="font-mono text-[11px] font-medium tracking-[0.15em] text-muted-foreground">
                      {item.time}
                    </p>
                    <p
                      className={`mt-0.5 font-display text-base font-bold tracking-tight transition-colors duration-300 sm:text-lg ${
                        upcoming
                          ? "text-muted-foreground/50"
                          : "text-foreground"
                      }`}
                    >
                      {item.title}
                    </p>
                    <p
                      className={`mt-0.5 text-sm leading-relaxed transition-colors duration-300 ${
                        upcoming
                          ? "text-muted-foreground/40"
                          : "text-muted-foreground"
                      }`}
                    >
                      {item.desc}
                    </p>
                  </li>
                );
              })}
            </ol>

            {/* CTA — solid gold, no glow, visible focus ring */}
            <div className="mt-8 flex w-full justify-center min-[960px]:justify-start">
              <button
                onClick={open}
                className="inline-flex items-center gap-2.5 rounded-full px-7 py-3.5 text-base font-bold transition-all duration-300 hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                style={{
                  background: "hsl(var(--accent))",
                  color: "hsl(var(--accent-foreground))",
                }}
              >
                Book a Strategy Call
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
