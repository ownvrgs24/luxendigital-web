import { describe, expect, it } from "vitest";
import { PROJECTS } from "@/content/work";

// The work grid is a 12-column layout hand-tuned per card. Nothing warns you
// when a row stops adding to 12 — the grid just silently reflows and leaves a
// gap down the right-hand side, which reads as a rendering bug.
describe("work grid", () => {
  const widthOf = (span: string) => Number(span.replace("lg:col-span-", ""));

  it("uses a parseable column span for every project", () => {
    for (const p of PROJECTS) {
      expect(p.span, p.title).toMatch(/^lg:col-span-(\d|1[0-2])$/);
    }
  });

  it("fills every row to twelve columns", () => {
    const widths = PROJECTS.map((p) => widthOf(p.span));
    const total = widths.reduce((a, b) => a + b, 0);
    expect(total % 12, `total is ${total}`).toBe(0);

    // Walk the rows: a card must never straddle a row boundary.
    let row = 0;
    for (const [i, w] of widths.entries()) {
      row += w;
      expect(row, `project ${i + 1} overflows its row`).toBeLessThanOrEqual(12);
      if (row === 12) row = 0;
    }
    expect(row, "last row is short").toBe(0);
  });

  it("gives every project a title, image, blurb, and tags", () => {
    for (const p of PROJECTS) {
      expect(p.title).toBeTruthy();
      expect(p.img, p.title).toMatch(/^https:\/\//);
      expect(p.blurb, p.title).toBeTruthy();
      expect(p.tags.length, p.title).toBeGreaterThan(0);
    }
  });

  it("gives every project a distinct title", () => {
    const titles = PROJECTS.map((p) => p.title);
    expect(new Set(titles).size).toBe(titles.length);
  });
});
