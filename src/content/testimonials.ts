export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  city: string;
};

/** Shared by the testimonials marquee and the short proof row that sits
 *  under the pricing cards. One list, so a quote can't drift between them. */
export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Our website finally does something. It books jobs while we're on the roof. We've never been this busy.",
    name: "Marcus T.",
    role: "Roofing Co.",
    city: "Austin, TX",
  },
  {
    quote:
      "The AI receptionist alone paid for itself in a week. We stopped losing calls completely.",
    name: "Dana R.",
    role: "Medical Spa",
    city: "Scottsdale, AZ",
  },
  {
    quote:
      "Reviews started coming in automatically. We went from 12 to 87 five-star reviews in three months.",
    name: "Luis G.",
    role: "HVAC",
    city: "Tampa, FL",
  },
  {
    quote:
      "It looks like a million dollars and loads instantly. Patients tell us they chose us because of the site.",
    name: "Dr. Priya N.",
    role: "Dentist",
    city: "Denver, CO",
  },
  {
    quote:
      "I don't think about follow-up anymore. It just happens. My pipeline has never been this full.",
    name: "Elena V.",
    role: "Law Firm",
    city: "Chicago, IL",
  },
  {
    quote:
      "One platform replaced four different tools. My team actually uses it. That's never happened before.",
    name: "Tom B.",
    role: "Plumbing",
    city: "Columbus, OH",
  },
];
