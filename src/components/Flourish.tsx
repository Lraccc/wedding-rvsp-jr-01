type FlourishProps = {
  className?: string;
};

/** Thin divider with two leaves and a dot, used under headings. */
export function Flourish({ className }: FlourishProps) {
  return (
    <svg
      viewBox="0 0 160 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M4 8h52" />
      <path d="M104 8h52" />
      <path d="M60 8c4-3.6 9-3.6 13 0-4 3.6-9 3.6-13 0Z" />
      <path d="M100 8c-4-3.6-9-3.6-13 0 4 3.6 9 3.6 13 0Z" />
      <circle cx="80" cy="8" r="1.8" fill="currentColor" stroke="none" />
    </svg>
  );
}
