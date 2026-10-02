import { PageLayout } from "@/components/layout/PageLayout";
import { PageHero } from "@/components/layout/PageHero";
import { Pricing } from "@/components/sections/Pricing";
import { PricingSteps } from "@/components/sections/PricingSteps";
import { FAQ } from "@/components/sections/FAQ";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { faqsById, faqSchema, PRICING_FAQ_IDS } from "@/content/faq";
import { PLANS } from "@/content/pricing";

const TITLE = "Pick the plan that matches how busy you want to be.";
const LEDE =
  "Start with a website that actually converts, then turn on the automation that follows up for you. Month to month, cancel any time.";

/** The three things a visitor checks before they'll look at a price. */
const TRUST = [
  "No long-term contracts",
  "You own your website",
  "Live in 1–4 weeks",
];

const PRICING_FAQS = faqsById(PRICING_FAQ_IDS);

const PricingPage = () => (
  <PageLayout
    mainClassName="pt-32"
    seo={{
      title: TITLE,
      description: LEDE,
      canonical: "/pricing",
      schemaJson: {
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
          faqSchema(PRICING_FAQS),
        ],
      },
    }}
  >
    {/* Deliberately short. The cards are the page; the copy above them only
        has to say what it costs to be wrong (nothing). */}
    <PageHero eyebrow="Pricing" title={TITLE} subtitle={LEDE} chips={TRUST} />
    <Pricing />
    <PricingSteps />
    <FAQ
      faqs={PRICING_FAQS}
      eyebrow="Before you decide"
      title="The questions everyone asks first."
    />
    <FinalCTA />
  </PageLayout>
);

export default PricingPage;
