/** One question, one answer. `id` is the stable handle other pages use to
 *  pull a specific question out of the list — see PRICING_FAQ_IDS. */
export type Faq = {
  id: string;
  q: string;
  a: string;
};

/** The single source of every FAQ answer on the site. The /faq page renders
 *  all of them; the pricing page renders the handful that answer the
 *  objections people have while their card is already out. Keeping one list
 *  means an answer can never be right in one place and stale in the other. */
export const FAQS: Faq[] = [
  {
    id: "cost",
    q: "How much does a website cost?",
    a: "Every business is different, so pricing depends on your goals, features, and complexity. Most projects start with a free strategy call where we learn about your business and provide a custom quote with no obligation.",
  },
  {
    id: "timeline",
    q: "How long does a project take?",
    a: "Most websites are completed within 1-4 weeks, depending on the size of the project and how quickly we receive your content and feedback.",
  },
  {
    id: "ownership",
    q: "Do I own my website?",
    a: "Yes. Your website belongs to you. You'll always have access to your website and your business data.",
  },
  {
    id: "redesign",
    q: "Can you redesign my current website?",
    a: "Absolutely. Whether your website looks outdated, loads slowly, or isn't generating leads, we can redesign it into a modern, high-performing website built to convert visitors into customers.",
  },
  {
    id: "fit",
    q: "Do you work with my type of business?",
    a: "We specialize in appointment-based service businesses across the United States, including contractors, HVAC companies, plumbers, electricians, auto repair shops, cleaning companies, landscapers, medical practices, salons, pet groomers, and many more. If your business relies on booking customers, we're likely a great fit.",
  },
  {
    id: "monthly",
    q: "What's included every month?",
    a: "Our monthly plan can include secure hosting, website maintenance, software updates, technical support, AI tools, CRM access, automation, booking tools, ongoing improvements, and system monitoring. We'll recommend the plan that best fits your business.",
  },
  {
    id: "ai-chat",
    q: "How does the AI Chat Widget work?",
    a: "The AI Chat Widget engages visitors 24/7 by answering common questions, qualifying leads, collecting contact information, and encouraging visitors to schedule an appointment—even when your business is closed.",
  },
  {
    id: "missed-call",
    q: "What is Missed Call Text Back?",
    a: "If you miss a phone call, your customer automatically receives a personalized text message letting them know you'll get back to them. This helps recover potential customers who might otherwise call a competitor.",
  },
  {
    id: "reviews",
    q: "How does the Google Review Funnel work?",
    a: "After a completed job, customers can automatically receive a text or email asking for feedback. Happy customers are encouraged to leave a Google review, helping you build trust and improve your online reputation.",
  },
  {
    id: "booking",
    q: "Can customers book appointments online?",
    a: "Yes. We can integrate an online booking system directly into your website, allowing customers to schedule appointments anytime, from any device.",
  },
  {
    id: "hosting",
    q: "Is hosting included?",
    a: "Yes. We offer secure, high-performance hosting with ongoing maintenance to help keep your website fast, reliable, and up to date.",
  },
  {
    id: "mobile",
    q: "Will my website work on mobile devices?",
    a: "Absolutely. Every website we build is fully responsive, meaning it looks and works great on desktops, tablets, and smartphones.",
  },
  {
    id: "changes",
    q: "Can I request changes after launch?",
    a: "Yes. We provide ongoing support, and depending on your plan, updates and changes can be requested after your website goes live.",
  },
  {
    id: "contracts",
    q: "Are there long-term contracts?",
    a: "No. We don't believe in locking clients into long-term commitments. We focus on delivering value so you choose to stay because the service is working for your business—not because you're required to.",
  },
];

/** The objections that stand between a visitor and the checkout button, in
 *  the order they tend to surface. Rendered on /pricing. */
export const PRICING_FAQ_IDS = [
  "contracts",
  "monthly",
  "timeline",
  "ownership",
  "cost",
  "changes",
] as const;

const BY_ID: Record<string, Faq> = Object.fromEntries(
  FAQS.map((f) => [f.id, f]),
);

/** Look up a set of questions by id, in the order given. Unknown ids are
 *  dropped rather than rendered as holes — the test is what catches them. */
export function faqsById(ids: readonly string[]): Faq[] {
  return ids.map((id) => BY_ID[id]).filter(Boolean);
}
