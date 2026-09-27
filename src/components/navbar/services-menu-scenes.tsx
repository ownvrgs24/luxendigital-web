import { useEffect, useRef } from "react";

// ── 8 preview scenes (CSS/HTML only, no images) ────────────────────────
// Each scene loops only while active. When mounted fresh (key change),
// the CSS animations restart automatically.

export function Scene({ id }: { id: string }) {
  switch (id) {
    case "website":
      return (
        <div className="lsm-scn lsm-scn-web">
          <div className="bar">
            <i />
            <i />
            <i />
          </div>
          <div className="field">
            <i />
          </div>
          <div className="field">
            <i />
          </div>
          <div className="field">
            <i />
          </div>
          <div className="btn-go lsm-pressed">Get a quote</div>
          <div className="toast">
            <b>New inquiry</b> from Dana R.
          </div>
        </div>
      );
    case "google":
      return <GoogleScene />;
    case "stay":
      return (
        <div className="lsm-scn lsm-scn-stay">
          <div className="ring r1" />
          <div className="ring r2" />
          <div className="ring r3" />
          <div className="hub">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 9v6h10l5 4V5l-5 4H4Z" />
              <path d="M16 9a3 3 0 0 1 0 6" />
            </svg>
          </div>
          <div className="ppl p1">J</div>
          <div className="ppl p2">M</div>
          <div className="ppl p3">K</div>
          <div className="ppl p4">D</div>
          <div className="cap">
            Spring tune-up reminder sent to 214 past customers
          </div>
        </div>
      );
    case "missed":
      return (
        <div className="lsm-scn lsm-scn-miss">
          <div className="card">
            <svg
              className="ph"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 4a15 15 0 0 0 0 16M19 4a15 15 0 0 1 0 16" />
              <path d="M3 12h18" />
            </svg>
            Missed call · 9:41
          </div>
          <div className="out">
            Sorry we missed you. What can we help with today?
          </div>
          <div className="tag">Sent automatically</div>
          <div className="reply">
            My AC stopped cooling, can someone come today?
          </div>
        </div>
      );
    case "inbox":
      return (
        <div className="lsm-scn lsm-scn-inb">
          <div className="badge">4</div>
          <div className="msg l">
            <div className="src">T</div>Text · Dana
          </div>
          <div className="msg r">
            <div className="src">E</div>Email · Quote
          </div>
          <div className="msg l">
            <div className="src">F</div>FB · Mike
          </div>
          <div className="msg r">
            <div className="src">V</div>Voicemail
          </div>
        </div>
      );
    case "phone":
      return (
        <div className="lsm-scn lsm-scn-ph">
          <div className="line">
            <div className="lab">
              <span className="dot" />
              Personal
            </div>
            <span>After hours off</span>
          </div>
          <div className="line biz">
            <div className="lab">
              <span className="dot" />
              Business line
            </div>
            <span className="tag">Incoming</span>
          </div>
        </div>
      );
    case "followup":
      return (
        <div className="lsm-scn lsm-scn-fu">
          <div className="track">
            <div className="fill" />
          </div>
          <div className="nodes">
            <div className="node">
              <div className="d" />
              <div className="lbl">Day 1 Text</div>
            </div>
            <div className="node">
              <div className="d" />
              <div className="lbl">Day 3 Email</div>
            </div>
            <div className="node">
              <div className="d" />
              <div className="lbl">Day 7 Reminder</div>
            </div>
            <div className="node">
              <div className="d" />
              <div className="lbl">Booked</div>
            </div>
          </div>
        </div>
      );
    case "reviews":
      return (
        <div className="lsm-scn lsm-scn-rev">
          <div className="stars">
            {Array.from({ length: 5 }).map((_, i) => (
              <svg key={i} viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3.5l2.3 4.7 5.2.8-3.8 3.7.9 5.2-4.6-2.4-4.6 2.4.9-5.2L4.5 9l5.2-.8Z" />
              </svg>
            ))}
          </div>
          <div className="count">
            4.9 from <b /> reviews
          </div>
          <div className="quote">
            "On time, fixed it right, and cleaned up. Highly recommend." — Tom
            P.
          </div>
        </div>
      );
    default:
      return null;
  }
}

// Google scene needs a typed search string; runs on mount.
function GoogleScene() {
  const spanRef = useRef<HTMLSpanElement>(null);
  const reduceRef = useRef(
    typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  useEffect(() => {
    const span = spanRef.current;
    if (!span) return;
    const text = "roof repair near me";
    if (reduceRef.current) {
      span.textContent = text;
      return;
    }
    span.textContent = "";
    let i = 0;
    const t = setInterval(() => {
      i += 1;
      span.textContent = text.slice(0, i);
      if (i >= text.length) clearInterval(t);
    }, 90);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="lsm-scn lsm-scn-goo">
      <div className="search">
        <span ref={spanRef} />
        <span className="caret" />
      </div>
      <div className="results">
        <div className="res me">Your business</div>
        <div className="res">Apex Roofing</div>
        <div className="res">Cornerstone Co.</div>
      </div>
    </div>
  );
}
