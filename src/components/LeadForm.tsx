import {
  useEffect,
  useId,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { RollLabel } from "@/components/motion/RollLabel";
import { postLeadWebhook, postTrackingEvent, TRACKING } from "@/lib/tracking";
import { detectCountry } from "@/lib/geo";
import PhoneInput, {
  isValidPhoneNumber,
  parsePhoneNumber,
  type Country,
} from "react-phone-number-input";
import "react-phone-number-input/style.css";

// Custom field id for the "Questions" textarea (registered via CRM).
const QUESTIONS_FIELD_ID = "SHWFEtxS1nmmx8O2Sw2l";

type Key = "first_name" | "last_name" | "email" | "phone";
type Values = Record<Key, string>;

/** In the order the fields appear — the first failing one gets focus. */
const KEYS: Key[] = ["first_name", "last_name", "email", "phone"];

const RULES: Record<Key, (v: string) => string | undefined> = {
  first_name: (v) => (v.trim() ? undefined : "Enter your first name"),
  last_name: (v) => (v.trim() ? undefined : "Enter your last name"),
  email: (v) =>
    !v.trim()
      ? "Enter your email"
      : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())
        ? undefined
        : "Enter a valid email, like jane@business.com",
  // Checked against the selected country's numbering plan, not a digit count.
  phone: (v) =>
    !v
      ? "Enter your phone number"
      : isValidPhoneNumber(v)
        ? undefined
        : "That number looks incomplete for the selected country",
};

type Props = {
  /** Stable slug for the CRM workflow's Form filter. Do not change after
   *  publish — rename `formName` instead. */
  formId: string;
  /** Display name, sent to the CRM and as the webhook's `source`. */
  formName: string;
  /** Answers collected before the form (e.g. the booking modal's questions),
   *  sent along with the contact details. Keyed by field name. */
  extra?: Record<string, { value: string; label: string }>;
  onSuccess: () => void;
  /** Lets a parent own the submit button (via the HTML `form` attribute),
   *  e.g. the booking modal's pinned footer. */
  id?: string;
  hideSubmit?: boolean;
  onSubmittingChange?: (submitting: boolean) => void;
  /** Tighter spacing and a smaller textarea, for the modal. */
  compact?: boolean;
};

/**
 * The one lead form on the site — used on the contact page and as the last
 * step of the booking modal. Every submission goes to the lead webhook (which
 * starts the CRM workflow) plus a fire-and-forget tracking event; success is
 * only reported once the webhook has accepted it.
 */
