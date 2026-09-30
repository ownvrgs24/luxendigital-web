import type { CSSProperties } from "react";

// Every scene stays mounted; only the active one gets `is-on`, which both
// reveals it and starts its CSS animations.
const v = (name: string, value: number) =>
  ({ [name]: value }) as CSSProperties;

const STAR =
  "M12 3l2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3l-5.6 2.9 1.1-6.2L3 9.6l6.2-.9z";
const PHONE_PATH =
  "M5 4h3.5l2 5-2.5 1.5a11 11 0 0 0 5.5 5.5L15 13.5l5 2V19a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z";

export function Scenes({ activeId }: { activeId: string }) {
  const on = (id: string) => `scene${id === activeId ? " is-on" : ""}`;

  return (
    <>
      <div className={on("website")} aria-hidden="true">
        <div className="win card">
          <div className="win__bar">
            <i />
            <i />
            <i />
          </div>
          <div className="win__body">
            <span className="fld">
              <b />
            </span>
            <span className="fld">
              <b />
            </span>
            <span className="btn-mini">Get a quote</span>
          </div>
        </div>
        <div className="toast">
          <i />
          New inquiry from Dana R.
        </div>
      </div>

      <div className={on("google")} aria-hidden="true">
        <div className="serp">
          <div className="serp__q card">
            <svg viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="6" />
              <path d="M20 20l-4.5-4.5" />
            </svg>
            <span className="type">roof repair near me</span>
          </div>
          <div className="serp__ai card">
            <span className="serp__ai-tag">
              <svg viewBox="0 0 24 24">
                <path d="M12 3l2 5 5 2-5 2-2 5-2-5-5-2 5-2 2-5z" />
              </svg>
              AI answer
            </span>
            <p>
              Closest match is <b>Your business</b> — 4.9 stars, open now,
              and they cover your area.
            </p>
          </div>
          <ol className="serp__list">
            <li className="r r--you card">
              <b>Your business</b>
              <small>4.9 stars, open now</small>
            </li>
            <li className="r r--other card">
              <b>Metro Roofing Co.</b>
              <small>3.8 stars</small>
            </li>
          </ol>
        </div>
      </div>

      <div className={on("stay")} aria-hidden="true">
        <div className="col">
          <div className="bcast">
            <span className="ring" />
            <span className="ring" />
            <span className="hub">
              <svg viewBox="0 0 24 24">
                <path d="M3 10v4h4l6 4V6l-6 4H3z" />
                <path d="M16.5 9a4 4 0 0 1 0 6" />
              </svg>
            </span>
            <span className="av">MK</span>
            <span className="av">JT</span>
            <span className="av">RL</span>
            <span className="av">SD</span>
          </div>
          <p className="cap">
            Spring tune-up reminder sent to 214 past customers
          </p>
        </div>
      </div>

      <div className={on("missed")} aria-hidden="true">
        <div className="chat">
          <div className="call card">
            <svg viewBox="0 0 24 24">
              <path d={PHONE_PATH} />
              <path d="M16 3l5 5M21 3l-5 5" />
            </svg>
            <div>
              <b>Missed call</b>
              <small>(555) 204-8812, 2:14 PM</small>
            </div>
          </div>
          <p className="bub bub--out">
            Sorry we missed you. What can we help with today?
          </p>
          <span className="auto">Sent automatically</span>
          <p className="bub bub--in">Need a quote for gutter cleaning</p>
        </div>
      </div>

      <div className={on("inbox")} aria-hidden="true">
        <ul className="stack">
          <li className="stack__head">
            Inbox <span className="badge" />
          </li>
          {[
            ["Text", "Can you come Thursday?"],
            ["Email", "Question about my invoice"],
            ["Facebook", "Do you service Westfield?"],
            ["Voicemail", "Leak under the sink, 0:42"],
          ].map(([src, text], i) => (
            <li key={src} className="msg card" style={v("--d", i)}>
              <span className="src">{src}</span>
              <b>{text}</b>
            </li>
          ))}
        </ul>
      </div>

      <div className={on("phone")} aria-hidden="true">
        <div className="lines">
          <div className="pline card">
            <div>
              <small>Personal</small>
              <b>(555) 318-2270</b>
            </div>
            <span className="tag tag--quiet">After hours off</span>
          </div>
          <div className="pline pline--biz card">
            <div>
              <small>Business line</small>
              <b>(555) 204-8812</b>
            </div>
            <span className="tag tag--ring">
              <svg viewBox="0 0 24 24">
                <path d={PHONE_PATH} />
              </svg>
              Incoming
            </span>
          </div>
        </div>
      </div>

      <div className={on("followup")} aria-hidden="true">
        <div className="track">
          <span className="track__fill" />
          {[
            ["Day 1", "Text"],
            ["Day 3", "Email"],
            ["Day 7", "Reminder"],
            ["Booked", "Job on Jun 14"],
          ].map(([when, what]) => (
            <div key={when} className="node">
              <i />
              <b>{when}</b>
              <small>{what}</small>
            </div>
          ))}
        </div>
      </div>

      <div className={on("reviews")} aria-hidden="true">
        <div className="rev">
          <div className="stars">
            {Array.from({ length: 5 }, (_, i) => (
              <svg key={i} viewBox="0 0 24 24" style={v("--d", i)}>
                <path d={STAR} />
              </svg>
            ))}
          </div>
          <div className="score">
            <b>4.9</b>
            <small>
              from <span className="count" /> reviews
            </small>
          </div>
          <p className="quote">
            &ldquo;Showed up on time and fixed the leak in under an
            hour.&rdquo;
          </p>
        </div>
      </div>
    </>
  );
}
