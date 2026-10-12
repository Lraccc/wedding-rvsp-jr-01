# Mark Robert & Donabelle · Wedding Invitation

A single-page wedding invitation: a wax-sealed envelope that opens into the invitation, with
venue maps, guest notes, gift QR codes, entourage, photo gallery, attire guide, FAQs and RSVP.
It is a fully static site, so it can be hosted for free on Vercel, Netlify or Cloudflare Pages.

**Stack:** Next.js 16 (App Router, static export) · TypeScript · Tailwind CSS v4 ·
Framer Motion · `next/font` (Great Vibes, Cormorant Garamond, Inter) · lucide-react.
There is no backend: RSVPs and video greetings upload straight from the browser to Cloudinary,
guests share their photos on Facebook or Instagram with the wedding hashtag, and maps are Google
Maps embeds.

## Run it locally

Requires Node.js 20.9 or newer.

```bash
npm install
npm run dev          # http://localhost:3000
```

| Command             | What it does                                        |
| ------------------- | --------------------------------------------------- |
| `npm run dev`       | Development server with hot reload                  |
| `npm run build`     | Static export to `out/`                             |
| `npm run preview`   | Serves `out/` locally to check the production build |
| `npm run lint`      | ESLint (Next.js + TypeScript rules)                 |
| `npm run typecheck` | TypeScript check                                    |
| `npm run format`    | Prettier (also sorts Tailwind classes)              |

## Edit the content

Everything a couple would change lives in **`src/config/wedding.ts`**: names, monogram, date and
time lines, envelope title and verse, hero wording, venues and map links, RSVP page and deadline,
notes, gift QR codes, hashtag and photo-sharing steps, entourage, gallery, attire guide, FAQs,
music, and the site URL used for link previews. Each field is typed, so your editor will flag
mistakes.

### Photos

| File                                     | Where it appears                                 |
| ---------------------------------------- | ------------------------------------------------ |
| `public/images/couple-portrait.webp`     | Hero portrait under the couple's names           |
| `public/images/hashtag-photo.webp`       | Full-width photo under the hashtag               |
| `public/images/gallery/photo-01…43.webp` | Photos section, in the order listed in `gallery` |

To swap a photo, replace the file (or point the config at a new one) and update its `width`,
`height` and `alt` in the config, so the page reserves the right space and screen readers describe
it. `hashtag.photo.position` sets which part of the full-width photo stays visible when wide screens
crop it. Export photos as WebP or JPEG around 1600–2400px on the long side to keep the site fast.

### Replace the placeholders

| Placeholder                                  | Replace with                                     |
| -------------------------------------------- | ------------------------------------------------ |
| `public/images/og-image.jpg` (1200×630)      | Link-preview image for Messenger, Facebook, etc. |
| `src/app/icon.svg`, `src/app/apple-icon.png` | Favicon and home-screen icon                     |

The Gift Guide QR code is `public/images/qr/instapay.png`, listed under `gifts` in the config. Add
more entries there to show several QR codes side by side.

### Music

The background song is `public/audio/how-do-i-live-sax-cover.mp3` ("How Do I Live", saxophone
cover by Christian Ama), set in `music.src`. To change it, put another MP3 in `public/audio/` and
update `music.src`. Prefer a 128 kbps file without embedded cover art: the song only starts once
the start of the file has downloaded, and cover art sits at the start.

### Links

- **RSVP:** guests answer on the site's own `/rsvp` page (see [RSVP](#rsvp) below).
  `rsvp.formUrl` is the Google Form, offered there if a response can't be sent.
- **Maps:** each venue builds its embed and "Open in Google Maps" links from the venue name. For an
  exact pin, open the place in Google Maps, choose **Share → Embed a map**, and paste only the
  iframe's `src` into `mapEmbedUrl`.
- **Link previews:** set `site.url` to your final address (for example
  `https://mark-robert-and-donabelle.vercel.app`).
- **Search engines:** `site.allowIndexing` is `false`, so the invitation asks not to be indexed.
  Set it to `true` if you want it to appear in search results.

### RSVP

