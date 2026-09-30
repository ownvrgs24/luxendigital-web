export type Project = {
  title: string;
  category: string;
  img: string;
  /** One line on what the build does for the business. */
  blurb: string;
  /** The pieces of the system this build runs on, pulled straight from the
   *  blurb. Shown as pills so the grid reads as capabilities, not just art. */
  tags: string[];
  /** 12-column width on desktop. Rows are laid out 7+5 / 5+7 so the grid
   *  alternates instead of marching down in equal boxes. */
  span: string;
  /** Screenshot is a phone, not a full-bleed site — it gets contained and
   *  sits on a mirrored blur of itself rather than being cropped. */
  mirror?: boolean;
};

export const PROJECTS: Project[] = [
  {
    title: "Northwind HVAC",
    category: "HVAC",
    img: "https://vibe.filesafe.space/1788847884528312040/assets/e22301b2-40e8-47f3-90c3-785f359a4089.png",
    blurb: "Booking-ready site with AI receptionist and review funnel.",
    tags: ["Online booking", "AI receptionist", "Review funnel"],
    span: "lg:col-span-7",
  },
  {
    title: "Lumière MedSpa",
    category: "Medical Spa",
    img: "https://vibe.filesafe.space/1788847884528312040/assets/8477f37a-2c4c-40ca-a865-e4bb94c1c5a3.png",
    blurb: "Editorial design with online scheduling and reminders.",
    tags: ["Editorial design", "Online scheduling", "Appointment reminders"],
    span: "lg:col-span-5",
  },
  {
    title: "Brightline Dental",
    category: "Dentistry",
    img: "https://vibe.filesafe.space/1788847884528312040/assets/5a7ed3ee-5e5e-4bb2-b200-08857062d7ab.png",
    blurb: "Trust-first layout with automated patient follow-up.",
    tags: ["Trust-first layout", "Automated follow-up"],
    span: "lg:col-span-5",
  },
  {
    title: "Fast Fix North County",
    category: "Jewelry Store",
    img: "https://vibe.filesafe.space/1788847884528312040/attachments/1bfff326-76ec-4ebd-9716-32d10d635165.png",
    blurb:
      "Multi-location booking system with automated estimate workflows and review funnel.",
    tags: ["Multi-location booking", "Estimate workflows", "Review funnel"],
    span: "lg:col-span-7",
    mirror: true,
  },
];

/** What every build ships with, whoever the client is. Sits under the grid
 *  so the work reads as a repeatable standard rather than four lucky jobs. */
export const BUILD_STANDARDS = [
  {
    title: "Built around the business",
    body: "No templates. The layout follows how this business actually wins work.",
  },
  {
    title: "Booking on every screen",
    body: "Whatever a visitor came for, the next step is one tap away.",
  },
  {
    title: "Fast on a phone",
    body: "Optimized for the cracked screen in a truck, not a design portfolio.",
  },
  {
    title: "Wired into the system",
    body: "The site is the front door; follow-up, reminders, and reviews run behind it.",
  },
];
