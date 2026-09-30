import { describe, expect, it } from "vitest";
import { PLANS, PLAN_FEATURES, type PlanId } from "@/content/pricing";
import { FAQS, PRICING_FAQ_IDS, faqsById } from "@/content/faq";

// The pricing page is the page where a mistake costs money. Everything it
// renders is pulled from another list by id or by name, and every one of
// those lookups fails silently — a dropped quote, an empty accordion, a
// feature row nobody can buy. These tests are the thing that notices.

describe("plans", () => {
  it("gives every plan a working checkout link", () => {
    for (const p of PLANS) {
      expect(p.href, p.name).toMatch(/^https:\/\//);
    }
  });

  it("has exactly one featured plan", () => {
    expect(PLANS.filter((p) => p.featured)).toHaveLength(1);
  });

  it("keeps the display price and the structured-data price in step", () => {
    for (const p of PLANS) {
      expect(p.price, p.name).toContain(String(p.priceFrom));
    }
  });

  it("gives every plan a distinct id", () => {
    expect(new Set(PLANS.map((p) => p.id)).size).toBe(PLANS.length);
  });
});

describe("feature matrix", () => {
  const ids = new Set<PlanId>(PLANS.map((p) => p.id));

  it("only marks features as included in plans that exist", () => {
    for (const f of PLAN_FEATURES) {
      expect(f.includedIn.length, f.label).toBeGreaterThan(0);
      for (const id of f.includedIn) expect(ids.has(id), f.label).toBe(true);
    }
  });

  it("lists no feature twice", () => {
    const labels = PLAN_FEATURES.map((f) => f.label);
    expect(new Set(labels).size).toBe(labels.length);
  });

  // The cards are the comparison: the cheaper plan's dimmed rows are the
  // argument for the dearer one. If every row were shared there would be
  // nothing to upgrade to, and the dimmed block would vanish.
  it("leaves the entry plan something to upgrade to", () => {
    const upgrades = PLAN_FEATURES.filter(
      (f) => !f.includedIn.includes("essential"),
    );
    expect(upgrades.length).toBeGreaterThan(0);
  });

  it("includes every feature in the featured plan", () => {
    const featured = PLANS.find((p) => p.featured)!;
    const missing = PLAN_FEATURES.filter(
      (f) => !f.includedIn.includes(featured.id),
    ).map((f) => f.label);
    expect(missing).toEqual([]);
  });
});

describe("pricing page copy pulled from shared lists", () => {
  it("resolves every FAQ id the pricing page asks for", () => {
    expect(faqsById(PRICING_FAQ_IDS)).toHaveLength(PRICING_FAQ_IDS.length);
  });

  it("gives every FAQ a unique id", () => {
    expect(new Set(FAQS.map((f) => f.id)).size).toBe(FAQS.length);
  });
});
