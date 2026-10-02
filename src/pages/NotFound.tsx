import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { SEOHead } from "@/components/SEOHead";
import { RollLabel } from "@/components/motion/RollLabel";
import { SectionHeading } from "@/components/ui/SectionHeading";

const TITLE = "Oops! Page not found";
const LEDE = "The page you're looking for doesn't exist or has moved.";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <SEOHead
        title={TITLE}
        description={LEDE}
        noIndex
      />
      <main className="text-center">
        <SectionHeading
          as="h1"
          center
          eyebrow="404"
          title={TITLE}
          subtitle={LEDE}
        />
        <a
          href="/"
          className="btn-gold mt-8 px-9 py-5 text-base"
        >
          <RollLabel>Return to Home</RollLabel>
        </a>
      </main>
    </div>
  );
};

export default NotFound;
