import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { NEXT_STEPS } from "@/content/pricing";

/**
 * What happens after the button. The thing that stops an owner mid-click is
 * rarely the price — it's not knowing what they've just signed up for, so
 * the three steps are spelled out before they have to ask.
 */
export function PricingSteps() {
  return (
    <section className="relative border-t border-border/60 bg-secondary/40 py-16 sm:py-20">
      <div className="mx-auto max-w-5xl px-6 lg:px-10">
        <Reveal className="mx-auto max-w-2xl text-center">
          <SectionHeading
            eyebrow="What happens next"
            title="From first call to booked jobs in three steps."
          />
        </Reveal>

        <ol className="mt-10 grid gap-5 md:grid-cols-3">
          {NEXT_STEPS.map((s, i) => (
            <Reveal
              key={s.step}
              as="li"
              delay={i * 0.1}
              className="relative h-full rounded-2xl border border-border bg-background p-7 shadow-lux"
            >
                <div className="mb-4 h-1.5 w-12 rounded-full gold-gradient" />
                <p className="font-display text-sm font-medium text-accent">
                  {s.step}
                </p>
                <h3 className="mt-2 font-display text-xl font-medium text-foreground">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {s.body}
                </p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
