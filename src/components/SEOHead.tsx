import { Helmet } from "react-helmet-async";

type SEOHeadProps = {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  noIndex?: boolean;
  schemaJson?: Record<string, unknown>;
};

const SITE_NAME = "Luxen Digital";
const DEFAULT_OG_IMAGE =
  "https://vibe.filesafe.space/1788847884528312040/attachments/2376e462-ac48-4064-8fcb-fe02fd5c4f1f.png";

/**
 * Centralized SEO head manager. Renders all title, meta, canonical,
 * Open Graph, Twitter, and structured-data tags for a given page.
 * Use at the top of every page, before <main>.
 */
export function SEOHead({
  title,
  description,
  canonical = "/",
  ogImage = DEFAULT_OG_IMAGE,
  noIndex = false,
  schemaJson,
}: SEOHeadProps) {
  const fullTitle = title === SITE_NAME ? title : `${title} — ${SITE_NAME}`;
  const canonicalUrl = canonical.startsWith("http")
    ? canonical
    : `https://luxendigital.com${canonical === "/" ? "/" : canonical}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph */}
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
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
