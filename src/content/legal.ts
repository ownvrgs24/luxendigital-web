import { EMAIL, PHONE } from "./brand";

/**
 * The legal pages, as structured content.
 *
 * IMPORTANT — these are drafted to match what this site actually does (a
 * contact form, a booking widget, a CRM that stores leads, and SMS features
 * the company sells and uses). They are a starting point written to the shape
 * of US obligations, not legal advice, and no one here is a lawyer. Have
 * counsel review them before launch, and fill the bracketed placeholders.
 */

export type LegalBlock =
  | { kind: "p"; text: string }
  | { kind: "h"; text: string }
  | { kind: "list"; items: string[] };

export type LegalDoc = {
  slug: string;
  /** Short label used in the footer. */
  nav: string;
  title: string;
  /** One line under the title, and the meta description. */
  summary: string;
  /** ISO date shown as "Last updated". */
  updated: string;
  blocks: LegalBlock[];
};

const COMPANY = "Luxen Digital";
const UPDATED = "2026-09-30";

export const LEGAL_DOCS: LegalDoc[] = [
  {
    slug: "privacy",
    nav: "Privacy Policy",
    title: "Privacy Policy",
    summary: `How ${COMPANY} collects, uses, and protects the information you give us.`,
    updated: UPDATED,
    blocks: [
      {
        kind: "p",
        text: `This policy explains what ${COMPANY} ("we", "us") collects when you use luxendigital.com, why we collect it, and the choices you have. It applies to this website and to the booking and contact tools we run on it.`,
      },
      { kind: "h", text: "Information we collect" },
      {
        kind: "list",
        items: [
          "Information you give us directly — your name, business name, email address, phone number, and anything you type into a contact form, booking form, or chat widget.",
          "Information collected automatically — IP address, browser and device type, pages viewed, referring page, and similar analytics data, gathered through cookies and comparable technologies.",
          "Information from our service providers — scheduling, CRM, and communications platforms that process submissions on our behalf.",
        ],
      },
      { kind: "h", text: "How we use it" },
      {
        kind: "list",
        items: [
          "To respond to your enquiry, schedule a call, and provide the services you request.",
          "To send service messages about work in progress, and marketing messages where you have opted in.",
          "To operate, secure, and improve the website.",
          "To meet legal, tax, and accounting obligations.",
        ],
      },
      { kind: "h", text: "How we share it" },
      {
        kind: "p",
        text: "We do not sell your personal information. We share it with vendors who process it for us — hosting, CRM, scheduling, email and SMS delivery, analytics — under contracts limiting their use to providing those services. We may also disclose information where required by law, or in connection with a merger or sale of the business.",
      },
      { kind: "h", text: "Cookies and tracking" },
      {
        kind: "p",
        text: "We use cookies and similar technologies to keep the site working, measure traffic, and understand which pages lead to enquiries. Most browsers let you refuse or delete cookies; parts of the site may not work as intended if you do.",
      },
      { kind: "h", text: "Your rights" },
      {
        kind: "p",
        text: "Depending on where you live, you may have the right to request access to the personal information we hold about you, request its correction or deletion, request a copy in a portable format, opt out of marketing messages, and opt out of the sale or sharing of personal information. California residents have these rights under the CCPA as amended by the CPRA, including the right not to be discriminated against for exercising them. Residents of other states with comprehensive privacy laws have comparable rights.",
      },
      {
        kind: "p",
        text: `To make a request, email ${EMAIL} or call ${PHONE}. We will verify your identity before acting, and we will not charge you for a reasonable request.`,
      },
      { kind: "h", text: "Retention and security" },
      {
        kind: "p",
        text: "We keep personal information for as long as needed to provide our services and to meet legal obligations, then delete or de-identify it. We use reasonable administrative and technical safeguards, though no method of transmission or storage is completely secure.",
      },
      { kind: "h", text: "Children" },
      {
        kind: "p",
        text: "This site is intended for businesses and is not directed to children under 13. We do not knowingly collect personal information from children.",
      },
      { kind: "h", text: "Changes and contact" },
      {
        kind: "p",
        text: `We will post any changes on this page and update the date above. Questions about this policy can go to ${EMAIL} or ${PHONE}.`,
      },
    ],
  },

  {
    slug: "terms",
    nav: "Terms of Service",
    title: "Terms of Service",
    summary: `The terms you agree to when you use this website or engage ${COMPANY}.`,
    updated: UPDATED,
    blocks: [
      {
        kind: "p",
        text: `By using luxendigital.com you agree to these terms. If you do not agree, please do not use the site.`,
      },
      { kind: "h", text: "Use of the site" },
      {
        kind: "p",
        text: "You may use this site for lawful purposes only. You agree not to interfere with its operation, attempt to gain unauthorised access, scrape it at a scale that degrades service, or use it to send unsolicited communications.",
      },
      { kind: "h", text: "Services and quotes" },
      {
        kind: "p",
        text: "Descriptions of our services and any prices shown on this site are for information and are not an offer to contract. Plan prices are starting points; the scope, price, and payment schedule of any engagement are set out in a separate written agreement or order form, which governs if it conflicts with anything here. Monthly plans continue until cancelled and, unless your agreement says otherwise, are not subject to a long-term commitment.",
      },
      { kind: "h", text: "Intellectual property" },
      {
        kind: "p",
        text: "The content, design, and code of this site belong to us or our licensors. Ownership of work we produce for a client is set out in that client's agreement.",
      },
      { kind: "h", text: "Third-party links and tools" },
      {
        kind: "p",
        text: "This site links to and embeds third-party tools, including scheduling, payment, and review platforms. We do not control them and are not responsible for their content, availability, or privacy practices.",
      },
      { kind: "h", text: "Disclaimers" },
      {
        kind: "p",
        text: 'The site is provided "as is" and "as available", without warranties of any kind to the fullest extent permitted by law. We do not warrant that it will be uninterrupted or error-free, and nothing on it is a guarantee of any particular business result.',
      },
      { kind: "h", text: "Limitation of liability" },
      {
        kind: "p",
        text: "To the fullest extent permitted by law, we are not liable for indirect, incidental, special, consequential, or punitive damages, or for lost profits or revenue, arising from your use of this site.",
      },
      { kind: "h", text: "Governing law" },
      {
        kind: "p",
        text: "These terms are governed by the laws of the State of [STATE], without regard to its conflict-of-laws rules, and any dispute will be brought in the state or federal courts located in [COUNTY, STATE].",
      },
      { kind: "h", text: "Contact" },
      { kind: "p", text: `Questions about these terms: ${EMAIL}.` },
    ],
  },

  {
    slug: "sms",
    nav: "SMS Terms",
    title: "SMS & Messaging Terms",
    summary:
      "Consent, message frequency, and how to stop text messages from us or from a system we build.",
    updated: UPDATED,
    blocks: [
      {
        kind: "p",
        text: "These terms apply to text messages sent by Luxen Digital, and are the template we deploy with the messaging features we build for clients — missed-call text-back, appointment reminders, follow-up, and review requests.",
      },
      { kind: "h", text: "Consent" },
      {
        kind: "p",
        text: "We send text messages only to people who have given prior express consent — by giving us a mobile number and agreeing to be contacted by text, or by texting us first. Consent to receive marketing texts is never a condition of purchasing anything.",
      },
      { kind: "h", text: "What we send and how often" },
      {
        kind: "list",
        items: [
          "Conversational replies when you contact us or we miss your call.",
          "Appointment confirmations and reminders.",
          "Occasional updates about your project or account.",
          "Message frequency varies with your activity and is typically a few messages per month.",
        ],
      },
      { kind: "h", text: "How to stop" },
      {
        kind: "p",
        text: "Reply STOP to any message to opt out, and you will receive one confirmation and nothing further. Reply HELP for assistance, or contact us using the details below. Opting out of marketing texts does not stop transactional messages you have asked for.",
      },
      { kind: "h", text: "Costs and carriers" },
      {
        kind: "p",
        text: "Message and data rates may apply. Carriers are not liable for delayed or undelivered messages, and delivery is not guaranteed on every network.",
      },
      { kind: "h", text: "Your information" },
      {
        kind: "p",
        text: "Mobile numbers collected for messaging are used to deliver these messages and are not sold. No mobile information is shared with third parties or affiliates for their own marketing or promotional purposes.",
      },
      { kind: "h", text: "Contact" },
      { kind: "p", text: `${EMAIL} · ${PHONE}` },
    ],
  },

  {
    slug: "accessibility",
    nav: "Accessibility",
    title: "Accessibility Statement",
    summary: `How ${COMPANY} approaches accessibility, and how to tell us when we fall short.`,
    updated: UPDATED,
    blocks: [
      {
        kind: "p",
        text: "We want this site to be usable by as many people as possible, including people who use screen readers, keyboard navigation, magnification, or reduced-motion settings.",
      },
      { kind: "h", text: "What we aim for" },
      {
        kind: "p",
        text: "We work toward the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA as our standard, and we treat accessibility as part of building a page rather than a pass at the end.",
      },
      { kind: "h", text: "What we do" },
      {
        kind: "list",
        items: [
          "Interactive controls are reachable and operable by keyboard, with visible focus.",
          "Images that carry meaning have text alternatives; decorative ones are hidden from assistive technology.",
          "Video controls are labelled, and the progress bar is a real slider rather than a mouse-only widget.",
          "Animation is reduced or removed when a visitor's system asks for reduced motion.",
          "We aim for text contrast that meets WCAG AA against its background.",
        ],
      },
      { kind: "h", text: "Known limitations" },
      {
        kind: "p",
        text: "Parts of this site embed third-party tools — scheduling, chat, and reviews — whose accessibility we do not fully control. We choose vendors with this in mind and raise problems with them when we find them.",
      },
      { kind: "h", text: "Tell us about a problem" },
      {
        kind: "p",
        text: `If something on this site is difficult or impossible to use, email ${EMAIL} or call ${PHONE}. Tell us the page and what happened, and we will work with you to get you the information or service you were after.`,
      },
    ],
  },

  {
    slug: "privacy-choices",
    nav: "Your Privacy Choices",
    title: "Your Privacy Choices",
    summary:
      "Opt out of the sale or sharing of personal information, and of targeted advertising.",
    updated: UPDATED,
    blocks: [
      {
        kind: "p",
        text: `${COMPANY} does not sell personal information for money. Some analytics and advertising technologies can still count as "sharing" for cross-context behavioural advertising under California law, so this page exists to give you a clear way to opt out.`,
      },
      { kind: "h", text: "How to opt out" },
      {
        kind: "list",
        items: [
          `Email ${EMAIL} with the subject "Do Not Sell or Share My Personal Information".`,
          `Call ${PHONE} and tell us you want to opt out.`,
          "Set the Global Privacy Control signal in a supporting browser or extension; we treat it as a valid opt-out request.",
          "Refuse or delete cookies in your browser settings.",
        ],
      },
      { kind: "h", text: "Your other rights" },
      {
        kind: "p",
        text: "You may also request access to, correction of, or deletion of the personal information we hold about you, and a copy of it in a portable format. We will not treat you differently for exercising any of these rights.",
      },
      { kind: "h", text: "Authorised agents" },
      {
        kind: "p",
        text: "You may use an authorised agent to make a request on your behalf. We will ask for proof of that authorisation and may ask you to verify your own identity directly.",
      },
      {
        kind: "p",
        text: "See our Privacy Policy for the full detail of what we collect and why.",
      },
    ],
  },
];

export const LEGAL_BY_SLUG: Record<string, LegalDoc> = Object.fromEntries(
  LEGAL_DOCS.map((d) => [d.slug, d]),
);
