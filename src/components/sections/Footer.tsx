import {
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { ArrowRight } from "lucide-react";
import { useReducedMotion } from "framer-motion";
import { LuxenMark } from "@/components/brand/LuxenMark";
import { SocialIcons } from "@/components/brand/SocialIcons";
import { Reveal } from "@/components/motion/Reveal";
import { RollLabel } from "@/components/motion/RollLabel";
import { ScrambleText } from "@/components/motion/ScrambleText";
import { useBooking } from "@/components/BookingModal";
import { useInView } from "@/hooks/use-in-view";
import { SERVICES } from "@/components/navbar/services-menu-data";
import { LEGAL_DOCS } from "@/content/legal";
import { EMAIL, PHONE, PHONE_HREF } from "@/content/brand";

/** A link, or (with no href) the button that opens the booking modal. */
type FooterLink = { label: string; href?: string };

/**
 * Four columns, grouped by what a visitor is actually trying to do: find out
 * who we are, find the thing they need, answer a question before buying, or
 * check the small print.
 *
 * Two of these used to be bare hashes — "About" pointed at `#top`, which just
 * scrolled you up whatever page you were already on, and "Philosophy" at
 * `#philosophy`, an anchor that only exists on the home page and therefore
 * did nothing from anywhere else. Both now point at real routes.
 *
 * The services column is built from SERVICES, so the footer can never offer a
 * service page that has been renamed or removed.
 */
const LINK =
  "inline-block py-0.5 text-left text-sm text-foreground/70 transition-colors hover:text-foreground";

const cols: { title: string; links: FooterLink[] }[] = [
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/why-luxen" },
      { label: "Our Work", href: "/work" },
      { label: "Reviews", href: "/testimonials" },
      { label: "Philosophy", href: "/#philosophy" },
      { label: "Contact", href: "/#contact" },
    ],
  },
  {
    title: "Services",
    links: SERVICES.map((s) => ({
      label: s.title,
      href: `/services/${s.slug}`,
    })),
  },
  {
    title: "Resources",
    links: [
      { label: "Pricing", href: "/pricing" },
      { label: "Our Process", href: "/#journey" },
      { label: "Industries We Serve", href: "/#who-we-help" },
      { label: "FAQ", href: "/faq" },
      { label: "Book a Strategy Call" },
    ],
  },
  {
    title: "Legal",
    links: LEGAL_DOCS.map((d) => ({
      label: d.nav,
      href: `/legal/${d.slug}`,
    })),
  },
];