export function LeadForm({
  formId,
  formName,
  extra = {},
  onSuccess,
  id,
  hideSubmit = false,
  onSubmittingChange,
  compact = false,
}: Props) {
  // Prefix for field ids: the contact page and the modal can both be
  // mounted at once, and duplicate ids would break label association.
  const uid = useId();
  const [submitting, setSubmitting] = useState(false);
  const [sendError, setSendError] = useState(false);
  // `phone` is E.164, e.g. "+639171234567" — what the input emits and what
  // the CRM gets.
  const [values, setValues] = useState<Values>({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
  });
  // A field shows its error once the visitor has left it (or tried to
  // submit). From then on it re-checks on every keystroke, so the message
  // clears the moment the input is fixed. Untouched fields stay quiet, so
  // nobody is told off halfway through typing their name.
  const [touched, setTouched] = useState<Partial<Record<Key, boolean>>>({});
  // Pre-selected from the visitor's location. If it arrives after they have
  // typed a number or picked a country, the input ignores it.
  const [country, setCountry] = useState<Country | undefined>();

  useEffect(() => {
    let live = true;
    detectCountry().then((c) => live && setCountry(c));
    return () => {
      live = false;
    };
  }, []);

  useEffect(() => {
    onSubmittingChange?.(submitting);
  }, [submitting, onSubmittingChange]);

  const problem = (k: Key) => RULES[k](values[k]);
  const errorFor = (k: Key) => (touched[k] ? problem(k) : undefined);
  // A tick as soon as a field is filled in correctly, touched or not.
  const okFor = (k: Key) => Boolean(values[k]) && !problem(k);

  const set = (k: Key, v: string) => setValues((prev) => ({ ...prev, [k]: v }));
  const touch = (k: Key) => setTouched((prev) => ({ ...prev, [k]: true }));

  const onSubmit = (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    if (submitting) return;
    setTouched({ first_name: true, last_name: true, email: true, phone: true });
    const firstBad = KEYS.find((k) => problem(k));
    if (firstBad) {
      document.getElementById(`${uid}-${firstBad}`)?.focus();
      return;
    }

    setSubmitting(true);
    setSendError(false);

    const contact = {
      first_name: values.first_name.trim(),
      last_name: values.last_name.trim(),
      email: values.email.trim(),
      phone: values.phone,
    };
    const phoneCountry = parsePhoneNumber(values.phone)?.country;
    const data = new FormData(ev.currentTarget);
    const questions = ((data.get("questions") as string) ?? "").trim();
    const extraValues = Object.fromEntries(
      Object.entries(extra).map(([k, v]) => [k, v.value]),
    );
    const extraLabels = Object.fromEntries(
      Object.entries(extra).map(([k, v]) => [k, v.label]),
    );

    // Attribution event — fire-and-forget.
    postTrackingEvent(
      {
        type: "external_form_submission",
        timestamp: Date.now(),
        formId,
        formData: { ...contact, ...extraValues },
        formLabels: {
          first_name: "First Name",
          last_name: "Last Name",
          email: "Email",
          phone: "Phone",
          ...extraLabels,
        },
        url: window.location.href,
        title: document.title,
        path: window.location.pathname,
        userAgent: navigator.userAgent,
        trackingId: TRACKING.trackingId,
        locationId: TRACKING.locationId,
        projectId: TRACKING.projectId,
        sessionId: crypto.randomUUID(),
        properties: {
          deviceType: /Mobile|Android|iPhone/i.test(navigator.userAgent)
            ? "mobile"
            : "desktop",
          source: "ai_studio",
          projectId: TRACKING.projectId,
          formName,
        },
      },
      {
        customFields: {
          [QUESTIONS_FIELD_ID]: {
            value: questions || undefined,
            label: "Questions",
          },
        },
      },
    );

    postLeadWebhook({
      ...contact,
      ...extraValues,
      country: phoneCountry,
      questions: questions || undefined,
      source: formName,
    })
      .then(onSuccess)
      .catch(() => setSendError(true))
      .finally(() => setSubmitting(false));
  };

  return (
    <form
      id={id}
      onSubmit={onSubmit}
      noValidate
      className={compact ? "space-y-4" : "space-y-5"}
    >
      <div className={`grid sm:grid-cols-2 ${compact ? "gap-4" : "gap-5"}`}>
        <Field
          uid={uid}
          name="first_name"
          label="First name"
          placeholder="Jane"
          autoComplete="given-name"
          value={values.first_name}
          onChange={(v) => set("first_name", v)}
          onBlur={() => touch("first_name")}
          error={errorFor("first_name")}
          ok={okFor("first_name")}
        />
        <Field
          uid={uid}
          name="last_name"
          label="Last name"
          placeholder="Doe"
          autoComplete="family-name"
          value={values.last_name}
          onChange={(v) => set("last_name", v)}
          onBlur={() => touch("last_name")}
          error={errorFor("last_name")}
          ok={okFor("last_name")}
        />
      </div>

      <Field
        uid={uid}
        name="email"
        type="email"
        label="Email"
        placeholder="jane@business.com"
        autoComplete="email"
        value={values.email}
        onChange={(v) => set("email", v)}
        onBlur={() => touch("email")}
        error={errorFor("email")}
        ok={okFor("email")}
      />

      <FieldShell
        uid={uid}
        name="phone"
        label="Phone number"
        error={errorFor("phone")}
        ok={okFor("phone")}
      >
        <PhoneInput
          id={`${uid}-phone`}
          name="phone"
          value={values.phone || undefined}
          onChange={(v) => set("phone", v ?? "")}
          onBlur={() => touch("phone")}
          defaultCountry={country}
          // Self-hosted copies of country-flag-icons (public/flags). Bundling
          // every flag as a component tripled this chunk, and the library's
          // default hotlinks a third-party GitHub Pages URL. Only the selected
          // country's flag is ever shown, so it's one small request.
          flagUrl="/flags/{XX}.svg"
          // The detected country heads the list, above a divider.
          countryOptionsOrder={country ? [country, "|", "..."] : undefined}
          autoComplete="tel"
          aria-invalid={!!errorFor("phone")}
          aria-describedby={`${uid}-phone-msg`}
          placeholder="Enter phone number"
          countrySelectProps={{ "aria-label": "Country" }}
          className={`lead-phone flex w-full items-center gap-3 rounded-xl border bg-background/60 pl-4 pr-10 transition-colors focus-within:ring-2 ${
            errorFor("phone")
              ? "border-destructive focus-within:ring-destructive/25"
              : "border-input focus-within:border-accent focus-within:ring-ring/40"
          }`}
          numberInputProps={{
            className:
              "min-w-0 flex-1 bg-transparent py-3 text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none",
          }}
        />
      </FieldShell>

      <div>
        <label
          htmlFor={`${uid}-questions`}
          className="mb-2 block text-sm font-medium text-foreground"
        >
          Questions{" "}
          {compact && (
            <span className="font-normal text-muted-foreground">
              (optional)
            </span>
          )}
        </label>
        <textarea
          id={`${uid}-questions`}
          name="questions"
          rows={compact ? 3 : 4}
          placeholder="Tell us about your business, goals, or anything you'd like to discuss…"
          className="w-full resize-none rounded-xl border border-input bg-background/60 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/70 transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-ring/40"
        />
      </div>

      {sendError && (
        <p
          role="alert"
          className="rounded-xl border border-destructive/40 bg-destructive/5 px-4 py-3 text-center text-sm text-destructive"
        >
          Something went wrong sending your message. Please try again, or email
          team@luxendigital.com.
        </p>
      )}

      {!hideSubmit && (
        <>
          <motion.button
            type="submit"
            disabled={submitting}
            whileHover={{ y: -2 }}
            whileTap={{ y: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="btn-gold group flex w-full items-center justify-center gap-2.5 rounded-full px-10 py-5 text-lg font-bold disabled:opacity-70"
          >
            <RollLabel>{submitting ? "Sending…" : "Send Message"}</RollLabel>
            {!submitting && (
              <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            )}
          </motion.button>

          <p className="text-center text-xs text-muted-foreground">
            No pressure, no obligation. Just a real conversation about your
            business.
          </p>
        </>
      )}
    </form>
  );
}

/** Label, the control, a tick when it's valid, and the message line. The
 *  message is announced politely so screen readers hear it as it changes. */
function FieldShell({
  uid,
  name,
  label,
  error,
  ok,
  children,
}: {
  uid: string;
  name: string;
  label: string;
  error?: string;
  ok: boolean;
  children: ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={`${uid}-${name}`}
        className="mb-2 block text-sm font-medium text-foreground"
      >
        {label}
      </label>
      <div className="relative">
        {children}
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute right-3.5 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full gold-gradient text-[hsl(240_10%_8%)] transition-all duration-200 ${
            ok && !error ? "scale-100 opacity-100" : "scale-50 opacity-0"
          }`}
        >
          <Check className="h-3 w-3" strokeWidth={3} />
        </span>
      </div>
      <p
        id={`${uid}-${name}-msg`}
        aria-live="polite"
        className={`text-xs text-destructive transition-all duration-200 ${
          error ? "mt-1.5 max-h-10 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        {error}
      </p>
    </div>
  );
}

function Field({
  uid,
  name,
  label,
  type = "text",
  placeholder,
  autoComplete,
  value,
  onChange,
  onBlur,
  error,
  ok,
}: {
  uid: string;
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  error?: string;
  ok: boolean;
}) {
  return (
    <FieldShell uid={uid} name={name} label={label} error={error} ok={ok}>
      <input
        id={`${uid}-${name}`}
        name={name}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        aria-invalid={!!error}
        aria-describedby={`${uid}-${name}-msg`}
        className={`w-full rounded-xl border bg-background/60 py-3 pl-4 pr-10 text-sm text-foreground placeholder:text-muted-foreground/70 transition-colors focus:outline-none focus:ring-2 ${
          error
            ? "border-destructive focus:ring-destructive/25"
            : "border-input focus:border-accent focus:ring-ring/40"
        }`}
      />
    </FieldShell>
  );
}
