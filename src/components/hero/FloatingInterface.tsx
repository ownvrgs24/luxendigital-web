import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import {
  Phone,
  Star,
  Calendar,
  MessageSquare,
  Bot,
  GitBranch,
  Check,
  TrendingUp,
  Zap,
} from "lucide-react";
import { type ReactNode, useState } from "react";

/**
 * FloatingInterface — An ultra-luxurious, full-width 3D suspended ecosystem.
 * Exactly captures the user's uploaded reference:
 * - Clean Apple/Linear/Porsche aesthetic
 * - Suspended minimalist browser card with realistic live UI elements (KPI stats, conversion pill, gold actions)
 * - 7 floating glass cards positioned generously around it with subtle organic floating physics
 * - Interactive hover states, realistic notifications, and conversion metrics
 * - Full-width layout on desktop that breathes with massive whitespace and high-converting presence.
 */

interface FloatCardProps {
  children: ReactNode;
  className?: string;
  delay: number;
  float: [number, number, number];
}

function FloatCard({ children, className, delay, float }: FloatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.88, y: 20 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
      className={`absolute ${className ?? ""}`}
    >
      <motion.div
        animate={{ y: [float[0], float[1], float[0]] }}
        transition={{ duration: float[2], repeat: Infinity, ease: "easeInOut" }}
        className="will-transform"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

function CardShell({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`group rounded-2xl border border-black/[0.06] bg-white/95 p-4 shadow-[0_18px_45px_-12px_rgba(0,0,0,0.12),0_4px_12px_-2px_rgba(0,0,0,0.04)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-black/[0.12] hover:shadow-[0_24px_55px_-12px_rgba(0,0,0,0.18)] ${className}`}
    >
      {children}
    </div>
  );
}