The **RSVP Here** button opens `/rsvp`, which asks the same questions as the Google Form: whether
the guest can attend, and the complete name of each attendee. Each response is saved to
[Cloudinary](https://cloudinary.com) as a small text file in the `rsvp` folder, for example
`juan-dela-cruz-attending.txt`:

```
RSVP · Mark Robert & Donabelle · December 18, 2026

Can you attend?
Yes, I’ll be there

Complete name of the attendee/s:
Juan Dela Cruz
Maria Dela Cruz

Sent October 12, 2026 at 2:05 PM, Philippine time
```

The wording of the page and the questions is under `rsvp` in the config.

**Set it up once:** in Cloudinary, under **Settings → Upload → Upload presets**, add a preset with
these settings:

- **Name:** `wedding_rsvp`
- **Signing mode:** Unsigned
- **Asset folder:** `rsvp`
- **Allowed formats:** `txt`

It uses the same Cloudinary account as the video greetings (`cloudinaryCloudName` in the config).
Until the preset exists, sending fails and the page points guests to the Google Form. If
`rsvp.cloudinary.cloudName` is empty, the page shows a button to the Google Form instead of the
form.

**The couple's guest list:** tapping the couple's names in the footer of any page opens
`/rsvp/guests`. It shows everyone who answered, split into attending and can't make it, with a
**Download Excel** button (one sheet each). Someone who answered more than once is listed once,
with their latest answer, and new RSVPs show up within a minute.

It reads Cloudinary's list of the files tagged `rsvp`, which Cloudinary blocks until you allow it
once: under **Settings → Security → Restricted media types**, untick **Resource list** and save.
Until then the page says the guest list isn't switched on yet.

The guest list is hidden, not locked: there is no password, so anyone who finds the link (or the
list's address in the site's code) can see the names. Search engines are asked not to index it.

**Other ways to read the responses:**

- **In Cloudinary:** open the `rsvp` folder in the Media Library. Each file is named after the
  first guest and says `attending` or `not-attending`; the tags of the same names filter the list.
  A file's details show its answers under contextual metadata, or open it to read the text.
- **As a spreadsheet:** create `.env.local` in the project folder with the three values from the
  Cloudinary dashboard's API Keys page:

  ```
  CLOUDINARY_CLOUD_NAME=...
  CLOUDINARY_API_KEY=...
  CLOUDINARY_API_SECRET=...
  ```

  Then run `npm run rsvp:export`. It prints how many guests are coming and writes every response,
  oldest first, to `rsvp-responses.csv`, which opens in Excel or Google Sheets. `.gitignore` keeps
  both files out of the public repository.

- **Answered twice?** Both responses are kept; the later one is the guest's latest answer. Delete
  a response by deleting its file in the Media Library.
- **Privacy:** anyone with the `/rsvp` link can send a response, and each file can be opened by
  anyone who has its link. The links are random, and only the guest list, the CSV and your
  Cloudinary account list them.

### Video greetings

Guests record or upload a greeting of up to a minute at `/greetings`. A GitHub workflow combines
all the greetings into one 1920×1080 video every 3 hours. Each greeting is labelled with the
guest's name, and portrait clips get a blurred background on the sides. The couple watch it at
`/greetings/watch` or download it from the `greetings` release. Until `greetings.cloudinary.cloudName`
is set, the page says "open soon", the invitation hides its button, and the workflow does nothing.

The site is static, so two free services do the work: guests' videos upload straight to
[Cloudinary](https://cloudinary.com), and GitHub Actions runs ffmpeg to combine them.

**Set it up once:**

1. Create a free Cloudinary account. Under **Settings → Upload → Upload presets**, add a preset
   with these settings:
   - **Name:** `wedding_greetings`
   - **Signing mode:** Unsigned
   - **Asset folder:** `greetings`
   - **Allowed formats:** `mp4,mov,m4v,webm,3gp`
   - Leave moderation off. Presets have no size limit setting: the page turns away videos over
     100 MB, and Cloudinary's free plan refuses them too.
2. In `src/config/wedding.ts`, set `greetings.cloudinary.cloudName` to the cloud name shown on
   the Cloudinary dashboard.
3. In the GitHub repository, open **Settings → Secrets and variables → Actions**:
   - Add a **variable** `CLOUDINARY_CLOUD_NAME`.
   - Add **secrets** `CLOUDINARY_API_KEY` and `CLOUDINARY_API_SECRET`. All three values are on
     the Cloudinary dashboard under API Keys.
4. Push. Send a test greeting, then open **Actions → Greetings compilation → Run workflow**.

**Day to day:**

- **Rebuild now:** **Actions → Greetings compilation → Run workflow**. Tick "Rebuild" to rebuild
  even when no greetings changed.
- **Remove a greeting:** delete it in Cloudinary's Media Library (`greetings` folder). The next
  run leaves it out.
- **Read the guests' notes:** each video's name and note are in its details in the Media Library.
- **Keep it running:** GitHub pauses scheduled workflows after 60 days with no activity in the
  repository. Pushing any commit, or running the workflow by hand, starts it again.
- **Privacy:** the repository is public, so anyone browsing its Releases page can find the video.
  Anyone with the `/greetings` link can upload, and every upload goes into the video.
- **Try it on your computer:** with ffmpeg installed, run
  `node scripts/compile-greetings.mjs local <folder of videos>`. The result is
  `greetings-build/greetings-compilation.mp4`.

### Design tokens

Tailwind v4 is configured in CSS: the `@theme` block at the top of `src/app/globals.css` holds the
red and gold palette (ivory, crimson, wine, rosewood, gold…), type scale, letter-spacing, section
spacing, shadows and easing. Change a value there and every component that uses it follows. The
`velvet` utility in the same file draws the crimson bands behind the date and the footer. The
envelope, wax seal and icons use hex values directly in their SVGs. Fonts are loaded in
`src/app/layout.tsx`.

## Deploy

`npm run build` writes a complete static site to `out/`. Any static host works.

**Vercel:** import the repository at vercel.com/new. The Next.js preset is detected and the static
export is served as-is; no settings are needed.

**Netlify:** import the repository. `netlify.toml` already sets the build command
(`npm run build`) and publish directory (`out`).

**Cloudflare Pages:** create a project from the repository with build command `npm run build` and
build output directory `out`. Set the `NODE_VERSION` environment variable to `20` or newer if the
default is older.

**Anything else:** upload the contents of `out/` to the web root.

## How it works

- **Envelope intro** (`src/components/Envelope.tsx`): a timeline built with Framer Motion's
  `useAnimate`. The seal cracks and its halves fall away, the envelope straightens, the flap folds
  back in 3D (`rotateX` around its top edge, swapping to its inner face and moving behind the
  letter once it is edge-on), and the letter rises only partway so its bottom stays in the pocket.
  After a pause the scene fades and scales into the site. The envelope icon in the top-left corner
  replays it.
- **Music** (`src/hooks/useAudio.tsx`): one `<audio>` element behind a React context. Browsers only
  allow sound after a tap or click, so the song starts inside the envelope's click handler and
  fades in. The speaker button toggles it; it pauses while the tab is hidden.
- **Countdown:** computed in the visitor's browser from their local date (and refreshed at
  midnight), so it is never stale and never causes a hydration mismatch.
- **Navigation:** a scroll spy built on `IntersectionObserver` highlights the current section;
  links scroll smoothly with `scroll-margin-top` so headings clear the floating nav. On phones the
  pill scrolls sideways and keeps the active link in view. A shared link such as `/#rsvp` lands on
  that section once the envelope is opened.
- **Accessibility:** semantic sections and headings, alt text, a focus-trapped photo lightbox
  (arrow keys, swipe, Escape), an accessible FAQ accordion, visible focus styles, and the page
  behind the intro is `inert`. With `prefers-reduced-motion`, movement is replaced by fades.
  Without JavaScript, the intro is skipped and the full page is shown.
- **Performance:** fonts are self-hosted by `next/font`; images are pre-compressed WebP; the map
  iframes load only when a guest scrolls near them; the page under the envelope is not rendered
  until the letter is out; the decorative vines mount after the first paint.

## Project structure

```
src/
  app/            layout (fonts, metadata), page, global styles and theme, icons
    greetings/    video greetings page, and watch/ for the combined video
    rsvp/         RSVP form page, and guests/ for the couple's guest list
  components/     Envelope, Nav, Hero, Countdown, VenueMap, ImportantNotes, GiftQR, Hashtag,
                  Entourage, Gallery, Lightbox, AttireGuide, Faqs, Rsvp, RsvpForm, GuestList,
                  Footer, FloralDecor, MusicToggle, GreetingRecorder, CompilationPlayer, and
                  small shared pieces
  config/         wedding.ts: all editable content
  hooks/          useAudio, useIntro, useActiveSection, useDaysUntil, useIsClient
  lib/            small helpers, the Cloudinary uploads, the guest list and its Excel file
public/
  images/         portrait, church photo, gallery, QR codes, link-preview image
  audio/          background music
scripts/
  compile-greetings.mjs   combines the video greetings (run by .github/workflows/)
  export-rsvps.mjs        saves the RSVPs to a spreadsheet (npm run rsvp:export)
```
