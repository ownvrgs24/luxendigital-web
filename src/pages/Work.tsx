import { PageLayout } from "@/components/layout/PageLayout";
import { PageHero } from "@/components/layout/PageHero";
import { Portfolio } from "@/components/sections/Portfolio";
import { Reviews } from "@/components/sections/Reviews";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { PROJECTS } from "@/content/work";

const TITLE = "Sites that book the job, not just win the compliment.";
const LEDE =
  "Every build is custom — designed around how the business actually wins work, then wired into the follow-up that runs after the visitor leaves.";

/** The industries on show, straight off the grid — so the line can never
 *  claim a category that isn't actually below it. */
const CATEGORIES = [...new Set(PROJECTS.map((p) => p.category))];

const WorkPage = () => (
  <PageLayout
    mainClassName="pt-32"
    seo={{
      title: TITLE,
      description: LEDE,
      canonical: "/work",
      ogImage: PROJECTS[0].img,
      schemaJson: {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "Selected Work — Luxen Digital",
        description:
          "Custom, conversion-focused websites and automation systems built for service businesses.",
        hasPart: PROJECTS.map((p) => ({
          "@type": "CreativeWork",
          name: p.title,
          about: p.category,
          description: p.blurb,
          creator: { "@type": "Organization", name: "Luxen Digital" },
        })),
      },
    }}
  >
    <PageHero
      eyebrow="Selected Work"
      title={TITLE}
      subtitle={LEDE}
      chips={CATEGORIES}
    />
    <Portfolio />
    <Reviews
      heading={{
        eyebrow: "Reviews",
        title: "What they said once the site was live.",
        subtitle:
          "Unedited and current — pulled straight from our review platform.",
      }}
    />
    <FinalCTA />
  </PageLayout>
);

export default WorkPage;
