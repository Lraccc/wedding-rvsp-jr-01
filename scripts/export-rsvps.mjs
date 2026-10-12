#!/usr/bin/env node
/**
 * Collects the RSVPs that guests sent from the /rsvp page (text files in Cloudinary's "rsvp"
 * folder) into rsvp-responses.csv, oldest first, and prints how many guests are coming.
 * Needs the Cloudinary API key in .env.local; see "RSVP" in the README.
 *
 *   npm run rsvp:export
 *
 * The CSV holds guests' names, so .gitignore keeps it out of the public repository.
 */
import { writeFileSync } from "node:fs";

const ASSET_FOLDER = "rsvp";
const OUTPUT_FILE = "rsvp-responses.csv";

const sentAtFormat = new Intl.DateTimeFormat("en-US", {
  timeZone: "Asia/Manila",
  dateStyle: "medium",
  timeStyle: "short",
});

try {
  const responses = await listResponses();
  writeFileSync(OUTPUT_FILE, toCsv(responses));
  const attending = responses.filter((response) => response.attending === "yes").length;
  console.log(
    `${responses.length} RSVP(s): ${attending} attending, ${responses.length - attending} not attending.`,
  );
  console.log(`Saved to ${OUTPUT_FILE}.`);
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}

/** Every RSVP file in the Cloudinary "rsvp" folder, oldest first. */
async function listResponses() {
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
    resources = await listAll(`${api}/resources/raw/upload`, { prefix: `${ASSET_FOLDER}/` });
  }

  return resources
    .filter((resource) => (resource.resource_type ?? "raw") === "raw")
    .map((resource) => {
      const context = resource.context?.custom ?? resource.context ?? {};
      return {
        createdAt: resource.created_at ?? "",
        attending: String(context.attending ?? ""),
        names: String(context.names ?? ""),
        file: resource.secure_url ?? resource.public_id,
      };
    })
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));

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

function toCsv(responses) {
  const rows = [
    ["Sent (Philippine time)", "Attending", "Names", "File"],
    ...responses.map((response) => [
      response.createdAt ? sentAtFormat.format(new Date(response.createdAt)) : "",
      { yes: "Yes", no: "No" }[response.attending] ?? response.attending,
      response.names,
      response.file,
    ]),
  ];
  // The byte order mark tells Excel the file is UTF-8, so names like "Peñaranda" stay intact.
  return "﻿" + rows.map((row) => row.map(toCsvCell).join(",")).join("\r\n") + "\r\n";
}

function toCsvCell(value) {
  // Guests typed these names, so keep spreadsheets from reading one as a formula.
  const safe = /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
  return /[",\r\n]/.test(safe) ? `"${safe.replace(/"/g, '""')}"` : safe;
}

function requireEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Set ${name} in .env.local (see "RSVP" in the README).`);
  return value;
}
