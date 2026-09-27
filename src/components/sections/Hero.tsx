import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useBooking } from "@/components/BookingModal";
import { useRef } from "react";
import RibbonGlow from "@/components/originkit/ui/ribbon-glow-custom-style";
import { RollLabel } from "@/components/motion/RollLabel";

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const { open } = useBooking();
  const reduce = useReducedMotion();
  const containerRef = useRef<HTMLElement>(null);

  return (
    <section
      id="top"
      ref={containerRef}
      // bg-foreground, not bg-background: the hero only looked black because
      // the WebGL ribbon paints over it. With a white declared background and
      // near-white text, a machine without WebGL rendered white on white.
      className="relative min-h-screen overflow-hidden bg-foreground text-[#FAFAFA] flex items-center pt-28 pb-20 lg:pt-32 lg:pb-24"
    >
      {/* Ribbon Glow — deep black-dominant cinematic light field */}
      <div className="absolute inset-0 z-[1] pointer-events-auto">
        <RibbonGlow
          background="#050507"
          color1="#3A2E12"
          color2="#241B08"
          speed={38}
          size={120}
          angle={-180}
          hover={70}
          reach={220}
          style={{ minWidth: 0, minHeight: 0, width: "100%", height: "100%" }}
        />
        {/* Black-dominant scrims for depth + readability */}
        <div className="absolute inset-0 bg-black/55 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-black/20 pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/90 to-transparent pointer-events-none" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 lg:px-12">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease }}
          className="inline-flex items-center gap-2"
        >
          <span className="text-xs sm:text-sm font-semibold tracking-[0.28em] text-accent uppercase">
            REAL TALK. NO CONTRACT. NO BS.
          </span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1, ease }}
          className="mt-6 max-w-4xl font-display text-[2.75rem] sm:text-6xl lg:text-[4.75rem] font-black leading-[1.03] tracking-[-0.03em] text-white"
        >
          Stop losing sales to a{" "}
          <span className="relative inline-block gold-text">dead website.</span>
        </motion.h1>

        {/* Subheadline copy */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease }}
          className="mt-6 max-w-lg text-base sm:text-lg leading-relaxed text-[#E4E4E7]"
        >
          <p>
            Luxen combines a high-converting website, CRM, automated follow-up,
            reviews, and AI into one system built to help your business capture
            and convert more opportunities.
          </p>
        </motion.div>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3, ease }}
          className="mt-9 flex flex-wrap items-center gap-4"
        >
          <button
            onClick={open}
            className="btn-gold group relative inline-flex items-center justify-center gap-2.5 rounded-full px-9 py-5 text-base sm:text-lg font-bold active:scale-[0.98]"
          >
            <RollLabel>Let&apos;s Talk</RollLabel>
            <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
          </button>

          <a
            href="#who-we-help"
            className="group inline-flex items-center justify-center gap-2.5 rounded-full border border-white/20 bg-white/10 px-9 py-5 text-base sm:text-lg font-semibold text-white backdrop-blur-md transition-all duration-300 hover:border-white/40 hover:bg-white/20 hover:scale-[1.02] active:scale-[0.98]"
          >
            See What We Do
          </a>
        </motion.div>

        {/* Micro proof points */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-12 flex flex-wrap items-center gap-6 pt-6 border-t border-white/[0.12] text-xs uppercase tracking-wider text-[#D4D4D8]"
        >
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            <span>Custom Built</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            <span>AI Automated</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            <span>No Long-Term Contracts</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
