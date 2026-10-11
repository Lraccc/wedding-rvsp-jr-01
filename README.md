# Mark Robert & Donabelle · Wedding Invitation

A single-page wedding invitation: a wax-sealed envelope that opens into the invitation, with
venue maps, guest notes, gift QR codes, entourage, photo gallery, attire guide, FAQs and RSVP.
It is a fully static site, so it can be hosted for free on Vercel, Netlify or Cloudflare Pages.

**Stack:** Next.js 16 (App Router, static export) · TypeScript · Tailwind CSS v4 ·
Framer Motion · `next/font` (Great Vibes, Cormorant Garamond, Inter) · lucide-react.
There is no backend: RSVPs go to a Google Form, guests share their photos on Facebook or
Instagram with the wedding hashtag, and maps are Google Maps embeds.

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
time lines, envelope title and verse, hero wording, venues and map links, RSVP form and deadline,
notes, gift QR codes, hashtag and photo-sharing steps, entourage, gallery, attire guide, FAQs,
music, and the site URL used for link previews. Each field is typed, so your editor will flag
mistakes.

### Photos

| File                                     | Where it appears                                 |
| ---------------------------------------- | ------------------------------------------------ |
| `public/images/couple-portrait.webp`     | Hero portrait under the couple's names           |
| `public/images/hashtag-photo.webp`       | Full-width photo under the hashtag               |
| `public/images/gallery/photo-01…40.webp` | Photos section, in the order listed in `gallery` |

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

- **RSVP:** set `rsvp.formUrl` to your Google Form's share link. To also show the form on the
  page, open the form, choose **Send → `<>`**, and paste the iframe's `src` into `rsvp.embedUrl`.
- **Maps:** each venue builds its embed and "Open in Google Maps" links from the venue name. For an
  exact pin, open the place in Google Maps, choose **Share → Embed a map**, and paste only the
  iframe's `src` into `mapEmbedUrl`.
- **Link previews:** set `site.url` to your final address (for example
  `https://mark-robert-and-donabelle.vercel.app`).
- **Search engines:** `site.allowIndexing` is `false`, so the invitation asks not to be indexed.
  Set it to `true` if you want it to appear in search results.

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
  components/     Envelope, Nav, Hero, Countdown, VenueMap, ImportantNotes, GiftQR, Hashtag,
                  Entourage, Gallery, Lightbox, AttireGuide, Faqs, Rsvp, Footer, FloralDecor,
                  MusicToggle, GreetingRecorder, CompilationPlayer, and small shared pieces
  config/         wedding.ts: all editable content
  hooks/          useAudio, useIntro, useActiveSection, useDaysUntil, useIsClient
  lib/            small helpers, and the Cloudinary upload
public/
  images/         portrait, church photo, gallery, QR codes, link-preview image
  audio/          background music
scripts/
  compile-greetings.mjs   combines the video greetings (run by .github/workflows/)
```
