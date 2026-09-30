import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * Three alphabets, picked to match the character being replaced rather than
 * to be one pool of noise. A capital is replaced by a capital, a lowercase
 * letter by a lowercase one, a digit by a digit — so "Pricing" scrambles
 * to "Xqwbzly", never to "XQWBZLY", and the word keeps its own silhouette
 * of ascenders and x-height the whole way through.
 */
const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWER = "abcdefghijklmnopqrstuvwxyz";
const DIGITS = "0123456789";

/**
 * The stand-in for one character. Anything that is not a letter or a digit
 * — a space, an `@`, a hyphen, the dot in a domain — is left exactly where
 * it is, so the label's punctuation reads as itself from the first frame.
 */
function noiseFor(ch: string, rand: () => number) {
  const pool = UPPER.includes(ch)
    ? UPPER
    : LOWER.includes(ch)
      ? LOWER
      : DIGITS.includes(ch)
        ? DIGITS
        : "";
  if (!pool) return ch;
  return pool[Math.min(pool.length - 1, Math.floor(rand() * pool.length))];
}

/** How long a single character stays unresolved, then the floor and ceiling
 *  for a whole word — a long label must not outlast the pointer's patience. */
const PER_CHAR_MS = 42;
const MIN_MS = 280;
const MAX_MS = 720;
/** Gap between glyph re-rolls. Every frame reads as flicker; this reads as type. */
const STEP_MS = 45;

/**
 * One frame of the scramble, as a pure function of how far the word has
 * resolved. `progress` runs 0 → 1: characters left of the reveal head are
 * already their real selves, everything right of it is still noise.
 *
 * Every character maps to exactly one character, so a frame is always the
 * same length as the label and always in the same case — the scramble is a
 * substitution over the real string, never a re-generation of it.
 *
 * `rand` is injectable so the behaviour can be pinned down in a test.
 */
export function scrambleFrame(
  text: string,
  progress: number,
  rand: () => number = Math.random,
): string {
  const head = progress * text.length;
  let out = "";
  for (let i = 0; i < text.length; i++) {
    out += i < head ? text[i] : noiseFor(text[i], rand);
  }
  return out;
}

/** Total time a word of this length takes to settle. */
export function scrambleDuration(text: string) {
  return Math.min(MAX_MS, Math.max(MIN_MS, text.length * PER_CHAR_MS));
}

/**
 * A word that shatters into noise and rebuilds itself into the same word
 * when you hover the link it sits in.
 *
 * Two things make it safe to drop into a layout. The animated copy is
 * absolutely positioned over an invisible copy of the real text, so the
 * scramble can never nudge a neighbour or reflow the column. And the text
 * an assistive reader announces is a separate, stable `sr-only` copy — the
 * noise is `aria-hidden`, so nobody hears "Xqwbz" read out. That copy is
 * `select-none` and the reserver is `visibility: hidden`, so dragging over
 * a label still copies the word exactly once, not three times over.
 *
 * The trigger is bound to the nearest enclosing link or button rather than
 * to this span, so the whole control is the hover target — including its
 * padding — and keyboard focus fires it too. That keeps the call site a
 * plain `<a><ScrambleText text="About" /></a>`.
 */
export function ScrambleText({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const host = useRef<HTMLSpanElement>(null);
  const raf = useRef(0);
  const [out, setOut] = useState(text);

  // A new label mid-flight would otherwise keep resolving to the old one.
  useEffect(() => setOut(text), [text]);

  const run = useCallback(() => {
    if (reduce) return;
    cancelAnimationFrame(raf.current);
    const duration = scrambleDuration(text);
    const start = performance.now();
    let last = -STEP_MS;

    const step = (now: number) => {
      const elapsed = now - start;
      if (elapsed >= duration) {
        setOut(text); // always land exactly on the real word
        return;
      }
      if (elapsed - last >= STEP_MS) {
        last = elapsed;
        setOut(scrambleFrame(text, elapsed / duration));
      }
      raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
  }, [reduce, text]);

  useEffect(() => {
    const target = host.current?.closest("a, button") ?? host.current;
    if (!target) return;
    // `pointerenter` does not bubble, so it is bound on the control itself;
    // `focusin` is the bubbling twin of focus and covers the keyboard.
    target.addEventListener("pointerenter", run);
    target.addEventListener("focusin", run);
    return () => {
      cancelAnimationFrame(raf.current);
      target.removeEventListener("pointerenter", run);
      target.removeEventListener("focusin", run);
    };
  }, [run]);

  return (
    <span
      ref={host}
      className={`relative inline-block whitespace-nowrap ${className}`}
    >
      <span className="sr-only select-none">{text}</span>
      <span aria-hidden="true" className="invisible">
        {text}
      </span>
      <span aria-hidden="true" className="absolute left-0 top-0">
        {out}
      </span>
    </span>
  );
}
