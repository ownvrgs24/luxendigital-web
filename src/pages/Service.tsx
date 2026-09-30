import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/sections/Footer";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { MobileCallBar } from "@/components/MobileCallBar";
import { Reveal } from "@/components/motion/Reveal";
import { RollLabel } from "@/components/motion/RollLabel";
import { SEOHead } from "@/components/SEOHead";
import { useBooking } from "@/components/BookingModal";
import { BY_SLUG, SERVICES, ICONS } from "@/components/navbar/services-menu-data";
import { Scenes } from "@/components/navbar/services-menu-scenes";
import { SERVICE_COPY } from "@/content/services";
import NotFound from "./NotFound";
import "@/components/navbar/navbar.css";

/** Section label. One rule, one word — the pages have enough parts that
 *  they need signposting, and enough restraint that it should be quiet. */
function Marker({ children }: { children: string }) {
  return (
    <p className="text-xs font-medium uppercase tracking-[0.25em] text-muted-foreground">
      {children}
    </p>
  );
}

const ServicePage = () => {
  const { slug = "" } = useParams();
  const { open } = useBooking();
  const svc = BY_SLUG[slug];
  const copy = SERVICE_COPY[svc?.id];

  // Service pages link to each other, and react-router keeps the scroll
  // position across a route change — without this you land halfway down.
  useEffect(() => window.scrollTo(0, 0), [slug]);

  if (!svc || !copy) return <NotFound />;

  const related = copy.related
    .map((id) => SERVICES.find((s) => s.id === id))
    .filter((s): s is (typeof SERVICES)[number] => Boolean(s));

  return (
    <div id="top" className="relative min-h-screen bg-background">
      <SEOHead
        title={`${svc.title} | Luxen Digital`}
        description={copy.meta}
        canonical={`/services/${svc.slug}`}
        schemaJson={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: svc.title,
          description: copy.meta,
          provider: { "@type": "Organization", name: "Luxen Digital" },
          areaServed: "United States",
        }}
      />
      <Navbar />

      <main>
        {/* ── Hero ───────────────────────────────────────────────────────
            Dark band, so the page opens the way the home page does. The
            demo on the right is the same animated scene the services menu
            shows for this service — one source, seen twice. */}
        <section className="relative isolate overflow-hidden bg-primary pb-20 pt-32 text-primary-foreground sm:pb-28 sm:pt-40">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
              <Reveal>
                <div className="flex items-center gap-3">
                  <span
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-accent [&_svg]:h-[18px] [&_svg]:w-[18px]"
                    dangerouslySetInnerHTML={{ __html: ICONS[svc.id] }}
                  />
                  <p className="text-sm font-medium uppercase tracking-[0.25em] text-accent">
                    {svc.group}
                  </p>
                </div>

                <h1 className="mt-6 max-w-[18ch] font-display text-4xl leading-[1.02] tracking-tight text-balance sm:text-5xl lg:text-6xl">
                  {copy.h1}
                </h1>

                <p className="mt-6 max-w-xl text-lg leading-relaxed text-primary-foreground/60">
                  {copy.lede}
                </p>

                <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
                  <button
                    onClick={open}
                    className="btn-gold inline-flex items-center gap-2.5 rounded-full px-8 py-4 text-base font-bold"
                  >
                    <RollLabel>Book a Strategy Call</RollLabel>
                    <ArrowRight className="h-5 w-5" />
                  </button>
                  <a
                    href="/pricing"
                    className="text-sm font-medium text-primary-foreground/60 underline-offset-4 transition-colors hover:text-primary-foreground hover:underline"
                  >
                    See what it costs
                  </a>
                </div>
              </Reveal>

              {/* The navbar's scene CSS is scoped under .lxn, so the wrapper
                  carries that class to bring the styles with it. */}
              <Reveal delay={0.15} className="lxn">
                <div
                  className="stage__screen"
                  style={{ height: "clamp(240px, 34vw, 340px)" }}
                >
                  <Scenes activeId={svc.id} />
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ── What it does ───────────────────────────────────────────────
            Four parallel points. A ruled two-column list rather than four
            cards: they are claims to read, not tiles to scan. */}
        <section className="border-b border-border bg-background bg-dots py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <Reveal>
              <Marker>What it does</Marker>
              <h2 className="mt-4 max-w-2xl font-display text-2xl leading-tight tracking-tight text-balance sm:text-3xl lg:text-4xl">
                {svc.desc}
              </h2>
            </Reveal>

            <dl className="mt-14 grid gap-x-16 sm:grid-cols-2">
              {copy.does.map((d, i) => (
                <Reveal key={d.title} delay={i * 0.06}>
                  <div className="border-t border-border py-7">
                    <dt className="font-display text-lg tracking-tight sm:text-xl">
                      {d.title}
                    </dt>
                    <dd className="mt-2 max-w-md text-[15px] leading-relaxed text-muted-foreground">
                      {d.body}
                    </dd>
                  </div>
                </Reveal>
              ))}
            </dl>
          </div>
        </section>

        {/* ── How it works ──────────────────────────────────────────────
            Ordered, so it gets numerals. They sit in the margin at display
            size and do the whole job an icon or a connector line would. */}
        <section className="border-b border-border bg-secondary py-20 sm:py-28">
          <div className="mx-auto max-w-4xl px-6 lg:px-10">
            <Reveal>
              <Marker>How it works</Marker>
            </Reveal>

            <ol className="mt-10">
              {copy.steps.map((s, i) => (
                <Reveal key={s.title} delay={i * 0.06}>
                  <li className="grid grid-cols-[3rem_1fr] gap-x-5 border-t border-border py-7 last:border-b sm:grid-cols-[4.5rem_1fr]">
                    <span className="font-display text-2xl leading-none tracking-tight text-muted-foreground/35 sm:text-4xl">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="font-display text-lg tracking-tight sm:text-xl">
                        {s.title}
                      </h3>
                      <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
                        {s.body}
                      </p>
                    </div>
                  </li>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>

        {/* ── What's included + related ──────────────────────────────── */}
        <section className="bg-background bg-dots py-20 sm:py-28">
          <div className="mx-auto grid max-w-7xl gap-16 px-6 lg:grid-cols-[1.15fr_0.85fr] lg:gap-24 lg:px-10">
            <Reveal>
              <Marker>What you get</Marker>
              <ul className="mt-8">
                {copy.included.map((item) => (
                  <li
                    key={item}
                    className="flex gap-4 border-t border-border py-4 last:border-b"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-[0.7em] h-px w-4 flex-none bg-accent"
                    />
                    <span className="text-[15px] leading-relaxed sm:text-base">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.1}>
              <Marker>Pairs with</Marker>
              <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-muted-foreground">
                Each of these is useful alone. They're worth more together —
                one system, one inbox, one record of the customer.
              </p>
              <ul className="mt-8">
                {related.map((r) => (
                  <li key={r.id}>
                    <a
                      href={`/services/${r.slug}`}
                      className="group flex items-start gap-4 border-t border-border py-5 transition-colors last:border-b hover:border-foreground/25"
                    >
                      <span className="min-w-0 flex-1">
                        <span className="block font-display text-base tracking-tight transition-colors group-hover:text-accent sm:text-lg">
                          {r.title}
                        </span>
                        <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">
                          {r.desc}
                        </span>
                      </span>
                      <ArrowUpRight className="mt-1 h-4 w-4 flex-none text-muted-foreground transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent motion-reduce:transition-none" />
                    </a>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </section>

        <FinalCTA />
      </main>

      <Footer />
      <MobileCallBar />
    </div>
  );
};

export default ServicePage;
