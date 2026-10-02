import { useEffect, useRef, useState } from "react";
import { Star, ExternalLink } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useInView } from "@/hooks/use-in-view";

const SCRIPT_SRC =
  "https://crm.luxendigital.com/reputation/assets/review-widget.js";
const WIDGET_SRC =
  "https://crm.luxendigital.com/reputation/widgets/review_widget/myHH3DWgv1jOQx1drQO9";

/** Height the frame holds before the widget sizes itself. Measured against
 *  what the widget actually settles at, so the swap is a small adjustment
 *  rather than the page collapsing a few hundred pixels under the reader. */
const RESERVED_HEIGHT = 400;
/** Below this the frame is still the browser's 150px default, not reviews. */
const SIZED_HEIGHT = 240;
/** Loaded but never resized — show it anyway rather than hide working content. */
const SETTLE_MS = 2500;
/** Nothing at all by now: blocked, offline, or the widget is down. */
const GIVE_UP_MS = 12000;

/** One tag for the whole app, however many embeds mount. */
let scriptLoad: Promise<void> | null = null;

function loadWidgetScript(): Promise<void> {
  if (scriptLoad) return scriptLoad;
  scriptLoad = new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${SCRIPT_SRC}"]`)) {
      resolve();
      return;
    }
    const el = document.createElement("script");
    el.src = SCRIPT_SRC;
    el.async = true;
    el.onload = () => resolve();
    el.onerror = () => reject(new Error("review widget script failed to load"));
    document.head.appendChild(el);
  });
  return scriptLoad;
}

type Heading = { eyebrow: string; title: string; subtitle?: string };

/**
 * Live reviews, straight from the CRM's reputation widget.
 *
 * The widget is a third-party iframe that sizes itself from the inside once
 * it has rendered, so there is a stretch where it is present but empty. The
 * skeleton covers exactly that stretch, at exactly the reserved height, so
 * the section never collapses and then snaps open under the reader.
 *
 * Pass `heading` on pages whose own <h1> is about something else. On the
 * reviews page the hero already introduces it, so it is left off.
 */
export function Reviews({ heading }: { heading?: Heading }) {
  const { ref, inView } = useInView<HTMLDivElement>({
    // Start booting the widget a screen early — by the time it scrolls into
    // view the reviews are usually already there.
    rootMargin: "400px 0px",
    threshold: 0,
  });

  return (
    <section
      id="reviews"
      ref={ref}
      className="relative scroll-mt-24 overflow-hidden border-t border-border/60 bg-secondary/40 py-20 sm:py-28"
    >
      <div className="pointer-events-none absolute inset-0 -z-10 bg-dots opacity-60 mask-fade-b" />

      <div className="mx-auto max-w-6xl px-6 lg:px-10">
        {heading && (
          <Reveal className="mx-auto mb-10 max-w-2xl text-center">
            <SectionHeading center {...heading} />
          </Reveal>
        )}

        <Reveal delay={heading ? 0.1 : 0}>
          <div className="relative overflow-hidden rounded-[2rem] border border-border bg-background p-3 shadow-float sm:p-5">
            {/* gold hairline, the same one the pricing cards wear */}
            <div className="absolute inset-x-0 top-0 h-1 gold-gradient" />
            <LiveBadge />
            <ReviewsEmbed armed={inView} />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/** Small "these are real and current" marker above the frame. */
function LiveBadge() {
  return (
    <div className="flex items-center justify-center gap-2 pb-3 pt-4 text-xs font-medium text-muted-foreground">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
      </span>
      Verified reviews, live from our review platform
    </div>
  );
}

type Status = "waiting" | "loading" | "ready" | "failed";

function ReviewsEmbed({ armed }: { armed: boolean }) {
  const [status, setStatus] = useState<Status>("waiting");
  const frameRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!armed) return;
    setStatus("loading");

    const frame = frameRef.current;
    if (!frame) return;

    let settled = false;
    const settle = (next: "ready" | "failed") => {
      if (settled) return;
      settled = true;
      setStatus(next);
    };

    // The widget messages its height out once it has painted. That resize is
    // the only honest signal that reviews — not an empty frame — are there.
    const observer = new MutationObserver(() => {
      const sized = Number(frame.getAttribute("height")) || frame.offsetHeight;
      if (sized >= SIZED_HEIGHT && sized !== RESERVED_HEIGHT) settle("ready");
    });
    observer.observe(frame, {
      attributes: true,
      attributeFilter: ["style", "height"],
    });

    let settleTimer: ReturnType<typeof setTimeout>;
    const onLoad = () => {
      settleTimer = setTimeout(() => settle("ready"), SETTLE_MS);
    };
    const onError = () => settle("failed");
    frame.addEventListener("load", onLoad);
    frame.addEventListener("error", onError);

    const giveUp = setTimeout(() => settle("failed"), GIVE_UP_MS);

    // The script is appended after this render, so the iframe it scans for is
    // already in the document.
    loadWidgetScript().catch(() => settle("failed"));

    return () => {
      observer.disconnect();
      frame.removeEventListener("load", onLoad);
      frame.removeEventListener("error", onError);
      clearTimeout(settleTimer);
      clearTimeout(giveUp);
    };
  }, [armed]);

  if (status === "failed") return <ReviewsFallback />;

  const ready = status === "ready";

  return (
    <div
      className="relative"
      style={{ minHeight: ready ? undefined : RESERVED_HEIGHT }}
    >
      {armed && (
        <iframe
          ref={frameRef}
          className="lc_reviews_widget w-full border-0 transition-opacity duration-500"
          src={WIDGET_SRC}
          title="Customer reviews for Luxen Digital"
          scrolling="no"
          loading="lazy"
          // The widget sizes itself by writing the `height` ATTRIBUTE, which
          // an inline style.height would silently outrank — that is how this
          // frame ended up 212px taller than its own content. So the reserved
          // height goes on the attribute (which the widget overwrites) and on
          // the wrapper's min-height (which is dropped once it has sized), and
          // style never mentions height at all.
          height={RESERVED_HEIGHT}
          style={{
            minWidth: "100%",
            width: "100%",
            opacity: ready ? 1 : 0,
          }}
        />
      )}

      {!ready && (
        <div
          className="absolute inset-0"
          aria-hidden="true"
          // The live region below is what actually announces the wait; the
          // decorative blocks would only be noise to a screen reader.
        >
          <ReviewsSkeleton />
        </div>
      )}

      <span className="sr-only" role="status" aria-live="polite">
        {ready ? "Reviews loaded." : "Loading customer reviews…"}
      </span>
    </div>
  );
}

