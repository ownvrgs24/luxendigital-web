import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

export const LUXEN_LOGO_URL =
  "https://vibe.filesafe.space/1788847884528312040/attachments/2376e462-ac48-4064-8fcb-fe02fd5c4f1f.png";

/**
 * LuxenMark — renders the custom full Luxen Digital gold mark or icon.
 */
export function LuxenMark({
  className = "h-8 w-auto",
}: {
  className?: string;
}) {
  return (
    <img
      src={LUXEN_LOGO_URL}
      alt="Luxen Digital"
      className={`object-contain select-none ${className}`}
      loading="eager"
    />
  );
}

/** Animated wordmark or full logo for branding headers */
export function LuxenWordmark({ className = "" }: { className?: string }) {
  const reduce = useReducedMotion();
  const [glow, setGlow] = useState(0);

  useEffect(() => {
    if (reduce) return;
    let raf = 0;
    let t = 0;
    const loop = () => {
      t += 0.012;
      setGlow((Math.sin(t) + 1) / 2);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [reduce]);

  return (
    <div className={`relative inline-flex items-center ${className}`}>
      <img
        src={LUXEN_LOGO_URL}
        alt="Luxen Digital"
        className="h-8 md:h-9 w-auto object-contain select-none"
      />
      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-0 z-20 blur-md"
        style={{
          background: `radial-gradient(60% 80% at ${20 + glow * 60}% 50%, hsl(43 90% 60% / ${0.18 + glow * 0.12}), transparent 70%)`,
        }}
      />
    </div>
  );
}
