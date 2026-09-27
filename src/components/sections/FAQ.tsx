import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";

const faqs = [
  {
    q: "How much does a website cost?",
    a: "Every business is different, so pricing depends on your goals, features, and complexity. Most projects start with a free strategy call where we learn about your business and provide a custom quote with no obligation.",
  },
  {
    q: "How long does a project take?",
    a: "Most websites are completed within 1-4 weeks, depending on the size of the project and how quickly we receive your content and feedback.",
  },
  {
    q: "Do I own my website?",
    a: "Yes. Your website belongs to you. You'll always have access to your website and your business data.",
  },
  {
    q: "Can you redesign my current website?",
    a: "Absolutely. Whether your website looks outdated, loads slowly, or isn't generating leads, we can redesign it into a modern, high-performing website built to convert visitors into customers.",
  },
  {
    q: "Do you work with my type of business?",
    a: "We specialize in appointment-based service businesses across the United States, including contractors, HVAC companies, plumbers, electricians, auto repair shops, cleaning companies, landscapers, medical practices, salons, pet groomers, and many more. If your business relies on booking customers, we're likely a great fit.",
  },
  {
    q: "What's included every month?",
    a: "Our monthly plan can include secure hosting, website maintenance, software updates, technical support, AI tools, CRM access, automation, booking tools, ongoing improvements, and system monitoring. We'll recommend the plan that best fits your business.",
  },
  {
    q: "How does the AI Chat Widget work?",
    a: "The AI Chat Widget engages visitors 24/7 by answering common questions, qualifying leads, collecting contact information, and encouraging visitors to schedule an appointment—even when your business is closed.",
  },
  {
    q: "What is Missed Call Text Back?",
    a: "If you miss a phone call, your customer automatically receives a personalized text message letting them know you'll get back to them. This helps recover potential customers who might otherwise call a competitor.",
  },
  {
    q: "How does the Google Review Funnel work?",
    a: "After a completed job, customers can automatically receive a text or email asking for feedback. Happy customers are encouraged to leave a Google review, helping you build trust and improve your online reputation.",
  },
  {
    q: "Can customers book appointments online?",
    a: "Yes. We can integrate an online booking system directly into your website, allowing customers to schedule appointments anytime, from any device.",
  },
  {
    q: "Is hosting included?",
    a: "Yes. We offer secure, high-performance hosting with ongoing maintenance to help keep your website fast, reliable, and up to date.",
  },
  {
    q: "Will my website work on mobile devices?",
    a: "Absolutely. Every website we build is fully responsive, meaning it looks and works great on desktops, tablets, and smartphones.",
  },
  {
    q: "Can I request changes after launch?",
    a: "Yes. We provide ongoing support, and depending on your plan, updates and changes can be requested after your website goes live.",
  },
  {
    q: "Are there long-term contracts?",
    a: "No. We don't believe in locking clients into long-term commitments. We focus on delivering value so you choose to stay because the service is working for your business—not because you're required to.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="relative py-16 sm:py-20">
      <div className="mx-auto max-w-3xl px-6 lg:px-10">
        <Reveal className="text-center">
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-accent">
            FAQ
          </p>
          <h2 className="mt-4 font-display text-3xl font-medium tracking-tight text-balance sm:text-4xl lg:text-5xl">
            Questions, answered.
          </h2>
        </Reveal>

        <div className="mt-10 divide-y divide-border border-y border-border">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={f.q} delay={i * 0.04}>
                <div>
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-6 py-6 text-left"
                    aria-expanded={isOpen}
                  >
                    <span className="font-display text-lg font-medium text-foreground">
                      {f.q}
                    </span>
                    <motion.span
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border text-accent"
                    >
                      <Plus className="h-4 w-4" />
                    </motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="pb-6 pr-12 text-base leading-relaxed text-muted-foreground">
                          {f.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
