import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** `gold` is for crimson backgrounds such as the velvet bands. */
type ButtonTone = "crimson" | "gold";

type ButtonLinkProps = {
  href: string;
  tone?: ButtonTone;
  className?: string;
  children: ReactNode;
};

const TONES = {
  crimson: "bg-crimson text-paper after:border-gold-light/45 hover:bg-garnet active:bg-garnet",
  gold: "bg-gold-light text-wine after:border-wine/20 hover:bg-[#f1dfae] active:bg-[#f1dfae]",
};

/** The call-to-action look, for `<button>`s that should match ButtonLink. */
export function buttonClass(tone: ButtonTone = "crimson", className?: string) {
  return cn(
    "relative inline-flex min-h-12 items-center justify-center gap-2 rounded-[2px] px-10 py-3.5 text-label-lg font-medium tracking-label uppercase shadow-soft transition-colors duration-300",
    "after:pointer-events-none after:absolute after:inset-[3px] after:rounded-[1px] after:border",
    TONES[tone],
    className,
  );
}

/** Rectangular call-to-action with a thin inner rule. External links open in a new tab. */
export function ButtonLink({ href, tone = "crimson", className, children }: ButtonLinkProps) {
  const isExternal = /^https?:\/\//.test(href);

  return (
    <a
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className={buttonClass(tone, className)}
    >
      {children}
      {isExternal ? <span className="sr-only">(opens in a new tab)</span> : null}
    </a>
  );
}
