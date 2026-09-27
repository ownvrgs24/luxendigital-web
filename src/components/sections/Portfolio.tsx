import { motion } from "framer-motion";
import { Reveal } from "@/components/motion/Reveal";
import { ArrowUpRight } from "lucide-react";

const projects = [
  {
    title: "Northwind HVAC",
    category: "HVAC",
    img: "https://vibe.filesafe.space/1788847884528312040/assets/e22301b2-40e8-47f3-90c3-785f359a4089.png",
    blurb: "Booking-ready site with AI receptionist and review funnel.",
    span: "lg:col-span-7",
  },
  {
    title: "Lumière MedSpa",
    category: "Medical Spa",
    img: "https://vibe.filesafe.space/1788847884528312040/assets/8477f37a-2c4c-40ca-a865-e4bb94c1c5a3.png",
    blurb: "Editorial design with online scheduling and reminders.",
    span: "lg:col-span-5",
  },
  {
    title: "Brightline Dental",
    category: "Dentistry",
    img: "https://vibe.filesafe.space/1788847884528312040/assets/5a7ed3ee-5e5e-4bb2-b200-08857062d7ab.png",
    blurb: "Trust-first layout with automated patient follow-up.",
    span: "lg:col-span-5",
  },
  {
    title: "Fast Fix North County",
    category: "Jewelry Store",
    img: "https://vibe.filesafe.space/1788847884528312040/attachments/1bfff326-76ec-4ebd-9716-32d10d635165.png",
    blurb:
      "Multi-location booking system with automated estimate workflows and review funnel.",
    span: "lg:col-span-7",
    mirror: true,
  },
];

export function Portfolio() {
  return (
    <section
      id="portfolio"
      className="relative scroll-mt-24 border-t border-border/60 bg-background py-20 sm:py-28"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div className="max-w-xl">
            <p className="text-sm font-medium uppercase tracking-[0.25em] text-accent">
              Selected Work
            </p>
            <h2 className="mt-4 font-display text-3xl font-medium tracking-tight text-balance sm:text-4xl lg:text-5xl">
              A look at what we build.
            </h2>
          </div>
          <p className="max-w-sm text-sm text-muted-foreground">
            Every site is custom — designed around the business, not a template.
            Editorial, minimal, fast.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-5 lg:grid-cols-12">
          {projects.map((p, i) => (
            <Reveal key={p.title} className={p.span} delay={i * 0.08}>
              <ProjectCard {...p} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({
  title,
  category,
  img,
  blurb,
  mirror,
}: {
  title: string;
  category: string;
  img: string;
  blurb: string;
  mirror?: boolean;
}) {
  return (
    <motion.a
      href="#contact"
      whileHover="hover"
      className="group relative block h-full overflow-hidden rounded-3xl border border-border bg-card shadow-lux"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
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
        <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-90" />
        <motion.div
          className="absolute right-5 top-5 z-20 flex h-10 w-10 items-center justify-center rounded-full glass text-foreground"
          variants={{ hover: { rotate: 0, scale: 1.1 } }}
          initial={{ rotate: -30, opacity: 0.7 }}
        >
          <ArrowUpRight className="h-5 w-5" />
        </motion.div>
        <div className="absolute inset-x-0 bottom-0 z-20 p-6">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-accent">
            {category}
          </p>
          <h3 className="mt-1.5 font-display text-2xl font-medium text-white">
            {title}
          </h3>
          <motion.p
            className="mt-1 max-w-md text-sm text-white/80"
            variants={{ hover: { opacity: 1, y: 0 } }}
            initial={{ opacity: 0, y: 8 }}
          >
            {blurb}
          </motion.p>
        </div>
      </div>
    </motion.a>
  );
}
