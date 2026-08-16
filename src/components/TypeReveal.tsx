import { motion } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * Movable-type typography: each word sits in its own "slot" and is set into
 * place from below, the way a compositor drops sorts into a composing stick.
 */
export function TypeReveal({
  text,
  className,
  delay = 0,
  stagger = 0.045,
  as = "span",
  accentFrom,
}: {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  as?: "h1" | "h2" | "h3" | "span" | "p";
  /** Index of the first word rendered in the gold accent face. */
  accentFrom?: number;
}) {
  const Tag = motion[as] as typeof motion.span;
  const words = text.split(" ");

  return (
    <Tag
      className={cn("inline-flex flex-wrap", className)}
      initial="hidden"
      animate="shown"
      variants={{ shown: { transition: { staggerChildren: stagger, delayChildren: delay } } }}
    >
      {words.map((word, i) => (
        <span key={`${word}-${i}`} className="type-slot">
          <motion.span
            className={cn(
              "inline-block will-change-transform",
              accentFrom !== undefined && i >= accentFrom && "text-gold",
            )}
            variants={{
              hidden: { y: "110%", opacity: 0, rotate: 2 },
              shown: { y: "0%", opacity: 1, rotate: 0 },
            }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          >
            {word}
          </motion.span>
          {i < words.length - 1 && <span>&nbsp;</span>}
        </span>
      ))}
    </Tag>
  );
}

/** Small uppercase eyebrow that letterspaces open as it fades in. */
export function Eyebrow({ children, delay = 0 }: { children: string; delay?: number }) {
  return (
    <motion.p
      initial={{ opacity: 0, letterSpacing: "0.5em" }}
      animate={{ opacity: 1, letterSpacing: "0.28em" }}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
      className="text-[10px] uppercase text-muted-foreground"
    >
      {children}
    </motion.p>
  );
}