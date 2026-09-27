import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useBooking } from "@/components/BookingModal";

/**
 * Mobile-only fixed bottom "Book A Call" bar.
 * Hidden on desktop (lg breakpoint and up).
 * Appears after the user scrolls past the hero.
 */
export function MobileCallBar() {
  const [visible, setVisible] = useState(false);
  const { open } = useBooking();

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 600);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-x-0 bottom-0 z-50 lg:hidden"
        >
          {/* fade backdrop above the bar */}
          <div className="pointer-events-none absolute -top-6 inset-x-0 h-6 bg-gradient-to-t from-background to-transparent" />
          <div className="border-t border-border bg-background/90 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl">
            <button
              onClick={open}
              className="btn-gold group flex w-full items-center justify-center gap-2.5 rounded-full px-8 py-4 text-lg font-bold active:scale-[0.98]"
            >
              Book A Call
              <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
