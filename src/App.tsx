import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { BookingProvider } from "@/components/BookingModal";
import { lazy, Suspense } from "react";
import Index from "./pages/Index";

// Every route but the homepage is split into its own chunk, so the first
// visit only downloads and parses the code for the page it lands on.
const FaqPage = lazy(() => import("./pages/Faq"));
const WhyLuxenPage = lazy(() => import("./pages/WhyLuxen"));
const PricingPage = lazy(() => import("./pages/Pricing"));
const TestimonialsPage = lazy(() => import("./pages/Testimonials"));
const WorkPage = lazy(() => import("./pages/Work"));
const ServicePage = lazy(() => import("./pages/Service"));
const LegalPage = lazy(() => import("./pages/Legal"));
const NotFound = lazy(() => import("./pages/NotFound"));

const App = () => (
  <HelmetProvider>
    <BookingProvider>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Suspense fallback={<div className="min-h-screen bg-background" />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/faq" element={<FaqPage />} />
            <Route path="/why-luxen" element={<WhyLuxenPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/testimonials" element={<TestimonialsPage />} />
            <Route path="/work" element={<WorkPage />} />
            <Route path="/services/:slug" element={<ServicePage />} />
            <Route path="/legal/:slug" element={<LegalPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </BookingProvider>
  </HelmetProvider>
);

export default App;
