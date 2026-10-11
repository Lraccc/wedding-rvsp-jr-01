#!/usr/bin/env node
/**
 * Puts the guests' video greetings together into one video and publishes it as the
 * "greetings" GitHub release. Run by .github/workflows/greetings-compilation.yml in two steps:
 *
 *   node scripts/compile-greetings.mjs check   lists the clips in Cloudinary; "changed=true"
 *                                              when they differ from the published video
 *   node scripts/compile-greetings.mjs build   prepares new clips, joins them all, publishes
 *
 * To try the video steps on your own computer without Cloudinary or GitHub (needs ffmpeg):
 *
 *   node scripts/compile-greetings.mjs local <folder of videos>
 *
 * Each clip is converted once to the same size, frame rate and sound settings, then all of
 * them are joined without re-encoding. Prepared clips are kept in greetings-build/normalized
 * (cached between workflow runs), so a run only converts the clips that are new.
 * Guest names and video links are never printed: the logs of a public repo are public.
 */
import { execFileSync, spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import {
  appendFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { basename, extname, join, relative } from "node:path";

const ASSET_FOLDER = "greetings";
const RELEASE_TAG = "greetings";
const OUTPUT_NAME = "greetings-compilation.mp4";
const MAX_SECONDS = 60;
const WIDTH = 1920;
const HEIGHT = 1080;
const FPS = 30;
// Release files can be up to 2 GiB.
const MAX_OUTPUT_BYTES = 1.9 * 1024 ** 3;
// Bump when the conversion settings change, so every clip is converted again.
const FORMAT_VERSION = 1;

const WORK_DIR = "greetings-build";
const NORMALIZED_DIR = join(WORK_DIR, "normalized");
const DOWNLOAD_DIR = join(WORK_DIR, "downloads");
const TEXT_DIR = join(WORK_DIR, "text");
const CLIPS_FILE = join(WORK_DIR, "clips.json");
const MANIFEST_FILE = join(WORK_DIR, "manifest.json");
const PREVIOUS_MANIFEST_FILE = join(WORK_DIR, "previous", "manifest.json");

const FFMPEG = process.env.FFMPEG || "ffmpeg";
const FFPROBE = process.env.FFPROBE || "ffprobe";
const FONT_FILE = process.env.FONT_FILE || "/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf";

const [command, localFolder] = process.argv.slice(2);

try {
  if (command === "check") await check();
  else if (command === "build") await build();
  else if (command === "local" && localFolder) await buildLocal(localFolder);
  else {
    console.error("Usage: compile-greetings.mjs check | build | local <folder>");
    process.exit(1);
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}

async function check() {
  mkdirSync(WORK_DIR, { recursive: true });
  const clips = await listCloudinaryClips();
  writeFileSync(CLIPS_FILE, JSON.stringify(clips, null, 2));
  writeFileSync(MANIFEST_FILE, JSON.stringify(toManifest(clips), null, 2));

  const previous = readPreviousManifest();
  const force = process.env.FORCE === "true";
  const changed =
    clips.length > 0 && (force || JSON.stringify(previous) !== JSON.stringify(toManifest(clips)));

  console.log(
    `${clips.length} greeting(s) in Cloudinary; ` +
      (previous ? `${previous.clips.length} in the published video.` : "nothing published yet."),
  );
  console.log(changed ? "Rebuilding the video." : "No changes; nothing to do.");
  setOutput("changed", String(changed));
}

async function build() {
  const clips = JSON.parse(readFileSync(CLIPS_FILE, "utf8"));
  const output = join(WORK_DIR, OUTPUT_NAME);
  const included = await prepareAll(clips, downloadClip);
  joinClips(included, output);
  publish(output);
}

async function buildLocal(folder) {
  const clips = readdirSync(folder)
    .filter((file) => !file.startsWith("."))
    .sort()
    .map((file) => ({
      id: file,
      version: Math.floor(statSync(join(folder, file)).mtimeMs),
      name: basename(file, extname(file)),
      source: join(folder, file),
    }));
  const output = join(WORK_DIR, OUTPUT_NAME);
  const included = await prepareAll(clips, async (clip) => clip.source);
  joinClips(included, output);
  console.log(`Done: ${output}`);
}

/** Every video in the Cloudinary "greetings" folder, oldest first. */
async function listCloudinaryClips() {
  const cloudName = requireEnv("CLOUDINARY_CLOUD_NAME");
  const auth = Buffer.from(
    `${requireEnv("CLOUDINARY_API_KEY")}:${requireEnv("CLOUDINARY_API_SECRET")}`,
  ).toString("base64");
  const api = `https://api.cloudinary.com/v1_1/${cloudName}`;

  // Accounts made since 2024 file uploads by asset folder; older ones by public ID prefix.
  let resources;
  try {
    resources = await listAll(`${api}/resources/by_asset_folder`, { asset_folder: ASSET_FOLDER });
  } catch {
    resources = await listAll(`${api}/resources/video/upload`, { prefix: `${ASSET_FOLDER}/` });
  }

  return resources
    .filter((resource) => (resource.resource_type ?? "video") === "video")
    .map((resource) => ({
      id: resource.public_id,
      version: resource.version ?? 0,
      name: readName(resource.context),
      createdAt: resource.created_at ?? "",
      url:
        resource.secure_url ??
        `https://res.cloudinary.com/${cloudName}/video/upload/v${resource.version}/${resource.public_id}.${resource.format ?? "mp4"}`,
    }))
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt) || a.id.localeCompare(b.id));

  async function listAll(endpoint, query) {
    const all = [];
    let cursor;
    do {
      const params = new URLSearchParams({ ...query, max_results: "500", context: "true" });
      if (cursor) params.set("next_cursor", cursor);
      const response = await fetch(`${endpoint}?${params}`, {
        headers: { Authorization: `Basic ${auth}` },
      });
      if (!response.ok) throw new Error(`Cloudinary answered ${response.status}`);
      const body = await response.json();
      all.push(...(body.resources ?? []));
      cursor = body.next_cursor;
    } while (cursor);
    return all;
  }
}

function readName(context) {
  const name = context?.custom?.name ?? context?.name ?? "";
  return String(name).replace(/\s+/g, " ").trim().slice(0, 60);
}

/** What the published video contains; a new or deleted greeting changes it. */
function toManifest(clips) {
  return {
    format: FORMAT_VERSION,
    clips: clips.map(({ id, version, name }) => ({ id, version, name })),
  };
}

function readPreviousManifest() {
  rmSync(join(WORK_DIR, "previous"), { recursive: true, force: true });
  const result = spawnSync(
    "gh",
    [
      "release",
      "download",
      RELEASE_TAG,
      "--pattern",
      "manifest.json",
      "--dir",
      join(WORK_DIR, "previous"),
    ],
    { stdio: "ignore" },
  );
  if (result.status !== 0 || !existsSync(PREVIOUS_MANIFEST_FILE)) return null;
  return JSON.parse(readFileSync(PREVIOUS_MANIFEST_FILE, "utf8"));
}

async function downloadClip(clip) {
  mkdirSync(DOWNLOAD_DIR, { recursive: true });
  const response = await fetch(clip.url);
  if (!response.ok) throw new Error(`download failed (${response.status})`);
  const file = join(DOWNLOAD_DIR, clipKey(clip));
  writeFileSync(file, Buffer.from(await response.arrayBuffer()));
  return file;
}

/** Converts each clip not prepared yet; returns the prepared files in order. */
async function prepareAll(clips, getSource) {
  mkdirSync(NORMALIZED_DIR, { recursive: true });
  mkdirSync(TEXT_DIR, { recursive: true });

  const wanted = new Set(clips.map((clip) => `${clipKey(clip)}.mp4`));
  // Drop prepared clips of greetings that have since been deleted.
  for (const file of readdirSync(NORMALIZED_DIR)) {
    if (!wanted.has(file)) rmSync(join(NORMALIZED_DIR, file));
  }

  const included = [];
  let converted = 0;
  for (const [index, clip] of clips.entries()) {
    const target = join(NORMALIZED_DIR, `${clipKey(clip)}.mp4`);
    if (!existsSync(target)) {
      try {
        const source = await getSource(clip);
        normalize(source, target, clip.name);
        if (source.startsWith(DOWNLOAD_DIR)) rmSync(source);
        converted++;
      } catch (error) {
        rmSync(target, { force: true });
        console.warn(
          `Skipping greeting ${index + 1} of ${clips.length}: ${describeFailure(error)}`,
        );
        continue;
      }
    }
    included.push(target);
  }

  console.log(
    `${included.length} greeting(s) in the video, ${converted} newly converted, ` +
      `${clips.length - included.length} skipped.`,
  );
  if (included.length === 0) throw new Error("No greetings could be converted.");
  return included;
}

/**
 * Fits the clip on a 1920×1080 frame over a blurred, zoomed copy of itself (so portrait clips
 * don't get black bars), adds "From <name>" for the first seconds, evens out the loudness,
 * and encodes with settings shared by every clip so they can be joined without re-encoding.
 */
function normalize(source, target, name) {
  const audioStreams = run(FFPROBE, [
    "-v",
    "error",
    "-select_streams",
    "a",
    "-show_entries",
    "stream=index",
    "-of",
    "csv=p=0",
    source,
  ]);
  const hasAudio = audioStreams.trim() !== "";

  const video = [
    `[0:v]fps=${FPS},split=2[bgsrc][fgsrc]`,
    // Blurring a small copy and scaling it up is much faster than blurring at full size.
    `[bgsrc]scale=480:270:force_original_aspect_ratio=increase,crop=480:270,boxblur=12:2,` +
      `scale=${WIDTH}:${HEIGHT},eq=brightness=-0.06[bg]`,
    `[fgsrc]scale=${WIDTH}:${HEIGHT}:force_original_aspect_ratio=decrease:force_divisible_by=2[fg]`,
    `[bg][fg]overlay=(W-w)/2:(H-h)/2,setsar=1,format=yuv420p${nameLabel(name, target)}[v]`,
  ];
  const audio = [
    `[${hasAudio ? "0:a" : "1:a"}]aresample=48000,aformat=sample_fmts=fltp:channel_layouts=stereo,` +
      `loudnorm=I=-16:TP=-1.5:LRA=11,aresample=48000,apad[a]`,
  ];

  // prettier-ignore
  run(FFMPEG, [
    "-hide_banner", "-loglevel", "error", "-y",
    "-i", source,
    "-f", "lavfi", "-i", "anullsrc=channel_layout=stereo:sample_rate=48000",
    "-filter_complex", [...video, ...audio].join(";"),
    "-map", "[v]", "-map", "[a]",
    "-t", String(MAX_SECONDS), "-shortest",
    "-map_metadata", "-1", "-map_chapters", "-1",
    "-c:v", "libx264", "-preset", "veryfast", "-crf", "21",
    "-maxrate", "3M", "-bufsize", "6M", "-profile:v", "high",
    "-r", String(FPS), "-g", String(FPS * 2), "-video_track_timescale", String(FPS * 1000),
    "-c:a", "aac", "-b:a", "160k", "-ar", "48000", "-ac", "2",
    target,
  ]);
}

/** A drawtext filter for the guest's name; empty when there is no name. */
function nameLabel(name, target) {
  if (!name) return "";
  // Reading the text from a file means quotes, colons and % in names need no escaping.
  const textFile = join(TEXT_DIR, `${basename(target, ".mp4")}.txt`);
  writeFileSync(textFile, `From ${name}`);
  const font = existsSync(FONT_FILE) ? `fontfile='${filterPath(FONT_FILE)}'` : "font=serif";
  return (
    `,drawtext=${font}:textfile='${filterPath(textFile)}':expansion=none:` +
    `fontsize=52:fontcolor=white:box=1:boxcolor=black@0.45:boxborderw=22:` +
    `x=90:y=h-th-120:enable='between(t,0.3,5)'`
  );
}

/** Joins the prepared clips without re-encoding; they all share the same settings. */
function joinClips(files, output) {
  const listFile = join(WORK_DIR, "concat.txt");
  const lines = files.map((file) => `file '${relative(WORK_DIR, file).replaceAll("\\", "/")}'`);
  writeFileSync(listFile, `${lines.join("\n")}\n`);
  // prettier-ignore
  run(FFMPEG, [
    "-hide_banner", "-loglevel", "error", "-y",
    "-f", "concat", "-safe", "0", "-i", listFile,
    "-c", "copy", "-movflags", "+faststart",
    output,
  ]);

  const { size } = statSync(output);
  console.log(`Joined ${files.length} greeting(s): ${(size / 1024 ** 2).toFixed(1)} MB.`);
  if (size > MAX_OUTPUT_BYTES) {
    throw new Error("The video is over the 1.9 GB GitHub release limit; lower -crf/-maxrate.");
  }
}

function publish(output) {
  const exists =
    spawnSync("gh", ["release", "view", RELEASE_TAG], { stdio: "ignore" }).status === 0;
  if (!exists) {
    const notes =
      "The guests' video greetings, combined into one video. Rebuilt automatically by the " +
      "Greetings compilation workflow; the download link stays the same.";
    run("gh", [
      "release",
      "create",
      RELEASE_TAG,
      "--title",
      "Video greetings",
      "--notes",
      notes,
      "--latest=false",
    ]);
  }
  run("gh", ["release", "upload", RELEASE_TAG, output, MANIFEST_FILE, "--clobber"]);
  console.log("Published.");
}

/** Short, filesystem-safe name for a clip version. */
function clipKey(clip) {
  const id = createHash("sha1").update(String(clip.id)).digest("hex").slice(0, 16);
  return `${id}-${clip.version}-f${FORMAT_VERSION}`;
}

/** Escapes a path for use inside a quoted ffmpeg filter option (Windows drive colons). */
function filterPath(path) {
  return path.replaceAll("\\", "/").replaceAll(":", "\\:").replaceAll("'", "\\'");
}

/** The last line ffmpeg printed, or the error message: enough to see why a clip failed. */
function describeFailure(error) {
  const stderr = typeof error?.stderr === "string" ? error.stderr.trim() : "";
  if (stderr) return stderr.split("\n").pop();
  return error instanceof Error ? error.message.split("\n")[0] : "unknown error";
}

function run(program, args) {
  return execFileSync(program, args, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
}

function requireEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing environment variable ${name}.`);
  return value;
}

function setOutput(name, value) {
  if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, `${name}=${value}\n`);
}
