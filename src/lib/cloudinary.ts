/**
 * Uploads a video from the browser to Cloudinary with an unsigned upload preset, so the
 * static site needs no server. The preset (set up in Cloudinary) decides the asset folder,
 * allowed formats and size limit; see "Video greetings" in the README.
 */

// Cloudinary wants every chunk but the last to be over 5 MB.
const CHUNK_SIZE = 10 * 1024 * 1024;
const MAX_ATTEMPTS = 3;

type UploadOptions = {
  cloudName: string;
  uploadPreset: string;
  file: Blob;
  fileName: string;
  /** Stored with the video as contextual metadata, e.g. the guest's name. */
  context: Record<string, string>;
  /** 0 to 1, across the whole file. */
  onProgress: (fraction: number) => void;
};

/** Error with a message that is safe to show to the guest. */
export class UploadError extends Error {}

export async function uploadVideo({
  cloudName,
  uploadPreset,
  file,
  fileName,
  context,
  onProgress,
}: UploadOptions) {
  const url = `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`;
  const contextValue = Object.entries(context)
    .filter(([, value]) => value)
    .map(([key, value]) => `${key}=${escapeContext(value)}`)
    .join("|");

  // Larger files go up in chunks, so a dropped connection only repeats one chunk.
  const isChunked = file.size > CHUNK_SIZE;
  const uploadId = isChunked ? makeUploadId() : null;

  for (let start = 0; start < file.size; start += CHUNK_SIZE) {
    const end = isChunked ? Math.min(start + CHUNK_SIZE, file.size) : file.size;
    const body = new FormData();
    body.append("file", file.slice(start, end), fileName);
    body.append("upload_preset", uploadPreset);
    if (contextValue) body.append("context", contextValue);

    const headers: Record<string, string> = uploadId
      ? {
          "X-Unique-Upload-Id": uploadId,
          "Content-Range": `bytes ${start}-${end - 1}/${file.size}`,
        }
      : {};

    await withRetries(() =>
      send(url, body, headers, (loaded) => onProgress((start + loaded) / file.size)),
    );
  }

  onProgress(1);
}

function send(
  url: string,
  body: FormData,
  headers: Record<string, string>,
  onLoaded: (bytes: number) => void,
) {
  // XHR rather than fetch: fetch can't report upload progress.
  return new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url);
    for (const [name, value] of Object.entries(headers)) xhr.setRequestHeader(name, value);
    xhr.upload.onprogress = (event) => onLoaded(event.loaded);
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) return resolve();
      const message = readCloudinaryError(xhr.responseText);
      // Server errors are worth retrying; a refused file (4xx) will be refused again.
      reject(xhr.status >= 500 ? new Error(message) : new UploadError(message));
    };
    xhr.onerror = () => reject(new Error("Network error"));
    xhr.send(body);
  });
}

async function withRetries(attempt: () => Promise<void>) {
  for (let tries = 1; ; tries++) {
    try {
      return await attempt();
    } catch (error) {
      if (error instanceof UploadError) throw error;
      if (tries >= MAX_ATTEMPTS) {
        throw new UploadError("The connection dropped while sending. Please try again.");
      }
      await new Promise((resolve) => setTimeout(resolve, 1000 * tries));
    }
  }
}

function readCloudinaryError(responseText: string) {
  try {
    const message = JSON.parse(responseText)?.error?.message;
    if (typeof message === "string") return `Cloudinary refused the video: ${message}`;
  } catch {
    // Not JSON; fall through to the generic message.
  }
  return "The video could not be sent. Please try again.";
}

// `=` and `|` separate context entries, so Cloudinary needs them escaped inside values.
function escapeContext(value: string) {
  return value
    .replace(/\s+/g, " ")
    .trim()
    .replace(/([=|])/g, "\\$1");
}

function makeUploadId() {
  return typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
