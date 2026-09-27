import { motion } from "framer-motion";
import { Reveal } from "@/components/motion/Reveal";
import {
  Phone,
  Calendar,
  MessageSquare,
  Star,
  Bell,
  GitBranch,
} from "lucide-react";
import AppearText from "@/components/originkit/ui/appear-text-custom-style";

const pillars = [
  {
    icon: Phone,
    label: "Lead capture",
    code: "01",
    detail: "High-converting capture & instant routing",
  },
  {
    icon: MessageSquare,
    label: "AI follow-up",
    code: "02",
    detail: "24/7 intelligent SMS & email within seconds",
  },
  {
    icon: Calendar,
    label: "Appointment booking",
    code: "03",
    detail: "Self-serve calendar synced straight to CRM",
  },
  {
    icon: Star,
    label: "Reputation management",
    code: "04",
    detail: "Automated reviews on Google & reputation funnel",
  },
  {
    icon: Bell,
    label: "Missed call text back",
    code: "05",
    detail: "Instant automatic SMS so zero callers are lost",
  },
  {
    icon: GitBranch,
    label: "Lead pipeline",
    code: "06",
    detail: "Visual deal stages from first touch to paid job",
  },
];

export function Philosophy() {
  return (
    <section
      id="philosophy"
      className="relative isolate overflow-hidden bg-foreground py-16 sm:py-20"
    >
      {/* Background kinetic text watermark */}
      <div
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden opacity-[0.12] select-none"
        aria-hidden="true"
      >
        <AppearText
          text="INTEGRATED"
          font={{
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            fontSize: 72,
            lineHeight: "1.25em",
            letterSpacing: "0.02em",
            textAlign: "center",
          }}
          textColor="hsl(var(--accent))"
          backgroundColor="transparent"
          rowCount={6}
          repeatCount={2}
          rowGap={20}
          wordGap={40}
          horizontalShiftPx={120}
          zoomScalePct={115}
          expandDurationSec={1.2}
          holdDurationSec={5}
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        />
      </div>

      <div className="pointer-events-none absolute inset-0 z-0 bg-grid opacity-[0.04] mask-fade-b" />
      <div className="relative z-10 w-full px-6 lg:px-10">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          {/* First column — copy */}
          <Reveal>
            <p className="text-sm font-medium uppercase tracking-[0.25em] text-accent">
              Our Philosophy
            </p>
            <h2 className="mt-4 font-display text-3xl font-medium leading-tight tracking-tight text-balance text-background sm:text-4xl lg:text-5xl">
              Your website should be your{" "}
              <span className="gold-text">hardest-working employee</span>.
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-background/70">
              We don’t just build websites. We build systems that capture leads,
              follow up automatically, book appointments, and turn happy
              customers into reviews — so your business can grow without more
              manual work.
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 sm:gap-4">
              {pillars.map((p, i) => (
                <motion.div
                  key={p.label}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-10%" }}
                  transition={{
                    duration: 0.5,
                    delay: i * 0.06,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  whileHover={{ y: -3 }}
                  tabIndex={0}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-neutral-900/60 p-6 backdrop-blur-md transition-all duration-300 hover:border-accent/50 hover:bg-neutral-900/80 hover:shadow-[0_8px_30px_-10px_rgba(209,160,84,0.18)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  {/* Subtle top ambient accent line on hover */}
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-accent/0 to-transparent transition-opacity duration-300 group-hover:via-accent/40" />

                  {/* Header: prominent icon + index code */}
                  <div className="flex items-start justify-between gap-4">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-accent/25 bg-accent/10 text-accent transition-all duration-300 group-hover:scale-105 group-hover:border-accent/60 group-hover:bg-accent/20 group-hover:shadow-[0_0_20px_-3px_rgba(209,160,84,0.35)]">
                      <p.icon className="h-6 w-6 stroke-[1.8] transition-transform duration-300 group-hover:rotate-3" />
                    </span>
                    <span className="font-mono text-xs font-semibold tracking-wider text-background/30 transition-colors duration-300 group-hover:text-accent/80">
                      {p.code}
                    </span>
                  </div>

                  {/* Text details */}
                  <div className="mt-5">
                    <h3 className="font-display text-base font-semibold tracking-tight text-background transition-colors duration-300 group-hover:text-white sm:text-lg">
                      {p.label}
                    </h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-background/60 transition-colors duration-300 group-hover:text-background/80">
                      {p.detail}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
