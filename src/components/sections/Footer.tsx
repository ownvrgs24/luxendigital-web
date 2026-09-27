import { LuxenMark, LuxenWordmark } from "@/components/brand/LuxenMark";

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
    title: "Services",
    links: [
      { label: "Website Design", href: "#features" },
      { label: "AI Receptionist", href: "#features" },
      { label: "CRM & Automation", href: "#features" },
      { label: "Reputation Management", href: "#features" },
      { label: "Local SEO", href: "#features" },
    ],
  },
  {
    title: "Industries",
    links: [
      { label: "HVAC", href: "#who-we-help" },
      { label: "Dentists", href: "#who-we-help" },
      { label: "Medical Spas", href: "#who-we-help" },
      { label: "Attorneys", href: "#who-we-help" },
      { label: "Roofing", href: "#who-we-help" },
      { label: "View all", href: "#who-we-help" },
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

export function Footer() {
  return (
    <footer className="border-t border-border bg-background bg-dots">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_repeat(4,1fr)]">
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

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
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
