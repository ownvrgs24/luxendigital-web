import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowRight, MessageSquare, Check } from "lucide-react";
import "./who-we-help-phone.css";

const ease = [0.22, 1, 0.36, 1] as const;

export type ChatMsg = {
  type: "ai" | "customer" | "system";
  text: string;
  time?: string;
};

// ── iOS status bar icons (inline SVG, no images/fonts/emoji) ───────────
function SignalIcon() {
  return (
    <svg
      width="1.1em"
      height="0.75em"
      viewBox="0 0 18 12"
      fill="currentColor"
      aria-hidden="true"
    >
      <rect x="0" y="8" width="3" height="4" rx="1" />
      <rect x="5" y="5.5" width="3" height="6.5" rx="1" />
      <rect x="10" y="3" width="3" height="9" rx="1" />
      <rect x="15" y="0.5" width="3" height="11.5" rx="1" />
    </svg>
  );
}
function WifiIcon() {
  return (
    <svg
      width="1.05em"
      height="0.75em"
      viewBox="0 0 16 12"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M8 11.2a1.1 1.1 0 1 0 0-2.2 1.1 1.1 0 0 0 0 2.2Z" />
      <path d="M3.2 6.4a6.8 6.8 0 0 1 9.6 0l-1.3 1.3a5 5 0 0 0-7 0L3.2 6.4Z" />
      <path d="M0.6 3.8a10.4 10.4 0 0 1 14.8 0l-1.3 1.3a8.6 8.6 0 0 0-12.2 0L0.6 3.8Z" />
    </svg>
  );
}
function BatteryIcon() {
  return (
    <svg
      width="2em"
      height="0.95em"
      viewBox="0 0 26 12"
      fill="none"
      aria-hidden="true"
    >
      <rect
        x="0.5"
        y="0.5"
        width="22"
        height="11"
        rx="3"
        stroke="currentColor"
        strokeOpacity="0.4"
      />
      <rect x="2" y="2" width="17.6" height="8" rx="1.8" fill="currentColor" />
      <rect
        x="24"
        y="3.5"
        width="2"
        height="5"
        rx="1"
        fill="currentColor"
        fillOpacity="0.4"
      />
    </svg>
  );
}

// ── Chat phone (module-level component) ────────────────────────────────
// The phone frame has an explicit, content-independent size so it never
// shrinks on load. The chat area is a fixed-height flex child; messages
// never change the phone's outer dimensions. Status bar + Dynamic Island
// scale with the phone via container query units (cqw).
export function ChatPhone({
  messages,
  visibleCount,
  typing,
  reduce,
  islandExpanded,
}: {
  messages: ChatMsg[];
  visibleCount: number;
  typing: boolean;
  reduce: boolean | null;
  islandExpanded: boolean;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: reduce ? "auto" : "smooth" });
  }, [visibleCount, typing, reduce]);

  const visible = messages.slice(0, visibleCount);

  return (
    <div
      className="phone-frame"
      style={{
        // Width is fixed and explicit; height comes only from the ratio.
        // Fixes the small-on-load bug (content-based sizing).
        ["--phone-w" as string]: "clamp(260px, 80vw, 340px)",
        ["--phone-ratio" as string]: "9 / 16",
        width: "var(--phone-w)",
        aspectRatio: "var(--phone-ratio)",
        height: "auto",
        flex: "none",
        containerType: "inline-size",
      }}
    >
      {/* Titanium frame */}
      <div className="phone-titanium">
        {/* Black bezel */}
        <div className="phone-bezel">
          {/* Screen */}
          <div className="phone-screen">
            {/* Dynamic Island — solid black pill, scales with phone */}
            <div
              className={`phone-island ${islandExpanded && !reduce ? "island-expanded" : ""}`}
              aria-hidden="true"
            >
              {islandExpanded && !reduce && (
                <>
                  <Check className="island-check" />
                  <span className="island-text">Booked 2:00 PM</span>
                </>
              )}
            </div>

            {/* Status bar — time left, icons right */}
            <div className="phone-status" aria-hidden="true">
              <span className="phone-time">9:41</span>
              <div className="phone-status-icons">
                <SignalIcon />
                <WifiIcon />
                <BatteryIcon />
              </div>
            </div>

            {/* Chat header */}
            <div className="phone-chat-header">
              <div className="phone-avatar">
                <MessageSquare className="phone-avatar-icon" />
              </div>
              <div>
                <p className="phone-chat-name">Luxen AI Assistant</p>
                <p className="phone-chat-status">
                  <span className="phone-dot" />
                  Online now
                </p>
              </div>
            </div>

            {/* Message list — fixed-height flex child, scrollbar hidden */}
            <div ref={scrollRef} className="phone-messages no-scrollbar">
              <div className="phone-msg-list">
                {visible.map((msg, i) => {
                  const prev = i > 0 ? visible[i - 1] : null;
                  const showTime =
                    !!msg.time && (!prev || prev.time !== msg.time);

                  if (msg.type === "system") {
                    return (
                      <div key={i} className="phone-system-row">
                        <div className="phone-system-pill">{msg.text}</div>
                      </div>
                    );
                  }

                  const isAi = msg.type === "ai";
                  return (
                    <div
                      key={i}
                      className={`phone-msg-col ${isAi ? "phone-ai" : "phone-cust"}`}
                    >
                      {showTime && (
                        <span className="phone-msg-time">{msg.time}</span>
                      )}
                      <motion.div
                        initial={
                          reduce ? false : { opacity: 0, y: 8, scale: 0.96 }
                        }
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.28, ease }}
                        className={`phone-bubble ${isAi ? "phone-bubble-ai" : "phone-bubble-cust"}`}
                      >
                        {msg.text}
                      </motion.div>
                    </div>
                  );
                })}

                {/* Typing indicator — only right before an AI reply */}
                {typing && (
                  <div className="phone-typing-wrap">
                    <div className="phone-typing phone-bubble-ai">
                      {[0, 1, 2].map((d) => (
                        <span key={d} className="typing-dot" />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Input bar */}
            <div className="phone-input-bar">
              <div className="phone-input-field">
                <span>Type a message...</span>
              </div>
              <div className="phone-send-btn">
                <ArrowRight className="phone-send-icon" />
              </div>
            </div>

            {/* Home indicator */}
            <div className="phone-home-bar" aria-hidden="true" />
          </div>
        </div>
      </div>
    </div>
  );
}
