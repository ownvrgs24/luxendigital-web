import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

type Reason = {
  title: string;
  desc: string;
};

const reasons: Reason[] = [
  {
    title: "Built for Service Businesses",
    desc: "Every decision is designed around the way service businesses grow: generating leads, responding quickly, booking appointments, and building a strong reputation.",
  },
  {
    title: "Designed to Convert",
    desc: "Your website is built to make your services clear, establish trust, and guide visitors toward one simple next step: calling, submitting an inquiry, or booking an appointment.",
  },
  {
    title: "Fast, Reliable Performance",
    desc: "Fast-loading pages create a better user experience and help prevent visitors from leaving before they contact you. We optimize every site for speed, mobile performance, and conversions.",
  },
  {
    title: "Automation That Works Around the Clock",
    desc: "Capture new leads, send instant follow-ups, remind customers about appointments, recover missed calls, and request reviews automatically.",
  },
  {
    title: "One Connected Platform",
    desc: "Your website, CRM, conversations, booking calendar, follow-up campaigns, and reputation tools work together in one system instead of being scattered across multiple apps.",
  },
  {
    title: "Real Human Support",
    desc: "You get direct support from people who understand your system and can help you make the right changes as your business evolves.",
  },
  {
    title: "Ongoing Optimization",
    desc: "Your business changes over time. We help update and improve your website and customer-acquisition system so it continues to support your goals after launch.",
  },
  {
    title: "Flexible Website Updates",
    desc: "Need to change a service, update your offer, or add a new section? We make it easy to keep your website current without unexpected development fees.",
  },
];

/**
 * The eight commitments, as a ruled editorial list.
 *
 * These used to be eight cards bobbing on eight different loops at once. One
 * floating card is a flourish; eight of them is a page that won't sit still
 * while you try to read it. The motion now happens on arrival and on hover,
 * where it means something.
 */
export function WhyLuxen() {
  return (
    <section
      id="why"
      className="relative border-t border-border/60 py-20 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-6 lg:px-10">
        <Reveal className="max-w-2xl">
          <SectionHeading
            eyebrow="What you get"
            title="Eight commitments that don’t expire at launch."
          />
        </Reveal>

        <div className="mt-12 grid gap-x-14 md:grid-cols-2">
          {reasons.map((r, i) => (
            <Reveal key={r.title} delay={(i % 2) * 0.08}>
              <article className="group relative border-t border-border py-7">
                {/* A gold rule that draws itself across the divider on hover. */}
                <span
                  aria-hidden="true"
                  className="absolute -top-px left-0 h-px w-0 gold-gradient transition-all duration-500 group-hover:w-full motion-reduce:transition-none"
                />
                <div className="flex items-baseline gap-4">
                  <span className="font-display text-sm font-medium tabular-nums text-accent/70 transition-colors duration-300 group-hover:text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-display text-lg font-medium tracking-tight text-foreground sm:text-xl">
                    {r.title}
                  </h3>
                </div>
                <p className="mt-3 pl-9 text-sm leading-relaxed text-muted-foreground">
                  {r.desc}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
