import type { Metadata } from "next";
import { Users } from "lucide-react";
import { BackToInvitation } from "@/components/BackToInvitation";
import { Footer } from "@/components/Footer";
import { GuestList } from "@/components/GuestList";
import { SectionHeading } from "@/components/SectionHeading";
import { wedding } from "@/config/wedding";

const { couple } = wedding;

export const metadata: Metadata = {
  title: `Guest List · ${couple.groom} & ${couple.bride}`,
  robots: { index: false, follow: false },
};

/**
 * The couple's guest list, opened by tapping the title above the envelope. It is hidden, not
 * locked; see "RSVP" in the README.
 */
export default function GuestListPage() {
  return (
    <>
      <BackToInvitation />
      <main className="px-6 pt-8 pb-section">
        <SectionHeading
          as="h1"
          id="guests-title"
          eyebrow="For the couple"
          icon={
            <Users
              className="mx-auto mb-4 size-6 text-gold"
              strokeWidth={1.25}
              aria-hidden="true"
            />
          }
        >
          Guest List
        </SectionHeading>
        <div className="mt-10">
          <GuestList />
        </div>
      </main>
      <Footer />
    </>
  );
}
