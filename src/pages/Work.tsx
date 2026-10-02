import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/sections/Footer";
import { Portfolio } from "@/components/sections/Portfolio";
import { Reviews } from "@/components/sections/Reviews";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { MobileCallBar } from "@/components/MobileCallBar";
import { Reveal } from "@/components/motion/Reveal";
import { SEOHead } from "@/components/SEOHead";
import { PROJECTS } from "@/content/work";

/** The industries on show, straight off the grid — so the line can never
 *  claim a category that isn't actually below it. */
const CATEGORIES = [...new Set(PROJECTS.map((p) => p.category))];

const WorkPage = () => {
  return (
    <div id="top" className="relative min-h-screen bg-background">
      <SEOHead
        title="Sites that book the job, not just win the compliment."
        description="Every build is custom — designed around how the business actually wins work, then wired into the follow-up that runs after the visitor leaves."
        canonical="/work"
        ogImage={PROJECTS[0].img}
        schemaJson={{
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
        }}
      />
      <Navbar />
      <main className="pt-32">
        <section className="relative py-8 sm:py-12">
          <div className="mx-auto max-w-3xl px-6 lg:px-10">
            <Reveal className="text-center">
              <p className="text-sm font-medium uppercase tracking-[0.25em] text-accent">
                Selected Work
              </p>
              <h1 className="mt-4 font-display text-3xl font-medium tracking-tight text-balance sm:text-4xl lg:text-5xl">
                Sites that book the job, not just win the compliment.
              </h1>
              <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                Every build is custom — designed around how the business
                actually wins work, then wired into the follow-up that runs
                after the visitor leaves.
              </p>

              <ul className="mt-7 flex flex-wrap items-center justify-center gap-2.5">
                {CATEGORIES.map((c) => (
                  <li
                    key={c}
                    className="rounded-full border border-border bg-secondary/50 px-4 py-1.5 text-xs font-medium text-muted-foreground"
                  >
                    {c}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </section>

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
      </main>
      <Footer />
      <MobileCallBar />
    </div>
  );
};

export default WorkPage;
