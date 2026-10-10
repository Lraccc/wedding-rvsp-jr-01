import { wedding } from "@/config/wedding";
import { GiftQR } from "./GiftQR";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

/** Screen 5: guest notes, with the gift QR codes under the Gift Guide. */
export function ImportantNotes() {
  return (
    <section aria-labelledby="notes-title" className="px-6 py-section">
      <SectionHeading id="notes-title">Important Notes</SectionHeading>

      <div className="mx-auto mt-14 max-w-3xl space-y-16 text-center">
        {wedding.notes.map((note) => (
          <Reveal key={note.title}>
            <h3 className="text-label-lg font-medium tracking-label text-espresso uppercase">
              {note.title}
            </h3>
            <p className="mx-auto mt-4 max-w-2xl font-serif text-[1.3rem] leading-relaxed text-rose italic sm:text-[1.4rem]">
              {note.body}
            </p>
            {note.showGiftQRs ? <GiftQR /> : null}
          </Reveal>
        ))}
      </div>
    </section>
  );
}
