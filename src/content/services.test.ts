import { describe, expect, it } from "vitest";
import { SERVICES, BY_SLUG } from "@/components/navbar/services-menu-data";
import { SERVICE_COPY } from "@/content/services";

// The services menu, the /services/:slug route, and this copy file are three
// places that have to agree. When they drift, the symptom is a menu row that
// quietly renders the 404 page — which nobody notices for a month.
describe("service pages", () => {
  it("has page copy for every service in the menu", () => {
    const missing = SERVICES.filter((s) => !SERVICE_COPY[s.id]).map((s) => s.id);
    expect(missing).toEqual([]);
  });

  it("has no copy for services that no longer exist", () => {
    const ids = new Set(SERVICES.map((s) => s.id));
    const orphans = Object.keys(SERVICE_COPY).filter((id) => !ids.has(id));
    expect(orphans).toEqual([]);
  });

  it("gives every service a unique slug", () => {
    expect(Object.keys(BY_SLUG)).toHaveLength(SERVICES.length);
    for (const s of SERVICES) expect(s.slug).toMatch(/^[a-z0-9-]+$/);
  });

  it("only cross-links to services that exist, and never to itself", () => {
    const ids = new Set(SERVICES.map((s) => s.id));
    for (const [id, copy] of Object.entries(SERVICE_COPY)) {
      expect(copy.related).not.toContain(id);
      for (const r of copy.related) expect(ids.has(r), `${id} → ${r}`).toBe(true);
    }
  });
});