// Industries and Services are no longer link columns — they are the two
// tabs of the carousel below, which is the only place they appear now.
// Root-relative, not bare hashes: these render in the footer of every page,
// and `#who-we-help` only resolves on the home page — everywhere else the
// whole carousel was a row of links that did nothing.
const TABS = {
  industries: {
    label: "Industries",
    href: "/#who-we-help",
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
    href: "/#features",
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

// ── Oversized wordmark ───────────────────────────────────────────────────
/**
 * Sized so each line fills ~99% of the band. `cqi` is a share of the band's
 * own inline size, so one number per line holds from a 320px phone to the
 * 1920px cap — there are no breakpoints to keep in sync, only the stack.
 * Below `sm` the two words stack and each one spans the width on its own,
 * which is the only way the type stays big on a phone; from `sm` up they
 * join into the single edge-to-edge line.
 */
const WORDS = [
  { text: "LUXEN", size: "[font-size:27.3cqi]" },
  { text: "DIGITAL", size: "[font-size:22.8cqi]" },
];
const ONE_LINE = "sm:[font-size:12cqi]";

/** Reach and lift, as multiples of a letter's own box — the interaction
 *  then reads identically at 40px and at 220px without a second constant. */
const RADIUS = 2.2;
const LIFT = 0.16;
/** Share of the pointer's offset a letter leans toward it. */
const LEAN = 0.1;

/**
 * Where one letter goes when the pointer is at `px`. A gaussian on the
 * distance, so the letter under the hand lifts furthest and the effect dies
 * out smoothly a reach away instead of ending at a visible edge. `h` is the
 * letter's own box height, which is what makes the shape scale-free.
 */
export function letterOffset(px: number, cx: number, h: number) {
  const reach = h * RADIUS;
  const d = (px - cx) / reach;
  const f = Math.exp(-d * d); // 1 under the pointer, ~0 a reach away
  return { x: d * reach * LEAN * f, y: -h * LIFT * f, scale: 1 + 0.05 * f };
}

/**
 * The full-bleed LUXEN DIGITAL sign-off.
 *
 * Each letter is two spans. The outer one does the staggered entrance, the
 * inner one carries the pointer displacement, so the entrance delay never
 * lags the hover and neither animation overwrites the other. Only transform
 * and opacity move, so nothing here can shift the page's layout.
 */
function Wordmark() {
  const reduce = useReducedMotion();
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.2 });
  const letters = useRef<(HTMLSpanElement | null)[]>([]);

  /**
   * Magnetic follow. Letter positions come from `offset*`, which is layout
   * geometry and therefore blind to the transforms we are writing — reading
   * a rect instead would feed each letter's own displacement back in on the
   * next event and let it drift away. They are read off the entrance span,
   * not the one we move: its transform makes it the inner span's
   * `offsetParent`, so the inner span's own `offsetLeft` is always 0.
   * The smoothing is the CSS transition on the inner span, so there is no
   * rAF loop and no state written per frame.
   */
  const pull = (e: ReactPointerEvent<HTMLElement>) => {
    if (reduce) return;
    const box = e.currentTarget.getBoundingClientRect();
    const px = e.clientX - box.left;
    for (const el of letters.current) {
      const slot = el?.parentElement;
      if (!el || !slot) continue;
      const { x, y, scale } = letterOffset(
        px,
        slot.offsetLeft + slot.offsetWidth / 2,
        slot.offsetHeight,
      );
      el.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
    }
  };

  const settle = () => {
    for (const el of letters.current) if (el) el.style.transform = "";
  };

  return (
    <div
      ref={ref}
      className="mx-auto max-w-[1920px] px-6 [container-type:inline-size] lg:px-10"
    >
      {/* A real link, so the wordmark is reachable by Tab and does something
          when you commit to the press. `pan-y` keeps vertical scrolling
          intact on touch while a sideways drag across the letters stands in
          for the hover — pointer events cover both inputs, so this is one
          code path rather than a desktop effect with a mobile branch. */}
      <a
        href="/"
        aria-label="Luxen Digital — back to top"
        onPointerMove={pull}
        onPointerLeave={settle}
        onPointerUp={settle}
        onPointerCancel={settle}
        className="relative block select-none whitespace-nowrap py-[0.06em] font-display leading-[0.82] tracking-[-0.035em] text-foreground [touch-action:pan-y] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-background"
      >
        {WORDS.map((word, w) => (
          <span
            key={word.text}
            className={`block ${word.size} sm:inline ${ONE_LINE}`}
          >
            {/* The gap between the words only exists on the single line. */}
            {w > 0 && (
              <span aria-hidden="true" className="hidden sm:inline">
                &nbsp;
              </span>
            )}
            {word.text.split("").map((ch, c) => {
              const i = w * 8 + c; // stable slot per letter, entrance order
              return (
                <span
                  key={`${ch}-${c}`}
                  aria-hidden="true"
                  className={`inline-block transition-[transform,opacity] duration-700 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
                    inView
                      ? "translate-y-0 opacity-100"
                      : "translate-y-[0.3em] opacity-0"
                  }`}
                  style={{ transitionDelay: `${i * 35}ms` }}
                >
                  <span
                    ref={(el) => {
                      letters.current[i] = el;
                    }}
                    className="will-transform inline-block origin-bottom transition-transform [transition-duration:550ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
                  >
                    {ch}
                  </span>
                </span>
              );
            })}
          </span>
        ))}
      </a>
    </div>
  );
}

