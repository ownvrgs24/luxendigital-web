import { useState } from "react";
import { LuxenMark } from "@/components/brand/LuxenMark";

type FooterLink = { label: string; href: string };

const cols: { title: string; links: FooterLink[] }[] = [
  {
    title: "Company",
    links: [
      { label: "About", href: "#top" },
      { label: "Philosophy", href: "#philosophy" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Process", href: "/#journey" },
      { label: "Pricing", href: "/pricing" },
      { label: "Our Work", href: "/work" },
      { label: "Testimonials", href: "/testimonials" },
      { label: "FAQ", href: "/faq" },
    ],
  },
];

// Industries and Services are no longer link columns — they are the two
// tabs of the carousel below, which is the only place they appear now.
const TABS = {
  industries: {
    label: "Industries",
    href: "#who-we-help",
    items: [
      "HVAC",
      "Dentists",
      "Medical Spas",
      "Attorneys",
      "Roofing",
      "Plumbing",
      "Electricians",
      "Landscaping",
      "Auto Repair",
    ],
  },
  services: {
    label: "Services",
    href: "#features",
    items: [
      "Website Design",
      "AI Receptionist",
      "CRM & Automation",
      "Reputation Management",
      "Local SEO",
      "Missed-Call Text Back",
      "Appointment Booking",
      "Lead Follow-Up",
    ],
  },
} as const;

type TabKey = keyof typeof TABS;

export function Footer() {
  const [tab, setTab] = useState<TabKey>("industries");
  const active = TABS[tab];

  return (
    <footer className="border-t border-border bg-background bg-dots">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr]">
          <div>
            <a
              href="#top"
              className="flex items-center gap-2.5"
              aria-label="Luxen Digital home"
            >
              <LuxenMark className="h-9 w-auto max-w-[220px]" />
            </a>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Premium websites and AI-powered business systems for local service
              businesses.
            </p>
            <div className="mt-5 space-y-2">
              <a
                href="mailto:team@luxendigital.com"
                className="inline-block text-sm font-medium text-foreground underline-offset-4 hover:text-accent hover:underline"
              >
                team@luxendigital.com
              </a>
              <p className="text-sm text-muted-foreground">
                <a
                  href="tel:+18582239635"
                  className="font-medium text-foreground underline-offset-4 hover:text-accent hover:underline"
                >
                  +1 858-223-9635
                </a>
              </p>
            </div>
          </div>

          {cols.map((c) => (
            <div key={c.title}>
              <h3 className="text-sm font-semibold text-foreground">
                {c.title}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {c.links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── Tabs for the carousel below ── */}
        <div
          role="tablist"
          aria-label="What we do and who we do it for"
          className="mt-16 inline-flex items-center gap-1 rounded-full border border-border p-1"
        >
          {(Object.keys(TABS) as TabKey[]).map((key) => {
            const on = key === tab;
            return (
              <button
                key={key}
                role="tab"
                id={`footer-tab-${key}`}
                aria-selected={on}
                aria-controls="footer-marquee"
                onClick={() => setTab(key)}
                className={`rounded-full px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                  on
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {TABS[key].label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── The carousel. Full-bleed on purpose: it runs off both edges, so
           it sits outside the max-w container rather than inside it. ── */}
      <div
        id="footer-marquee"
        role="tabpanel"
        aria-labelledby={`footer-tab-${tab}`}
        className="marquee -mt-2 pb-14"
      >
        <div className="marquee__track">
          {/* Two copies: the first is the real, focusable one; the second
              exists only so the -50% slide has something to land on. */}
          {[0, 1].map((copy) => (
            <ul
              key={copy}
              aria-hidden={copy === 1 || undefined}
              className="flex shrink-0 items-center"
            >
              {active.items.map((item) => (
                <li key={item} className="flex items-center">
                  <a
                    href={active.href}
                    tabIndex={copy === 1 ? -1 : undefined}
                    className="whitespace-nowrap px-5 text-2xl text-muted-foreground/45 transition-colors duration-300 hover:text-foreground sm:text-3xl lg:text-4xl"
                  >
                    {item}
                  </a>
                  <span
                    aria-hidden="true"
                    className="text-2xl text-muted-foreground/25 sm:text-3xl lg:text-4xl"
                  >
                    ·
                  </span>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="flex flex-col items-center justify-between gap-4 border-t border-border py-8 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Luxen Digital. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            {["LinkedIn", "Instagram", "X"].map((s) => (
              <a
                key={s}
                href="/contact"
                className="text-xs font-medium text-muted-foreground transition-colors hover:text-accent"
              >
                {s}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
