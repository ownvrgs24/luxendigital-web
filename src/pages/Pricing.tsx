import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/sections/Footer";
import { Pricing } from "@/components/sections/Pricing";
import { MobileCallBar } from "@/components/MobileCallBar";
import { Reveal } from "@/components/motion/Reveal";
import { SEOHead } from "@/components/SEOHead";

const PricingPage = () => {
  return (
    <div id="top" className="relative min-h-screen bg-background">
      <SEOHead
        title="Pricing — Simple, Transparent Plans | Luxen Digital"
        description="Transparent monthly plans for service businesses. Start with the essentials, then add automation when you're ready. No long-term contracts."
        canonical="/pricing"
        schemaJson={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: "Luxen Digital Website & Automation Plans",
          description:
            "Premium websites and AI-powered business systems for local service businesses.",
        }}
      />
      <Navbar />
      <main className="pt-32">
        <section className="relative py-12 sm:py-16">
          <div className="mx-auto max-w-3xl px-6 lg:px-10">
            <Reveal className="text-center">
              <p className="text-sm font-medium uppercase tracking-[0.25em] text-accent">
                Pricing
              </p>
              <h1 className="mt-4 font-display text-3xl font-medium tracking-tight text-balance sm:text-4xl lg:text-5xl">
                Plans that grow with your business.
              </h1>
              <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                Start with the essentials, then add automation when you're
                ready. No long-term contracts — just a system that works.
              </p>
            </Reveal>
          </div>
        </section>
        <Pricing />
      </main>
      <Footer />
      <MobileCallBar />
    </div>
  );
};

export default PricingPage;
