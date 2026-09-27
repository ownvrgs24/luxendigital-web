import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";

export const HERO_EMBLEM_URL =
  "https://vibe.filesafe.space/1788847884528312040/attachments/885d3e41-e94d-46e9-bfba-8ac9a8e9aad1.png";

/**
 * HeroEmblem — Multi-million dollar luxury brand showcase.
 * Replaces fuzzy dots/bubbles with a razor-sharp, ultra-luxurious floating emblem showcase.
 * Features 3D mouse parallax tilt, metallic gold rim light, specular shimmer sweep,
 * and high-end glass backdrop.
 */
export function ParticleLogo() {
  const reduce = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);

  // Mouse-driven 3D tilt
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [10, -10]), {
    stiffness: 80,
    damping: 22,
  });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-12, 12]), {
    stiffness: 80,
    damping: 22,
  });

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const onMove = (e: React.MouseEvent) => {
    if (reduce) return;
    const el = wrapRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };

  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <div
      ref={wrapRef}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="relative mx-auto aspect-[16/10] w-full max-w-md sm:max-w-lg lg:max-w-xl will-transform py-4"
      style={{ perspective: 1200 }}
    >
      {/* Pure, soft ambient gold luxury spotlight (NO blurry blobs or bubbles) */}
      <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center">
        <div className="h-full w-full rounded-full bg-[radial-gradient(circle_at_center,hsl(43_90%_60%_/_0.12)_0%,transparent_70%)] blur-2xl" />
      </div>

      <motion.div
        className="relative h-full w-full"
        style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
      >
        {/* Floating luxury glass canvas */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{
            opacity: mounted ? 1 : 0,
            scale: mounted ? 1 : 0.92,
            y: mounted ? 0 : 20,
          }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative h-full w-full rounded-3xl border border-[hsl(43_80%_60%_/_0.25)] bg-gradient-to-b from-card/90 via-card/80 to-card/95 p-8 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08),0_0_30px_-5px_hsl(43_90%_60%_/_0.15)] backdrop-blur-xl flex items-center justify-center overflow-hidden"
        >
          {/* Subtle gold grid hairline overlay */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "linear-gradient(to right, #d4af37 1px, transparent 1px), linear-gradient(to bottom, #d4af37 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />

          {/* Luxury gold corner accents */}
          <div className="pointer-events-none absolute top-3 left-3 h-3 w-3 border-t-2 border-l-2 border-[hsl(43_80%_55%)] opacity-60" />
          <div className="pointer-events-none absolute top-3 right-3 h-3 w-3 border-t-2 border-r-2 border-[hsl(43_80%_55%)] opacity-60" />
          <div className="pointer-events-none absolute bottom-3 left-3 h-3 w-3 border-b-2 border-l-2 border-[hsl(43_80%_55%)] opacity-60" />
          <div className="pointer-events-none absolute bottom-3 right-3 h-3 w-3 border-b-2 border-r-2 border-[hsl(43_80%_55%)] opacity-60" />

          {/* Specular shimmer sweep across glass */}
          {!reduce && (
            <motion.div
              className="pointer-events-none absolute inset-0 z-20"
              style={{
                background:
                  "linear-gradient(115deg, transparent 40%, rgba(255,255,255,0.4) 50%, transparent 60%)",
              }}
              animate={{
                x: ["-100%", "200%"],
              }}
              transition={{
                duration: 4.5,
                repeat: Infinity,
                repeatDelay: 3,
                ease: "easeInOut",
              }}
            />
          )}

          {/* Central Logo Mark - Crisp, High-Res, Beautifully Lit */}
          <div className="relative z-10 flex flex-col items-center justify-center text-center max-w-[85%] py-2">
            <motion.img
              src={HERO_EMBLEM_URL}
              alt="Luxen Digital Official Emblem"
              className="h-28 sm:h-32 md:h-36 w-auto object-contain select-none drop-shadow-[0_10px_20px_rgba(212,175,55,0.22)]"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
            />
          </div>

          {/* Bottom subtle luxury edge light */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[hsl(43_90%_60%_/_0.5)] to-transparent" />
        </motion.div>
      </motion.div>
    </div>
  );
}
