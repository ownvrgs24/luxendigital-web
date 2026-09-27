import { type ReactNode } from "react";

/**
 * Two stacked copies of a button's label. The parent `.btn-gold` hover
 * rolls the first one out of the frame and the second one up into it.
 * The duplicate is aria-hidden so the label is announced once.
 */
export function RollLabel({ children }: { children: ReactNode }) {
  return (
    <span className="roll-label">
      <span>{children}</span>
      <span aria-hidden="true">{children}</span>
    </span>
  );
}
