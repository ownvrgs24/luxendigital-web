import { Eyebrow } from "@/components/ui/SectionHeading";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { EASE, Reveal } from "@/components/motion/Reveal";
import { useBooking } from "@/components/BookingModal";
import RotatingText from "@/components/originkit/ui/text-carousel-variant-2";
import { RollLabel } from "@/components/motion/RollLabel";

// Each stage carries one description and nothing else. The previous data
// also held a `plain` restatement of the same sentence ("They search, you
// appear." under "Someone searches Google for a service you offer…"), which
// said each step twice and tripled the section's height.
const stages = [
  {
    title: "A customer finds you",
    desc: "Someone searches Google for a service you offer. Your business shows up at the top.",
  },
  {
    title: "They visit your website",
    desc: "They land on a fast, clean site that instantly shows them you're professional and trustworthy.",
  },
  {
    title: "They reach out",
    desc: "They call, text, or fill out a form. If you can't answer, the system texts them back instantly.",
  },
  {
    title: "They book an appointment",
    desc: "They pick a time that works for them — right from your website. No phone tag, no back-and-forth.",
  },
  {
    title: "They get a confirmation",
    desc: "An automatic text and email confirms the appointment and sends a reminder before it happens.",
  },
  {
    title: "You get notified",
    desc: "You're alerted with all the details — name, number, what they need, and when they're coming.",
  },
  {
    title: "The job gets done",
    desc: "You show up, do great work, and the customer is happy.",
  },
  {
    title: "A review is requested",
    desc: "At the perfect moment, the system asks your happy customer to leave a Google review.",
  },
  {
    title: "They come back",
    desc: "Months later, they remember the great experience, return, and refer their friends.",
  },
];


export function CustomerJourney() {
  const reduce = useReducedMotion();
  const { open } = useBooking();

  return (
    <section
      id="journey"
      className="relative isolate overflow-hidden border-t border-border bg-background bg-dots py-16 sm:py-20"
    >
      <div className="mx-auto max-w-6xl px-6 lg:px-10">
        {/* Heading + rotating text */}
        <div className="mx-auto max-w-3xl text-center">
          <Eyebrow>The Customer Journey</Eyebrow>

          <Reveal>
            <div className="mt-5 flex flex-col items-center justify-center gap-2 sm:gap-3">
              <h2 className="font-display text-3xl font-medium leading-tight tracking-tight text-balance sm:text-4xl lg:text-5xl">
                From first search to
              </h2>
              <RotatingText
                prefix=""
                texts={[
                  "loyal customer.",
                  "booked appointment.",
                  "5-star review.",
                  "repeat business.",
                  "more revenue.",
                ]}
                font={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(28px, 5vw, 52px)",
                  fontWeight: 700,
                  lineHeight: "1.15em",
                  letterSpacing: "-0.01em",
                  textAlign: "center",
                }}
                color="hsl(240 10% 8%)"
                badgeBackground="hsl(var(--accent))"
                badgeRadius={999}
                badgePaddingX={28}
                badgePaddingY={14}
                gap={0}
                splitBy="words"
                staggerFrom="first"
                auto={true}
                transition={{
                  type: "tween",
                  duration: 0.55,
                  delay: 0,
                  ease: "circInOut",
                  staggerChildren: 0.025,
                }}
              />
            </div>
          </Reveal>

          <p className="mx-auto mt-5 max-w-xl text-base text-muted-foreground">
            Every step runs automatically — even while you sleep.
          </p>
        </div>

        {/* ── The nine steps ──────────────────────────────────────────────
             A numbered index, not nine stacked cards. Each step is a rule,
             a number and two lines of type — the sequence is carried by the
             numbering and the reading order, so no card, border, icon chip
             or connector line is needed to hold it together. Three columns
             also make the section a third as tall as the vertical stack. */}
        <div className="mt-14 grid gap-x-8 gap-y-9 sm:mt-16 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-12">
          {stages.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              // Stagger across each row, not down the whole list: a 9-step
              // cascade made the last item arrive half a second late.
              transition={{
                duration: 0.5,
                delay: reduce ? 0 : (i % 3) * 0.07,
                ease: EASE,
              }}
              className="group"
            >
              {/* Rule fills gold left-to-right on hover — the only motion
                   here, and it marks the step you are actually reading. */}
              <div className="relative h-px w-full overflow-hidden bg-border">
                <span
                  className="absolute inset-0 origin-left scale-x-0 bg-accent transition-transform duration-500 ease-out group-hover:scale-x-100 motion-reduce:transition-none"
                  aria-hidden="true"
                />
              </div>

              <p className="mt-4 font-mono text-[11px] font-medium tracking-[0.2em] text-muted-foreground/60 transition-colors duration-300 group-hover:text-accent">
                {String(i + 1).padStart(2, "0")}
              </p>

              <h3 className="mt-2 font-display text-lg font-semibold tracking-tight text-foreground sm:text-xl">
                {s.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {s.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <Reveal delay={0.1}>
          <div className="mt-14 flex flex-col items-center gap-4 text-center sm:mt-16">
            <p className="max-w-md text-base text-muted-foreground">
              See exactly how this works for your business.
            </p>
            <button
              onClick={() => open()}
              className="btn-gold px-8 py-4 text-base"
            >
              <RollLabel>Book a Strategy Call</RollLabel>
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
