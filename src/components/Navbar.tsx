import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { useLocation } from "react-router-dom";
import { useBooking } from "@/components/BookingModal";
import {
  SERVICES,
  GROUP_ORDER,
  groups,
  ICONS,
  type Service,
} from "@/components/navbar/services-menu-data";
import { Scenes } from "@/components/navbar/services-menu-scenes";
import "@/components/navbar/navbar.css";

const LOGO_URL =
  "https://vibe.filesafe.space/1788847884528312040/attachments/2376e462-ac48-4064-8fcb-fe02fd5c4f1f.png";

const EASE = "cubic-bezier(.2,.8,.2,1)";
const MOBILE = "(max-width: 860px)";

const NAV_LINKS = [
  { label: "Pricing", href: "/pricing" },
  { label: "Our Works", href: "/work" },
  { label: "About Us", href: "/why-luxen" },
];

/** Does `href` name the page we're on? Sub-paths count, so /services/hvac
 *  lights up the services trigger the same way /work lights up its link. */
const matches = (pathname: string, href: string) =>
  pathname === href || pathname.startsWith(`${href}/`);

/** Routes whose first screen is dark enough for the transparent bar to sit on
 *  top of it. Add a route here only when its hero genuinely fills the top of
 *  the viewport — otherwise the light nav text lands on a white page. */
const DARK_HERO_ROUTES = new Set(["/", "/why-luxen"]);

const isMobile = () => window.matchMedia(MOBILE).matches;
const isReduced = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const Chevron = ({ className }: { className: string }) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
    <path d="M6 9l6 6 6-6" />
  </svg>
);

const Roll = ({ label }: { label: string }) => (
  <span className="roll">
    <span>{label}</span>
    <span aria-hidden="true">{label}</span>
  </span>
);

/** Screen + copy. Rendered once for the desktop aside, and once inside
 *  whichever mobile drawer is open (the CSS shows only one per breakpoint). */
function Stage({
  scene,
  copy,
  copyRef,
  onLink,
}: {
  scene: string;
  copy: Service;
  copyRef?: React.Ref<HTMLDivElement>;
  onLink: () => void;
}) {
  return (
    <div className="stage">
      <div className="stage__screen">
        <Scenes activeId={scene} />
      </div>
      <div className="stage__copy" ref={copyRef}>
        <p className="stage__group">{copy.group}</p>
        <h4 className="stage__title">{copy.title}</h4>
        <p className="stage__desc">{copy.desc}</p>
        <a className="link" href={`/services/${copy.slug}`} onClick={onLink}>
          How it works
        </a>
      </div>
    </div>
  );
}

