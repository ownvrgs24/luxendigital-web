import { describe, expect, it } from "vitest";
import { FORMATIONS, fitScale, sampleFormation } from "./formations";

const MAX_P = FORMATIONS.length - 1;

describe("sampleFormation", () => {
  it("lands exactly on each formation at integer progress", () => {
    FORMATIONS.forEach((f, i) => {
      const s = sampleFormation(i);
      expect(s.ext).toBeCloseTo(f.ext, 6);
      expect(s.pitch).toBeCloseTo(f.pitch, 6);
      expect(s.spin).toBeCloseTo(f.spin, 6);
    });
  });

  it("clamps outside the table instead of wrapping or reading undefined", () => {
    expect(sampleFormation(-5)).toEqual(sampleFormation(0));
    expect(sampleFormation(MAX_P + 5)).toEqual(sampleFormation(MAX_P));
  });

  it("is continuous — no jump between neighbouring scroll positions", () => {
    let prev = sampleFormation(0);
    for (let p = 0.01; p <= MAX_P; p += 0.01) {
      const cur = sampleFormation(p);
      // 0.01 of progress is a sliver of one step; nothing may teleport.
      expect(Math.abs(cur.ext - prev.ext)).toBeLessThan(0.05);
      expect(Math.abs(cur.spin - prev.spin)).toBeLessThan(0.05);
      expect(Math.abs(cur.pitch - prev.pitch)).toBeLessThan(1);
      prev = cur;
    }
  });

  it("keeps the cube turning through every formation boundary", () => {
    // The old build morphed over the first 40% of a step then froze, so
    // the cube ticked between poses. Spin must advance everywhere.
    for (let p = 0; p < MAX_P - 0.02; p += 0.05) {
      const d = sampleFormation(p + 0.02).spin - sampleFormation(p).spin;
      expect(d).toBeGreaterThan(0);
    }
  });

  it("is a pure scrub — scrolling back reproduces the way out", () => {
    expect(sampleFormation(3.4)).toEqual(sampleFormation(3.4));
  });
});

describe("fitScale", () => {
  const FIT = 5.0;
  const FALLOFF = 0.75;
  const TRAVEL = 1.78; // motion.travel 178 / 100 × CELL

  const apparent = (ext: number) => {
    const travel = ext * TRAVEL;
    return (1 + 2 * travel) * fitScale(travel, FIT, FALLOFF);
  };

  it("renders a solid cube at the target size", () => {
    expect(apparent(0)).toBeCloseTo(FIT, 6);
  });

  it("keeps the exploded rosette within ~1.5× the solid cube", () => {
    // Unnormalised the span ratio is 4.56×, which is what rendered the
    // solid cube at ~10% of its frame.
    const ratio = apparent(1) / apparent(0);
    expect(ratio).toBeGreaterThan(1);
    expect(ratio).toBeLessThan(1.6);
  });

  it("grows monotonically with extension", () => {
    for (let e = 0; e < 1; e += 0.05) {
      expect(apparent(e + 0.05)).toBeGreaterThan(apparent(e));
    }
  });

  it("stays inside the ~16-cell frame at distance 32 / FOV 28°", () => {
    const frame = 2 * 32 * Math.tan(((28 / 2) * Math.PI) / 180);
    // ×1.45 for the widest projected diagonal as the rosette rotates.
    expect(apparent(1) * 1.45).toBeLessThan(frame);
  });
});
