import Image from "next/image";
import { wedding } from "@/config/wedding";
import { cn } from "@/lib/cn";

/** Bank QR codes shown under the Gift Guide note. */
export function GiftQR() {
  const single = wedding.gifts.length === 1;

  return (
    <ul
      className={cn(
        "mx-auto mt-10 grid max-w-[15rem] grid-cols-1 gap-9",
        !single && "sm:max-w-3xl sm:grid-cols-3 sm:gap-6",
      )}
    >
      {wedding.gifts.map((gift) => (
        <li key={gift.bank} className="flex flex-col items-center">
          <p className="text-label tracking-label text-wine uppercase">{gift.bank}</p>
          <div className="mt-3 w-full rounded-2xl bg-white p-4 shadow-card ring-1 ring-gold/40">
            <Image
              src={gift.qr}
              alt={`${gift.bank} QR code for monetary gifts`}
              width={gift.width}
              height={gift.height}
              sizes="(max-width: 640px) 15rem, 14rem"
              className="h-auto w-full"
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
