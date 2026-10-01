// Type-only import: this module is loaded with the main bundle (the booking
// modal starts detection when it opens), so it must not pull in the phone
// library's metadata. The phone input itself ignores an unknown code.
import type { Country as CountryCode } from "react-phone-number-input";

/** LeadConnector's IP lookup — the same one their chat widget uses. */
const GEO_URL =
  "https://services.leadconnectorhq.com/funnels/funnel/geo-location/";
const FALLBACK: CountryCode = "US";
const TIMEOUT_MS = 2500;

const asCountryCode = (code: unknown): CountryCode | undefined => {
  const c = typeof code === "string" ? code.toUpperCase() : "";
  return /^[A-Z]{2}$/.test(c) ? (c as CountryCode) : undefined;
};

/** The region in the browser's language setting, e.g. "en-PH" → "PH".
 *  A rough guess, used only when the IP lookup fails. */
function countryFromLocale(): CountryCode | undefined {
  for (const tag of navigator.languages ?? [navigator.language]) {
    try {
      const region = new Intl.Locale(tag).maximize().region;
      const c = asCountryCode(region);
      if (c) return c;
    } catch {
      // malformed language tag — try the next one
    }
  }
  return undefined;
}

let pending: Promise<CountryCode> | null = null;

/**
 * The visitor's country, for pre-selecting the phone field's country picker.
 * IP lookup first (it reflects where they actually are); browser locale if
 * that fails or times out; the US as a last resort. Runs once per page load —
 * every caller shares the same promise — and never rejects.
 */
export function detectCountry(): Promise<CountryCode> {
  pending ??= (async () => {
    try {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
      const res = await fetch(GEO_URL, { signal: ctrl.signal });
      clearTimeout(timer);
      if (res.ok) {
        const c = asCountryCode((await res.json())?.country);
        if (c) return c;
      }
    } catch {
      // offline, blocked, or timed out — fall through
    }
    return countryFromLocale() ?? FALLBACK;
  })();
  return pending;
}
