import { wedding } from "@/config/wedding";

/** Every RSVP file carries this tag, and Cloudinary lists files by tag. */
export const RSVP_TAG = "rsvp";

/** Separates the attendees' names in an RSVP's contextual metadata. */
export const NAME_SEPARATOR = ";";

export type RsvpResponse = { attending: boolean; names: string[]; sentAt: Date };

export type Guest = { name: string; attending: boolean; sentAt: Date };

/**
 * `locked`: Cloudinary's settings still restrict lists (see "RSVP" in the README).
 * `network`: the list couldn't be reached.
 */
export class GuestListError extends Error {
  constructor(readonly reason: "locked" | "network") {
    super(reason);
  }
}

type ListedFile = {
  created_at?: string;
  context?: { custom?: Record<string, string> };
};

/** Every RSVP, oldest first, from Cloudinary's public list of the files tagged "rsvp". */
export async function fetchResponses(): Promise<RsvpResponse[]> {
  const { cloudName } = wedding.rsvp.cloudinary;
  const url = `https://res.cloudinary.com/${cloudName}/raw/list/${RSVP_TAG}.json`;

  let files: ListedFile[];
  try {
    // Cloudinary caches the list for a minute; skip the browser's own cache on top of that.
    const response = await fetch(url, { cache: "no-store" });
    // 404: no one has answered yet.
    if (response.status === 404) return [];
    if (response.status === 401) throw new GuestListError("locked");
    if (!response.ok) throw new GuestListError("network");
    files = (await response.json()).resources ?? [];
  } catch (error) {
    throw error instanceof GuestListError ? error : new GuestListError("network");
  }

  return files
    .map(toResponse)
    .filter((response) => response.names.length > 0)
    .sort((a, b) => a.sentAt.getTime() - b.sentAt.getTime());
}

/**
 * One entry per person, in the order of their answers. Someone who answered more than once
 * is listed once, with their latest answer.
 */
export function toGuests(responses: RsvpResponse[]): Guest[] {
  const latest = new Map<string, Guest>();
  for (const response of responses) {
    for (const name of response.names) {
      const key = name
        .normalize("NFKD")
        .replace(/[̀-ͯ]/g, "")
        .toLowerCase()
        .replace(/[^\p{L}\p{N}]+/gu, " ")
        .trim();
      // Delete first, so the person moves to the position of their latest answer.
      latest.delete(key);
      latest.set(key, { name, attending: response.attending, sentAt: response.sentAt });
    }
  }
  return [...latest.values()];
}

function toResponse(file: ListedFile): RsvpResponse {
  const context = file.context?.custom ?? {};
  return {
    attending: context.attending === "yes",
    names: (context.names ?? "")
      .split(NAME_SEPARATOR)
      .map((name) => name.trim())
      .filter(Boolean),
    sentAt: new Date(file.created_at ?? 0),
  };
}
