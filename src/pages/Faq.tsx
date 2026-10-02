import { PageLayout } from "@/components/layout/PageLayout";
import { PageHero } from "@/components/layout/PageHero";
import { FAQ } from "@/components/sections/FAQ";
import { FAQS, faqSchema } from "@/content/faq";

const TITLE = "Everything you need to know.";
const LEDE =
  "Straight answers for business owners considering a website and automation system built by Luxen Digital.";

const FaqPage = () => (
  <PageLayout
    mainClassName="pt-32"
    seo={{
      title: TITLE,
      description: LEDE,
      canonical: "/faq",
      schemaJson: { "@context": "https://schema.org", ...faqSchema(FAQS) },
    }}
  >
    <PageHero eyebrow="Support" title={TITLE} subtitle={LEDE} />
    <FAQ />
  </PageLayout>
);

export default FaqPage;
