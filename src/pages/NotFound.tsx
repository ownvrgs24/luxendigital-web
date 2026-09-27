import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { SEOHead } from "@/components/SEOHead";

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
        title="Page Not Found — Luxen Digital"
        description="The page you're looking for doesn't exist. Return to the Luxen Digital homepage to explore premium websites and AI systems for service businesses."
        canonical="/404"
        noIndex
      />
      <div className="text-center">
        <p className="text-sm font-medium uppercase tracking-[0.25em] text-accent">
          404
        </p>
        <h1 className="mt-4 font-display text-3xl font-medium tracking-tight text-balance sm:text-4xl lg:text-5xl">
          Oops! Page not found
        </h1>
        <p className="mx-auto mt-6 max-w-md text-lg leading-relaxed text-muted-foreground">
          The page you're looking for doesn't exist or has moved.
        </p>
        <a
          href="/"
          className="btn-gold mt-8 inline-flex items-center gap-2.5 rounded-full px-9 py-5 text-base font-bold"
        >
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
