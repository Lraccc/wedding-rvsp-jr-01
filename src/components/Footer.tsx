import Link from "next/link";
import { wedding } from "@/config/wedding";
import { PAGE_END_ID } from "@/lib/ids";
import { Reveal } from "./Reveal";
import { WaxSeal } from "./WaxSeal";

export function Footer() {
  const { couple, date, hashtag, closing } = wedding;

  return (
    <footer className="px-6 py-16 text-center velvet sm:py-20">
      <Reveal className="flex flex-col items-center">
        <WaxSeal
          monogram={couple.monogram}
          className="size-16 drop-shadow-[0_4px_6px_rgb(30_4_10/0.45)]"
        />
        <p className="mt-7 font-serif text-xl text-gold-light italic">{closing.message}</p>
        <p className="mt-1 font-script text-[clamp(2.25rem,8.5vw,3rem)] leading-tight">
          {/* The couple's hidden way in to their guest list. */}
          <Link href="/rsvp/guests">
            <span className="text-gradient bg-linear-to-b from-[#f6e6b8] via-gold-light to-[#c9a766]">
              {couple.groom} &amp; {couple.bride}
            </span>
            <span className="sr-only">: guest list</span>
          </Link>
        </p>
        <p className="mt-4 text-label tracking-label text-paper/80 uppercase">{date.display}</p>
        <p className="mt-1 font-serif text-lg text-paper">{hashtag.tag}</p>
      </Reveal>
      <div id={PAGE_END_ID} className="h-px" aria-hidden="true" />
    </footer>
  );
}
