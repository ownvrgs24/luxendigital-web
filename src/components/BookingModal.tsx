import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, ArrowLeft, Check } from "lucide-react";
import { TRACKING, postTrackingEvent } from "@/lib/tracking";
import { RollLabel } from "@/components/motion/RollLabel";

const BOOKING_SRC =
  "https://crm.luxendigital.com/widget/booking/fXV07pL1FsAbe205S48w";

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
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
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
  const [step, setStep] = useState(0); // 0..QUESTIONS.length-1 = questions, QUESTIONS.length = calendar
  const [answers, setAnswers] = useState<Answers>({});
  const [submitting, setSubmitting] = useState(false);

  const totalSteps = QUESTIONS.length;
  const isCalendar = step >= totalSteps;
  const current = QUESTIONS[step];

  const selectAnswer = (key: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const canProceed = current ? Boolean(answers[current.key]) : true;

  const next = () => {
    if (!canProceed) return;
    if (step < totalSteps) {
      // moving to calendar — fire tracking event once
      if (step === totalSteps - 1) {
        fireQualificationLead(answers);
      }
      setStep((s) => s + 1);
    }
  };

  const back = () => setStep((s) => Math.max(0, s - 1));

  const ease = [0.22, 1, 0.36, 1] as const;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
    >
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-[hsl(240_10%_8%)]/70 backdrop-blur-md"
        onClick={close}
      />

      {/* modal */}
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.98 }}
        transition={{ duration: 0.35, ease }}
        className="relative z-10 flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-3xl border border-border/60 bg-background shadow-lux"
      >
        <div className="flex items-center justify-between border-b border-border/60 px-5 py-4">
          <div>
            <p className="font-display text-base font-medium tracking-tight text-foreground">
              {isCalendar
                ? "Pick Your Time"
                : "Book Your Free Website Strategy Call"}
            </p>
            <p className="text-xs text-muted-foreground">
              {isCalendar
                ? "Choose a time that works for you."
                : "Quick questions first — so we come prepared."}
            </p>
          </div>
          <button
            onClick={close}
            aria-label="Close"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-accent/40 hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* progress bar */}
        {!isCalendar && (
          <div className="h-1 w-full bg-secondary">
            <motion.div
              className="h-full gold-gradient"
              initial={false}
              animate={{ width: `${((step + 1) / (totalSteps + 1)) * 100}%` }}
              transition={{ duration: 0.4, ease }}
            />
          </div>
        )}

        <div className="min-h-[420px] flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            {!isCalendar && current ? (
              <motion.div
                key={current.key}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.3, ease }}
                className="flex flex-col gap-4 p-6 sm:p-7"
              >
                <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-accent">
                  <span>
                    Step {step + 1} of {totalSteps}
                  </span>
                </div>
                <h3 className="font-display text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                  {current.label}
                </h3>
                <div className="mt-1 flex flex-col gap-2.5">
                  {current.options.map((opt) => {
                    const selected = answers[current.key] === opt;
                    return (
                      <button
                        key={opt}
                        onClick={() => selectAnswer(current.key, opt)}
                        className={`group flex items-center justify-between rounded-xl border px-4 py-3.5 text-left text-sm font-medium transition-all duration-200 sm:text-base ${
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

                <div className="mt-4 flex items-center justify-between gap-3">
                  <button
                    onClick={back}
                    disabled={step === 0}
                    className="inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground disabled:opacity-30 disabled:hover:text-muted-foreground"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </button>
                  <button
                    onClick={next}
                    disabled={!canProceed}
                    className="btn-gold group inline-flex items-center gap-2.5 rounded-full px-7 py-3 text-base font-bold disabled:opacity-40 disabled:shadow-none"
                  >
                    <RollLabel>
                      {step === totalSteps - 1
                        ? "See Available Times"
                        : "Continue"}
                    </RollLabel>
                    <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="calendar"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                <iframe
                  src={BOOKING_SRC}
                  title="Book Your Strategy Call"
                  allow="payment"
                  scrolling="yes"
                  id="fXV07pL1FsAbe205S48w_1789022210907"
                  className="h-[70vh] w-full border-none"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}

/** Fire the qualification answers as a tracked lead event to the CRM. */
function fireQualificationLead(answers: Answers) {
  const formData: Record<string, unknown> = {};
  const formLabels: Record<string, string> = {};

  for (const q of QUESTIONS) {
    formData[q.key] = answers[q.key] ?? "";
    formLabels[q.key] = q.label;
  }

  const payload = {
    type: "external_form_submission",
    sessionId: crypto.randomUUID(),
    trackingId: TRACKING.trackingId,
    locationId: TRACKING.locationId,
    projectId: TRACKING.projectId,
    formId: "strategy-call-qualification",
    formName: "Strategy Call Qualification",
    formData,
    formLabels,
    page: typeof window !== "undefined" ? window.location.href : "",
  };

  postTrackingEvent(payload);
}