export function FloatingInterface() {
  const reduce = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  const [activeTab, setActiveTab] = useState<"leads" | "pipeline" | "reviews">(
    "leads",
  );

  // Subtle natural mouse tilt for that $100k agency 3D feel
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [6, -6]), {
    stiffness: 70,
    damping: 24,
  });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-8, 8]), {
    stiffness: 70,
    damping: 24,
  });

  // Layered Parallax for floating cards
  const px = useSpring(useTransform(mx, [-0.5, 0.5], [16, -16]), {
    stiffness: 45,
    damping: 18,
  });
  const py = useSpring(useTransform(my, [-0.5, 0.5], [-14, 14]), {
    stiffness: 45,
    damping: 18,
  });
  const px2 = useSpring(useTransform(mx, [-0.5, 0.5], [-22, 22]), {
    stiffness: 35,
    damping: 18,
  });
  const py2 = useSpring(useTransform(my, [-0.5, 0.5], [18, -18]), {
    stiffness: 35,
    damping: 18,
  });

  const onMove = (e: React.MouseEvent) => {
    if (reduce) return;
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <div
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="relative mx-auto w-full select-none py-4"
    >
      {/* Outer ambient glow */}
      <div className="pointer-events-none absolute -inset-8 rounded-[40px] bg-gradient-to-b from-amber-500/[0.04] via-transparent to-transparent blur-3xl" />

      {/* Main container with generous responsive height */}
      <div className="relative mx-auto h-[540px] w-full max-w-5xl sm:h-[580px] lg:h-[620px]">
        {/* ========================================================= */}
        {/* CENTRAL WEBSITE INTERFACE (Apple/Porsche/Linear aesthetic) */}
        {/* ========================================================= */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          style={{
            rotateX: reduce ? 0 : rotateX,
            rotateY: reduce ? 0 : rotateY,
            transformPerspective: 1400,
          }}
          className="absolute left-1/2 top-1/2 w-[92%] -translate-x-1/2 -translate-y-[48%] sm:w-[78%] lg:w-[68%]"
        >
          <div className="overflow-hidden rounded-3xl border border-black/[0.08] bg-white/95 shadow-[0_30px_90px_-20px_rgba(0,0,0,0.18),0_10px_25px_-5px_rgba(0,0,0,0.06)] backdrop-blur-2xl">
            {/* Minimalist Browser Chrome */}
            <div className="flex items-center justify-between border-b border-black/[0.06] bg-neutral-50/80 px-5 py-3.5">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-[#FF5F56] shadow-sm" />
                <span className="h-3 w-3 rounded-full bg-[#FFBD2E] shadow-sm" />
                <span className="h-3 w-3 rounded-full bg-[#27C93F] shadow-sm" />
              </div>
              <div className="mx-auto flex h-6 w-56 items-center justify-center rounded-full border border-black/[0.04] bg-white/80 px-3 text-[11px] font-medium tracking-wide text-neutral-400 shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)]">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-2 animate-pulse" />
                luxendigital.com/live-system
              </div>
              <div className="flex items-center gap-1.5 text-neutral-300">
                <div className="h-1.5 w-1.5 rounded-full bg-neutral-300" />
                <div className="h-1.5 w-1.5 rounded-full bg-neutral-300" />
              </div>
            </div>

            {/* Central Dashboard & Site Interface */}
            <div className="p-6 sm:p-8 space-y-5">
              {/* Header inside the mockup */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-3.5 w-24 rounded-full gold-gradient shadow-sm" />
                  <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600">
                    Auto-Pilot Active
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button className="h-7 rounded-full bg-neutral-900 px-3.5 text-[11px] font-semibold text-white shadow-sm transition hover:bg-neutral-800">
                    Live Dashboard
                  </button>
                </div>
              </div>

              {/* Faux Skeleton Headline */}
              <div className="space-y-2">
                <div className="h-3.5 w-4/5 rounded-full bg-neutral-100" />
                <div className="h-3 w-3/5 rounded-full bg-neutral-100/70" />
              </div>

              {/* Live KPI Metric Cards inside mockup */}
              <div className="grid grid-cols-3 gap-3 pt-1">
                <div className="rounded-2xl border border-black/[0.04] bg-neutral-50/70 p-3 transition hover:bg-neutral-50">
                  <p className="text-[10px] font-medium uppercase tracking-wider text-neutral-400">
                    Response Time
                  </p>
                  <p className="mt-1 font-display text-lg font-bold text-neutral-900 sm:text-xl">
                    &lt; 30s
                  </p>
                  <span className="inline-flex items-center text-[10px] font-medium text-emerald-600">
                    <Zap className="mr-0.5 h-2.5 w-2.5" /> Instant AI
                  </span>
                </div>

                <div className="rounded-2xl border border-black/[0.04] bg-neutral-50/70 p-3 transition hover:bg-neutral-50">
                  <p className="text-[10px] font-medium uppercase tracking-wider text-neutral-400">
                    Booked Jobs
                  </p>
                  <p className="mt-1 font-display text-lg font-bold text-neutral-900 sm:text-xl">
                    +42%
                  </p>
                  <span className="inline-flex items-center text-[10px] font-medium text-emerald-600">
                    <TrendingUp className="mr-0.5 h-2.5 w-2.5" /> This Month
                  </span>
                </div>

                <div className="rounded-2xl border border-black/[0.04] bg-neutral-50/70 p-3 transition hover:bg-neutral-50">
                  <p className="text-[10px] font-medium uppercase tracking-wider text-neutral-400">
                    Reviews Sent
                  </p>
                  <p className="mt-1 font-display text-lg font-bold text-neutral-900 sm:text-xl">
                    4.9 ★
                  </p>
                  <span className="text-[10px] font-medium text-neutral-500">
                    98% 5-Star
                  </span>
                </div>
              </div>

              {/* Gold Conversion Banner inside mockup */}
              <div className="relative overflow-hidden rounded-2xl gold-gradient p-4 text-neutral-900 shadow-[0_12px_30px_-8px_rgba(230,175,46,0.4)]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-900/80">
                      Customer Acquisition Engine
                    </p>
                    <p className="text-xs font-medium text-neutral-900/90 sm:text-sm">
                      Never lose another lead to slow replies.
                    </p>
                  </div>
                  <div className="rounded-full bg-neutral-900 px-3.5 py-1.5 text-[11px] font-semibold text-white shadow-sm">
                    Active 24/7
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ========================================================= */}
        {/* ORBITING GLASS CARDS — EXACT COMPOSITION OF REFERENCE     */}
        {/* ========================================================= */}

        {/* LAYER 1: Closer parallax (fast response to mouse) */}
        <motion.div
          style={{ x: px, y: py }}
          className="pointer-events-none absolute inset-0 will-transform"
        >
          {/* Top Left: Incoming Call (Green icon) */}
          <FloatCard
            className="left-[2%] top-[4%] sm:left-[6%] sm:top-[6%] pointer-events-auto"
            delay={0.15}
            float={[-6, 6, 6.2]}
          >
            <CardShell className="w-52 sm:w-56">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 ring-1 ring-emerald-500/20">
                  <Phone className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                    <p className="text-xs font-bold text-neutral-900">
                      Incoming call
                    </p>
                  </div>
                  <p className="text-[11px] font-medium text-neutral-500">
                    +1 (555) 012-8842
                  </p>
                </div>
              </div>
            </CardShell>
          </FloatCard>

          {/* Top Right: AI Assistant Active (Purple icon) */}
          <FloatCard
            className="right-[8%] top-[2%] sm:right-[18%] sm:top-[4%] pointer-events-auto"
            delay={0.3}
            float={[5, -5, 7]}
          >
            <CardShell className="w-48 sm:w-52">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-purple-50 text-purple-600 ring-1 ring-purple-500/20">
                  <Bot className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-xs font-bold text-neutral-900">
                    AI assistant active
                  </p>
                  <p className="text-[10px] text-neutral-400">
                    Handling inquiry 24/7
                  </p>
                </div>
              </div>
              <div className="mt-2.5 space-y-1.5 pl-1">
                <div className="h-1.5 w-full rounded-full bg-neutral-100" />
                <div className="h-1.5 w-2/3 rounded-full bg-neutral-100" />
              </div>
            </CardShell>
          </FloatCard>

          {/* Middle Right: 5-Star Review (Gold stars) */}
          <FloatCard
            className="right-[2%] top-[26%] sm:right-[8%] sm:top-[28%] pointer-events-auto"
            delay={0.45}
            float={[-5, 5, 6.8]}
          >
            <CardShell className="w-52 sm:w-56">
              <div className="flex items-center gap-1 text-amber-400">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-current" />
                ))}
              </div>
              <p className="mt-1.5 text-xs font-bold text-neutral-900">
                New 5-star review
              </p>
              <p className="text-[11px] italic text-neutral-500">
                “Fast, professional, on time.”
              </p>
            </CardShell>
          </FloatCard>

          {/* Bottom Center-Right: Job Completed (Green check badge) */}
          <FloatCard
            className="right-[22%] bottom-[6%] sm:right-[32%] sm:bottom-[10%] pointer-events-auto z-20"
            delay={0.7}
            float={[4, -4, 6.5]}
          >
            <CardShell className="w-52 border-amber-200/60 bg-gradient-to-b from-white via-amber-50/30 to-amber-100/40 shadow-[0_20px_50px_-10px_rgba(230,175,46,0.35)]">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-emerald-100/80 text-emerald-700">
                  <Check className="h-4 w-4 stroke-[3]" />
                </span>
                <div>
                  <p className="text-xs font-bold text-neutral-900">
                    Job completed
                  </p>
                  <p className="text-[11px] font-semibold text-neutral-600">
                    Invoice sent ·{" "}
                    <span className="text-neutral-900 font-bold">$1,240</span>
                  </p>
                </div>
              </div>
            </CardShell>
          </FloatCard>
        </motion.div>

        {/* LAYER 2: Deeper parallax for cinematic depth */}
        <motion.div
          style={{ x: px2, y: py2 }}
          className="pointer-events-none absolute inset-0 will-transform"
        >
          {/* Middle Left: Pipeline moved (Blue icon) */}
          <FloatCard
            className="left-[2%] top-[40%] sm:left-[6%] sm:top-[44%] pointer-events-auto"
            delay={0.55}
            float={[-4, 4, 8.2]}
          >
            <CardShell className="w-52 sm:w-56">
              <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl bg-sky-50 text-sky-600 ring-1 ring-sky-500/20">
                  <GitBranch className="h-4 w-4" />
                </span>
                <p className="text-xs font-bold text-neutral-900">
                  Pipeline moved
                </p>
              </div>
              <div className="mt-2.5 flex items-center gap-1.5">
                <span className="rounded-md bg-neutral-100 px-2 py-0.5 text-[10px] font-medium text-neutral-500">
                  New
                </span>
                <span className="rounded-md bg-neutral-100 px-2 py-0.5 text-[10px] font-medium text-neutral-500">
                  Contacted
                </span>
                <span className="rounded-md bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 ring-1 ring-emerald-500/30">
                  Won ✓
                </span>
              </div>
            </CardShell>
          </FloatCard>

          {/* Lower Left: Appointment booked (Gold Calendar icon) */}
          <FloatCard
            className="left-[4%] bottom-[8%] sm:left-[8%] sm:bottom-[12%] pointer-events-auto"
            delay={0.8}
            float={[5, -5, 7.5]}
          >
            <CardShell className="w-52 sm:w-56">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 ring-1 ring-amber-500/20">
                  <Calendar className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-neutral-900">
                    Appointment booked
                  </p>
                  <p className="text-[11px] font-medium text-neutral-500">
                    Tomorrow · 9:00 AM
                  </p>
                </div>
              </div>
            </CardShell>
          </FloatCard>

          {/* Floating Lower Center/Right: Lead replied instantly (Indigo icon) */}
          <FloatCard
            className="right-[26%] bottom-[20%] sm:right-[36%] sm:bottom-[22%] pointer-events-auto z-10"
            delay={0.65}
            float={[-4, 4, 7.8]}
          >
            <CardShell className="w-52 sm:w-56">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 ring-1 ring-indigo-500/20">
                  <MessageSquare className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-neutral-900">
                    Lead replied instantly
                  </p>
                  <p className="text-[10px] text-neutral-500">
                    Automated confirmation sent
                  </p>
                </div>
              </div>
            </CardShell>
          </FloatCard>
        </motion.div>
      </div>

      {/* Bottom Conversion Tagline */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-center text-xs font-medium text-neutral-500 sm:text-sm"
      >
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          Automatic Missed-Call Recovery
        </span>
        <span className="hidden sm:inline text-neutral-300">•</span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-amber-500" />
          24/7 Online Calendar Booking
        </span>
        <span className="hidden sm:inline text-neutral-300">•</span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-indigo-500" />
          Automated 5-Star Google Review Funnel
        </span>
      </motion.div>
    </div>
  );
}
