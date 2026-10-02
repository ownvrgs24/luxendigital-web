import { lazy, Suspense, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/sections/Hero";
import { Footer } from "@/components/sections/Footer";
import { MobileCallBar } from "@/components/MobileCallBar";
import { SEOHead } from "@/components/SEOHead";

// Everything below the hero is fetched as a separate chunk, so the first
// paint only waits on the code for what is actually on screen. The heavy
// pieces (GSAP, the WebGL rosette) live down here.
const WhoWeHelp = lazy(() =>
  import("@/components/sections/WhoWeHelp").then((m) => ({
    default: m.WhoWeHelp,
  })),
);
const Philosophy = lazy(() =>
  import("@/components/sections/Philosophy").then((m) => ({
    default: m.Philosophy,
  })),
);
const Features = lazy(() =>
  import("@/components/sections/Features").then((m) => ({
    default: m.Features,
  })),
);
const CustomerJourney = lazy(() =>
  import("@/components/sections/CustomerJourney").then((m) => ({
    default: m.CustomerJourney,
  })),
);
const FinalCTA = lazy(() =>
  import("@/components/sections/FinalCTA").then((m) => ({
    default: m.FinalCTA,
  })),
);

/**
 * The browser jumps to a URL's #hash on load, before the lazy sections exist.
 * Once they have mounted, finish that jump ourselves.
 */
function ScrollToHash() {
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (id) document.getElementById(id)?.scrollIntoView();
  }, []);
  return null;
}

const Index = () => {
  return (
    <div className="relative min-h-screen bg-background">
      <SEOHead
        title="Stop losing sales to a dead website."
        description="Luxen combines a high-converting website, CRM, automated follow-up, reviews, and AI into one system built to help your business capture and convert more opportunities."
        canonical="/"
        schemaJson={{
          "@context": "https://schema.org",
          "@type": "ProfessionalService",
          name: "Luxen Digital",
          description:
            "Premium websites and AI-powered business systems for local service businesses.",
          areaServed: "US",
          serviceType: [
            "Web Design",
            "AI Automation",
            "CRM",
            "Lead Generation",
            "Reputation Management",
          ],
        }}
      />
      <Navbar />
      <main>
        <Hero />
        <Suspense fallback={<div className="min-h-screen" />}>
          <WhoWeHelp />
          <Philosophy />
          <Features />
          <CustomerJourney />
          <FinalCTA />
          <ScrollToHash />
        </Suspense>
      </main>
      <Footer />
      <MobileCallBar />
    </div>
  );
};

export default Index;
