import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Phone, Mail, Clock } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { Navbar } from "@/components/Navbar";
import { MobileCallBar } from "@/components/MobileCallBar";
import { SEOHead } from "@/components/SEOHead";
import { LeadForm } from "@/components/LeadForm";

export default function Contact() {
  const [done, setDone] = useState(false);

  return (
    <div id="top" className="relative min-h-screen bg-background">
      <SEOHead
        title="Contact Luxen Digital — Let's Build Something Your Competitors Can't Copy"
        description="Tell us about your service business and we'll reply within one business day with a clear plan. No pressure, no obligation. Email team@luxendigital.com or call +1 858-223-9635."
        canonical="/contact"
        schemaJson={{
          "@context": "https://schema.org",
          "@type": "ContactPage",
          name: "Contact Luxen Digital",
          description:
            "Get in touch with Luxen Digital to build a premium website and AI-powered business system for your service business.",
        }}
      />
      <Navbar />
      {/* ambient glow */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[60vh] w-[90vw] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,hsl(43_90%_60%_/_0.08),transparent_70%)]" />
        <div className="absolute inset-0 bg-grid opacity-20 mask-fade-b" />
      </div>

      <section className="mx-auto max-w-6xl px-6 pb-24 pt-36 lg:px-10 lg:pt-44">
        <div className="grid gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
          {/* Left — copy */}
          <div>
            <Reveal>
              <p className="text-sm font-medium uppercase tracking-[0.25em] text-accent">
                Contact
              </p>
              <h1 className="mt-6 font-display text-3xl font-medium leading-[1.05] tracking-tight text-balance sm:text-4xl lg:text-5xl">
                Let's build something{" "}
                <span className="gold-text">your competitors can't copy</span>.
              </h1>
              <p className="mt-6 max-w-md text-lg leading-relaxed text-muted-foreground">
                Tell us about your business. We'll reply within one business day
                with a clear plan — no pressure, no obligation.
              </p>
            </Reveal>

            <Reveal delay={0.15}>
              <div className="mt-10 space-y-4">
                <ContactRow
                  icon={<Mail className="h-5 w-5" />}
                  label="Email"
                  value="team@luxendigital.com"
                  href="mailto:team@luxendigital.com"
                />
                <ContactRow
                  icon={<Phone className="h-5 w-5" />}
                  label="Phone"
                  value="+1 858-223-9635"
                  href="tel:+18582239635"
                />
                <ContactRow
                  icon={<Clock className="h-5 w-5" />}
                  label="Response time"
                  value="Within one business day"
                />
              </div>
            </Reveal>
          </div>

          {/* Right — form card */}
          <Reveal delay={0.1}>
            <div className="relative rounded-3xl glass shadow-lux border border-border/60 p-7 sm:p-9">
              <AnimatePresence mode="wait">
                {done ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="flex flex-col items-center py-10 text-center"
                  >
                    <motion.div
                      initial={{ scale: 0.6, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{
                        duration: 0.5,
                        ease: [0.22, 1, 0.36, 1],
                        delay: 0.1,
                      }}
                      className="btn-gold flex h-16 w-16 items-center justify-center rounded-full"
                    >
                      <Check
                        className="h-8 w-8 text-[hsl(240_10%_8%)]"
                        strokeWidth={2.5}
                      />
                    </motion.div>
                    <h2 className="mt-6 font-display text-2xl font-medium tracking-tight">
                      Message received.
                    </h2>
                    <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
                      Thank you. A member of our team will reach out shortly to
                      schedule your strategy call.
                    </p>
                    <button
                      onClick={() => setDone(false)}
                      className="mt-7 text-sm font-medium text-accent underline-offset-4 hover:underline"
                    >
                      Send another message
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <LeadForm
                      // Do not change after publish — stable slug for workflow Form filter (use formName for display renames)
                      formId="contact-form-luxen-digital"
                      formName="Contact Form Luxen Digital"
                      onSuccess={() => setDone(true)}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Reveal>
        </div>
      </section>
      <MobileCallBar />
    </div>
  );
}

function ContactRow({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
}) {
  const content = (
    <div className="flex items-center gap-4 rounded-2xl border border-border/60 bg-secondary/30 p-4 transition-colors hover:border-accent/40">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent">
        {icon}
      </div>
      <div>
        <p className="text-xs uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        <p className="text-sm font-medium text-foreground">{value}</p>
      </div>
    </div>
  );
  return href ? (
    <a href={href} className="block">
      {content}
    </a>
  ) : (
    content
  );
}
