import { ArrowLeft } from "lucide-react";
import Link from "next/link";

/** Top bar for the pages outside the main invitation. */
export function BackToInvitation() {
  return (
    <header className="px-6 pt-6">
      <Link
        href="/"
        className="inline-flex min-h-11 items-center gap-2 text-label tracking-label text-rosewood uppercase transition-colors hover:text-crimson"
      >
        <ArrowLeft className="size-4" strokeWidth={1.5} aria-hidden="true" />
        Back to the invitation
      </Link>
    </header>
  );
}
