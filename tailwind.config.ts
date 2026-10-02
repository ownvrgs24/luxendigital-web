import type { Config } from "tailwindcss";

/** Colors are raw HSL channels in index.css, so opacity modifiers
 *  (e.g. `bg-accent/20`) keep working. */
const token = (name: string) => `hsl(var(--${name}))`;

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        border: token("border"),
        input: token("input"),
        ring: token("ring"),
        background: token("background"),
        foreground: token("foreground"),
        card: token("card"),
        primary: { DEFAULT: token("primary"), foreground: token("primary-foreground") },
        secondary: { DEFAULT: token("secondary"), foreground: token("secondary-foreground") },
        destructive: { DEFAULT: token("destructive"), foreground: token("destructive-foreground") },
        muted: { DEFAULT: token("muted"), foreground: token("muted-foreground") },
        accent: {
          DEFAULT: token("accent"),
          foreground: token("accent-foreground"),
          soft: token("accent-soft"),
        },
      },
    },
  },
} satisfies Config;
