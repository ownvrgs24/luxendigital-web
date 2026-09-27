import "./services-menu.css";

// ── Service data (contractor-facing, plain copy) ───────────────────────
export type Service = {
  id: string;
  group: "Growth" | "Operations" | "Reputation";
  title: string;
  desc: string;
};

export const SERVICES: Service[] = [
  {
    id: "website",
    group: "Growth",
    title: "Lead-generating website",
    desc: "A fast, custom-built site that turns visitors into quote requests, not just page views.",
  },
  {
    id: "google",
    group: "Growth",
    title: "Get found on Google",
    desc: "Show up in the map results when people nearby search for the work you do.",
  },
  {
    id: "stay",
    group: "Growth",
    title: "Stay in touch",
    desc: "Seasonal reminders and offers that bring past customers back for the next job.",
  },
  {
    id: "missed",
    group: "Operations",
    title: "Missed call text back",
    desc: "Every missed call gets an instant text, so the lead stays with you instead of the next contractor.",
  },
  {
    id: "inbox",
    group: "Operations",
    title: "All-in-one inbox",
    desc: "Texts, emails, calls, and Facebook messages in one place your whole crew can see.",
  },
  {
    id: "phone",
    group: "Operations",
    title: "Business phone",
    desc: "A dedicated business number on the phone you already carry, so work calls stay separate.",
  },
  {
    id: "followup",
    group: "Operations",
    title: "Automatic follow-up",
    desc: "New leads get timed texts and emails until they book, even on your busiest weeks.",
  },
  {
    id: "reviews",
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

// ── Line icons (24x24, stroke 1.7, pathLength="1") ─────────────────────
export const ICONS: Record<string, string> = {
  website:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" pathLength="1"><rect x="2.5" y="4.5" width="19" height="15" rx="2.5"/><path d="M2.5 9h19"/><circle cx="5" cy="6.7" r=".6" fill="currentColor" stroke="none"/><circle cx="7" cy="6.7" r=".6" fill="currentColor" stroke="none"/></svg>',
  google:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" pathLength="1"><path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z"/><circle cx="12" cy="10" r="2.4"/></svg>',
  stay: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" pathLength="1"><path d="M4 9v6h10l5 4V5l-5 4H4Z"/><path d="M16 9a3 3 0 0 1 0 6"/></svg>',
  missed:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" pathLength="1"><path d="M5 4a15 15 0 0 0 0 16"/><path d="M19 4a15 15 0 0 1 0 16"/><path d="M5 20l3-2m11 2-3-2M3 12h4l2-3 2 6 2-4 2 2h6"/></svg>',
  inbox:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" pathLength="1"><path d="M3 13h4l2 3h6l2-3h4"/><path d="M5 5h14l2 8v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5Z"/></svg>',
  phone:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" pathLength="1"><rect x="6" y="3" width="12" height="18" rx="3"/><path d="M10 18h4"/></svg>',
  followup:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" pathLength="1"><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M21 4v4h-4"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/><path d="M3 20v-4h4"/></svg>',
  reviews:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" pathLength="1"><path d="M12 3.5l2.3 4.7 5.2.8-3.8 3.7.9 5.2-4.6-2.4-4.6 2.4.9-5.2L4.5 9l5.2-.8Z"/></svg>',
};

// Renders icon markup safely (static strings we control).
export function IconMarkup({ id }: { id: string }) {
  return (
    <span
      className="lsm-row__icon"
      dangerouslySetInnerHTML={{ __html: ICONS[id] }}
    />
  );
}
