import Link from "next/link";
import { wedding } from "@/config/wedding";
import { PAGE_END_ID } from "@/lib/ids";
import { Reveal } from "./Reveal";
import { WaxSeal } from "./WaxSeal";

type FooterProps = {
  /** Turns the couple's names into their hidden way in to their guest list (on /rsvp only). */
  linkToGuestList?: boolean;
};

export function Footer({ linkToGuestList = false }: FooterProps) {
  const { couple, date, hashtag, closing } = wedding;
  const names = (
    <span className="text-gradient bg-linear-to-b from-[#f6e6b8] via-gold-light to-[#c9a766]">
      {couple.groom} &amp; {couple.bride}
    </span>
  );

  return (
    <footer className="px-6 py-16 text-center velvet sm:py-20">
      <Reveal className="flex flex-col items-center">
        <WaxSeal
          monogram={couple.monogram}
          className="size-16 drop-shadow-[0_4px_6px_rgb(30_4_10/0.45)]"
        />
        <p className="mt-7 font-serif text-xl text-gold-light italic">{closing.message}</p>
        <p className="mt-1 font-script text-[clamp(2.25rem,8.5vw,3rem)] leading-tight">
          {linkToGuestList ? (
            <Link href="/rsvp/guests" className="[-webkit-tap-highlight-color:transparent]">
              {names}
              <span className="sr-only">: guest list</span>
            </Link>
          ) : (
            names
          )}
        </p>
        <p className="mt-4 text-label tracking-label text-paper/80 uppercase">{date.display}</p>
        <p className="mt-1 font-serif text-lg text-paper">{hashtag.tag}</p>
      </Reveal>
      <div id={PAGE_END_ID} className="h-px" aria-hidden="true" />
    </footer>
  );
}
