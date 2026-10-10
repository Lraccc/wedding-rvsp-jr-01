import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type ButtonLinkProps = {
  href: string;
  className?: string;
  children: ReactNode;
};

/** Taupe rectangular call-to-action. External links open in a new tab. */
export function ButtonLink({ href, className, children }: ButtonLinkProps) {
  const isExternal = /^https?:\/\//.test(href);

  return (
    <a
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className={cn(
        "inline-flex min-h-12 items-center justify-center gap-2 rounded-[2px] bg-taupe px-10 py-3.5 text-label-lg font-medium tracking-label text-espresso-deep uppercase shadow-soft transition-colors duration-300 hover:bg-taupe-deep active:bg-taupe-deep",
        className,
      )}
    >
      {children}
      {isExternal ? <span className="sr-only">(opens in a new tab)</span> : null}
    </a>
  );
}
