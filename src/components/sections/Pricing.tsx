import { motion } from "framer-motion";
import { Reveal } from "@/components/motion/Reveal";
import { Check, ArrowRight } from "lucide-react";

type Tier = {
  name: string;
  tagline: string;
  price: string;
  period: string;
  href: string;
  features: string[];
  cta: string;
  featured: boolean;
  variant: "silver" | "gold";
};

const tiers: Tier[] = [
  {
    name: "Essential",
    tagline:
      "For service businesses that need a professional online presence and a reliable way to capture leads.",
    price: "Starting at $99",
    period: "/month",
    href: "https://crm.luxendigital.com/payment-link/6aa4eba5ceb12d9fc1a8c7c9",
    features: [
      "Custom, conversion-focused website",
      "Lead capture forms",
      "Online appointment booking",
      "Missed-call text-back",
      "Mobile-optimized design",
      "Hosting and security",
      "Basic website support",
    ],
    cta: "Get Started",
    featured: false,
    variant: "silver",
  },
  {
    name: "Growth",
    tagline:
      "For service businesses that want their follow-up and appointment process to run automatically.",
    price: "Starting at $299",
    period: "/month",
    href: "https://crm.luxendigital.com/payment-link/6aa4ebdbbfd4fe37f21d28fc",
    features: [
      "Everything in Essential",
      "CRM and lead pipeline",
      "Automated text and email follow-up",
      "AI chat assistant",
      "Appointment reminders",
      "Google review request system",
      "Lead tracking and notifications",
      "Ongoing website updates",
    ],
    cta: "Build My Growth System",
    featured: true,
    variant: "gold",
  },
];

export function Pricing() {
  return (
    <section
      id="pricing"
      className="relative scroll-mt-24 border-t border-border/60 bg-background py-20 sm:py-28"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-accent">
            Pricing
          </p>
          <h2 className="mt-4 font-display text-3xl font-medium tracking-tight text-balance sm:text-4xl lg:text-5xl">
            Simple, transparent plans built around how your business grows.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Start with the essentials, then add automation when you're ready. No
            long-term contracts.
          </p>
        </Reveal>

        <div className="mx-auto mt-10 grid max-w-3xl gap-5 lg:grid-cols-2">
          {tiers.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.1}>
              <PricingCard {...t} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function PricingCard({
  name,
  tagline,
  price,
  period,
  features,
  cta,
  featured,
  variant,
  href,
}: {
  name: string;
  tagline: string;
  price: string;
  period: string;
  features: string[];
  cta: string;
  featured: boolean;
  variant: "silver" | "gold";
  href: string;
}) {
  const isSilver = variant === "silver";

  const accentLine = isSilver ? "silver-gradient" : "gold-gradient";

  const badgeClass = isSilver
    ? "silver-gradient text-foreground"
    : "gold-gradient text-[hsl(240_10%_8%)] shadow-gold";

  const checkClass = isSilver
    ? "silver-gradient text-foreground"
    : "gold-gradient text-[hsl(240_10%_8%)]";

  const ctaClass = isSilver
    ? "silver-gradient text-foreground shadow-silver hover:shadow-[0_12px_40px_-8px_hsl(220_10%_60%_/_0.5)]"
    : "gold-gradient text-[hsl(240_10%_8%)] shadow-gold hover:shadow-[0_12px_40px_-8px_hsl(43_90%_55%_/_0.6)]";

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className={`relative flex h-full flex-col overflow-hidden rounded-3xl border p-8 shadow-lux transition-colors duration-300 ${
        featured
          ? "border-accent/50 bg-card"
          : isSilver
            ? "border-[hsl(220_10%_70%_/_0.4)] bg-card"
            : "border-border bg-card/70"
      }`}
    >
      {/* top accent */}
      {featured && (
        <div className="absolute inset-x-0 top-0 h-1 gold-gradient" />
      )}
      {isSilver && (
        <div className="absolute inset-x-0 top-0 h-1.5 silver-gradient" />
      )}

      {/* ambient corner accents */}
      {isSilver && (
        <>
          <div className="pointer-events-none absolute -right-6 -top-6 h-16 w-16 rotate-45 bg-[hsl(220_10%_70%_/_0.18)] blur-[2px]" />
          <div className="pointer-events-none absolute -left-6 -bottom-6 h-16 w-16 rotate-45 bg-[hsl(220_10%_70%_/_0.12)] blur-[2px]" />
        </>
      )}

      {featured && (
        <span className="absolute right-6 top-6 rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold text-accent">
          Most popular
        </span>
      )}
      {isSilver && (
        <span
          className={`absolute right-6 top-6 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${badgeClass}`}
        >
          Essential
        </span>
      )}

      <div className={`mb-4 h-1.5 w-12 rounded-full ${accentLine}`} />

      <h3 className="font-display text-2xl font-medium text-foreground">
        {name}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {tagline}
      </p>
      <div className="mt-6 flex items-baseline gap-2">
        <span className="font-display text-2xl font-medium text-foreground">
          {price}
        </span>
        <span className="text-sm text-muted-foreground">{period}</span>
      </div>

      <ul className="mt-7 space-y-3">
        {features.map((f) => (
          <li
            key={f}
            className="flex items-start gap-3 text-sm text-foreground/80"
          >
            <span
              className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${checkClass}`}
            >
              <Check className="h-3 w-3" />
            </span>
            {f}
          </li>
        ))}
      </ul>

      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`group mt-8 inline-flex w-full items-center justify-center gap-2.5 rounded-full px-8 py-4 text-base font-bold transition-all duration-300 ${ctaClass}`}
      >
        {cta}
        <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
      </a>
    </motion.div>
  );
}
