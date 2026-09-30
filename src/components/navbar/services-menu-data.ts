// ── Service data (contractor-facing, plain copy) ───────────────────────
export type Service = {
  id: string;
  /** URL segment under /services. */
  slug: string;
  group: "Growth" | "Operations" | "Reputation";
  title: string;
  desc: string;
};

export const SERVICES: Service[] = [
  {
    id: "website",
    slug: "lead-generating-website",
    group: "Growth",
    title: "Lead-generating website",
    desc: "A fast, custom-built site that turns visitors into quote requests, not just page views.",
  },
  {
    id: "google",
    slug: "get-found-in-search-and-ai",
    group: "Growth",
    title: "Get found in search and AI",
    desc: "Show up in the map results — and in the answer, when someone asks ChatGPT or Gemini who to call.",
  },
  {
    id: "stay",
    slug: "stay-in-touch",
    group: "Growth",
    title: "Stay in touch",
    desc: "Seasonal reminders and offers that bring past customers back for the next job.",
  },
  {
    id: "missed",
    slug: "missed-call-text-back",
    group: "Operations",
    title: "Missed call text back",
    desc: "Every missed call gets an instant text, so the lead stays with you instead of the next contractor.",
  },
  {
    id: "inbox",
    slug: "all-in-one-inbox",
    group: "Operations",
    title: "All-in-one inbox",
    desc: "Texts, emails, calls, and Facebook messages in one place your whole crew can see.",
  },
  {
    id: "phone",
    slug: "business-phone",
    group: "Operations",
    title: "Business phone",
    desc: "A dedicated business number on the phone you already carry, so work calls stay separate.",
  },
  {
    id: "followup",
    slug: "automatic-follow-up",
    group: "Operations",
    title: "Automatic follow-up",
    desc: "New leads get timed texts and emails until they book, even on your busiest weeks.",
  },
  {
    id: "reviews",
    slug: "more-5-star-reviews",
    group: "Reputation",
    title: "More 5-star reviews",
    desc: "Ask every happy customer for a review right after the job, without lifting a finger.",
  },
];

export const GROUP_ORDER = ["Growth", "Operations", "Reputation"] as const;

export const groups: Record<string, Service[]> = GROUP_ORDER.reduce(
  (acc, g) => {
    acc[g] = SERVICES.filter((s) => s.group === g);
    return acc;
  },
  {} as Record<string, Service[]>,
);

// ── Line icons (24x24) ─────────────────────────────────────────────────
// pathLength="1" on every stroked child is what makes the shared
// stroke-dasharray:1 / dashoffset draw-in animation normalize across shapes.
const svg = (body: string) =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;

export const ICONS: Record<string, string> = {
  website: svg(
    '<rect pathLength="1" x="2.5" y="4.5" width="19" height="15" rx="2.5"/><path pathLength="1" d="M2.5 9h19"/><path pathLength="1" d="M6 13h7"/>',
  ),
  google: svg(
    '<path pathLength="1" d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z"/><circle pathLength="1" cx="12" cy="10" r="2.4"/>',
  ),
  stay: svg(
    '<path pathLength="1" d="M4 9v6h10l5 4V5l-5 4H4Z"/><path pathLength="1" d="M16 9a3 3 0 0 1 0 6"/>',
  ),
  missed: svg(
    '<path pathLength="1" d="M5 4h3.5l2 5-2.5 1.5a11 11 0 0 0 5.5 5.5L15 13.5l5 2V19a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/><path pathLength="1" d="M16 3l5 5M21 3l-5 5"/>',
  ),
  inbox: svg(
    '<path pathLength="1" d="M5 5h14l2 8v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5Z"/><path pathLength="1" d="M3 13h4l2 3h6l2-3h4"/>',
  ),
  phone: svg(
    '<rect pathLength="1" x="6" y="3" width="12" height="18" rx="3"/><path pathLength="1" d="M10 18h4"/>',
  ),
  followup: svg(
    '<path pathLength="1" d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path pathLength="1" d="M21 4v4h-4"/><path pathLength="1" d="M21 12a9 9 0 0 1-15 6.7L3 16"/><path pathLength="1" d="M3 20v-4h4"/>',
  ),
  reviews: svg(
    '<path pathLength="1" d="M12 3.5l2.3 4.7 5.2.8-3.8 3.7.9 5.2-4.6-2.4-4.6 2.4.9-5.2L4.5 9l5.2-.8Z"/>',
  ),
};

/** Canonical service lookup by URL slug — used by the /services/:slug route. */
export const BY_SLUG: Record<string, Service> = Object.fromEntries(
  SERVICES.map((s) => [s.slug, s]),
);
