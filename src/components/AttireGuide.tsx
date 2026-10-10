import { wedding } from "@/config/wedding";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

export function AttireGuide() {
  const { attire } = wedding;

  return (
    <section id="attire" aria-labelledby="attire-title" className="scroll-mt-nav px-6 py-section">
      <SectionHeading id="attire-title" eyebrow="What to Wear">
        Attire Guide
      </SectionHeading>

      <Reveal className="mx-auto mt-12 max-w-2xl text-center">
        <p className="text-label tracking-label text-rosewood uppercase">Dress Code</p>
        <p className="mt-1 font-serif text-4xl text-crimson">{attire.dressCode}</p>
        <p className="mt-5 font-serif text-[1.3rem] leading-relaxed text-rosewood italic">
          {attire.intro}
        </p>
      </Reveal>

      <div className="mx-auto mt-14 grid max-w-4xl gap-12 sm:grid-cols-2 sm:gap-0 sm:divide-x sm:divide-gold/40">
        {attire.groups.map((group, index) => (
          <Reveal key={group.title} delay={index * 0.1} className="text-center sm:px-10">
            <h3 className="text-label-lg font-medium tracking-label text-crimson uppercase">
              {group.title}
            </h3>
            <dl className="mt-6 space-y-5">
              {group.items.map((item) => (
                <div key={item.who}>
                  <dt className="font-serif text-xl text-wine italic">{item.who}</dt>
                  <dd className="mt-1 text-[0.95rem] leading-relaxed text-rosewood">{item.what}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        ))}
      </div>

      <Reveal className="mx-auto mt-16 max-w-3xl text-center">
        <h3 className="text-label-lg font-medium tracking-label text-crimson uppercase">
          Our Palette
        </h3>
        <ul className="mt-8 flex flex-wrap justify-center gap-x-3 gap-y-7 sm:gap-x-6">
          {attire.palette.map((swatch) => (
            <li key={swatch.name} className="flex w-24 flex-col items-center">
              <span
                className="size-14 rounded-full shadow-card ring-1 ring-gold/60 ring-offset-4 ring-offset-ivory"
                style={{ backgroundColor: swatch.hex }}
                aria-hidden="true"
              />
              <span className="mt-4 text-[0.65rem] font-medium tracking-[0.2em] text-wine uppercase">
                {swatch.name}
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-10 font-serif text-lg text-rosewood italic">{attire.note}</p>
      </Reveal>
    </section>
  );
}