export function Footer() {
  const [tab, setTab] = useState<TabKey>("industries");
  const { open } = useBooking();
  const active = TABS[tab];

  return (
    <footer className="relative border-t border-border bg-background bg-dots">
      {/* ── Closing CTA. Left-aligned on the same gutter as the wordmark
           below, so the headline's first character and the giant L sit on
           one axis and the two read as a single composition. ── */}
      <div className="mx-auto max-w-7xl px-6 pb-14 pt-20 sm:pb-16 sm:pt-28 lg:px-10">
        <div className="max-w-3xl">
          <Reveal>
            <p className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
              <span aria-hidden="true" className="h-px w-8 bg-accent" />
              Let&rsquo;s work together
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-6 max-w-[20ch] font-display text-[clamp(2rem,9vw,4.5rem)] leading-[0.95] text-balance text-foreground">
              Tell us about the work you want more of.
            </h2>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mt-6 max-w-[46ch] text-base leading-relaxed text-muted-foreground">
              Twenty minutes on a call. You leave with a plain-English plan for
              the next ninety days — whether or not you hire us to build it.
            </p>
          </Reveal>
          <Reveal delay={0.24}>
            <div className="mt-9 flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:gap-7">
              <button
                onClick={open}
                className="btn-gold w-full px-8 py-4 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:w-auto"
              >
                <RollLabel>Book a Strategy Call</RollLabel>
                <ArrowRight className="h-5 w-5" />
              </button>
              <p className="text-sm text-muted-foreground">
                or call{" "}
                <a
                  href={PHONE_HREF}
                  className="font-medium text-foreground underline decoration-border underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
                >
                  {PHONE}
                </a>
              </p>
            </div>
          </Reveal>
        </div>
      </div>

      {/* ── Functional footer. The brand block keeps the contact details
           together in one place — email, phone, and where we work — and the
           four link columns sit beside it on a desktop, wrapping to two on a
           tablet and one on a phone. ── */}
      <div className="border-t border-border">
        <div className="mx-auto max-w-7xl px-6 py-14 sm:py-16 lg:px-10">
          <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-[1.25fr_repeat(4,minmax(0,1fr))]">
            <div className="sm:col-span-2 lg:col-span-1">
              <a
                href="/"
                className="inline-flex items-center gap-2.5"
                aria-label="Luxen Digital home"
              >
                <LuxenMark className="h-10 w-auto max-w-[200px]" />
              </a>
              <ul className="mt-6 space-y-2.5">
                <li>
                  <a
                    href={`mailto:${EMAIL}`}
                    className="text-sm font-medium text-foreground transition-colors hover:text-accent"
                  >
                    <ScrambleText text={EMAIL} />
                  </a>
                </li>
                <li>
                  <a
                    href={PHONE_HREF}
                    className="text-sm font-medium text-foreground transition-colors hover:text-accent"
                  >
                    {PHONE}
                  </a>
                </li>
                <li className="text-sm text-muted-foreground">
                  Serving service businesses across the San Diego area and the
                  rest of the United States
                </li>
              </ul>

              <SocialIcons className="mt-7" />
            </div>

            {cols.map((c) => (
              <div key={c.title}>
                <h3 className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                  {c.title}
                </h3>
                <ul className="mt-5 space-y-3">
                  {c.links.map((l) => (
                    <li key={l.label}>
                      {l.href ? (
                        <a href={l.href} className={LINK}>
                          <ScrambleText text={l.label} />
                        </a>
                      ) : (
                        <button type="button" onClick={open} className={LINK}>
                          <ScrambleText text={l.label} />
                        </button>
                      )}
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
            className="mt-14 inline-flex items-center gap-1 rounded-full border border-border p-1"
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
                  className={`rounded-full px-4 py-2 font-mono text-[11px] uppercase tracking-[0.18em] transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                    on
                      ? "bg-foreground text-background"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <ScrambleText text={TABS[key].label} />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── The carousel. Full-bleed on purpose: it runs off both edges, so
           it sits outside the padded blocks rather than inside one. ── */}
      <div
        id="footer-marquee"
        role="tabpanel"
        aria-labelledby={`footer-tab-${tab}`}
        className="marquee -mt-6 pb-16"
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
              {/* `active` is a union of the two tab objects, so TypeScript
                  can't infer the element type of the union of their `items`
                  tuples on its own. */}
              {active.items.map((item: string) => (
                <li key={item} className="flex items-center">
                  <a
                    href={active.href}
                    tabIndex={copy === 1 ? -1 : undefined}
                    className="whitespace-nowrap px-4 text-lg text-muted-foreground/45 transition-colors duration-300 hover:text-foreground sm:px-5 sm:text-2xl"
                  >
                    {item}
                  </a>
                  <span
                    aria-hidden="true"
                    className="text-lg text-muted-foreground/25 sm:text-2xl"
                  >
                    ·
                  </span>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>

      {/* ── Sign-off ── */}
      <Wordmark />

      {/* ── Sign-off. The legal row repeats here because this is where people
           look for it, and the SMS line is the disclosure that has to be
           visible wherever a phone number is collected. ── */}
      <div className="mx-auto max-w-7xl px-6 pb-9 pt-7 lg:px-10">
        <div className="border-t border-border pt-7">
          <div className="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} Luxen Digital. All rights reserved.
            </p>

            <nav aria-label="Legal">
              <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
                {LEGAL_DOCS.map((d) => (
                  <li key={d.slug}>
                    <a
                      href={`/legal/${d.slug}`}
                      className="text-xs text-muted-foreground transition-colors hover:text-accent"
                    >
                      {d.nav}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <a
              href="#top"
              className="py-1 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-accent"
            >
              <ScrambleText text="Back to top" />
            </a>
          </div>

          <p className="mt-6 max-w-3xl text-[11px] leading-relaxed text-muted-foreground/70">
            By providing a phone number you agree to receive calls and text
            messages from Luxen Digital at that number, including messages sent
            by automated means. Consent is not a condition of purchase. Message
            and data rates may apply; message frequency varies. Reply STOP to
            opt out or HELP for help. See our{" "}
            <a
              href="/legal/sms"
              className="underline decoration-border underline-offset-2 transition-colors hover:text-accent"
            >
              SMS Terms
            </a>{" "}
            and{" "}
            <a
              href="/legal/privacy"
              className="underline decoration-border underline-offset-2 transition-colors hover:text-accent"
            >
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </footer>
  );
}
