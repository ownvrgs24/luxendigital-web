import { EASE } from "@/components/motion/Reveal";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useBooking } from "@/components/BookingModal";
import { useEffect, useRef, useState } from "react";
import { RollLabel } from "@/components/motion/RollLabel";


const HERO_VIDEO =
  "https://assets.cdn.filesafe.space/myHH3DWgv1jOQx1drQO9/media/6abd8084f88ee1436cc5cc7c.mp4";

/**
 * The background video is ~3 MB, so its source is only attached once the page
 * has finished loading — the headline paints first and the video fades in
 * behind it. Skipped for reduced motion and data-saver connections.
 */
function useDeferredVideoSrc(enabled: boolean) {
  const [src, setSrc] = useState<string | null>(null);
  useEffect(() => {
    if (!enabled) return;
    const conn = (
      navigator as Navigator & { connection?: { saveData?: boolean } }
    ).connection;
    if (conn?.saveData) return;
    const attach = () => setSrc(HERO_VIDEO);
    if (document.readyState === "complete") {
      attach();
      return;
    }
    window.addEventListener("load", attach, { once: true });
    return () => window.removeEventListener("load", attach);
  }, [enabled]);
  return src;
}

export function Hero() {
  const { open } = useBooking();
  const reduce = useReducedMotion();
  const containerRef = useRef<HTMLElement>(null);
  const videoSrc = useDeferredVideoSrc(!reduce);
  const [videoReady, setVideoReady] = useState(false);

  return (
    <section
      id="top"
      ref={containerRef}
      // bg-foreground, not bg-background: the hero only looks black because
      // the video layer paints over it. With a white declared background and
      // near-white text, a failed video would render white on white.
      className="relative min-h-screen overflow-hidden bg-foreground text-[#FAFAFA] flex items-center pt-28 pb-20 lg:pt-32 lg:pb-24"
    >
      {/* Background video — kept faint under the scrims so it reads as
          texture behind the copy, not competition for it. */}
      <div className="absolute inset-0 z-[1] bg-[#050507]">
        {videoSrc && (
          <video
            src={videoSrc}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            aria-hidden="true"
            tabIndex={-1}
            onPlaying={() => setVideoReady(true)}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
              videoReady ? "opacity-100" : "opacity-0"
            }`}
          />
        )}
        {/* Scrims for readability: an overall dim, heavier on the left where
            the headline sits, and a fade into the next section. */}
        <div className="absolute inset-0 bg-black/55 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-black/10 pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/90 to-transparent pointer-events-none" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 lg:px-12">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="inline-flex items-center gap-2"
        >
          <span className="text-xs sm:text-sm font-semibold tracking-[0.28em] text-accent uppercase">
            WEB DESIGN AND MARKETING SYSTEM
          </span>
        </motion.div>

        {/* Main Headline */}
        {/* Transform-only entrance: the headline is the LCP element, and
            starting it at opacity 0 holds LCP back until the animation ends. */}
        <motion.h1
          initial={reduce ? false : { y: 22 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
          className="mt-6 max-w-4xl font-display text-[2.75rem] sm:text-6xl lg:text-[4.75rem] font-black leading-[1.03] tracking-[-0.03em] text-white"
        >
          Stop losing sales to a{" "}
          <span className="relative inline-block gold-text">dead website.</span>
        </motion.h1>

        {/* Subheadline copy */}
        <motion.div
          initial={reduce ? false : { y: 18 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: EASE }}
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
          transition={{ duration: 0.9, delay: 0.3, ease: EASE }}
          className="mt-9 flex flex-wrap items-center gap-4"
        >
          <button
            onClick={open}
            className="btn-gold group relative px-9 py-5 text-base sm:text-lg active:scale-[0.98]"
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
