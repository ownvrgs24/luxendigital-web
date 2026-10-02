import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/sections/Footer";
import { FAQ } from "@/components/sections/FAQ";
import { MobileCallBar } from "@/components/MobileCallBar";
import { Reveal } from "@/components/motion/Reveal";
import { SEOHead } from "@/components/SEOHead";

const FaqPage = () => {
  return (
    <div id="top" className="relative min-h-screen bg-background">
      <SEOHead
        title="Everything you need to know."
        description="Straight answers for business owners considering a website and automation system built by Luxen Digital."
        canonical="/faq"
        schemaJson={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            {
              "@type": "Question",
              name: "How much does a website cost?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Every business is different, so pricing depends on your goals, features, and complexity. Most projects start with a free strategy call where we learn about your business and provide a custom quote with no obligation.",
              },
            },
            {
              "@type": "Question",
              name: "How long does a project take?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Most websites are completed within 1-4 weeks, depending on the size of the project and how quickly we receive your content and feedback.",
              },
            },
          ],
        }}
      />
      <Navbar />
      <main className="pt-32">
        <section className="relative py-12 sm:py-16">
          <div className="mx-auto max-w-3xl px-6 lg:px-10">
            <Reveal className="text-center">
              <p className="text-sm font-medium uppercase tracking-[0.25em] text-accent">
                Support
              </p>
              <h1 className="mt-4 font-display text-3xl font-medium tracking-tight text-balance sm:text-4xl lg:text-5xl">
                Everything you need to know.
              </h1>
              <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                Straight answers for business owners considering a website and
                automation system built by Luxen Digital.
              </p>
            </Reveal>
          </div>
        </section>
        <FAQ />
      </main>
      <Footer />
      <MobileCallBar />
    </div>
  );
};

export default FaqPage;
