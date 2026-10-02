import { Instagram, Linkedin, type LucideProps } from "lucide-react";
import { type ComponentType } from "react";

/**
 * The X mark, drawn here rather than imported.
 *
 * Lucide's `X` is the close/cross glyph, not the brand — using it put a
 * dismiss icon in the social row. Lucide dropped brand marks entirely, so
 * the logo is inlined. It is a solid shape by design and has no stroked
 * form, which is why it takes `fill` and ignores the row's stroke weight.
 */
function XLogo({ className }: LucideProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

type Social = {
  label: string;
  href: string;
  Icon: ComponentType<LucideProps>;
  /** A filled glyph reads heavier than a hairline one at the same size, so
   *  the brand marks sit in a smaller box to match their neighbours. */
  solid?: boolean;
};

/**
 * The social row.
 *
 * One family of line icons at a single hairline weight, drawn large. The
 * thin stroke is what lets them be this big without shouting — at 1.1px on
 * a 32px box they read as drawing rather than as chrome, which is the only
 * way an icon this size sits quietly under a paragraph of body copy.
 */
const SOCIALS: Social[] = [
  { label: "LinkedIn", href: "/contact", Icon: Linkedin },
  { label: "Instagram", href: "/contact", Icon: Instagram },
  { label: "X (formerly Twitter)", href: "/contact", Icon: XLogo, solid: true },
];

export function SocialIcons({ className = "" }: { className?: string }) {
  return (
    <ul className={`flex items-center gap-3 ${className}`}>
      {SOCIALS.map(({ label, href, Icon, solid }) => (
        <li key={label}>
          <a
            href={href}
            aria-label={label}
            className="group relative grid h-14 w-14 place-items-center rounded-full border border-border text-foreground/70 transition-[color,border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:hover:translate-y-0"
          >
            {/* A ring that blooms out of the border on hover. Transform and
                opacity only, so it cannot disturb the row's layout. */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 rounded-full border border-accent/40 opacity-0 transition-[transform,opacity] duration-500 group-hover:scale-110 group-hover:opacity-100 motion-reduce:transition-none"
            />
            <Icon
              className={`${
                solid ? "h-[25px] w-[25px]" : "h-8 w-8"
              } transition-transform duration-500 group-hover:rotate-[8deg] motion-reduce:transition-none motion-reduce:group-hover:rotate-0`}
              strokeWidth={1.1}
              aria-hidden="true"
            />
          </a>
        </li>
      ))}
    </ul>
  );
}
