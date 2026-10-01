import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/sections/Footer";
import { Pricing } from "@/components/sections/Pricing";
import { PricingSteps } from "@/components/sections/PricingSteps";
import { PricingFAQ } from "@/components/sections/PricingFAQ";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { MobileCallBar } from "@/components/MobileCallBar";
import { Reveal } from "@/components/motion/Reveal";
import { SEOHead } from "@/components/SEOHead";
import { faqsById, PRICING_FAQ_IDS } from "@/content/faq";
import { PLANS } from "@/content/pricing";

/** The three things a visitor checks before they'll look at a price. */
const TRUST = [
  "No long-term contracts",
  "You own your website",
  "Live in 1–4 weeks",
];

const PricingPage = () => {
  return (
    <div id="top" className="relative min-h-screen bg-background">
      <SEOHead
        title="Pricing — Simple, Transparent Plans | Luxen Digital"
        description="Transparent monthly plans for service businesses. Start with the essentials, then add automation when you're ready. No long-term contracts."
        canonical="/pricing"
        schemaJson={{
          "@context": "https://schema.org",
          // Two entities on one page: the plans, and the questions people
          // search before they buy. A @graph keeps both in a single block.
          "@graph": [
            {
              "@type": "Product",
              name: "Luxen Digital Website & Automation Plans",
              description:
                "Premium websites and AI-powered business systems for local service businesses.",
              offers: PLANS.map((p) => ({
                "@type": "Offer",
                name: p.name,
                description: p.tagline,
                url: "https://luxendigital.com/pricing",
                priceCurrency: "USD",
                priceSpecification: {
                  "@type": "UnitPriceSpecification",
                  minPrice: p.priceFrom,
                  priceCurrency: "USD",
                  unitCode: "MON",
                },
              })),
            },
            {
              "@type": "FAQPage",
              mainEntity: faqsById(PRICING_FAQ_IDS).map((f) => ({
                "@type": "Question",
                name: f.q,
                acceptedAnswer: { "@type": "Answer", text: f.a },
              })),
            },
          ],
        }}
      />
      <Navbar />
      <main className="pt-32">
        {/* Hero — deliberately short. The cards are the page; the copy above
            them only has to say what it costs to be wrong (nothing). */}
        <section className="relative py-8 sm:py-12">
          <div className="mx-auto max-w-3xl px-6 lg:px-10">
            <Reveal className="text-center">
              <p className="text-sm font-medium uppercase tracking-[0.25em] text-accent">
                Pricing
              </p>
              <h1 className="mt-4 font-display text-3xl font-medium tracking-tight text-balance sm:text-4xl lg:text-5xl">
                Pick the plan that matches how busy you want to be.
              </h1>
              <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                Start with a website that actually converts, then turn on the
                automation that follows up for you. Month to month, cancel any
                time.
              </p>

              <ul className="mt-7 flex flex-wrap items-center justify-center gap-2.5">
                {TRUST.map((t) => (
                  <li
                    key={t}
                    className="rounded-full border border-border bg-secondary/50 px-4 py-1.5 text-xs font-medium text-muted-foreground"
                  >
                    {t}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </section>

        <Pricing />
        <PricingSteps />
        <PricingFAQ />
        <FinalCTA />
      </main>
      <Footer />
      <MobileCallBar />
    </div>
  );
};

export default PricingPage;
