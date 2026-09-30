import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { BookingProvider } from "@/components/BookingModal";
import Index from "./pages/Index";
import Contact from "./pages/Contact";
import FaqPage from "./pages/Faq";
import WhyLuxenPage from "./pages/WhyLuxen";
import PricingPage from "./pages/Pricing";
import TestimonialsPage from "./pages/Testimonials";
import WorkPage from "./pages/Work";
import ServicePage from "./pages/Service";
import LegalPage from "./pages/Legal";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BookingProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/contact" element={<Contact />} />
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
          </BrowserRouter>
        </BookingProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