export function Navbar() {
  const { open: openBooking } = useBooking();

  const [scrolled, setScrolled] = useState(false);
  // The undocked bar is transparent with light text, so it only reads against
  // a dark opening. Routes that start on a light surface get the docked pill
  // from the first pixel instead.
  const { pathname } = useLocation();
  const onDarkHero = DARK_HERO_ROUTES.has(pathname);
  const servicesActive = matches(pathname, "/services");
  /** The service page we're actually on, if any. Module-level SERVICES means
   *  this is a stable reference for as long as the route doesn't change. */
  const currentService = SERVICES.find(
    (s) => pathname === `/services/${s.slug}`,
  );
  const docked = scrolled || !onDarkHero;
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<Service>(
    () => currentService ?? SERVICES[0],
  );
  const [copy, setCopy] = useState<Service>(
    () => currentService ?? SERVICES[0],
  );
  const [openAcc, setOpenAcc] = useState<string | null>(null);

  const headerRef = useRef<HTMLElement>(null);
  const svcItemRef = useRef<HTMLLIElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const glideRef = useRef<HTMLSpanElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const openTimer = useRef<ReturnType<typeof setTimeout>>();
  const closeTimer = useRef<ReturnType<typeof setTimeout>>();
  const openedAt = useRef(0);
  const copyAnim = useRef<Animation | null>(null);

  // ── sliding highlight ──────────────────────────────────────────────
  const moveGlide = useCallback((instant?: boolean) => {
    const glide = glideRef.current;
    const row = listRef.current?.querySelector<HTMLElement>(".svc.is-active");
    if (!glide || !row || isMobile()) return;
    if (instant) glide.style.transition = "none";
    glide.style.transform = `translate(${row.offsetLeft}px, ${row.offsetTop}px)`;
    glide.style.width = `${row.offsetWidth}px`;
    glide.style.height = `${row.offsetHeight}px`;
    glide.classList.add("is-on");
    if (instant) {
      void glide.offsetHeight;
      glide.style.transition = "";
    }
  }, []);

  // ── active row + copy swap ─────────────────────────────────────────
  const activate = useCallback((svc: Service, instant?: boolean) => {
    setActive(svc);
    const el = copyRef.current;
    if (!el || instant || isReduced()) {
      setCopy(svc);
      return;
    }
    copyAnim.current?.cancel();
    const out = el.animate(
      [
        { opacity: 1, transform: "translateY(0)" },
        { opacity: 0, transform: "translateY(-6px)" },
      ],
      { duration: 110, easing: "ease-in", fill: "forwards" },
    );
    out.onfinish = () => {
      setCopy(svc);
      requestAnimationFrame(() => {
        out.cancel();
        copyAnim.current = el.animate(
          [
            { opacity: 0, transform: "translateY(8px)" },
            { opacity: 1, transform: "translateY(0)" },
          ],
          { duration: 300, easing: EASE },
        );
      });
    };
  }, []);

  useEffect(() => {
    if (open) requestAnimationFrame(() => moveGlide());
  }, [open, active, moveGlide]);

  // ── open / close ───────────────────────────────────────────────────
  const setMenu = useCallback(
    (v: boolean) => {
      clearTimeout(openTimer.current);
      clearTimeout(closeTimer.current);
      setOpen((was) => {
        if (was === v) return was;
        if (v) {
          openedAt.current = performance.now();
          if (!isMobile()) {
            // Open on the service you're reading, not on whatever happens to
            // be first in the list.
            activate(currentService ?? SERVICES[0], true);
            requestAnimationFrame(() => moveGlide(true));
          }
        } else {
          setOpenAcc(null);
        }
        return v;
      });
    },
    [activate, moveGlide, currentService],
  );

  // body scroll lock while the mobile sheet is up
  useEffect(() => {
    document.body.classList.toggle("menu-open", open && isMobile());
    return () => document.body.classList.remove("menu-open");
  }, [open]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setMenu(false);
      if (!isMobile()) triggerRef.current?.focus();
    };
    const onDown = (e: PointerEvent) => {
      if (!headerRef.current?.contains(e.target as Node)) setMenu(false);
    };
    const mq = window.matchMedia(MOBILE);
    const onMq = () => setMenu(false);

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    mq.addEventListener("change", onMq);
    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
      mq.removeEventListener("change", onMq);
    };
  }, [setMenu]);

  // ── hover intent: trigger + panel behave as one zone ────────────────
  const desktopMouse = (e: ReactPointerEvent) =>
    e.pointerType === "mouse" && !isMobile();
  const inZone = (el: EventTarget | null) =>
    el instanceof Node &&
    (!!svcItemRef.current?.contains(el) || !!wrapRef.current?.contains(el));

  const zoneEnter = (isTrigger: boolean) => (e: ReactPointerEvent) => {
    if (!desktopMouse(e)) return;
    clearTimeout(closeTimer.current);
    if (isTrigger && !open)
      openTimer.current = setTimeout(() => setMenu(true), 80);
  };
  const zoneLeave = (e: ReactPointerEvent) => {
    if (!desktopMouse(e)) return;
    clearTimeout(openTimer.current);
    if (inZone(e.relatedTarget)) return;
    closeTimer.current = setTimeout(() => setMenu(false), 300);
  };
  // moving onto any other nav target closes it quickly
  const awayEnter = (e: ReactPointerEvent) => {
    if (!desktopMouse(e) || !open) return;
    clearTimeout(openTimer.current);
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setMenu(false), 120);
  };

  const onListKeyDown = (e: React.KeyboardEvent) => {
    const rows = Array.from(
      listRef.current?.querySelectorAll<HTMLElement>(".svc") ?? [],
    );
    const i = rows.indexOf(document.activeElement as HTMLElement);
    if (i < 0) return;
    const go = (n: number) => {
      e.preventDefault();
      rows[(n + rows.length) % rows.length]?.focus();
    };
    if (e.key === "ArrowDown") go(i + 1);
    else if (e.key === "ArrowUp") go(i - 1);
    else if (e.key === "Home") go(0);
    else if (e.key === "End") go(rows.length - 1);
  };

  const toggleDrawer = (svc: Service) => {
    const next = openAcc === svc.id ? null : svc.id;
    setOpenAcc(next);
    if (!next) return;
    setTimeout(() => {
      const li = listRef.current?.querySelector<HTMLElement>(
        `li[data-id="${svc.id}"]`,
      );
      const panel = panelRef.current;
      if (!li || !panel) return;
      const r = li.getBoundingClientRect();
      const p = panel.getBoundingClientRect();
      if (r.top < p.top || r.top > p.top + p.height * 0.45)
        panel.scrollBy({
          top: r.top - p.top - 12,
          behavior: isReduced() ? "auto" : "smooth",
        });
    }, 120);
  };

  const closeAndGo = () => setMenu(false);

  let row = -1; // stagger index across all groups

  return (
    <header
      ref={headerRef}
      className={`lxn nav${docked ? " is-scrolled" : ""}${open ? " is-open" : ""}`}
    >
      <div className="nav__bar">
        <a className="logo" href="/" aria-label="Luxen Digital home">
          <img
            className="logo__mark"
            src={LOGO_URL}
            alt=""
            width={1254}
            height={1254}
            decoding="async"
          />
          {/* Same roll as the gold buttons, but the second line says where
              the link goes. The link's aria-label already names it. */}
          <span className="roll-label" aria-hidden="true">
            <span>Luxen Digital</span>
            <span>Home</span>
          </span>
        </a>

        <ul className="nav__links">
          <li
            ref={svcItemRef}
            onPointerEnter={zoneEnter(true)}
            onPointerLeave={zoneLeave}
          >
            <button
              ref={triggerRef}
              className={`nav__item${servicesActive ? " is-current" : ""}`}
              aria-current={servicesActive ? "page" : undefined}
              aria-expanded={open}
              aria-controls="lxn-mega"
              onClick={() => {
                // hover already opened it a moment ago
                if (open && performance.now() - openedAt.current < 450) return;
                setMenu(!open);
              }}
              onKeyDown={(e) => {
                if (e.key !== "ArrowDown") return;
                e.preventDefault();
                setMenu(true);
                requestAnimationFrame(() =>
                  listRef.current?.querySelector<HTMLElement>(".svc")?.focus(),
                );
              }}
            >
              Our Services
              <Chevron className="chev" />
            </button>
          </li>
          {NAV_LINKS.map((l) => {
            const current = matches(pathname, l.href);
            return (
              <li key={l.href}>
                <a
                  className={`nav__item${current ? " is-current" : ""}`}
                  aria-current={current ? "page" : undefined}
                  href={l.href}
                  onPointerEnter={awayEnter}
                >
                  {l.label}
                </a>
              </li>
            );
          })}
        </ul>

        <button
          className="btn btn--amber nav__cta"
          onClick={openBooking}
          onPointerEnter={awayEnter}
        >
          <Roll label="Let's Talk" />
          <svg className="nav__cta-arrow" viewBox="0 0 16 16" aria-hidden="true">
            <path d="M3 8h10M9 4l4 4-4 4" />
          </svg>
        </button>

        <button
          className="burger"
          aria-expanded={open}
          aria-controls="lxn-mega"
          aria-label="Menu"
          onClick={() => setMenu(!open)}
        >
          <i />
          <i />
        </button>
      </div>

      <div
        id="lxn-mega"
        ref={wrapRef}
        className={`mega-wrap${open ? " is-open" : ""}`}
        onPointerEnter={zoneEnter(false)}
        onPointerLeave={zoneLeave}
      >
        <div className="mega" ref={panelRef} aria-label="Services">
          <p className="mega__head">Our Services</p>

          <div className="mega__inner">
            <div className="mega__list" ref={listRef} onKeyDown={onListKeyDown}>
              <span className="glide" ref={glideRef} aria-hidden="true" />

              {GROUP_ORDER.map((g) => (
                <section className="grp" key={g}>
                  <h3>{g}</h3>
                  <ul>
                    {groups[g].map((s) => {
                      row += 1;
                      const accOpen = openAcc === s.id;
                      return (
                        <li
                          key={s.id}
                          data-id={s.id}
                          className={`in${accOpen ? " is-open" : ""}`}
                          style={{ "--i": row } as CSSProperties}
                        >
                          <a
                            // is-active follows the pointer; is-current marks
                            // the page you're on and outlives the hover.
                            className={`svc${active.id === s.id ? " is-active" : ""}${
                              currentService?.id === s.id ? " is-current" : ""
                            }`}
                            aria-current={
                              currentService?.id === s.id ? "page" : undefined
                            }
                            href={`/services/${s.slug}`}
                            aria-expanded={accOpen}
                            onPointerEnter={(e) => {
                              if (desktopMouse(e)) activate(s);
                            }}
                            onFocus={() => {
                              if (!isMobile()) activate(s);
                            }}
                            onClick={(e) => {
                              if (isMobile()) {
                                e.preventDefault();
                                toggleDrawer(s);
                              } else {
                                closeAndGo();
                              }
                            }}
                          >
                            <span
                              className="svc__icon"
                              dangerouslySetInnerHTML={{ __html: ICONS[s.id] }}
                            />
                            <span className="svc__title">{s.title}</span>
                            <Chevron className="svc__caret" />
                          </a>
                          <div className="drawer">
                            <div className="drawer__in">
                              {accOpen && (
                                <Stage
                                  scene={s.id}
                                  copy={s}
                                  onLink={closeAndGo}
                                />
                              )}
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              ))}
            </div>

            <aside
              className="stage-home in"
              style={{ "--i": 2 } as CSSProperties}
            >
              <Stage
                scene={active.id}
                copy={copy}
                copyRef={copyRef}
                onLink={closeAndGo}
              />
            </aside>
          </div>

          <div className="mega__foot">
            <p>Every service runs on one connected system.</p>
            <a className="link" href="#features" onClick={closeAndGo}>
              See all services
            </a>
          </div>

          <nav className="mega__more" aria-label="More">
            {NAV_LINKS.map((l) => {
              const current = matches(pathname, l.href);
              return (
                <a
                  key={l.href}
                  href={l.href}
                  className={current ? "is-current" : undefined}
                  aria-current={current ? "page" : undefined}
                  onClick={closeAndGo}
                >
                  {l.label}
                </a>
              );
            })}
            <button
              className="btn btn--amber"
              onClick={() => {
                setMenu(false);
                openBooking();
              }}
            >
              <Roll label="Let's Talk" />
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}
