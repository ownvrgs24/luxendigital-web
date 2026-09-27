import { useEffect, useRef, useState, useCallback } from "react";
import { ChevronDown, X, Menu as MenuIcon } from "lucide-react";
import { useBooking } from "@/components/BookingModal";
import {
  SERVICES,
  GROUP_ORDER,
  groups,
  ICONS,
  type Service,
} from "./services-menu-data";
import { Scene } from "./services-menu-scenes";

const EASE = "cubic-bezier(0.2,0.8,0.2,1)";

const NAV_LINKS = [
  { label: "Pricing", href: "/pricing" },
  { label: "Testimonials", href: "/testimonials" },
  { label: "Our Works", href: "/work" },
  { label: "About Us", href: "/why-luxen" },
];

function reduceMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function ServicesMenu({ onNavigate }: { onNavigate?: () => void }) {
  const { open: openBooking } = useBooking();
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeId, setActiveId] = useState<string>(SERVICES[0].id);
  const [hovering, setHovering] = useState(false);
  const [copyContent, setCopyContent] = useState<Service>(SERVICES[0]);
  const [copyKey, setCopyKey] = useState(0);
  const [openAcc, setOpenAcc] = useState<string | null>(null);

  const listRef = useRef<HTMLDivElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const openTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hoverOpenedAt = useRef(0);
  const copyAnim = useRef<Animation | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

  // ── sliding highlight ──
  const moveHighlight = useCallback(() => {
    const list = listRef.current;
    const hl = highlightRef.current;
    const active = list?.querySelector<HTMLButtonElement>(
      `[data-id="${activeId}"]`,
    );
    if (!list || !hl || !active) return;
    const listRect = list.getBoundingClientRect();
    const rowRect = active.getBoundingClientRect();
    hl.style.transform = `translate(${rowRect.left - listRect.left}px, ${rowRect.top - listRect.top}px)`;
    hl.style.width = `${rowRect.width}px`;
    hl.style.height = `${rowRect.height}px`;
  }, [activeId]);

  // ── set active service (copy swap via Web Animations API) ──
  const setActive = useCallback(
    (svc: Service, opts?: { instant?: boolean }) => {
      if (svc.id === activeId && !opts?.instant) return;
      setActiveId(svc.id);
      const reduce = reduceMotion();
      const copyEl = copyRef.current;
      if (!copyEl || reduce || opts?.instant) {
        setCopyContent(svc);
        setCopyKey((k) => k + 1);
        return;
      }
      if (copyAnim.current) copyAnim.current.cancel();
      const exit = copyEl.animate(
        [
          { opacity: 1, transform: "translateY(0)" },
          { opacity: 0, transform: "translateY(-12px)" },
        ],
        { duration: 110, easing: EASE, fill: "forwards" },
      );
      exit.onfinish = () => {
        setCopyContent(svc);
        setCopyKey((k) => k + 1);
        // enter on next frame after React paints new content
        requestAnimationFrame(() => {
          copyAnim.current = copyEl.animate(
            [
              { opacity: 0, transform: "translateY(14px)" },
              { opacity: 1, transform: "translateY(0)" },
            ],
            { duration: 300, easing: EASE, fill: "forwards" },
          );
        });
      };
    },
    [activeId],
  );

  // reposition highlight on active / open / resize
  useEffect(() => {
    if (open) requestAnimationFrame(moveHighlight);
  }, [open, activeId, moveHighlight]);

  useEffect(() => {
    const onResize = () => {
      if (open) moveHighlight();
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [open, moveHighlight]);

  // ── open/close with hover intent ──
  const openMenu = useCallback(
    (viaHover: boolean) => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
      if (viaHover) hoverOpenedAt.current = Date.now();
      setActive(SERVICES[0], { instant: true });
      setOpen(true);
      requestAnimationFrame(() => moveHighlight());
    },
    [moveHighlight, setActive],
  );

  const closeMenu = useCallback(() => {
    setOpen(false);
    setHovering(false);
  }, []);

  const onTriggerEnter = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    openTimer.current = setTimeout(() => openMenu(true), 70);
  };
  const onTriggerLeave = () => {
    if (openTimer.current) clearTimeout(openTimer.current);
  };
  const onNavLeave = () => {
    if (openTimer.current) clearTimeout(openTimer.current);
    closeTimer.current = setTimeout(closeMenu, 220);
  };
  const onNavEnter = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };

  const onTriggerClick = () => {
    if (Date.now() - hoverOpenedAt.current < 450) return;
    setOpen((v) => !v);
  };

  // keyboard on trigger
  const onTriggerKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      openMenu(false);
      const firstRow =
        listRef.current?.querySelector<HTMLButtonElement>(".lsm-row");
      firstRow?.focus();
    }
  };

  // keyboard within list
  const onListKeyDown = (e: React.KeyboardEvent) => {
    const rows = Array.from(
      listRef.current?.querySelectorAll<HTMLButtonElement>(".lsm-row") ?? [],
    );
    const idx = rows.indexOf(document.activeElement as HTMLButtonElement);
    if (e.key === "ArrowDown") {
      e.preventDefault();
      rows[(idx + 1) % rows.length]?.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      rows[(idx - 1 + rows.length) % rows.length]?.focus();
    } else if (e.key === "Home") {
      e.preventDefault();
      rows[0]?.focus();
    } else if (e.key === "End") {
      e.preventDefault();
      rows[rows.length - 1]?.focus();
    } else if (e.key === "Escape") {
      e.preventDefault();
      closeMenu();
      triggerRef.current?.focus();
    }
  };

  // close on click outside
  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      const t = e.target as Node;
      if (
        navRef.current?.contains(t) ||
        document.getElementById("lsm-menu")?.contains(t)
      )
        return;
      closeMenu();
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open, closeMenu]);

  // lock body scroll on mobile sheet
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // close on Escape for mobile sheet
  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  return (
    <div className="lsm flex items-center gap-2">
      {/* Desktop: trigger + links */}
      <div
        ref={navRef}
        className="hidden items-center gap-1 md:flex"
        onMouseLeave={onNavLeave}
        onMouseEnter={onNavEnter}
      >
        {/* Services trigger */}
        <button
          ref={triggerRef}
          type="button"
          aria-expanded={open}
          aria-controls="lsm-menu"
          aria-haspopup="true"
          onClick={onTriggerClick}
          onMouseEnter={onTriggerEnter}
          onMouseLeave={onTriggerLeave}
          onKeyDown={onTriggerKeyDown}
          className={`relative flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-semibold transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/70 ${
            open ? "text-amber-300" : "text-gray-200 hover:text-white"
          }`}
        >
          Our Services
          <ChevronDown
            className={`h-3.5 w-3.5 transition-transform duration-300 ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Other nav links close the menu on hover */}
        {NAV_LINKS.map((l) => (
          <a
            key={l.href}
            href={l.href}
            className="rounded-full px-3 py-1.5 text-[13px] font-semibold text-gray-200 transition-colors duration-200 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/70"
            onMouseEnter={() => {
              if (open) closeTimer.current = setTimeout(closeMenu, 80);
            }}
          >
            {l.label}
          </a>
        ))}
      </div>

      {/* ── Desktop mega panel ── */}
      {open && (
        <div
          id="lsm-menu"
          role="region"
          aria-label="Services menu"
          className="lsm fixed left-1/2 top-[88px] z-50 w-[calc(100vw-2.5rem)] max-w-[1000px] -translate-x-1/2"
          style={{ animation: "lsm-open-panel 0.6s var(--lsm-ease) forwards" }}
        >
          <div className="lsm-menu__panel">
            {/* List */}
            <div
              ref={listRef}
              className="lsm-list"
              data-hover={hovering ? "true" : "false"}
              onKeyDown={onListKeyDown}
              onMouseOver={(e) => {
                const row = (e.target as HTMLElement).closest(".lsm-row");
                if (!row) return;
                setHovering(true);
                const svc = SERVICES.find(
                  (s) => s.id === row.getAttribute("data-id"),
                );
                if (svc) setActive(svc);
              }}
              onMouseLeave={() => setHovering(false)}
            >
              <div
                ref={highlightRef}
                className="lsm-highlight"
                data-show={hovering ? "true" : "false"}
              />
              {GROUP_ORDER.map((gName) => (
                <div key={gName} className="lsm-group">
                  <div className="lsm-group__label">{gName}</div>
                  <div className="lsm-group__rows">
                    {groups[gName].map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        data-id={s.id}
                        data-active={activeId === s.id ? "true" : "false"}
                        className="lsm-row"
                        onMouseEnter={() => {
                          setHovering(true);
                          setActive(s);
                        }}
                        onFocus={() => {
                          setHovering(true);
                          setActive(s);
                        }}
                        onClick={() => {
                          setActive(s, { instant: true });
                          onNavigate?.();
                          closeMenu();
                          window.location.hash = "#features";
                        }}
                      >
                        <span
                          className="lsm-row__icon"
                          dangerouslySetInnerHTML={{ __html: ICONS[s.id] }}
                        />
                        <span className="lsm-row__title">{s.title}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Preview */}
            <div className="lsm-preview">
              <div className="lsm-screen">
                {/* remount scene per active service to restart CSS animations */}
                <div className="lsm-scene" key={activeId}>
                  <Scene id={activeId} />
                </div>
              </div>
              <div ref={copyRef} className="lsm-preview__copy" key={copyKey}>
                <div className="lsm-preview__group">{copyContent.group}</div>
                <h3 className="lsm-preview__title">{copyContent.title}</h3>
                <p className="lsm-preview__desc">{copyContent.desc}</p>
                <a
                  className="lsm-preview__link"
                  href="#features"
                  onClick={() => {
                    closeMenu();
                    onNavigate?.();
                  }}
                >
                  How it works
                </a>
              </div>
            </div>

            {/* Footer */}
            <div className="lsm-menu__footer">
              <p>Every service runs on one connected system.</p>
              <a
                href="#features"
                onClick={() => {
                  closeMenu();
                  onNavigate?.();
                }}
              >
                See all services
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ── Mobile hamburger + sheet ── */}
      <button
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white md:hidden hover:bg-white/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/70"
        onClick={() => setMobileOpen((v) => !v)}
        aria-label="Toggle menu"
        aria-expanded={mobileOpen}
      >
        {mobileOpen ? (
          <X className="h-4 w-4" />
        ) : (
          <MenuIcon className="h-4 w-4" />
        )}
      </button>

      {mobileOpen && (
        <div
          className="lsm fixed inset-x-0 top-[68px] bottom-0 z-50 overflow-y-auto bg-[#141210] p-5 md:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          style={{ animation: "lsm-sheet-in 0.42s var(--lsm-ease)" }}
        >
          <h2 className="text-3xl font-extrabold tracking-tight mb-4">
            Services
          </h2>
          <div>
            {GROUP_ORDER.map((gName) => (
              <div key={gName} className="lsm-sheet__group">
                <div className="lsm-sheet__glabel">{gName}</div>
                {groups[gName].map((s) => {
                  const isOpen = openAcc === s.id;
                  return (
                    <div
                      key={s.id}
                      className="lsm-acc"
                      data-open={isOpen ? "true" : "false"}
                    >
                      <button
                        className="lsm-acc__head"
                        aria-expanded={isOpen}
                        onClick={() => setOpenAcc(isOpen ? null : s.id)}
                      >
                        <span
                          className="lsm-acc__icon"
                          dangerouslySetInnerHTML={{ __html: ICONS[s.id] }}
                        />
                        <span>{s.title}</span>
                        <ChevronDown className="lsm-acc__chev" />
                      </button>
                      <div className="lsm-acc__body">
                        <div className="lsm-acc__inner">
                          <div className="lsm-acc__stage">
                            {isOpen && (
                              <div className="lsm-screen lsm-screen--mobile">
                                <div
                                  className="lsm-scene"
                                  key={`${s.id}-${copyKey}`}
                                >
                                  <Scene id={s.id} />
                                </div>
                              </div>
                            )}
                            <p className="lsm-preview__desc">{s.desc}</p>
                            <a
                              className="lsm-preview__link"
                              href="#features"
                              onClick={() => {
                                setMobileOpen(false);
                                onNavigate?.();
                              }}
                            >
                              How it works
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* bottom nav */}
          <div className="mt-6 border-t border-white/10 pt-5 flex flex-col gap-1">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => {
                  setMobileOpen(false);
                  onNavigate?.();
                }}
                className="py-3.5 text-base font-semibold text-gray-200 hover:text-white"
              >
                {l.label}
              </a>
            ))}
            <button
              onClick={() => {
                setMobileOpen(false);
                openBooking();
              }}
              className="mt-3 inline-flex justify-center rounded-xl px-5 py-3.5 text-base font-bold"
              style={{ background: "#f4b92c", color: "#1a1405" }}
            >
              Let&apos;s Talk
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
