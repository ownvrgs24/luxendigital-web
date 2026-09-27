import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { useBooking } from "@/components/BookingModal";
import { ServicesMenu } from "@/components/navbar/ServicesMenu";

const LOGO_URL =
  "https://vibe.filesafe.space/1788847884528312040/attachments/2376e462-ac48-4064-8fcb-fe02fd5c4f1f.png";

export function Navbar() {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const { open: openBooking } = useBooking();
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const spring = reduceMotion
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 260, damping: 30, mass: 0.6 };

  const ease = reduceMotion ? undefined : ([0.22, 1, 0.36, 1] as const);

  // On homepage: transparent at top, dark pill on scroll.
  // On non-home routes: solid translucent dark pill with high-contrast border.
  const containerBg = scrolled
    ? "rgba(18,18,20,0.85)"
    : isHome
      ? "rgba(0,0,0,0)"
      : "rgba(18,18,20,0.88)";

  const containerBorder = scrolled
    ? "rgba(255,255,255,0.12)"
    : isHome
      ? "rgba(255,255,255,0)"
      : "rgba(255,255,255,0.14)";

  const containerShadow = scrolled
    ? "0 18px 50px rgba(0,0,0,0.5), 0 2px 8px rgba(0,0,0,0.3)"
    : isHome
      ? "0 0 0 rgba(0,0,0,0)"
      : "0 14px 40px -10px rgba(0,0,0,0.35), 0 2px 8px rgba(0,0,0,0.15)";

  const containerBlur = scrolled || !isHome ? "blur(20px)" : "blur(0px)";

  return (
    <motion.header
      initial={reduceMotion ? false : { y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={
        reduceMotion ? { duration: 0 } : { duration: 1, ease, delay: 0.2 }
      }
      className="fixed inset-x-0 top-0 z-50 pointer-events-none"
    >
      <div className="mx-auto w-full px-4 sm:px-6">
        <motion.div
          animate={{
            maxWidth: scrolled || !isHome ? 980 : 1280,
            marginTop: scrolled ? 12 : isHome ? 20 : 14,
            marginBottom: scrolled ? 0 : 0,
          }}
          transition={spring}
          className="mx-auto w-full pointer-events-auto"
        >
          <motion.div
            animate={{
              paddingTop: scrolled ? 8 : 12,
              paddingBottom: scrolled ? 8 : 12,
              paddingLeft: scrolled ? 14 : 20,
              paddingRight: scrolled ? 14 : 20,
              borderRadius: 999,
              backgroundColor: containerBg,
              borderColor: containerBorder,
              boxShadow: containerShadow,
            }}
            transition={spring}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "12px",
              border: `1px solid ${containerBorder}`,
              backdropFilter: containerBlur,
              WebkitBackdropFilter: containerBlur,
            }}
          >
            {/* Logo */}
            <a
              href="/"
              className="flex items-center gap-2.5 group transition-transform duration-200 hover:scale-[1.02] shrink-0"
              aria-label="Luxen Digital home"
            >
              <img
                src={LOGO_URL}
                alt="Luxen Digital"
                className="h-7 w-7 sm:h-8 sm:w-8 rounded-full object-contain ring-1 ring-white/20 shadow-[0_2px_10px_rgba(234,179,8,0.25)] bg-black/40"
              />
              <span className="text-sm font-semibold tracking-tight text-white group-hover:text-amber-300 transition-colors">
                Luxen Digital
              </span>
            </a>

            {/* Services mega menu: desktop trigger + links, mobile hamburger */}
            <nav className="relative flex items-center gap-2">
              <ServicesMenu />
            </nav>

            {/* CTA */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={openBooking}
                className="btn-gold inline-flex items-center justify-center rounded-full px-5 py-2 sm:px-6 sm:py-2.5 text-sm sm:text-base font-bold hover:scale-[1.03] active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
              >
                Let&apos;s Talk
              </button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.header>
  );
}
