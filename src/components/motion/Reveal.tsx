import { type ReactNode } from "react";
import { motion } from "framer-motion";
import { useInView } from "@/hooks/use-in-view";

/** The site's one easing curve — a fast start that settles softly. */
export const EASE = [0.22, 1, 0.36, 1] as const;

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  as?: "div" | "li" | "section" | "span" | "p" | "h1" | "h2" | "h3";
};

/** Fade-up reveal on scroll into view. */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 28,
  as = "div",
}: RevealProps) {
  const { ref, inView } = useInView<HTMLDivElement>();
  const MotionTag = motion[as] as typeof motion.div;
  return (
    <MotionTag
      ref={ref}
      className={className}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{ duration: 0.9, delay, ease: EASE }}
    >
      {children}
    </MotionTag>
  );
}
