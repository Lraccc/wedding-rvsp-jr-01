"use client";

import { useId } from "react";

const WAX_BLOB =
  "M50 3C62 2 72 7 80 13C89 20 96 30 97 42C99 53 96 64 91 73C85 83 76 91 64 95C53 98 41 98 31 94C20 89 11 81 6 70C2 60 1 48 4 37C8 25 16 15 27 9C34 5 42 3 50 3Z";

type WaxSealProps = {
  monogram: readonly [string, string];
  className?: string;
};

/** Dark brown wax seal with a pressed monogram. Purely decorative. */
export function WaxSeal({ monogram, className }: WaxSealProps) {
  const id = useId();
  const wax = `${id}-wax`;
  const well = `${id}-well`;

  return (
    <svg viewBox="0 0 100 100" className={className} overflow="visible" aria-hidden="true">
      <defs>
        <radialGradient id={wax} cx="0.38" cy="0.32" r="0.78">
          <stop offset="0" stopColor="#8a7061" />
          <stop offset="0.5" stopColor="#5c4a3f" />
          <stop offset="1" stopColor="#33261e" />
        </radialGradient>
        <radialGradient id={well} cx="0.5" cy="0.42" r="0.62">
          <stop offset="0" stopColor="#4d3d33" />
          <stop offset="1" stopColor="#614e42" />
        </radialGradient>
      </defs>
      <path d={WAX_BLOB} fill={`url(#${wax})`} />
      <circle cx="50" cy="50" r="33.5" fill={`url(#${well})`} />
      <circle
        cx="50"
        cy="50"
        r="33.5"
        fill="none"
        stroke="#24190f"
        strokeOpacity="0.5"
        strokeWidth="1.6"
      />
      <circle
        cx="50"
        cy="51"
        r="34.8"
        fill="none"
        stroke="#b9a291"
        strokeOpacity="0.32"
        strokeWidth="0.8"
      />
      <circle
        cx="50"
        cy="50"
        r="29.5"
        fill="none"
        stroke="#f1e6d8"
        strokeOpacity="0.3"
        strokeWidth="0.7"
        strokeDasharray="0.1 2.6"
        strokeLinecap="round"
      />
      <g className="font-serif" fontSize="25" fontWeight="500" textAnchor="middle">
        <text x="36.1" y="59.3" fill="#1f160f" fillOpacity="0.55">
          {monogram[0]}
        </text>
        <text x="64.6" y="59.3" fill="#1f160f" fillOpacity="0.55">
          {monogram[1]}
        </text>
        <text x="35.5" y="58.5" fill="#f2e8db">
          {monogram[0]}
        </text>
        <text x="64" y="58.5" fill="#f2e8db">
          {monogram[1]}
        </text>
      </g>
      <ellipse
        cx="33"
        cy="21"
        rx="13"
        ry="5"
        fill="#fff"
        opacity="0.14"
        transform="rotate(-28 33 21)"
      />
    </svg>
  );
}