/**
 * A skeleton shaped like the thing it is standing in for — a rating summary
 * over a row of review cards. Generic grey slabs tell you the page is slow;
 * this tells you what is about to arrive.
 */
function ReviewsSkeleton() {
  return (
    <div className="flex flex-col gap-6 p-2 sm:p-4">
      {/* summary bar */}
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-5">
        <div className="shimmer h-8 w-20 rounded-lg" />
        <div className="flex gap-1.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className="h-5 w-5 text-muted-foreground/25" />
          ))}
        </div>
        <div className="shimmer h-3.5 w-44 rounded-full" />
      </div>

      {/* review cards */}
      <div className="grid items-start gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, card) => (
          <div
            key={card}
            className={`flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 ${
              card === 2 ? "hidden lg:flex" : ""
            } ${card === 1 ? "hidden sm:flex" : ""}`}
          >
            <div className="flex items-center gap-3">
              <div className="shimmer h-10 w-10 shrink-0 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="shimmer h-3 w-2/3 rounded-full" />
                <div className="shimmer h-2.5 w-1/3 rounded-full" />
              </div>
            </div>
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className="h-3.5 w-3.5 text-muted-foreground/25"
                />
              ))}
            </div>
            <div className="space-y-2.5">
              <div className="shimmer h-2.5 w-full rounded-full" />
              <div className="shimmer h-2.5 w-[92%] rounded-full" />
              <div className="shimmer h-2.5 w-[78%] rounded-full" />
              <div className="shimmer h-2.5 w-[60%] rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** The embed never arrived. Say so plainly and hand over a working door. */
function ReviewsFallback() {
  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-card px-6 py-16 text-center">
      <div className="flex gap-1.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className="h-5 w-5 fill-accent text-accent" />
        ))}
      </div>
      <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
        Our reviews are hosted on our review platform and couldn&rsquo;t be
        loaded here — an ad blocker or a dropped connection will do it.
      </p>
      <a
        href={WIDGET_SRC}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-full border border-accent/40 px-5 py-2.5 text-sm font-semibold text-foreground transition-colors duration-300 hover:bg-accent-soft"
      >
        Read them directly
        <ExternalLink className="h-4 w-4" />
      </a>
    </div>
  );
}
