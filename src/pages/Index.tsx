import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/sections/Hero";
import { WhoWeHelp } from "@/components/sections/WhoWeHelp";
import { Philosophy } from "@/components/sections/Philosophy";
import { Features } from "@/components/sections/Features";
import { CustomerJourney } from "@/components/sections/CustomerJourney";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { Footer } from "@/components/sections/Footer";
import { MobileCallBar } from "@/components/MobileCallBar";
import { SEOHead } from "@/components/SEOHead";

const Index = () => {
  return (
    <div className="relative min-h-screen bg-background">
      <SEOHead
        title="Luxen Digital — Premium Websites & AI Systems for Service Businesses"
        description="Luxen Digital builds premium websites and AI-powered business systems for local service businesses. Generate more leads, automate follow-up, book appointments, and grow faster."
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
        <WhoWeHelp />
        <Philosophy />
        <Features />
        <CustomerJourney />
        <FinalCTA />
      </main>
      <Footer />
      <MobileCallBar />
    </div>
  );
};

export default Index;
