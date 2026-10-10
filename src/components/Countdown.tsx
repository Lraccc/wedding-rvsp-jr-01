"use client";

import { wedding } from "@/config/wedding";
import { useDaysUntil } from "@/hooks/useDaysUntil";
import { ButtonLink } from "./ButtonLink";
import { Reveal } from "./Reveal";

type CountdownProps = {
  /** Days remaining when the site was built; shown until the browser computes today's value. */
  initialDays: number;
};

/** Screen 3, on a crimson band: time, date, a live "days away" counter and the RSVP call to action. */
export function Countdown({ initialDays }: CountdownProps) {
  const { date, rsvp } = wedding;
  const days = useDaysUntil(date.iso) ?? initialDays;

  return (
    <section aria-labelledby="date-title" className="px-6 py-section text-center velvet">
      <Reveal>
        <p className="font-serif text-xl text-gold-light italic sm:text-2xl">{date.timeLine}</p>
        <h2
          id="date-title"
          className="mt-3 font-serif text-[clamp(1.8rem,8.4vw,4.6rem)] leading-tight font-normal tracking-[0.1em] text-paper"
        >
          {date.display}
        </h2>

        <p className="mt-6 text-label-lg tracking-label text-paper/80 uppercase">
          <DaysAway days={days} />
        </p>

        <ButtonLink href="https://forms.gle/EzxEQbRRSpzq3jsU6" tone="gold" className="mt-9">
          RSVP Here
        </ButtonLink>

        <p className="mx-auto mt-7 max-w-md text-label tracking-label text-paper/80 uppercase">
          We kindly request that you confirm your attendance by completing the Google Form on or
          before {rsvp.deadline}
        </p>
      </Reveal>
    </section>
  );
}

function DaysAway({ days }: { days: number }) {
  const number = (value: string | number) => (
    <strong className="mx-2 inline-block align-[-0.14em] font-serif text-[2.75em] leading-none font-semibold tracking-normal text-gold-light tabular-nums">
      {value}
    </strong>
  );

  if (days > 1) return <>The wedding is {number(days)} days away</>;
  if (days === 1) return <>The wedding is {number(1)} day away</>;
  if (days === 0) return <>The wedding is today!</>;
  return <>We are married! Thank you for celebrating with us</>;
}
