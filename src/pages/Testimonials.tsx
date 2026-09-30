import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/sections/Footer";
import { Reviews } from "@/components/sections/Reviews";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { MobileCallBar } from "@/components/MobileCallBar";
import { Reveal } from "@/components/motion/Reveal";
import { SEOHead } from "@/components/SEOHead";

const TestimonialsPage = () => {
  return (
    <div id="top" className="relative min-h-screen bg-background">
      {/* No aggregateRating here. The reviews are now live from the review
          platform, so any star count hard-coded on this page would be a
          number nobody is checking — and Google treats a stale or unbacked
          rating as exactly the kind of markup it penalises. */}
      <SEOHead
        title="Reviews — What Our Clients Say | Luxen Digital"
        description="Verified reviews from service business owners who stopped doing it all manually. Read what Luxen Digital's websites and automation systems did for their businesses."
        canonical="/testimonials"
      />
      <Navbar />
      <main className="pt-32">
        <section className="relative py-8 sm:py-12">
          <div className="mx-auto max-w-3xl px-6 lg:px-10">
            <Reveal className="text-center">
              <p className="text-sm font-medium uppercase tracking-[0.25em] text-accent">
                Reviews
              </p>
              <h1 className="mt-4 font-display text-3xl font-medium tracking-tight text-balance sm:text-4xl lg:text-5xl">
                Owners who stopped doing it all manually.
              </h1>
              <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                Every review below is left by a real client and published
                unedited. More leads, faster follow-up, and systems that run
                while they work.
              </p>
            </Reveal>
          </div>
        </section>

        <Reviews />
        <FinalCTA />
      </main>
      <Footer />
      <MobileCallBar />
    </div>
  );
};

export default TestimonialsPage;
