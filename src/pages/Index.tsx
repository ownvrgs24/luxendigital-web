import { lazy, Suspense, useEffect, type ComponentType } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Hero } from "@/components/sections/Hero";

/** Lazy-load a named export (React.lazy only takes default exports). */
const lazySection = <K extends string>(
  load: () => Promise<Record<K, ComponentType>>,
  name: K,
) => lazy(() => load().then((m) => ({ default: m[name] })));

// Everything below the hero is fetched as a separate chunk, so the first
// paint only waits on the code for what is actually on screen. The heavy
// pieces (GSAP, the WebGL rosette) live down here.
const WhoWeHelp = lazySection(() => import("@/components/sections/WhoWeHelp"), "WhoWeHelp");
const Philosophy = lazySection(() => import("@/components/sections/Philosophy"), "Philosophy");
const Features = lazySection(() => import("@/components/sections/Features"), "Features");
const CustomerJourney = lazySection(() => import("@/components/sections/CustomerJourney"), "CustomerJourney");
const FinalCTA = lazySection(() => import("@/components/sections/FinalCTA"), "FinalCTA");

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

const Index = () => (
  <PageLayout
    seo={{
      title: "Stop losing sales to a dead website.",
      description:
        "Luxen combines a high-converting website, CRM, automated follow-up, reviews, and AI into one system built to help your business capture and convert more opportunities.",
      canonical: "/",
      schemaJson: {
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
      },
    }}
  >
    <Hero />
    <Suspense fallback={<div className="min-h-screen" />}>
      <WhoWeHelp />
      <Philosophy />
      <Features />
      <CustomerJourney />
      <FinalCTA />
      <ScrollToHash />
    </Suspense>
  </PageLayout>
);

export default Index;
