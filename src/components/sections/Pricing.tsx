import { motion } from "framer-motion";
import { Check, ArrowRight, Users } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { RollLabel } from "@/components/motion/RollLabel";
import { useBooking } from "@/components/BookingModal";
import {
  PLANS,
  PLAN_FEATURES,
  ASSURANCES,
  ENTERPRISE,
  type Plan,
} from "@/content/pricing";

export function Pricing() {
  const { open } = useBooking();

  return (
    <section
      id="pricing"
      className="relative scroll-mt-24 border-t border-border/60 bg-background pb-16 pt-10 sm:pb-20 sm:pt-14"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        {/* The cards carry the decision, so they start high on the page — the
            heading for this section is the page's own <h1>, right above. */}
        <div className="mx-auto grid max-w-3xl items-start gap-5 lg:grid-cols-2">
          {PLANS.map((plan, i) => (
            <Reveal
              key={plan.id}
              delay={i * 0.1}
              // Stacked on phones the popular plan goes first — nobody
              // scrolls past a full card to find the one we recommend.
              className={
                plan.featured ? "order-first lg:order-none lg:-mt-6" : undefined
              }
            >
              <PricingCard plan={plan} onSelect={open} />
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.15}>
          <EnterpriseCard onContact={open} />
        </Reveal>

        {/* Undecided visitors are the ones who leave. Give them a door that
            costs nothing instead of making them guess between two plans. */}
        <Reveal delay={0.2}>
          <div className="mx-auto mt-8 flex max-w-3xl flex-col items-center gap-4 rounded-2xl border border-border bg-secondary/40 px-6 py-5 text-center sm:flex-row sm:justify-between sm:text-left">
            <p className="text-sm leading-relaxed text-muted-foreground">
              <span className="font-semibold text-foreground">
                Not sure which one fits?
              </span>{" "}
              Book a free strategy call — we&rsquo;ll look at your business and
              tell you which plan to start on. No obligation.
            </p>
            <button
              onClick={open}
              className="shrink-0 rounded-full border border-accent/40 px-6 py-3 text-sm font-semibold text-foreground transition-colors duration-300 hover:bg-accent-soft"
            >
              Book a free call
            </button>
          </div>
        </Reveal>

        <Assurances />
      </div>
    </section>
  );
}

function PricingCard({
  plan,
  onSelect,
}: {
  plan: Plan;
  onSelect: () => void;
}) {
  const { name, badge, tagline, price, period, cta, reassurance } = plan;
  const isSilver = plan.variant === "silver";

  const accentLine = isSilver ? "silver-gradient" : "gold-gradient";

  const badgeClass = isSilver
    ? "silver-gradient text-foreground"
    : "gold-gradient text-[hsl(240_10%_8%)] shadow-gold";

  const checkClass = isSilver
    ? "silver-gradient text-foreground"
    : "gold-gradient text-[hsl(240_10%_8%)]";

  const ctaClass = isSilver
    ? "silver-gradient text-foreground shadow-silver hover:shadow-[0_12px_40px_-8px_hsl(220_10%_60%_/_0.5)]"
    : "btn-gold";

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className={`relative flex h-full flex-col overflow-hidden rounded-3xl border p-8 transition-colors duration-300 ${
        plan.featured
          ? "border-accent/50 bg-card shadow-gold"
          : "border-[hsl(220_10%_70%_/_0.4)] bg-card shadow-lux"
      }`}
    >
      {/* top accent */}
      <div
        className={`absolute inset-x-0 top-0 h-1.5 ${
          plan.featured ? "gold-gradient" : "silver-gradient"
        }`}
      />

      {/* ambient corner accents */}
      {isSilver && (
        <>
          <div className="pointer-events-none absolute -right-6 -top-6 h-16 w-16 rotate-45 bg-[hsl(220_10%_70%_/_0.18)] blur-[2px]" />
          <div className="pointer-events-none absolute -left-6 -bottom-6 h-16 w-16 rotate-45 bg-[hsl(220_10%_70%_/_0.12)] blur-[2px]" />
        </>
      )}

      <span
        className={`absolute right-6 top-6 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${badgeClass}`}
      >
        {badge}
      </span>

      <div className={`mb-4 h-1.5 w-12 rounded-full ${accentLine}`} />

      <h3 className="font-display text-2xl font-medium text-foreground">
        {name}
      </h3>
      <p className="mt-2 max-w-[34ch] text-sm leading-relaxed text-muted-foreground">
        {tagline}
      </p>

      <div className="mt-6 flex items-baseline gap-2">
        <span className="font-display text-2xl font-medium text-foreground">
          {price}
        </span>
        <span className="text-sm text-muted-foreground">{period}</span>
      </div>

      {/* The button sits under the price, not under ten feature rows. Anyone
          who has already decided never has to scroll past the argument.
          Every plan starts with the strategy-call modal, not a checkout. */}
      <button
        type="button"
        onClick={onSelect}
        className={`group mt-6 inline-flex w-full items-center justify-center gap-2.5 rounded-full px-8 py-4 text-base font-bold transition-all duration-300 ${ctaClass}`}
      >
        <RollLabel>{cta}</RollLabel>
        <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
      </button>
      <p className="mt-3 text-center text-xs text-muted-foreground">
        {reassurance}
      </p>

      <div className="mt-7 border-t border-border pt-6">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
          What&rsquo;s included
        </p>
        <ul className="mt-4 space-y-3">
          {PLAN_FEATURES.map((f) => {
            const included = f.includedIn.includes(plan.id);
            return (
              <li
                key={f.label}
                className={`flex items-start gap-3 text-sm ${
                  included ? "text-foreground/80" : "text-muted-foreground/45"
                }`}
              >
                <span
                  className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                    included ? checkClass : "bg-muted text-muted-foreground/50"
                  }`}
                >
                  <Check className="h-3 w-3" />
                </span>
                <span>{f.label}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </motion.div>
  );
}

/** Full-width and dark, so it reads as a step above the two self-serve
 *  plans rather than a third column to compare against them. The button
 *  opens the strategy-call modal: this plan is scoped on a call. */
function EnterpriseCard({ onContact }: { onContact: () => void }) {
  const { name, badge, tagline, price, period, cta, reassurance, features } =
    ENTERPRISE;

  return (
    <div className="relative mx-auto mt-8 max-w-3xl overflow-hidden rounded-3xl border border-accent/30 bg-[hsl(240_10%_6%)] p-8 text-white shadow-lux sm:p-10">
      <div className="absolute inset-x-0 top-0 h-1.5 gold-gradient" />
      {/* soft gold light in the corner, behind the copy */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[hsl(43_90%_55%_/_0.14)] blur-3xl" />

      <div className="relative grid gap-8 md:grid-cols-[1fr_1.1fr] md:gap-10">
        <div className="flex flex-col">
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full gold-gradient px-3 py-1 text-xs font-semibold text-[hsl(240_10%_8%)]">
            <Users className="h-3.5 w-3.5" />
            {badge}
          </span>
          <h3 className="mt-5 font-display text-2xl font-medium">{name}</h3>
          <p className="mt-2 max-w-[36ch] text-sm leading-relaxed text-white/70">
            {tagline}
          </p>

          <div className="mt-6">
            <p className="font-display text-2xl font-medium gold-text">
              {price}
            </p>
            <p className="mt-1 text-sm text-white/55">{period}</p>
          </div>

          <button
            onClick={onContact}
            className="btn-gold group mt-6 inline-flex w-full items-center justify-center gap-2.5 rounded-full px-8 py-4 text-base font-bold"
          >
            <RollLabel>{cta}</RollLabel>
            <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
          <p className="mt-3 text-center text-xs text-white/50">
            {reassurance}
          </p>
        </div>

        <div className="border-t border-white/10 pt-6 md:border-l md:border-t-0 md:pl-10 md:pt-0">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/50">
            What&rsquo;s included
          </p>
          <ul className="mt-4 space-y-3.5">
            {features.map((f) => (
              <li
                key={f}
                className="flex items-start gap-3 text-sm leading-relaxed text-white/85"
              >
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full gold-gradient text-[hsl(240_10%_8%)]">
                  <Check className="h-3 w-3" />
                </span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

/** Risk reversal in the visitor's own terms. Every line here is a promise the
 *  FAQ already makes — this just puts it next to the button. */
function Assurances() {
  return (
    <Reveal delay={0.25}>
      <ul className="mx-auto mt-10 grid max-w-5xl gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
        {ASSURANCES.map((a) => (
          <li key={a.title} className="bg-background p-6">
            <div className="flex items-center gap-2.5">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full gold-gradient text-[hsl(240_10%_8%)]">
                <Check className="h-3 w-3" />
              </span>
              <p className="font-display text-sm font-medium text-foreground">
                {a.title}
              </p>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {a.body}
            </p>
          </li>
        ))}
      </ul>
    </Reveal>
  );
}
