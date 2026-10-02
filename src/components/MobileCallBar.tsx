import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useBooking } from "@/components/BookingModal";
import { RollLabel } from "@/components/motion/RollLabel";

/* Puts the chat bubble in the lane MobileCallBar reserves on the right: same
   56px height and bottom inset as the button, same 16px gutter, so the two
   line up exactly. Below lg only, matching the bar. */
const LANE_CSS = `
@media (max-width: 1023px) {
  :host([data-callbar]) #lc_text-widget--btn {
    width: 3.5rem !important;
    height: 3.5rem !important;
    bottom: max(0.75rem, env(safe-area-inset-bottom)) !important;
    right: 1rem !important;
    transition: bottom 0.35s cubic-bezier(0.22, 1, 0.36, 1);
  }
}`;

let laneSheet: CSSStyleSheet | undefined;

function adoptLaneSheet(root: ShadowRoot) {
  if (!laneSheet) {
    laneSheet = new CSSStyleSheet();
    laneSheet.replaceSync(LANE_CSS);
  }
  if (!root.adoptedStyleSheets.includes(laneSheet)) {
    root.adoptedStyleSheets = [...root.adoptedStyleSheets, laneSheet];
  }
}

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

  // The chat bubble lives inside <chat-widget>'s shadow root, which page CSS
  // can't reach, so the lane rule is adopted into that root directly and
  // switched on by an attribute on the host.
  useEffect(() => {
    const sync = () => {
      const host = document.querySelector("chat-widget");
      if (!host?.shadowRoot) return false;
      adoptLaneSheet(host.shadowRoot);
      host.toggleAttribute("data-callbar", visible);
      return true;
    };
    // The widget is injected lazily (see index.html) and attaches its shadow
    // root after insertion, which no MutationObserver reports, so poll.
    let timer: number | undefined;
    if (!sync()) {
      timer = window.setInterval(() => {
        if (sync()) window.clearInterval(timer);
      }, 500);
    }
    return () => {
      window.clearInterval(timer);
      document.querySelector("chat-widget")?.removeAttribute("data-callbar");
    };
  }, [visible]);

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
          {/* right padding leaves a lane for the LeadConnector chat bubble,
              which floats over the bottom-right corner */}
          <div className="border-t border-border bg-background/90 pl-4 pr-[5.25rem] pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl">
            <button
              onClick={open}
              className="btn-gold group flex h-14 w-full items-center justify-center gap-2.5 rounded-full px-8 text-lg font-bold active:scale-[0.98]"
            >
              <RollLabel>Book A Call</RollLabel>
              <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
