# Mark Robert & Donabelle · Wedding Invitation

A single-page wedding invitation: a wax-sealed envelope that opens into the invitation, with
venue maps, guest notes, gift QR codes, entourage, photo gallery, attire guide, FAQs and RSVP.
It is a fully static site, so it can be hosted for free on Vercel, Netlify or Cloudflare Pages.

**Stack:** Next.js 16 (App Router, static export) · TypeScript · Tailwind CSS v4 ·
Framer Motion · `next/font` (Great Vibes, Cormorant Garamond, Inter) · lucide-react.
There is no backend: RSVPs go to a Google Form, photos to a shared Google Drive folder,
and maps are Google Maps embeds.

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
time lines, envelope title, hero wording, venues and map links, RSVP form and deadline, notes,
gift QR codes, hashtag and Drive link, entourage, gallery, attire guide, FAQs, music, and the site
URL used for link previews. Each field is typed, so your editor will flag mistakes.

### Photos

| File                                     | Where it appears                                 |
| ---------------------------------------- | ------------------------------------------------ |
| `public/images/couple-portrait.webp`     | Hero portrait under the couple's names           |
| `public/images/hashtag-photo.webp`       | Full-width photo under the hashtag               |
| `public/images/gallery/photo-01…10.webp` | Photos section, in the order listed in `gallery` |

To swap a photo, replace the file (or point the config at a new one) and update its `width`,
`height` and `alt` in the config, so the page reserves the right space and screen readers describe
it. `hashtag.photo.position` sets which part of the full-width photo stays visible when wide screens
crop it. Export photos as WebP or JPEG around 1600–2400px on the long side to keep the site fast.

### Replace the placeholders

| Placeholder                                                    | Replace with                                     |
| -------------------------------------------------------------- | ------------------------------------------------ |
| `public/images/qr/unionbank.png`, `landbank.png`, `gotyme.png` | Your InstaPay QR codes                           |
| `public/images/og-image.jpg` (1200×630)                        | Link-preview image for Messenger, Facebook, etc. |
| `src/app/icon.svg`, `src/app/apple-icon.png`                   | Favicon and home-screen icon                     |

### Music

The background song is `public/audio/how-do-i-live-sax-cover.mp3` ("How Do I Live", saxophone
cover by Christian Ama), set in `music.src`. To change it, put another MP3 in `public/audio/` and
update `music.src`. Prefer a 128 kbps file without embedded cover art: the song only starts once
the start of the file has downloaded, and cover art sits at the start.

### Links

- **RSVP:** set `rsvp.formUrl` to your Google Form's share link. To also show the form on the
  page, open the form, choose **Send → `<>`**, and paste the iframe's `src` into `rsvp.embedUrl`.
- **Photo uploads:** create a Google Drive folder, share it so guests can add files, and paste its
  link into `hashtag.driveUrl`.
- **Maps:** each venue builds its embed and "Open in Google Maps" links from the venue name. For an
  exact pin, open the place in Google Maps, choose **Share → Embed a map**, and paste only the
  iframe's `src` into `mapEmbedUrl`.
- **Link previews:** set `site.url` to your final address (for example
  `https://mark-robert-and-donabelle.vercel.app`).
- **Search engines:** `site.allowIndexing` is `false`, so the invitation asks not to be indexed.
  Set it to `true` if you want it to appear in search results.

### Design tokens

Tailwind v4 is configured in CSS: the `@theme` block at the top of `src/app/globals.css` holds the
palette (cream, taupe, rose, espresso…), type scale, letter-spacing, section spacing, shadows and
easing. Change a value there and every component that uses it follows. Fonts are loaded in
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
  components/     Envelope, Nav, Hero, Countdown, VenueMap, ImportantNotes, GiftQR, Hashtag,
                  Entourage, Gallery, Lightbox, AttireGuide, Faqs, Rsvp, Footer, FloralDecor,
                  MusicToggle, and small shared pieces
  config/         wedding.ts: all editable content
  hooks/          useAudio, useIntro, useActiveSection, useDaysUntil, useIsClient
  lib/            small helpers
public/
  images/         portrait, church photo, gallery, QR codes, link-preview image
  audio/          background music
```
