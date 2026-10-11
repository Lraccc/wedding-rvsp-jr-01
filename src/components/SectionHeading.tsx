import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Flourish } from "./Flourish";
import { Reveal } from "./Reveal";

type SectionHeadingProps = {
  id: string;
  eyebrow?: string;
  /** Small decorative icon above the eyebrow. */
  icon?: ReactNode;
  className?: string;
  /** `h1` on pages where this heading is the page title. */
  as?: "h1" | "h2";
  children: ReactNode;
};

export function SectionHeading({
  id,
  eyebrow,
  icon,
  className,
  as: Heading = "h2",
  children,
}: SectionHeadingProps) {
  return (
    <Reveal className={cn("text-center", className)}>
      {icon}
      {eyebrow ? (
        <p className="mb-2 text-label tracking-label text-rosewood uppercase">{eyebrow}</p>
      ) : null}
      <Heading
        id={id}
        className="font-serif text-[clamp(2.5rem,6.5vw,3.75rem)] leading-[1.1] font-normal text-crimson italic"
      >
        {children}
      </Heading>
      <Flourish className="mx-auto mt-5 w-36 text-gold" />
    </Reveal>
  );
}
