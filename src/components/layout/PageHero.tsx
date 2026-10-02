import { type ReactNode } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { Chips, SectionHeading } from "@/components/ui/SectionHeading";

/** The centred heading block that opens an inner page. */
export function PageHero({
  eyebrow,
  title,
  subtitle,
  chips,
}: {
  eyebrow: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  chips?: readonly string[];
}) {
  return (
    <section className="relative py-8 sm:py-12">
      <div className="mx-auto max-w-3xl px-6 lg:px-10">
        <Reveal className="text-center">
          <SectionHeading
            as="h1"
            center
            eyebrow={eyebrow}
            title={title}
            subtitle={subtitle}
          />
          {chips && <Chips items={chips} />}
        </Reveal>
      </div>
    </section>
  );
}
