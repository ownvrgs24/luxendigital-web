import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { LEGAL_BY_SLUG, LEGAL_DOCS } from "@/content/legal";
import NotFound from "./NotFound";

/** One page component for every legal document — they share a shape, so a
 *  second copy of this layout would only be somewhere for them to drift. */
const LegalPage = () => {
  const { slug = "" } = useParams();
  const doc = LEGAL_BY_SLUG[slug];

  useEffect(() => window.scrollTo(0, 0), [slug]);

  if (!doc) return <NotFound />;

  const others = LEGAL_DOCS.filter((d) => d.slug !== doc.slug);
  const updated = new Date(doc.updated).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <PageLayout
      mainClassName="pt-32"
      seo={{
        title: doc.title,
        description: doc.summary,
        canonical: `/legal/${doc.slug}`,
      }}
    >
        <section className="relative py-10 sm:py-14">
          <div className="mx-auto max-w-3xl px-6 lg:px-10">
            <Reveal>
              <SectionHeading
                as="h1"
                eyebrow="Legal"
                title={doc.title}
                subtitle={doc.summary}
              />
              <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                Last updated {updated}
              </p>
            </Reveal>
          </div>
        </section>

        <section className="relative pb-20 sm:pb-28">
          <div className="mx-auto max-w-3xl px-6 lg:px-10">
            <Reveal delay={0.06}>
              <div className="border-t border-border pt-10">
                {doc.blocks.map((b, i) =>
                  b.kind === "h" ? (
                    <h2
                      key={i}
                      className="mt-10 font-display text-xl font-medium tracking-tight text-foreground first:mt-0 sm:text-2xl"
                    >
                      {b.text}
                    </h2>
                  ) : b.kind === "list" ? (
                    <ul key={i} className="mt-4 space-y-3">
                      {b.items.map((item) => (
                        <li
                          key={item}
                          className="flex gap-3 text-base leading-relaxed text-muted-foreground"
                        >
                          <span
                            aria-hidden="true"
                            className="mt-2.5 h-1 w-3 shrink-0 rounded-full gold-gradient"
                          />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p
                      key={i}
                      className="mt-4 text-base leading-relaxed text-muted-foreground"
                    >
                      {b.text}
                    </p>
                  ),
                )}
              </div>
            </Reveal>

            <Reveal delay={0.12}>
              <nav
                aria-label="Other legal pages"
                className="mt-14 border-t border-border pt-8"
              >
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                  Also here
                </p>
                <ul className="mt-5 flex flex-wrap gap-2.5">
                  {others.map((d) => (
                    <li key={d.slug}>
                      <a
                        href={`/legal/${d.slug}`}
                        className="inline-block rounded-full border border-border px-4 py-2 text-sm text-foreground/75 transition-colors duration-300 hover:border-accent/50 hover:text-foreground"
                      >
                        {d.nav}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </Reveal>
          </div>
        </section>
    </PageLayout>
  );
};

export default LegalPage;
