import { LOGO_URL } from "@/content/brand";
import { Helmet } from "react-helmet-async";

export type SEOHeadProps = {
  title: string;
  description: string;
  /** Path ("/pricing") or absolute URL. Omit on pages with no real URL of
   *  their own (the 404), so they never point search engines elsewhere. */
  canonical?: string;
  ogImage?: string;
  noIndex?: boolean;
  schemaJson?: Record<string, unknown>;
};

const SITE_NAME = "Luxen Digital";
const SITE_URL = "https://luxendigital.com";

/**
 * Centralized SEO head manager. Renders all title, meta, canonical,
 * Open Graph, Twitter, and structured-data tags for a given page.
 * Use at the top of every page, before <main>.
 */
export function SEOHead({
  title,
  description,
  canonical,
  ogImage = LOGO_URL,
  noIndex = false,
  schemaJson,
}: SEOHeadProps) {
  // Pages pass their own headline; the brand is appended once, here. The
  // headline's closing period is dropped so it doesn't sit before the dash.
  const fullTitle = title.includes(SITE_NAME)
    ? title
    : `${title.replace(/\.$/, "")} — ${SITE_NAME}`;
  const canonicalUrl =
    canonical === undefined
      ? undefined
      : canonical.startsWith("http")
        ? canonical
        : `${SITE_URL}${canonical}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      <meta
        name="robots"
        content={noIndex ? "noindex, nofollow" : "index, follow"}
      />

      {/* Open Graph */}
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
      <meta property="og:image" content={ogImage} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {schemaJson && (
        <script type="application/ld+json">{JSON.stringify(schemaJson)}</script>
      )}
    </Helmet>
  );
}
