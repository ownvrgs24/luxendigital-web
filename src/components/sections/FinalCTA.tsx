import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { useBooking } from "@/components/BookingModal";

export function FinalCTA() {
  const { open } = useBooking();
  return (
    <section id="contact" className="relative overflow-hidden py-20 sm:py-28">
      {/* ambient gold glow */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/2 h-[50vh] w-[80vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,hsl(43_90%_60%_/_0.1),transparent_70%)]" />
        <div className="absolute inset-0 bg-grid opacity-30 mask-fade-b" />
      </div>

      <div className="mx-auto max-w-4xl px-6 text-center lg:px-10">
        <Reveal>
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-accent">
            Let's Talk
          </p>
          <h2 className="mt-6 font-display text-3xl font-medium leading-[1.05] tracking-tight text-balance sm:text-4xl lg:text-6xl">
            Ready to build a business that{" "}
            <span className="gold-text">never stops working</span>?
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Let's build something your competitors can't copy.
          </p>
        </Reveal>

        <Reveal delay={0.15}>
          <motion.button
            onClick={open}
            whileHover={{ y: -3 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="btn-gold group mt-10 inline-flex items-center gap-2.5 rounded-full px-11 py-5 text-lg font-bold"
          >
            Book Strategy Call
            <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
          </motion.button>
        </Reveal>

        <Reveal delay={0.25}>
          <p className="mt-6 text-sm text-muted-foreground">
            No pressure, no obligation. Just a real conversation about your
            business.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
