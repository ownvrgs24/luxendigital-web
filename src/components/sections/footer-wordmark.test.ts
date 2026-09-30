import { describe, it, expect } from "vitest";
import { letterOffset } from "./Footer";

// One letter box, 100px tall, sitting at x = 500.
const H = 100;
const CX = 500;

describe("letterOffset", () => {
  it("lifts the letter under the pointer the most, and not at all far away", () => {
    const under = letterOffset(CX, CX, H);
    const near = letterOffset(CX + 100, CX, H);
    const far = letterOffset(CX + 1200, CX, H);

    expect(under.y).toBeCloseTo(-H * 0.16);
    expect(near.y).toBeGreaterThan(under.y); // less lift (y is negative up)
    expect(far.y).toBeCloseTo(0);
    expect(under.x).toBeCloseTo(0); // dead centre: lift only, no lean
  });

  it("leans the letter toward the pointer on whichever side it is", () => {
    expect(letterOffset(CX + 120, CX, H).x).toBeGreaterThan(0);
    expect(letterOffset(CX - 120, CX, H).x).toBeLessThan(0);
  });

  it("never shrinks a letter, and stays within its own box", () => {
    for (let px = CX - 900; px <= CX + 900; px += 25) {
      const { x, y, scale } = letterOffset(px, CX, H);
      expect(scale).toBeGreaterThanOrEqual(1);
      expect(Math.abs(x)).toBeLessThan(H);
      expect(y).toBeLessThanOrEqual(0);
    }
  });

  it("is scale-free: doubling the letter doubles the displacement", () => {
    const small = letterOffset(CX + 60, CX, H);
    const big = letterOffset(CX + 120, CX, 2 * H);
    expect(big.y).toBeCloseTo(2 * small.y);
    expect(big.x).toBeCloseTo(2 * small.x);
  });
});
