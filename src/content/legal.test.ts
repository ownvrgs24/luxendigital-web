import { describe, expect, it } from "vitest";
import { LEGAL_DOCS, LEGAL_BY_SLUG } from "@/content/legal";

// The footer links to every one of these by slug, and /legal/:slug renders
// whatever it finds. A typo here is a 404 sitting in the footer of every page
// on the site — and a dead privacy-policy link is the kind of broken that
// matters more than a dead blog link.
describe("legal pages", () => {
  it("gives every document a unique, URL-safe slug", () => {
    const slugs = LEGAL_DOCS.map((d) => d.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const s of slugs) expect(s).toMatch(/^[a-z0-9-]+$/);
  });

  it("resolves every slug through the lookup the route uses", () => {
    for (const d of LEGAL_DOCS) expect(LEGAL_BY_SLUG[d.slug]).toBe(d);
  });

  it("gives every document a nav label, title, summary, and body", () => {
    for (const d of LEGAL_DOCS) {
      expect(d.nav, d.slug).toBeTruthy();
      expect(d.title, d.slug).toBeTruthy();
      expect(d.summary, d.slug).toBeTruthy();
      expect(d.blocks.length, d.slug).toBeGreaterThan(0);
    }
  });

  it("gives every document a parseable updated date", () => {
    for (const d of LEGAL_DOCS) {
      expect(d.updated, d.slug).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(Number.isNaN(Date.parse(d.updated)), d.slug).toBe(false);
    }
  });

  it("leaves no empty blocks to render as blank space", () => {
    for (const d of LEGAL_DOCS) {
      for (const b of d.blocks) {
        if (b.kind === "list") {
          expect(b.items.length, d.slug).toBeGreaterThan(0);
          for (const i of b.items) expect(i.trim(), d.slug).toBeTruthy();
        } else {
          expect(b.text.trim(), d.slug).toBeTruthy();
        }
      }
    }
  });

  // The pages people look for by name have to exist under the names they
  // expect, because these are the ones linked from the compliance line.
  it("covers the disclosures the footer points at", () => {
    for (const slug of ["privacy", "terms", "sms", "accessibility"]) {
      expect(LEGAL_BY_SLUG[slug], slug).toBeDefined();
    }
  });
});
