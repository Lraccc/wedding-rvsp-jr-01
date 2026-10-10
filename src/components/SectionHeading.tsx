import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Flourish } from "./Flourish";
import { Reveal } from "./Reveal";

type SectionHeadingProps = {
  id: string;
  eyebrow?: string;
  className?: string;
  children: ReactNode;
};

export function SectionHeading({ id, eyebrow, className, children }: SectionHeadingProps) {
  return (
    <Reveal className={cn("text-center", className)}>
      {eyebrow ? (
        <p className="mb-2 text-label tracking-label text-rosewood uppercase">{eyebrow}</p>
      ) : null}
      <h2
        id={id}
        className="font-serif text-[clamp(2.5rem,6.5vw,3.75rem)] leading-[1.1] font-normal text-crimson italic"
      >
        {children}
      </h2>
      <Flourish className="mx-auto mt-5 w-36 text-gold" />
    </Reveal>
  );
}
