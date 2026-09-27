import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/sections/Footer";
import { Portfolio } from "@/components/sections/Portfolio";
import { MobileCallBar } from "@/components/MobileCallBar";
import { Reveal } from "@/components/motion/Reveal";
import { SEOHead } from "@/components/SEOHead";

const WorkPage = () => {
  return (
    <div id="top" className="relative min-h-screen bg-background">
      <SEOHead
        title="Our Work — Premium Website Case Studies | Luxen Digital"
        description="A look at what we build. Custom, conversion-focused websites for service businesses — designed around the business, not a template."
        canonical="/work"
      />
      <Navbar />
      <main className="pt-32">
        <section className="relative py-12 sm:py-16">
          <div className="mx-auto max-w-3xl px-6 lg:px-10">
            <Reveal className="text-center">
              <p className="text-sm font-medium uppercase tracking-[0.25em] text-accent">
                Selected Work
              </p>
              <h1 className="mt-4 font-display text-3xl font-medium tracking-tight text-balance sm:text-4xl lg:text-5xl">
                A look at what we build.
              </h1>
              <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                Every site is custom — designed around the business, not a
                template. Editorial, minimal, fast.
              </p>
            </Reveal>
          </div>
        </section>
        <Portfolio />
      </main>
      <Footer />
      <MobileCallBar />
    </div>
  );
};

export default WorkPage;
