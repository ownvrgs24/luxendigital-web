import { PageLayout } from "@/components/layout/PageLayout";
import { PageHero } from "@/components/layout/PageHero";
import { Reviews } from "@/components/sections/Reviews";
import { FinalCTA } from "@/components/sections/FinalCTA";

const TITLE = "Owners who stopped doing it all manually.";
const LEDE =
  "Every review below is left by a real client and published unedited. More leads, faster follow-up, and systems that run while they work.";

// No aggregateRating here. The reviews are live from the review platform, so
// any star count hard-coded on this page would be a number nobody is
// checking — and Google penalises a stale or unbacked rating.
const TestimonialsPage = () => (
  <PageLayout
    mainClassName="pt-32"
    seo={{ title: TITLE, description: LEDE, canonical: "/testimonials" }}
  >
    <PageHero eyebrow="Reviews" title={TITLE} subtitle={LEDE} />
    <Reviews />
    <FinalCTA />
  </PageLayout>
);

export default TestimonialsPage;
