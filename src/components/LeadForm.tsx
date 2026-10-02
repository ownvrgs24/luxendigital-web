import {
  useEffect,
  useId,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { Check } from "lucide-react";
import { postLeadWebhook, postTrackingEvent, TRACKING } from "@/lib/tracking";
import { detectCountry } from "@/lib/geo";
import { EMAIL } from "@/content/brand";
import PhoneInput, {
  isValidPhoneNumber,
  parsePhoneNumber,
  type Country,
} from "react-phone-number-input";
import "react-phone-number-input/style.css";

// Custom field id for the "Questions" textarea (registered via CRM).
const QUESTIONS_FIELD_ID = "SHWFEtxS1nmmx8O2Sw2l";

type Key = "first_name" | "last_name" | "email" | "phone";
/** Everything the visitor types. `phone` is E.164, e.g. "+639171234567" —
 *  what the input emits and what the CRM gets. */
export type LeadValues = Record<Key | "questions", string>;

const EMPTY_LEAD: LeadValues = {
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  questions: "",
};

/** In the order the fields appear — the first failing one gets focus. */
const KEYS: Key[] = ["first_name", "last_name", "email", "phone"];

const LABELS: Record<Key, string> = {
  first_name: "First Name",
  last_name: "Last Name",
  email: "Email",
  phone: "Phone",
};

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

/** Border + focus ring shared by every input, red while it has an error.
 *  Spelled out in full so Tailwind can find the class names. */
const FRAME = {
  focus: {
    ok: "border-input focus:border-accent focus:ring-ring/40",
    bad: "border-destructive focus:ring-destructive/25",
  },
  "focus-within": {
    ok: "border-input focus-within:border-accent focus-within:ring-ring/40",
    bad: "border-destructive focus-within:ring-destructive/25",
  },
};
const frame = (error: string | undefined, on: keyof typeof FRAME) =>
  FRAME[on][error ? "bad" : "ok"];

type Props = {
  /** The form element's id, so the booking modal's pinned footer button can
   *  submit it through the HTML `form` attribute. */
  id: string;
  /** Stable slug for the CRM workflow's Form filter. Do not change after
   *  publish — rename `formName` instead. */
  formId: string;
  /** Display name, sent to the CRM and as the webhook's `source`. */
  formName: string;
  /** Answers collected before the form (the booking modal's questions),
   *  sent along with the contact details. Keyed by field name. */
  extra?: Record<string, { value: string; label: string }>;
  /** Values to start from, e.g. a restored draft. */
  initial?: LeadValues;
  onChange?: (values: LeadValues) => void;
  onSuccess: () => void;
  onSubmittingChange?: (submitting: boolean) => void;
};

/**
 * The lead form — the last step of the booking modal. Every submission goes
 * to the lead webhook (which starts the CRM workflow) plus a fire-and-forget
 * tracking event; success is only reported once the webhook has accepted it.
 */
export function LeadForm({
  id,
  formId,
  formName,
  extra = {},
  initial = EMPTY_LEAD,
  onChange,
  onSuccess,
  onSubmittingChange,
}: Props) {
  // Prefix for field ids, so labels stay associated however often it mounts.
  const uid = useId();
  const [submitting, setSubmitting] = useState(false);
  const [sendError, setSendError] = useState(false);
  const [values, setValues] = useState(initial);
  // A field shows its error once the visitor has left it (or tried to
  // submit). From then on it re-checks on every keystroke, so the message
  // clears the moment the input is fixed. Untouched fields stay quiet, so
  // nobody is told off halfway through typing their name. Restored values
  // count as touched, so any problem with them shows straight away.
  const [touched, setTouched] = useState<Partial<Record<Key, boolean>>>(() =>
    Object.fromEntries(KEYS.filter((k) => initial[k]).map((k) => [k, true])),
  );
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

  const set = (k: keyof LeadValues, v: string) => {
    const next = { ...values, [k]: v };
    setValues(next);
    onChange?.(next);
  };
  const touch = (k: Key) => setTouched((prev) => ({ ...prev, [k]: true }));

  /** Everything a field needs, keyed off its name. */
  const bind = (k: Key) => ({
    uid,
    name: k,
    error: errorFor(k),
    // A tick as soon as a field is filled in correctly, touched or not.
    ok: Boolean(values[k]) && !problem(k),
  });

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
    const questions = values.questions.trim() || undefined;
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
        formLabels: { ...LABELS, ...extraLabels },
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
          [QUESTIONS_FIELD_ID]: { value: questions, label: "Questions" },
        },
      },
    );

    postLeadWebhook({
      ...contact,
      ...extraValues,
      country: parsePhoneNumber(values.phone)?.country,
      questions,
      source: formName,
    })
      .then(onSuccess)
      .catch(() => setSendError(true))
      .finally(() => setSubmitting(false));
  };

  return (
    <form id={id} onSubmit={onSubmit} noValidate className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          {...bind("first_name")}
          label="First name"
          placeholder="Jane"
          autoComplete="given-name"
          value={values.first_name}
          onChange={(v) => set("first_name", v)}
          onBlur={() => touch("first_name")}
        />
        <Field
          {...bind("last_name")}
          label="Last name"
          placeholder="Doe"
          autoComplete="family-name"
          value={values.last_name}
          onChange={(v) => set("last_name", v)}
          onBlur={() => touch("last_name")}
        />
      </div>

      <Field
        {...bind("email")}
        type="email"
        label="Email"
        placeholder="jane@business.com"
        autoComplete="email"
        value={values.email}
        onChange={(v) => set("email", v)}
        onBlur={() => touch("email")}
      />

      <FieldShell {...bind("phone")} label="Phone number">
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
          className={`lead-phone flex w-full items-center gap-3 rounded-xl border bg-background/60 pl-4 pr-10 transition-colors focus-within:ring-2 ${frame(
            errorFor("phone"),
            "focus-within",
          )}`}
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
          <span className="font-normal text-muted-foreground">(optional)</span>
        </label>
        <textarea
          id={`${uid}-questions`}
          name="questions"
          rows={3}
          value={values.questions}
          onChange={(e) => set("questions", e.target.value)}
          placeholder="Tell us about your business, goals, or anything you'd like to discuss…"
          className={`${INPUT} resize-none px-4 ${frame(undefined, "focus")}`}
        />
      </div>

      {sendError && (
        <p
          role="alert"
          className="rounded-xl border border-destructive/40 bg-destructive/5 px-4 py-3 text-center text-sm text-destructive"
        >
          Something went wrong sending your message. Please try again, or email{" "}
          {EMAIL}.
        </p>
      )}
    </form>
  );
}

const INPUT =
  "w-full rounded-xl border bg-background/60 py-3 text-sm text-foreground placeholder:text-muted-foreground/70 transition-colors focus:outline-none focus:ring-2";

type ShellProps = {
  uid: string;
  name: string;
  label: string;
  error?: string;
  ok: boolean;
};

/** Label, the control, a tick when it's valid, and the message line. The
 *  message is announced politely so screen readers hear it as it changes. */
function FieldShell({
  uid,
  name,
  label,
  error,
  ok,
  children,
}: ShellProps & { children: ReactNode }) {
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
  type = "text",
  placeholder,
  autoComplete,
  value,
  onChange,
  onBlur,
  ...shell
}: ShellProps & {
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
}) {
  const { uid, name, error } = shell;
  return (
    <FieldShell {...shell}>
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
        className={`${INPUT} pl-4 pr-10 ${frame(error, "focus")}`}
      />
    </FieldShell>
  );
}
