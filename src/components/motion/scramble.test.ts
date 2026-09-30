import { describe, it, expect } from "vitest";
import { scrambleFrame, scrambleDuration } from "./ScrambleText";

/** A rand that always lands on the first glyph of its pool: "A", "a", "0".
 *  Each frame is then fully determined, so a whole frame can be asserted. */
const fixed = () => 0;

describe("scrambleFrame", () => {
  it("starts as noise and ends on the exact word", () => {
    expect(scrambleFrame("Pricing", 0, fixed)).toBe("A" + "a".repeat(6));
    expect(scrambleFrame("Pricing", 1, fixed)).toBe("Pricing");
  });

  it("matches the case of the character it replaces", () => {
    expect(scrambleFrame("FAQ", 0, fixed)).toBe("AAA"); // all caps stay caps
    expect(scrambleFrame("Pricing", 0, fixed)).toBe("A" + "a".repeat(6));
    expect(scrambleFrame("Our Work", 0, fixed)).toBe("Aaa Aaaa");
    expect(scrambleFrame("hvac", 0, fixed)).toBe("aaaa"); // all lower stays lower
  });

  it("draws each character from the pool its original belongs to", () => {
    const rand = Math.random;
    for (let i = 0; i < 200; i++) {
      // Title case in, title case out — capital first, lowercase tail.
      expect(scrambleFrame("Philosophy", 0, rand)).toMatch(/^[A-Z][a-z]{9}$/);
      expect(scrambleFrame("FAQ", 0, rand)).toMatch(/^[A-Z]{3}$/);
      expect(scrambleFrame("Our Work", 0, rand)).toMatch(
        /^[A-Z][a-z]{2} [A-Z][a-z]{3}$/,
      );
    }
  });

  it("scrambles only as many characters as the string has", () => {
    for (const word of ["FAQ", "Our Work", "team@luxendigital.com"]) {
      for (let p = -0.5; p <= 1.5; p += 0.05) {
        expect(scrambleFrame(word, p, fixed)).toHaveLength(word.length);
      }
    }
  });

  it("leaves spaces and punctuation in place, so the label keeps its shape", () => {
    expect(scrambleFrame("team@luxendigital.com", 0, fixed)).toBe(
      "aaaa@aaaaaaaaaaaa.aaa",
    );
    expect(scrambleFrame("Missed-Call Text Back", 0, fixed)).toBe(
      "Aaaaaa-Aaaa Aaaa Aaaa",
    );
  });

  it("keeps digits as digits", () => {
    expect(scrambleFrame("Top 10", 0, fixed)).toBe("Aaa 00");
  });

  it("resolves left to right and never un-resolves a character", () => {
    // "Philosophy" contains no "a" or "A", so under `fixed` a character
    // equals its original iff it has settled.
    const word = "Philosophy";
    let settled = -1;
    for (let p = 0; p <= 1.0001; p += 0.05) {
      const out = scrambleFrame(word, p, fixed);
      let n = 0;
      while (n < word.length && out[n] === word[n]) n++;
      expect(n).toBeGreaterThanOrEqual(settled); // monotone reveal
      settled = n;
    }
    expect(settled).toBe(word.length);
  });

  it("clamps: past the end stays resolved, before the start stays noise", () => {
    expect(scrambleFrame("FAQ", 5, fixed)).toBe("FAQ");
    expect(scrambleFrame("FAQ", -3, fixed)).toBe("AAA");
  });
});

describe("scrambleDuration", () => {
  it("gives a short word the floor and a long one the ceiling", () => {
    expect(scrambleDuration("X")).toBe(280);
    expect(scrambleDuration("team@luxendigital.com")).toBe(720);
  });

  it("grows with the word in between, and never runs backwards", () => {
    const words = ["FAQ", "Pricing", "Our Work", "Testimonials"];
    const times = words.map(scrambleDuration);
    for (let i = 1; i < times.length; i++) {
      expect(times[i]).toBeGreaterThanOrEqual(times[i - 1]);
    }
  });
});
