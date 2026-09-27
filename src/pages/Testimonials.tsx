import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/sections/Footer";
import { Testimonials } from "@/components/sections/Testimonials";
import { MobileCallBar } from "@/components/MobileCallBar";
import { Reveal } from "@/components/motion/Reveal";
import { SEOHead } from "@/components/SEOHead";

const TestimonialsPage = () => {
  return (
    <div id="top" className="relative min-h-screen bg-background">
      <SEOHead
        title="Testimonials — What Our Clients Say | Luxen Digital"
        description="Real results from service business owners who stopped doing it all manually. Hear how Luxen Digital's websites and automation systems grew their businesses."
        canonical="/testimonials"
        schemaJson={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Luxen Digital",
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: "5",
            reviewCount: "6",
          },
        }}
      />
      <Navbar />
      <main className="pt-32">
        <section className="relative py-12 sm:py-16">
          <div className="mx-auto max-w-3xl px-6 lg:px-10">
            <Reveal className="text-center">
              <p className="text-sm font-medium uppercase tracking-[0.25em] text-accent">
                Testimonials
              </p>
              <h1 className="mt-4 font-display text-3xl font-medium tracking-tight text-balance sm:text-4xl lg:text-5xl">
                Owners who stopped doing it all manually.
              </h1>
              <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                Real results from real service businesses. More leads, faster
                follow-up, and systems that run while they work.
              </p>
            </Reveal>
          </div>
        </section>
        <Testimonials />
      </main>
      <Footer />
      <MobileCallBar />
    </div>
  );
};

export default TestimonialsPage;
