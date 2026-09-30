import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { useBooking } from "@/components/BookingModal";
import { PROJECTS, BUILD_STANDARDS, type Project } from "@/content/work";

export function Portfolio() {
  const { open } = useBooking();

  return (
    <section
      id="portfolio"
      className="relative scroll-mt-24 border-t border-border/60 bg-background pb-20 pt-12 sm:pb-28 sm:pt-16"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        {/* No heading here — the page's own <h1> already introduces the grid,
            and two identical titles in a row read as a mistake. */}
        {/* items-start, not stretch: the 7- and 5-column cards hold images of
            different heights, and stretching them to match leaves a pool of
            dead space under the shorter card's copy. */}
        <div className="grid items-start gap-5 lg:grid-cols-12">
          {PROJECTS.map((p, i) => (
            <Reveal key={p.title} className={p.span} delay={i * 0.08}>
              <ProjectCard project={p} index={i} onEnquire={open} />
            </Reveal>
          ))}
        </div>

        <Standards />
      </div>
    </section>
  );
}

function ProjectCard({
  project,
  index,
  onEnquire,
}: {
  project: Project;
  index: number;
  onEnquire: () => void;
}) {
  const { title, category, img, blurb, tags, mirror } = project;

  return (
    <motion.button
      type="button"
      onClick={onEnquire}
      whileHover="hover"
      // Every card used to point at #contact, an anchor that doesn't exist on
      // this page — so the whole grid was dead. The booking sheet is the
      // actual next step, and it works from anywhere.
      aria-label={`${title} — ${category}. Start a project like this`}
      className="group relative flex h-full w-full flex-col overflow-hidden rounded-3xl border border-border bg-card text-left shadow-lux transition-colors duration-300 hover:border-accent/50"
    >
      {/* The screenshot is the point, so nothing is written across it — the
          copy sits underneath where it stays readable on any image. */}
      <div className="relative aspect-[16/10] overflow-hidden bg-secondary">
        {mirror && (
          <img
            src={img}
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 h-full w-full scale-110 object-cover opacity-30 blur-2xl [transform:scaleY(-1)]"
          />
        )}
        <motion.img
          src={img}
          alt={`${title} — ${category} website by Luxen Digital`}
          loading="lazy"
          className={
            mirror
              ? "relative z-10 h-full w-full object-contain p-4 drop-shadow-[0_20px_40px_rgba(0,0,0,0.25)]"
              : "h-full w-full object-cover"
          }
          variants={{ hover: { scale: mirror ? 1.02 : 1.05 } }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        />

        <span className="absolute left-5 top-5 z-20 rounded-full bg-black/45 px-2.5 py-1 font-display text-[11px] font-semibold tracking-[0.2em] text-white/90 backdrop-blur-sm">
          {String(index + 1).padStart(2, "0")}
        </span>

        <motion.div
          className="absolute right-5 top-5 z-20 flex h-10 w-10 items-center justify-center rounded-full glass text-foreground"
          variants={{ hover: { rotate: 0, scale: 1.1 } }}
          initial={{ rotate: -30, opacity: 0.7 }}
        >
          <ArrowUpRight className="h-5 w-5" />
        </motion.div>
      </div>

      <div className="flex flex-1 flex-col border-t border-border p-6 sm:p-7">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-accent">
          {category}
        </p>
        <h3 className="mt-2 font-display text-2xl font-medium text-foreground">
          {title}
        </h3>
        {/* Always visible. This used to fade in on hover, which meant every
            phone visitor — most of them — never read a word of it. */}
        <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
          {blurb}
        </p>
        <ul className="mt-5 flex flex-wrap gap-2">
          {tags.map((t) => (
            <li
              key={t}
              className="rounded-full border border-border bg-secondary/60 px-3 py-1 text-xs font-medium text-foreground/75"
            >
              {t}
            </li>
          ))}
        </ul>
      </div>
    </motion.button>
  );
}

/** The through-line between four different businesses. */
function Standards() {
  return (
    <Reveal delay={0.15}>
      <div className="mt-14 rounded-3xl border border-border bg-secondary/40 p-8 sm:p-10">
        <p className="text-sm font-medium uppercase tracking-[0.25em] text-accent">
          The standard
        </p>
        <h2 className="mt-3 max-w-2xl font-display text-2xl font-medium tracking-tight text-balance text-foreground sm:text-3xl">
          Different businesses. The same four things, every time.
        </h2>
        <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {BUILD_STANDARDS.map((s) => (
            <li key={s.title}>
              <div className="h-1.5 w-12 rounded-full gold-gradient" />
              <p className="mt-4 font-display text-base font-medium text-foreground">
                {s.title}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {s.body}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </Reveal>
  );
}
