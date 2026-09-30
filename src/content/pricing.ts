export type PlanId = "essential" | "growth";

export type Plan = {
  id: PlanId;
  name: string;
  /** Small pill in the card's top-right corner. */
  badge: string;
  /** One line, outcome first — what changes in the business, not what ships. */
  tagline: string;
  price: string;
  period: string;
  /** The number behind `price`, for structured data. Keep the two in step —
   *  the pricing test asserts the display string contains it. */
  priceFrom: number;
  /** Hosted checkout. Opens in a new tab. */
  href: string;
  cta: string;
  /** Sits directly under the button and answers "what am I committing to?". */
  reassurance: string;
  featured: boolean;
  variant: "silver" | "gold";
};

export const PLANS: Plan[] = [
  {
    id: "essential",
    name: "Essential",
    badge: "Start here",
    tagline:
      "Look like the best option in your area and stop losing leads to a slow, dated website.",
    price: "Starting at $99",
    period: "/month",
    priceFrom: 99,
    href: "https://crm.luxendigital.com/payment-link/6aa4eba5ceb12d9fc1a8c7c9",
    cta: "Start with Essential",
    reassurance: "Secure checkout · No long-term contract",
    featured: false,
    variant: "silver",
  },
  {
    id: "growth",
    name: "Growth",
    badge: "Most popular",
    tagline:
      "Every lead followed up, every missed call answered, every review asked for — without you touching it.",
    price: "Starting at $299",
    period: "/month",
    priceFrom: 299,
    href: "https://crm.luxendigital.com/payment-link/6aa4ebdbbfd4fe37f21d28fc",
    cta: "Build My Growth System",
    reassurance: "Secure checkout · Cancel anytime",
    featured: true,
    variant: "gold",
  },
];

/**
 * One list, rendered by both cards. A plan that doesn't include a row still
 * shows it, dimmed — the visible gap is what makes the upgrade obvious, and
 * it means the two cards are always the same height so they compare cleanly.
 * Order matters: the shared rows come first, then the automation that only
 * Growth buys, so the dimmed block on Essential reads as one solid stretch.
 */
export type PlanFeature = {
  label: string;
  /** Plans that include the row. Everything else renders it dimmed. */
  includedIn: PlanId[];
};

export const PLAN_FEATURES: PlanFeature[] = [
  {
    label: "Custom, conversion-focused website",
    includedIn: ["essential", "growth"],
  },
  {
    label: "Lead capture forms and online booking",
    includedIn: ["essential", "growth"],
  },
  { label: "Missed-call text-back", includedIn: ["essential", "growth"] },
  { label: "Mobile-optimized design", includedIn: ["essential", "growth"] },
  {
    label: "Hosting, security, and support",
    includedIn: ["essential", "growth"],
  },
  { label: "CRM and lead pipeline", includedIn: ["growth"] },
  { label: "Automated text and email follow-up", includedIn: ["growth"] },
  { label: "AI chat assistant", includedIn: ["growth"] },
  {
    label: "Appointment reminders and Google review requests",
    includedIn: ["growth"],
  },
  {
    label: "Lead tracking, notifications, and ongoing website updates",
    includedIn: ["growth"],
  },
];

/** The promises that answer "what if it doesn't work out?" — every one of
 *  them is also stated in the FAQ, which is where the wording comes from. */
export const ASSURANCES = [
  {
    title: "No long-term contracts",
    body: "Stay because it's working, not because you signed something.",
  },
  {
    title: "You own your website",
    body: "Your site and your business data belong to you. Always.",
  },
  {
    title: "Live in 1–4 weeks",
    body: "Most builds launch inside a month of kickoff.",
  },
  {
    title: "Hosting and security included",
    body: "Fast, monitored, and maintained — no extra invoice.",
  },
];

/** What happens after the button — the unknown that stops people clicking. */
export const NEXT_STEPS = [
  {
    step: "01",
    title: "Pick your plan",
    body: "Checkout takes about two minutes. No contract, and you can cancel any time.",
  },
  {
    step: "02",
    title: "Kickoff call",
    body: "We learn your business, your services, and the jobs you actually want more of.",
  },
  {
    step: "03",
    title: "You go live",
    body: "Most sites launch in 1–4 weeks. From then on the system books work while you work.",
  },
];
