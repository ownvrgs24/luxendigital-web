import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const testimonials = [
  {
    quote:
      "Our website finally does something. It books jobs while we're on the roof. We've never been this busy.",
    name: "Marcus T.",
    role: "Roofing Co.",
    city: "Austin, TX",
  },
  {
    quote:
      "The AI receptionist alone paid for itself in a week. We stopped losing calls completely.",
    name: "Dana R.",
    role: "Medical Spa",
    city: "Scottsdale, AZ",
  },
  {
    quote:
      "Reviews started coming in automatically. We went from 12 to 87 five-star reviews in three months.",
    name: "Luis G.",
    role: "HVAC",
    city: "Tampa, FL",
  },
  {
    quote:
      "It looks like a million dollars and loads instantly. Patients tell us they chose us because of the site.",
    name: "Dr. Priya N.",
    role: "Dentist",
    city: "Denver, CO",
  },
  {
    quote:
      "I don't think about follow-up anymore. It just happens. My pipeline has never been this full.",
    name: "Elena V.",
    role: "Law Firm",
    city: "Chicago, IL",
  },
  {
    quote:
      "One platform replaced four different tools. My team actually uses it. That's never happened before.",
    name: "Tom B.",
    role: "Plumbing",
    city: "Columbus, OH",
  },
];

export function Testimonials() {
  // duplicate for seamless loop
  const loop = [...testimonials, ...testimonials];
  return (
    <section
      id="testimonials"
      className="relative scroll-mt-24 overflow-hidden border-t border-border/60 bg-secondary/50 py-20 sm:py-28"
    >
      <div className="pointer-events-none absolute inset-0 -z-10 bg-grid opacity-30 mask-fade-b" />
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-accent">
            Testimonials
          </p>
          <h2 className="mt-4 font-display text-3xl font-medium tracking-tight text-balance sm:text-4xl lg:text-5xl">
            Owners who stopped doing it all manually.
          </h2>
        </div>
      </div>

      {/* marquee */}
      <div className="mask-fade-x mt-10">
        <motion.div
          className="flex w-max gap-5"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        >
          {loop.map((t, i) => (
            <TestimonialCard key={i} {...t} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function TestimonialCard({
  quote,
  name,
  role,
  city,
}: {
  quote: string;
  name: string;
  role: string;
  city: string;
}) {
  return (
    <figure className="flex w-[340px] shrink-0 flex-col justify-between rounded-3xl glass p-7 shadow-float sm:w-[420px]">
      <Quote className="h-7 w-7 text-accent/70" />
      <blockquote className="mt-4 text-base leading-relaxed text-foreground/90">
        “{quote}”
      </blockquote>
      <figcaption className="mt-6 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-full gold-gradient font-display text-sm font-semibold text-[hsl(240_10%_8%)]">
          {name.charAt(0)}
        </span>
        <div>
          <p className="text-sm font-semibold text-foreground">{name}</p>
          <p className="text-xs text-muted-foreground">
            {role} · {city}
          </p>
        </div>
      </figcaption>
    </figure>
  );
}
