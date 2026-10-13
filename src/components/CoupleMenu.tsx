"use client";

import { ChevronRight, Clapperboard, type LucideIcon, Users, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useId, useRef } from "react";
import { wedding } from "@/config/wedding";

type CoupleMenuProps = {
  open: boolean;
  onClose: () => void;
};

/**
 * The couple's hidden menu, opened by tapping the title above the envelope: their guest list
 * and their combined video greetings. Neither page is linked anywhere else. Like the pages
 * themselves, it is hidden rather than locked.
 */
export function CoupleMenu({ open, onClose }: CoupleMenuProps) {
  const { couple } = wedding;
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  // A modal <dialog> keeps focus inside, closes on Escape and makes the rest of the page inert.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={(event) => {
        // A click on the dialog itself, rather than its content, landed on the backdrop.
        if (event.target === event.currentTarget) onClose();
      }}
      className="m-auto w-[min(26rem,calc(100vw-2rem))] rounded-photo border border-gold/50 bg-paper text-center shadow-photo backdrop:bg-ink/55"
    >
      <div className="relative px-6 pt-10 pb-7 sm:px-8">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 grid size-10 place-items-center rounded-full text-rosewood transition-colors hover:bg-champagne hover:text-crimson"
        >
          <X className="size-5" strokeWidth={1.5} aria-hidden="true" />
        </button>

        <p className="text-label tracking-label text-rosewood uppercase">For the couple</p>
        <h2
          id={titleId}
          className="mt-1 font-script text-[clamp(2rem,8vw,2.5rem)] leading-tight text-crimson"
        >
          {couple.groom} &amp; {couple.bride}
        </h2>

        <ul className="mt-6 space-y-3 text-left">
          <li>
            <MenuLink
              href="/rsvp/guests"
              icon={Users}
              title="Guest List"
              description="See who has responded, and download the list as an Excel file."
            />
          </li>
          <li>
            <MenuLink
              href="/greetings/watch"
              icon={Clapperboard}
              title="Video Greetings"
              description="Watch the greetings from your family and friends, put together in one video."
            />
          </li>
        </ul>
      </div>
    </dialog>
  );
}

function MenuLink({
  href,
  icon: Icon,
  title,
  description,
}: {
  href: string;
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-4 rounded-[2px] border border-gold/60 bg-ivory px-4 py-4 transition-colors duration-300 hover:bg-champagne"
    >
      <span className="grid size-11 shrink-0 place-items-center rounded-full border border-gold/60 text-gold">
        <Icon className="size-5" strokeWidth={1.25} aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-serif text-[1.35rem] leading-tight text-crimson">{title}</span>
        <span className="mt-0.5 block text-[0.9rem] leading-snug text-rosewood">{description}</span>
      </span>
      <ChevronRight className="size-5 shrink-0 text-gold" strokeWidth={1.5} aria-hidden="true" />
    </Link>
  );
}
