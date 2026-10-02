import {
  createContext,
  lazy,
  Suspense,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, ArrowLeft, Check } from "lucide-react";
import { RollLabel } from "@/components/motion/RollLabel";
import { detectCountry } from "@/lib/geo";

// The form (and the phone library's numbering-plan data) is only needed at
// the last step, so it stays out of the main bundle and loads on open.
const loadLeadForm = () =>
  import("@/components/LeadForm").then((m) => ({ default: m.LeadForm }));
const LeadForm = lazy(loadLeadForm);

const LEAD_FORM_ID = "booking-lead-form";

type BookingCtx = { open: () => void; close: () => void };
const Ctx = createContext<BookingCtx | null>(null);

export function useBooking() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useBooking must be used within BookingProvider");
  return ctx;
}

const BUSINESS_TYPES = [
  "HVAC",
  "Plumbing",
  "Auto Repair",
  "Jewelry Repair",
  "Electrical",
  "Roofing",
  "General Contractor",
  "Remodeling",
  "Landscaping",
  "Other",
];

const BUSINESS_STATUS = [
  "Slow, I need jobs now",
  "Okay, but not consistent",
  "Busy, booked solid",
  "Just starting my business",
];

const TIMELINE = [
  "Right away",
  "In the next month or two",
  "Later this year",
  "Just seeing what's out there",
];

const REVENUE = [
  "$0-$10,000",
  "$10,000-$25,000",
  "$25,000-$100,000",
  "$100,000+",
];

const QUESTIONS = [
  {
    key: "businessType",
    label: "What type of business do you own?",
    options: BUSINESS_TYPES,
    required: true,
  },
  {
    key: "businessStatus",
    label: "How's business right now?",
    options: BUSINESS_STATUS,
    required: true,
  },
  {
    key: "timeline",
    label: "When are you looking to fix that?",
    options: TIMELINE,
    required: true,
  },
  {
    key: "revenue",
    label: "What's your current monthly revenue?",
    options: REVENUE,
    required: true,
  },
] as const;

type Answers = Record<string, string>;

export function BookingProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    if (isOpen) {
      document.addEventListener("keydown", onKey);
      // Lock the page scroll on <html> as well as <body> (either can be the
      // scroller), and pad by the scrollbar's width so content doesn't jump
      // sideways when it disappears.
      const gap = window.innerWidth - document.documentElement.clientWidth;
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
      if (gap > 0) document.body.style.paddingRight = `${gap}px`;
      // Hides the floating chat bubble (see index.css) so it can't sit on
      // top of the modal's buttons.
      document.body.classList.add("booking-open");
    }
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
      document.body.classList.remove("booking-open");
    };
  }, [isOpen, close]);

  return (
    <Ctx.Provider value={{ open, close }}>
      {children}
      <AnimatePresence>
        {isOpen && <BookingModalContent close={close} />}
      </AnimatePresence>
    </Ctx.Provider>
  );
}

