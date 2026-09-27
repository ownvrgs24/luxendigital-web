import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { RollLabel } from "@/components/motion/RollLabel";
import { useBooking } from "@/components/BookingModal";

// The headline calls the website an employee, so these read as that
// employee's duties rather than as a feature list. Every one of them also
// appears in the Features section further down the page; framing them as
// job description is what keeps this section from being a preview of it.
const duties = [
  {
    does: "It captures every lead",
    how: "High-converting forms and instant routing, so nothing sits in an inbox.",
  },
  {
    does: "It replies in seconds",
    how: "SMS and email follow-up that goes out day or night.",
  },
  {
    does: "It books the appointment",
    how: "A self-serve calendar synced straight to your CRM.",
  },
  {
    does: "It never misses a call",
    how: "An instant text back, so no caller is left waiting.",
  },
  {
    does: "It asks for the review",
    how: "Automated requests on Google, sent when people are happiest.",
  },
  {
    does: "It tracks every deal",
    how: "Visual stages from first touch to paid job.",
  },
];

const ease = [0.22, 1, 0.36, 1] as const;

export function Philosophy() {
  const { open } = useBooking();

  return (
    <section
      id="philosophy"
      className="relative isolate overflow-hidden bg-foreground py-20 sm:py-28"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:items-center lg:gap-20">
          {/* ── The claim ── */}
          <Reveal>
            <p className="text-sm font-medium uppercase tracking-[0.25em] text-accent">
              Our Philosophy
            </p>
            <h2 className="mt-4 font-display text-3xl font-medium leading-[1.05] tracking-tight text-balance text-background sm:text-4xl lg:text-5xl">
              Your website should be your{" "}
              <span className="gold-text">hardest-working employee</span>.
            </h2>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-background/60">
              We don’t just build websites. We build systems that capture leads,
              follow up automatically, book appointments, and turn happy
              customers into reviews — so your business can grow without more
              manual work.
            </p>
            <button
              onClick={open}
              className="btn-gold mt-8 inline-flex items-center gap-2.5 rounded-full px-8 py-4 text-base font-bold"
            >
              <RollLabel>Book a Strategy Call</RollLabel>
              <ArrowRight className="h-5 w-5" />
            </button>
          </Reveal>

          {/* ── The job description ──────────────────────────────────────
               A ruled list, not six cards. The rows are parallel duties,
               not ordered steps, so they carry no index numbers; and a
               verb per row does the work an icon chip was standing in for. */}
          <ul className="lg:-mt-1">
            {duties.map((d, i) => (
              <motion.li
                key={d.does}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-12%" }}
                transition={{ duration: 0.5, delay: i * 0.05, ease }}
                className="group border-t border-white/10 last:border-b"
              >
                <div className="py-5 transition-transform duration-300 ease-out group-hover:translate-x-2 motion-reduce:transition-none sm:py-6">
                  <h3 className="font-display text-lg tracking-tight text-background transition-colors duration-300 group-hover:text-accent sm:text-xl">
                    {d.does}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-background/55">
                    {d.how}
                  </p>
                </div>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
