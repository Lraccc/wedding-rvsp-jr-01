"use client";

import { useId } from "react";

const WAX_BLOB =
  "M50 3C62 2 72 7 80 13C89 20 96 30 97 42C99 53 96 64 91 73C85 83 76 91 64 95C53 98 41 98 31 94C20 89 11 81 6 70C2 60 1 48 4 37C8 25 16 15 27 9C34 5 42 3 50 3Z";

type WaxSealProps = {
  monogram: readonly [string, string];
  className?: string;
};

/** Gold wax seal with a pressed monogram. Purely decorative. */
export function WaxSeal({ monogram, className }: WaxSealProps) {
  const id = useId();
  const wax = `${id}-wax`;
  const well = `${id}-well`;

  return (
    <svg viewBox="0 0 100 100" className={className} overflow="visible" aria-hidden="true">
      <defs>
        <radialGradient id={wax} cx="0.38" cy="0.32" r="0.78">
          <stop offset="0" stopColor="#f6e3ae" />
          <stop offset="0.5" stopColor="#cfac66" />
          <stop offset="1" stopColor="#8a6a2e" />
        </radialGradient>
        <radialGradient id={well} cx="0.5" cy="0.42" r="0.62">
          <stop offset="0" stopColor="#a8833f" />
          <stop offset="1" stopColor="#c29d58" />
        </radialGradient>
      </defs>
      <path d={WAX_BLOB} fill={`url(#${wax})`} />
      <circle cx="50" cy="50" r="33.5" fill={`url(#${well})`} />
      <circle
        cx="50"
        cy="50"
        r="33.5"
        fill="none"
        stroke="#5c4415"
        strokeOpacity="0.45"
        strokeWidth="1.6"
      />
      <circle
        cx="50"
        cy="51"
        r="34.8"
        fill="none"
        stroke="#fff1cc"
        strokeOpacity="0.4"
        strokeWidth="0.8"
      />
      <circle
        cx="50"
        cy="50"
        r="29.5"
        fill="none"
        stroke="#fff5da"
        strokeOpacity="0.5"
        strokeWidth="0.7"
        strokeDasharray="0.1 2.6"
        strokeLinecap="round"
      />
      <g className="font-serif" fontSize="25" fontWeight="500" textAnchor="middle">
        <text x="36.1" y="59.3" fill="#4a350e" fillOpacity="0.55">
          {monogram[0]}
        </text>
        <text x="64.6" y="59.3" fill="#4a350e" fillOpacity="0.55">
          {monogram[1]}
        </text>
        <text x="35.5" y="58.5" fill="#fff3d4">
          {monogram[0]}
        </text>
        <text x="64" y="58.5" fill="#fff3d4">
          {monogram[1]}
        </text>
      </g>
      <ellipse
        cx="33"
        cy="21"
        rx="13"
        ry="5"
        fill="#fff"
        opacity="0.3"
        transform="rotate(-28 33 21)"
      />
    </svg>
  );
}
