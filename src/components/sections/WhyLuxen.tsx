import { motion, useReducedMotion } from "framer-motion";

type Reason = {
  title: string;
  desc: string;
};

const reasons: Reason[] = [
  {
    title: "Built for Service Businesses",
    desc: "Every decision is designed around the way service businesses grow: generating leads, responding quickly, booking appointments, and building a strong reputation.",
  },
  {
    title: "Designed to Convert",
    desc: "Your website is built to make your services clear, establish trust, and guide visitors toward one simple next step: calling, submitting an inquiry, or booking an appointment.",
  },
  {
    title: "Fast, Reliable Performance",
    desc: "Fast-loading pages create a better user experience and help prevent visitors from leaving before they contact you. We optimize every site for speed, mobile performance, and conversions.",
  },
  {
    title: "Automation That Works Around the Clock",
    desc: "Capture new leads, send instant follow-ups, remind customers about appointments, recover missed calls, and request reviews automatically.",
  },
  {
    title: "One Connected Platform",
    desc: "Your website, CRM, conversations, booking calendar, follow-up campaigns, and reputation tools work together in one system instead of being scattered across multiple apps.",
  },
  {
    title: "Real Human Support",
    desc: "You get direct support from people who understand your system and can help you make the right changes as your business evolves.",
  },
  {
    title: "Ongoing Optimization",
    desc: "Your business changes over time. We help update and improve your website and customer-acquisition system so it continues to support your goals after launch.",
  },
  {
    title: "Flexible Website Updates",
    desc: "Need to change a service, update your offer, or add a new section? We make it easy to keep your website current without unexpected development fees.",
  },
];

const floatDurations = [7, 8.5, 6.5, 9, 7.5, 8, 6.8, 9.5];

export function WhyLuxen() {
  return (
    <section id="why" className="relative py-14 sm:py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="mt-2 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {reasons.map((r, i) => (
            <FloatingCard key={r.title} index={i} reason={r} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FloatingCard({ index, reason }: { index: number; reason: Reason }) {
  const reduceMotion = useReducedMotion();
  const duration = floatDurations[index % floatDurations.length];
  const delay = (index % 4) * 0.6;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8%" }}
      transition={{
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1],
        delay: (index % 4) * 0.08,
      }}
      className="h-full"
    >
      <motion.div
        animate={reduceMotion ? undefined : { y: [0, -10, 0] }}
        transition={
          reduceMotion
            ? undefined
            : {
                duration,
                delay,
                repeat: Infinity,
                ease: "easeInOut",
              }
        }
        whileHover={reduceMotion ? undefined : { y: -14, scale: 1.015 }}
        className="group relative h-full overflow-hidden rounded-2xl border border-border bg-card/80 p-7 shadow-lux backdrop-blur-sm transition-colors duration-300 hover:border-accent/40 lg:p-8"
      >
        <span className="absolute left-0 top-7 h-px w-8 bg-accent/60 transition-all duration-300 group-hover:w-12" />
        <div className="pl-6">
          <span className="font-display text-xs font-medium tracking-[0.2em] text-accent/70">
            {String(index + 1).padStart(2, "0")}.
          </span>
          <h3 className="mt-3 font-display text-lg font-medium tracking-tight text-foreground sm:text-xl">
            {reason.title}
          </h3>
          <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
            {reason.desc}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
