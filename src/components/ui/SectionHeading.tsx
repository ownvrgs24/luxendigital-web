import { type ReactNode } from "react";

/** The small gold label above a heading. */
export function Eyebrow({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p
      className={`text-sm font-medium uppercase tracking-[0.25em] text-accent ${className}`}
    >
      {children}
    </p>
  );
}

/** Eyebrow, heading and optional lede — the opening of most sections and
 *  every inner page. Wrap it in a Reveal (or not) at the call site. */
export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  as: Tag = "h2",
  center = false,
}: {
  eyebrow: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  as?: "h1" | "h2";
  center?: boolean;
}) {
  return (
    <>
      <Eyebrow>{eyebrow}</Eyebrow>
      <Tag className="mt-4 font-display text-3xl font-medium tracking-tight text-balance sm:text-4xl lg:text-5xl">
        {title}
      </Tag>
      {subtitle && (
        <p
          className={`mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg ${
            center ? "mx-auto" : ""
          }`}
        >
          {subtitle}
        </p>
      )}
    </>
  );
}

/** A row of quiet pill labels, e.g. the trust points under a page heading. */
export function Chips({ items }: { items: readonly string[] }) {
  return (
    <ul className="mt-7 flex flex-wrap items-center justify-center gap-2.5">
      {items.map((t) => (
        <li
          key={t}
          className="rounded-full border border-border bg-secondary/50 px-4 py-1.5 text-xs font-medium text-muted-foreground"
        >
          {t}
        </li>
      ))}
    </ul>
  );
}
