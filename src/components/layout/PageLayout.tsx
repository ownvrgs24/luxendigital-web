import { type ReactNode } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/sections/Footer";
import { MobileCallBar } from "@/components/MobileCallBar";
import { SEOHead, type SEOHeadProps } from "@/components/SEOHead";

/** The frame every page shares: head tags, navbar, footer, mobile call bar. */
export function PageLayout({
  seo,
  mainClassName,
  children,
}: {
  seo: SEOHeadProps;
  mainClassName?: string;
  children: ReactNode;
}) {
  return (
    <div id="top" className="relative min-h-screen bg-background">
      <SEOHead {...seo} />
      <Navbar />
      <main className={mainClassName}>{children}</main>
      <Footer />
      <MobileCallBar />
    </div>
  );
}
