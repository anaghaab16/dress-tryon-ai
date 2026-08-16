import type { ReactNode } from "react";
import { motion } from "motion/react";
import { Eyebrow, TypeReveal } from "@/components/TypeReveal";

/**
 * Shared movable-type page masthead: eyebrow, set-in-place title, hairline rule.
 */
export function PageHeading({
  eyebrow,
  title,
  accentFrom,
  children,
}: {
  eyebrow: string;
  title: string;
  accentFrom?: number;
  children?: ReactNode;
}) {
  return (
    <header className="relative">
      <Eyebrow>{eyebrow}</Eyebrow>
      <TypeReveal
        as="h1"
        text={title}
        accentFrom={accentFrom}
        delay={0.12}
        className="mt-4 font-display text-4xl leading-[1.05] md:text-6xl"
      />
      {children && <div className="mt-4">{children}</div>}
      <motion.div
        aria-hidden
        className="mt-8 h-px origin-left bg-border"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
      />
    </header>
  );
}