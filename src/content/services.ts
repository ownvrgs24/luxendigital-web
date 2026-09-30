// ── Service page copy ──────────────────────────────────────────────────
// One entry per service in SERVICES. The shell in pages/Service.tsx is
// shared; everything that gives a page its character lives here.
//
// House rules for this file, learned the hard way:
//   · every claim is something a contractor could check or argue with
//   · no adjectives doing a verb's job ("seamless", "powerful", "robust")
//   · `does` items are four different points, not four sentences saying
//     the same thing with different nouns
//   · `included` is a delivery list — if we don't hand it over, it's not here

export type ServiceCopy = {
  /** Page headline. Deliberately not the nav label — that one names the
   *  service, this one makes an argument. */
  h1: string;
  /** The situation the service exists for. Two sentences, concrete. */
  lede: string;
  /** What the service actually does. Parallel points, not steps. */
  does: { title: string; body: string }[];
  /** The sequence, in order, from signing to running. */
  steps: { title: string; body: string }[];
  /** What is handed over. Plain nouns. */
  included: string[];
  /** Service ids that genuinely pair with this one. */
  related: string[];
  /** Meta description. */
  meta: string;
};

export const SERVICE_COPY: Record<string, ServiceCopy> = {
  website: {
    h1: "A website that asks for the job.",
    lede: "Most contractor sites are a brochure with a phone number at the bottom. This one is built around a single question: how fast can a stranger turn into a booked job?",
    does: [
      {
        title: "Built, not assembled",
        body: "No theme, no page builder. The layout follows your actual services and the questions people already ask you on the phone.",
      },
      {
        title: "Loads before they leave",
        body: "Under two seconds on a phone on cell data. A slow site loses the visitor before the first paragraph, and they never tell you.",
      },
      {
        title: "One obvious next step",
        body: "Quote form, call button, or booking calendar — whichever suits the job. Never all three competing on the same screen.",
      },
      {
        title: "Written for the person, not the algorithm",
        body: "Plain language about what you do, where you work, and what it costs to start. Pricing questions answered on the page beat pricing questions in your inbox.",
      },
    ],
    steps: [
      {
        title: "We read your last twenty leads",
        body: "Where they came from, what they asked, and what they were never told. That transcript is the outline for the site.",
      },
      {
        title: "Design happens in the browser",
        body: "You see real pages on a real phone, not a slide deck. Changes are cheap at this stage and expensive after launch.",
      },
      {
        title: "Build, test on real devices, launch",
        body: "Forms tested end to end, including the one nobody tests: what the email looks like when it lands on your phone at 7am.",
      },
      {
        title: "We watch the first month",
        body: "Which pages people leave from, which form fields they abandon. Then we fix those, at no charge.",
      },
    ],
    included: [
      "Custom design, up to eight pages",
      "Copywriting for every page",
      "Quote form wired to your inbox and CRM",
      "Mobile-first build, tested on real devices",
      "Hosting, SSL certificate, and nightly backups",
      "Edits within one business day, for as long as you're with us",
    ],
    related: ["google", "missed", "followup"],
    meta: "A custom, fast, conversion-focused website for service businesses — built around your services and the questions your customers actually ask.",
  },

  google: {
    h1: "Be the name that comes back — in the map, and in the answer.",
    lede: "“Roof repair near me” still returns a map with three businesses in it, and almost every call goes to one of those three. But a growing share of people never see that map: they ask ChatGPT, Gemini, or Siri who to call, and get back a short list of names. Both places are won the same way, and both are specific work — not a mystery.",
    does: [
      {
        title: "Your profile, finished properly",
        body: "Categories, service areas, hours, the full service list, photos of real job sites. The fields that move the ranking — and the same fields an AI assistant reads when it decides who to name.",
      },
      {
        title: "Written so a machine can quote you",
        body: "The industry calls it answer engine optimization. In practice it means your pages state plainly what you do, where, for whom, and at what price band — in the wording people actually ask in. A model that can't find a clear answer on your site recommends the competitor whose site has one.",
      },
      {
        title: "Reviews on a schedule",
        body: "The map weighs review count and recency nearly as heavily as distance, and assistants summarise those same reviews out loud. Twelve reviews, newest from 2021, is why you sit fourth and why the answer skips you.",
      },
      {
        title: "A page per town you actually work in",
        body: "Real jobs, real streets, real photos. One page per town you serve — not forty spun pages for towns you'd never drive to.",
      },
      {
        title: "Numbers you can check",
        body: "Every month: how many people found you, how many called, the exact phrases they searched, and which assistants named you when we ask them the questions your customers ask. If it isn't moving, you'll see it before we explain it.",
      },
    ],
    steps: [
      {
        title: "Audit what's live now",
        body: "Your profile, your competitors' profiles, and what the assistants say today when asked to recommend someone for your trade in your town. Written out in plain language.",
      },
      {
        title: "Fix the profile",
        body: "Categories and services first — they decide which searches you're even eligible for. Photos and hours after.",
      },
      {
        title: "Build the pages both read",
        body: "One per town, linked from the site, each carrying a job you've genuinely done there, plus the plain question-and-answer sections a model can lift a sentence from.",
      },
      {
        title: "Keep reviews coming",
        body: "Wired into job completion so recency never lapses again. This is the part that compounds, in the map and in the answer.",
      },
    ],
    included: [
      "Google Business Profile setup or cleanup",
      "Five local service-area pages, written and built",
      "Answer-ready pages: plain questions, direct answers, structured data an assistant can parse",
      "Directory listing cleanup (name, address, phone consistency)",
      "Review requests connected to job completion",
      "Monthly report: views, calls, direction requests, search terms, and which AI assistants named you",
    ],
    related: ["reviews", "website", "stay"],
    meta: "Local search and AI visibility for service businesses: rank in the Google map results and get named when customers ask ChatGPT or Gemini who to call.",
  },

  stay: {
    h1: "The customer you already have is the cheapest one you'll ever get.",
    lede: "You did the job, they paid, and then three years of silence. A tune-up reminder sent in September costs you almost nothing and fills the second week of October.",
    does: [
      {
        title: "Seasonal, not random",
        body: "Messages land when the work is on people's minds — before the first cold snap, after the first storm, at the start of the season you're always slow in.",
      },
      {
        title: "Sent from your number",
        body: "A text from the number already in their phone gets read. A newsletter from a marketing address does not.",
      },
      {
        title: "Written once, runs every year",
        body: "The calendar repeats. You approve the messages once and they go out on schedule from then on, including the years you're too busy to think about it.",
      },
      {
        title: "It stops when they book",
        body: "The moment someone replies or books, the rest of that sequence stops. Nobody gets nagged for a job they've already given you.",
      },
    ],
    steps: [
      {
        title: "We import and clean your customer list",
        body: "Out of the old CRM, the spreadsheet, and the invoicing software — deduplicated, with dead numbers dropped.",
      },
      {
        title: "We map your year",
        body: "Two to four sends, placed against the seasons your trade actually turns on.",
      },
      {
        title: "You approve the words once",
        body: "Short, specific, in your voice. Nothing that reads like it came from a marketing department.",
      },
      {
        title: "You see what came back",
        body: "Per send: replies, bookings, revenue. Weak sends get rewritten rather than repeated.",
      },
    ],
    included: [
      "Customer list import, deduplication, and cleanup",
      "A seasonal send calendar built around your trade",
      "Every message written and approved up front",
      "Replies routed into your shared inbox",
      "Results per send: replies, bookings, revenue",
    ],
    related: ["reviews", "inbox", "followup"],
    meta: "Seasonal reminders and offers that bring past customers back — written once, sent from your number, stopped the moment they book.",
  },

  missed: {
    h1: "A missed call is a call to your competitor.",
    lede: "You're on a ladder, in an attic, under a sink. The phone rings out and forty seconds later that person is dialling the next number on the list. A text sent the instant you miss it keeps the conversation yours.",
    does: [
      {
        title: "Fires in under five seconds",
        body: "Fast enough that the text arrives while they're still looking at the screen, before they've scrolled back to the search results.",
      },
      {
        title: "Says something worth replying to",
        body: "“This is Dave at Northline Plumbing, I'm on a job. What's going on, and what's the address?” That gets an answer. “Sorry we missed you” does not.",
      },
      {
        title: "The reply lands in a thread, not a voicemail box",
        body: "You answer it between jobs from the same inbox your crew uses, with the whole conversation in one place.",
      },
      {
        title: "Works hardest after hours",
        body: "Evenings and weekends are when emergency calls come in and when nobody picks up. The after-hours message is written separately for exactly that.",
      },
    ],
    steps: [
      {
        title: "Your number stays your number",
        body: "We forward it. Nothing on your truck, your invoices, or your van needs reprinting.",
      },
      {
        title: "We write the message for your trade",
        body: "What an HVAC caller needs to be asked is not what a personal injury caller needs to be asked.",
      },
      {
        title: "We test it with a real missed call",
        body: "From a real phone, at a real time of day, before it touches a customer.",
      },
      {
        title: "It runs",
        body: "You get a monthly count: calls missed, texts sent, conversations recovered.",
      },
    ],
    included: [
      "Call forwarding setup — you keep your existing number",
      "Missed-call message written for your trade",
      "A separate after-hours and weekend message",
      "Replies delivered to your shared inbox",
      "Monthly count of missed calls recovered",
    ],
    related: ["inbox", "phone", "followup"],
    meta: "Every missed call gets an instant text back, so the lead stays with you instead of going to the next contractor on the list.",
  },

  inbox: {
    h1: "One thread per customer, not six apps.",
    lede: "Texts on your personal phone, email on the office computer, Facebook messages nobody has checked since March. When someone asks whether anyone ever got back to Dana, nobody in the room can answer.",
    does: [
      {
        title: "Every channel in one thread",
        body: "Text, email, web form, Facebook and Instagram messages — stacked in order under the person who sent them.",
      },
      {
        title: "Your crew sees the same screen you do",
        body: "The office and the truck work from one inbox, so the answer to “did anyone call them back” is on the screen instead of in someone's memory.",
      },
      {
        title: "The history stays with the business",
        body: "When a tech leaves, two years of customer conversation does not leave in their phone.",
      },
      {
        title: "Assign it, or mark it done",
        body: "Every conversation is somebody's, or it's finished. Nothing sits in the middle, which is where leads go to die.",
      },
    ],
    steps: [
      {
        title: "Connect the channels",
        body: "Phone, email, website forms, and social. Half a day, no downtime.",
      },
      {
        title: "Bring the contacts across",
        body: "From wherever they live now, so old conversations attach to the right person.",
      },
      {
        title: "Decide who sees what",
        body: "Techs see their jobs, the office sees everything. Set once, changed any time.",
      },
      {
        title: "One training session, recorded",
        body: "Forty-five minutes with the crew. The recording is how you onboard the next hire.",
      },
    ],
    included: [
      "Text, email, web form, Facebook and Instagram connected",
      "Shared inbox with assignment and done states",
      "Mobile app for the crew",
      "Saved replies for the questions you answer weekly",
      "One training session, recorded and yours to keep",
    ],
    related: ["missed", "phone", "followup"],
    meta: "Texts, emails, calls, and social messages in one shared inbox your whole crew can see — one thread per customer.",
  },

  phone: {
    h1: "A work number on the phone you already carry.",
    lede: "Your personal number is printed on four hundred invoices and the side of a van. A business line ends that without putting a second phone in your pocket.",
    does: [
      {
        title: "Rings the phone in your hand",
        body: "No new handset, no new SIM. Work calls arrive on the device you already answer.",
      },
      {
        title: "You can turn it off at six",
        body: "After hours the line routes to a text or voicemail instead of your dinner. Emergency numbers can be exempted.",
      },
      {
        title: "Every call attaches to the customer",
        body: "Call history, recordings if you want them, and voicemail transcripts sit in the same thread as their texts and emails.",
      },
      {
        title: "The number is yours",
        body: "Portable. If you ever leave, it comes with you — the same way it would from any carrier.",
      },
    ],
    steps: [
      {
        title: "Pick a local number, or bring yours",
        body: "A new number is live the same day. Porting an existing one takes a few days and we handle the paperwork.",
      },
      {
        title: "Decide who it rings",
        body: "You, the office, or both in sequence. Changed from the app whenever the roster changes.",
      },
      {
        title: "Set your hours",
        body: "Open hours ring. Closed hours text back and log the call.",
      },
    ],
    included: [
      "A local business number, or a port of your existing one",
      "Call routing and ring order",
      "Voicemail transcribed to text",
      "Full call history inside the shared inbox",
      "Business hours and after-hours handling",
    ],
    related: ["missed", "inbox"],
    meta: "A dedicated business number that rings the phone you already carry, with hours, routing, and call history in one place.",
  },

  followup: {
    h1: "Most quotes are lost to silence, not to price.",
    lede: "You send the estimate on Tuesday and get busy. They meant to reply and got busy too. Three well-timed messages over ten days closes a meaningful share of the jobs you'd already written off.",
    does: [
      {
        title: "Starts the minute the lead arrives",
        body: "Not that evening, not the next morning. The first message goes out while they're still on your website.",
      },
      {
        title: "Stops the second they answer",
        body: "One reply, one booking, or one “no thanks” ends the sequence. Nobody gets the third text after they've already said yes.",
      },
      {
        title: "It sounds like you",
        body: "Written in your voice, sent from your number. If your customers would notice it was automated, it's written wrong.",
      },
      {
        title: "A new lead and a sent quote get different tracks",
        body: "One needs to be qualified. The other needs a reason to decide this week. Same sequence for both is why generic follow-up gets ignored.",
      },
    ],
    steps: [
      {
        title: "Map the stages you actually use",
        body: "New lead, quoted, booked, done. Usually four — whatever you already say out loud in the truck.",
      },
      {
        title: "Write both sequences",
        body: "Three to five messages each, across text and email, spaced by what your trade's decision cycle really looks like.",
      },
      {
        title: "Run it for thirty days",
        body: "Live, with every reply landing in your inbox.",
      },
      {
        title: "Cut what didn't work",
        body: "We read the reply rates at day thirty and rewrite the weak messages. Timing is usually the problem, not wording.",
      },
    ],
    included: [
      "Two sequences written: new lead, and quoted",
      "Text and email, timed for your trade",
      "Automatic stop on reply, booking, or opt-out",
      "A CRM pipeline you can see every open deal in",
      "Monthly reply and close-rate report",
    ],
    related: ["missed", "inbox", "stay"],
    meta: "Timed text and email follow-up that runs on every new lead and every sent quote until they book — and stops the moment they reply.",
  },

  reviews: {
    h1: "The review you never asked for is the review you never got.",
    lede: "People are happiest while you're packing the van. Two days later they aren't thinking about you at all. The ask has to happen inside that window, and it can't depend on you remembering.",
    does: [
      {
        title: "Sent when the job closes",
        body: "Triggered by the job being marked complete, so the timing is right every time without anybody deciding to do it.",
      },
      {
        title: "One tap to the right place",
        body: "A direct link straight to your review form. Every extra screen between the ask and the box loses roughly half the people.",
      },
      {
        title: "Everyone gets asked, and complaints reach you fast",
        body: "The same request goes to every customer — screening out unhappy ones breaks Google's rules and gets profiles penalised. What we do instead is make sure a bad reply lands in your inbox within minutes, so you can fix the job while it's still fixable.",
      },
      {
        title: "New reviews appear on your site",
        body: "The feed on your website updates itself, so the proof compounds in two places at once.",
      },
    ],
    steps: [
      {
        title: "Connect job completion",
        body: "From your CRM, your invoicing tool, or a button the tech taps before leaving.",
      },
      {
        title: "Write the ask",
        body: "Short, by name, referencing the actual job. Generic requests get ignored at roughly a third of the rate.",
      },
      {
        title: "Route the replies",
        body: "Reviews go to Google. Anything that reads like a complaint is flagged in your inbox immediately.",
      },
      {
        title: "Watch the count and the rating",
        body: "Monthly. Review recency is a ranking factor, so this feeds directly back into the map results.",
      },
    ],
    included: [
      "Review request by text and email, triggered on job completion",
      "Direct link to your Google review form",
      "Complaint replies flagged to your inbox in minutes",
      "A live review feed on your website",
      "Monthly report: requests sent, reviews left, rating trend",
    ],
    related: ["google", "website", "stay"],
    meta: "Ask every customer for a review at the moment they're happiest, automatically — and hear about problems before they become public ones.",
  },
};