function BookingModalContent({ close }: { close: () => void }) {
  // 0..QUESTIONS.length-1 = questions, QUESTIONS.length = contact details
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  // Warm both while the visitor answers the questions, so the last step
  // shows up ready, with their country already picked.
  useEffect(() => {
    void loadLeadForm();
    void detectCountry();
  }, []);

  const totalSteps = QUESTIONS.length + 1;
  const isDetails = step === QUESTIONS.length;
  const current = QUESTIONS[step];

  const selectAnswer = (key: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const canProceed = current ? Boolean(answers[current.key]) : true;

  const next = () => {
    if (canProceed && step < QUESTIONS.length) setStep((s) => s + 1);
  };

  const back = () => setStep((s) => Math.max(0, s - 1));

  // The qualification answers ride along with the contact details, so the
  // CRM gets one complete lead instead of an anonymous set of answers.
  const extra = Object.fromEntries(
    QUESTIONS.map((q) => [
      q.key,
      { value: answers[q.key] ?? "", label: q.label },
    ]),
  );

  const ease = [0.22, 1, 0.36, 1] as const;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      // z-[1100]: the navbar sits at z-index 1000 and must stay underneath.
      // Below `sm` the modal is a bottom sheet; above it, a centered card.
      className="fixed inset-0 z-[1100] flex items-end justify-center sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-title"
    >
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-[hsl(240_10%_8%)]/70 backdrop-blur-md"
        onClick={close}
      />

      {/* modal */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        transition={{ duration: 0.35, ease }}
        // dvh, not vh: on mobile browsers vh includes the area behind the
        // address bar, which pushes the bottom of the sheet off screen.
        className="relative z-10 flex max-h-[92dvh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl border border-b-0 border-border/60 bg-background shadow-lux sm:max-h-[88dvh] sm:rounded-3xl sm:border-b"
      >
        {/* Grab handle: signals "sheet" on touch screens. */}
        <div
          aria-hidden="true"
          className="mx-auto mt-2.5 h-1 w-10 shrink-0 rounded-full bg-border sm:hidden"
        />
        <div className="flex shrink-0 items-start justify-between gap-3 border-b border-border/60 px-5 pb-3.5 pt-3 sm:items-center sm:px-7 sm:py-4 [@media(max-height:760px)]:sm:px-6 [@media(max-height:760px)]:sm:py-3">
          <div className="min-w-0">
            <p
              id="booking-title"
              className="font-display text-sm font-medium leading-snug tracking-tight text-foreground sm:text-base"
            >
              Book Your Free Website Strategy Call
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {done
                ? "We'll be in touch shortly."
                : isDetails
                  ? "Last step — where should we reach you?"
                  : "Quick questions first — so we come prepared."}
            </p>
          </div>
          <button
            onClick={close}
            aria-label="Close"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-accent/40 hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* progress bar */}
        {!done && (
          <div className="h-1 w-full shrink-0 bg-secondary">
            <motion.div
              className="h-full gold-gradient"
              initial={false}
              animate={{ width: `${((step + 1) / totalSteps) * 100}%` }}
              transition={{ duration: 0.4, ease }}
            />
          </div>
        )}

        {/* overflow-x-hidden: the steps slide in sideways, and with only
            overflow-y set the browser treats x as auto too, flashing a
            horizontal scrollbar mid-transition. The scrollbar itself is hidden;
            the body still scrolls by wheel/touch if a step can't fit. */}
        <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain [scrollbar-width:none] sm:min-h-[min(420px,55dvh)] [&::-webkit-scrollbar]:hidden">
          <AnimatePresence mode="wait">
            {done ? (
              <motion.div
                key="done"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease }}
                className="flex flex-col items-center px-6 py-12 text-center sm:py-16"
              >
                <motion.div
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, ease, delay: 0.1 }}
                  className="btn-gold flex h-16 w-16 items-center justify-center rounded-full"
                >
                  <Check
                    className="h-8 w-8 text-[hsl(240_10%_8%)]"
                    strokeWidth={2.5}
                  />
                </motion.div>
                <h3 className="mt-6 font-display text-2xl font-medium tracking-tight text-foreground">
                  You&rsquo;re all set.
                </h3>
                <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
                  Thank you. A member of our team will reach out within one
                  business day to schedule your strategy call.
                </p>
                <button
                  onClick={close}
                  className="btn-gold mt-8 rounded-full px-8 py-3 text-sm font-bold"
                >
                  Close
                </button>
              </motion.div>
            ) : (
              <motion.div
                key={current ? current.key : "details"}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.3, ease }}
                // Short viewports (laptops, landscape phones) get tighter spacing so
                // the whole step fits without scrolling.
                className="flex flex-col gap-3 p-5 sm:gap-4 sm:p-7 [@media(max-height:760px)]:gap-2 [@media(max-height:760px)]:py-4 [@media(max-height:760px)]:sm:px-6"
              >
                <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-accent">
                  <span>
                    Step {step + 1} of {totalSteps}
                  </span>
                </div>

                {current ? (
                  <>
                    <h3 className="font-display text-lg font-semibold leading-tight tracking-tight text-foreground sm:text-2xl [@media(max-height:760px)]:sm:text-xl">
                      {current.label}
                    </h3>
                    <div
                      className={`mt-1 grid gap-2 sm:gap-2.5 [@media(max-height:760px)]:sm:gap-2 ${
                        current.options.length > 6
                          ? "grid-cols-2"
                          : "grid-cols-1"
                      }`}
                    >
                      {current.options.map((opt) => {
                        const selected = answers[current.key] === opt;
                        return (
                          <button
                            key={opt}
                            onClick={() => selectAnswer(current.key, opt)}
                            aria-pressed={selected}
                            className={`group flex min-h-12 items-center justify-between gap-2 rounded-xl border px-3.5 py-3 text-left text-sm font-medium leading-snug transition-all duration-200 sm:px-4 sm:py-3.5 sm:text-base [@media(max-height:760px)]:py-2.5 [@media(max-height:760px)]:sm:py-2.5 ${
                              selected
                                ? "border-accent bg-accent/5 text-foreground shadow-[0_4px_20px_-8px_hsl(43_90%_55%_/_0.4)]"
                                : "border-border bg-card/60 text-muted-foreground hover:border-accent/40 hover:text-foreground"
                            }`}
                          >
                            {opt}
                            <span
                              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-all duration-200 ${
                                selected
                                  ? "border-accent gold-gradient"
                                  : "border-border group-hover:border-accent/40"
                              }`}
                            >
                              {selected && (
                                <Check className="h-3 w-3 text-[hsl(240_10%_8%)]" />
                              )}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  <>
                    <h3 className="font-display text-lg font-semibold leading-tight tracking-tight text-foreground sm:text-2xl">
                      Where should we reach you?
                    </h3>
                    <Suspense
                      fallback={<div className="min-h-[360px]" aria-busy />}
                    >
                      <div className="mt-1">
                        <LeadForm
                          id={LEAD_FORM_ID}
                          // Do not change after publish — stable slug for the
                          // workflow Form filter (use formName for renames).
                          formId="strategy-call-qualification"
                          formName="Strategy Call Booking"
                          extra={extra}
                          onSuccess={() => setDone(true)}
                          onSubmittingChange={setSubmitting}
                          hideSubmit
                          compact
                        />
                      </div>
                    </Suspense>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Pinned footer: the next action is always in reach, however long
            the step is. Padded for the iPhone home indicator. On the details
            step the button submits the form through the `form` attribute. */}
        {!done && (
          <div className="flex shrink-0 items-center justify-between gap-3 border-t border-border/60 bg-background px-5 pb-[max(0.875rem,env(safe-area-inset-bottom))] pt-3.5 sm:px-7 sm:pb-5 sm:pt-4 [@media(max-height:760px)]:sm:px-6 [@media(max-height:760px)]:sm:py-3">
            <button
              onClick={back}
              disabled={step === 0 || submitting}
              className="-ml-3 inline-flex items-center gap-1.5 rounded-full px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground disabled:opacity-30 disabled:hover:text-muted-foreground sm:-ml-4 sm:px-4"
            >
              <ArrowLeft className="h-4 w-4 shrink-0" />
              <span className="leading-none">Back</span>
            </button>
            {isDetails ? (
              <button
                type="submit"
                form={LEAD_FORM_ID}
                disabled={submitting}
                className="btn-gold group inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold disabled:opacity-60 sm:gap-2.5 sm:px-7 sm:text-base"
              >
                <RollLabel>
                  {submitting ? "Sending…" : "Book My Call"}
                </RollLabel>
                {!submitting && (
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 sm:h-5 sm:w-5" />
                )}
              </button>
            ) : (
              <button
                onClick={next}
                disabled={!canProceed}
                className="btn-gold group inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold disabled:opacity-40 disabled:shadow-none sm:gap-2.5 sm:px-7 sm:text-base"
              >
                <RollLabel>Continue</RollLabel>
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 sm:h-5 sm:w-5" />
              </button>
            )}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
