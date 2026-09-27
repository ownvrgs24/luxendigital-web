import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/sections/Footer";
import { MobileCallBar } from "@/components/MobileCallBar";
import { Reveal } from "@/components/motion/Reveal";
import { WhyLuxen } from "@/components/sections/WhyLuxen";
import { SEOHead } from "@/components/SEOHead";

const WhyLuxenPage = () => {
  return (
    <div id="top" className="relative min-h-screen bg-background">
      <SEOHead
        title="Why Luxen Digital — A Premium Technology Partner, Not Just a Web Design Company"
        description="Most web designers treat launch as the finish line. At Luxen Digital, it's where the partnership begins. Built for service businesses, designed to convert, with automation that works around the clock."
        canonical="/why-luxen"
        schemaJson={{
          "@context": "https://schema.org",
          "@type": "AboutPage",
          name: "Why Luxen Digital",
          description:
            "Luxen Digital is a premium technology partner for service businesses — building connected customer-acquisition systems with ongoing support.",
        }}
      />
      <Navbar />
      <main className="pt-32">
        <section className="relative py-12 sm:py-16">
          <div className="mx-auto max-w-3xl px-6 lg:px-10">
            <Reveal className="text-center">
              <p className="text-sm font-medium uppercase tracking-[0.25em] text-accent">
                Why Luxen Digital
              </p>
              <h1 className="mt-4 font-display text-3xl font-medium tracking-tight text-balance sm:text-4xl lg:text-5xl">
                A premium technology partner, not just a web design company.
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                Most web designers treat launch as the finish line. At Luxen
                Digital, it is where the partnership begins. We stay involved
                after launch to keep your website, automations, and
                customer-acquisition system working, updated, and aligned with
                your business as it grows.
              </p>
            </Reveal>
          </div>
        </section>
        <WhyLuxen />
      </main>
      <Footer />
      <MobileCallBar />
    </div>
  );
};

export default WhyLuxenPage;
