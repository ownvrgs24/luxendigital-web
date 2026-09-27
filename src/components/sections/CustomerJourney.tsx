import { motion, useReducedMotion } from "framer-motion";
import {
  Search,
  Globe,
  MessageSquare,
  CalendarCheck,
  Bell,
  Briefcase,
  CheckCircle,
  Star,
  RefreshCw,
  ArrowRight,
} from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { useBooking } from "@/components/BookingModal";
import RotatingText from "@/components/originkit/ui/text-carousel-variant-2";

const stages = [
  {
    icon: Search,
    title: "A Customer Finds You",
    desc: "Someone searches Google for a service you offer. Your business shows up at the top.",
    plain: "They search, you appear.",
  },
  {
    icon: Globe,
    title: "They Visit Your Website",
    desc: "They land on a fast, clean site that instantly shows them you're professional and trustworthy.",
    plain: "Your site makes a great first impression.",
  },
  {
    icon: MessageSquare,
    title: "They Reach Out",
    desc: "They call, text, or fill out a form. If you can't answer, the system texts them back instantly.",
    plain: "Every inquiry gets an instant reply.",
  },
  {
    icon: CalendarCheck,
    title: "They Book an Appointment",
    desc: "They pick a time that works for them — right from your website. No phone tag, no back-and-forth.",
    plain: "They book themselves, anytime.",
  },
  {
    icon: Bell,
    title: "They Get a Confirmation",
    desc: "An automatic text and email confirms the appointment and sends a reminder before it happens.",
    plain: "Reminders go out automatically.",
  },
  {
    icon: Briefcase,
    title: "You Get Notified",
    desc: "You're alerted with all the details — name, number, what they need, and when they're coming.",
    plain: "You know exactly what's happening.",
  },
  {
    icon: CheckCircle,
    title: "The Job Gets Done",
    desc: "You show up, do great work, and the customer is happy.",
    plain: "Great work, happy customer.",
  },
  {
    icon: Star,
    title: "A Review Is Requested",
    desc: "At the perfect moment, the system asks your happy customer to leave a Google review.",
    plain: "Reviews happen on autopilot.",
  },
  {
    icon: RefreshCw,
    title: "They Come Back",
    desc: "Months later, they remember the great experience, return, and refer their friends.",
    plain: "One customer becomes many.",
  },
];

export function CustomerJourney() {
  const reduce = useReducedMotion();
  const { open } = useBooking();
  const ease = [0.22, 1, 0.36, 1] as const;

  return (
    <section
      id="journey"
      className="relative isolate overflow-hidden bg-secondary/40 py-16 sm:py-20"
    >
      <div className="pointer-events-none absolute inset-0 -z-10 bg-grid opacity-30 mask-fade-b" />
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        {/* Heading + rotating text */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-accent">
            The Customer Journey
          </p>

          <Reveal>
            <div className="mt-6 flex min-h-[5.5rem] flex-col items-center justify-center gap-4 sm:min-h-[6.5rem] sm:gap-6">
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

          <p className="mx-auto mt-6 max-w-xl text-base text-muted-foreground">
            Every step runs automatically — even while you sleep.
          </p>
        </div>

        {/* Continuous flow — no numbers, single connected path */}
        <div className="mt-14">
          <div className="relative">
            {/* Continuous flowing line */}
            <div
              className="pointer-events-none absolute left-6 top-6 bottom-6 w-px overflow-hidden sm:left-7 sm:top-7 sm:bottom-7"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-border" />
              <motion.div
                className="absolute inset-0 bg-gradient-to-b from-accent via-accent-glow to-accent"
                initial={
                  reduce
                    ? { scaleY: 1, opacity: 0.5 }
                    : { scaleY: 0, opacity: 0.6 }
                }
                whileInView={{ scaleY: 1, opacity: 0.6 }}
                viewport={{ once: true, margin: "-5%" }}
                transition={{ duration: 1.6, ease }}
                style={{ transformOrigin: "top" }}
              />
            </div>

            <div className="flex flex-col gap-3 lg:gap-4">
              {stages.map((s, i) => {
                const Icon = s.icon;
                return (
                  <motion.div
                    key={s.title}
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-8%" }}
                    transition={{
                      duration: 0.5,
                      delay: reduce ? 0 : i * 0.06,
                      ease,
                    }}
                    className="group relative flex items-center gap-4 sm:gap-6"
                  >
                    {/* Icon node — no number */}
                    <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-border bg-card transition-all duration-300 group-hover:border-accent group-hover:shadow-gold sm:h-14 sm:w-14">
                      <Icon className="h-5 w-5 text-muted-foreground transition-colors duration-300 group-hover:text-accent sm:h-6 sm:w-6" />
                    </div>

                    {/* Content card */}
                    <div className="flex flex-1 items-center gap-4 rounded-2xl border border-border bg-card/60 p-5 transition-all duration-300 group-hover:border-accent/40 group-hover:bg-card group-hover:shadow-[0_12px_40px_-12px_rgba(0,0,0,0.10)] sm:gap-6 sm:p-6">
                      <div className="min-w-0 flex-1">
                        <h3 className="font-display text-lg font-semibold tracking-tight text-foreground sm:text-xl">
                          {s.title}
                        </h3>
                        <p className="mt-1 text-sm leading-relaxed text-muted-foreground sm:text-base">
                          {s.desc}
                        </p>
                        <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-accent sm:text-sm">
                          <ArrowRight className="h-3 w-3" />
                          {s.plain}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* CTA */}
        <Reveal delay={0.1}>
          <div className="mt-12 flex flex-col items-center gap-4 text-center">
            <p className="max-w-md text-base text-muted-foreground">
              See exactly how this works for your business.
            </p>
            <button
              onClick={() => open()}
              className="btn-gold inline-flex items-center gap-2.5 rounded-full px-11 py-5 text-lg font-bold transition-transform duration-300 hover:scale-[1.02]"
            >
              Book a Strategy Call
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
