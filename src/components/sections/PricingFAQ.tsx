import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { faqsById, PRICING_FAQ_IDS } from "@/content/faq";

/**
 * The short FAQ, on the page where the money is. Same accordion as /faq —
 * only the questions differ: these are the six objections that surface with
 * a card already in hand, answered without making anyone leave the page.
 */
export function PricingFAQ() {
  const [open, setOpen] = useState<number | null>(0);
  const faqs = faqsById(PRICING_FAQ_IDS);

  return (
    <section className="relative py-16 sm:py-20">
      <div className="mx-auto max-w-3xl px-6 lg:px-10">
        <Reveal className="text-center">
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-accent">
            Before you decide
          </p>
          <h2 className="mt-4 font-display text-3xl font-medium tracking-tight text-balance sm:text-4xl">
            The questions everyone asks first.
          </h2>
        </Reveal>

        <div className="mt-10 divide-y divide-border border-y border-border">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={f.id} delay={i * 0.04}>
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
