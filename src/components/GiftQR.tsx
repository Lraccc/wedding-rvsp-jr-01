import Image from "next/image";
import { wedding } from "@/config/wedding";

/** Bank QR codes shown under the Gift Guide note. */
export function GiftQR() {
  return (
    <ul className="mx-auto mt-10 grid max-w-[15rem] grid-cols-1 gap-9 sm:max-w-3xl sm:grid-cols-3 sm:gap-6">
      {wedding.gifts.map((gift) => (
        <li key={gift.bank} className="flex flex-col items-center">
          <p className="text-label tracking-label text-espresso uppercase">{gift.bank}</p>
          <div className="mt-3 w-full rounded-2xl bg-white p-4 shadow-card ring-1 ring-taupe/30">
            <Image
              src={gift.qr}
              alt={`${gift.bank} InstaPay QR code for monetary gifts`}
              width={600}
              height={600}
              sizes="(max-width: 640px) 15rem, 14rem"
              className="h-auto w-full"
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
