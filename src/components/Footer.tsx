import { wedding } from "@/config/wedding";
import { PAGE_END_ID } from "@/lib/ids";
import { Reveal } from "./Reveal";
import { WaxSeal } from "./WaxSeal";

export function Footer() {
  const { couple, date, hashtag, closing } = wedding;

  return (
    <footer className="px-6 pt-6 pb-14 text-center">
      <Reveal className="flex flex-col items-center">
        <WaxSeal
          monogram={couple.monogram}
          className="size-16 drop-shadow-[0_4px_6px_rgb(40_30_24/0.3)]"
        />
        <p className="mt-7 font-serif text-xl text-rose italic">{closing.message}</p>
        <p className="mt-1 font-script text-[clamp(2.25rem,8.5vw,3rem)] leading-tight text-espresso">
          {couple.groom} &amp; {couple.bride}
        </p>
        <p className="mt-4 text-label tracking-label text-rose uppercase">{date.display}</p>
        <p className="mt-1 font-serif text-lg text-espresso">{hashtag.tag}</p>
      </Reveal>
      <div id={PAGE_END_ID} className="h-px" aria-hidden="true" />
    </footer>
  );
}
