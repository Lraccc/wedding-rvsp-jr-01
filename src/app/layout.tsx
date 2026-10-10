import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Great_Vibes, Inter } from "next/font/google";
import { wedding } from "@/config/wedding";
import "./globals.css";

const greatVibes = Great_Vibes({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-great-vibes",
});

// Only the script font is preloaded: it draws the intro title, the largest element on first paint.
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
  preload: false,
  variable: "--font-cormorant",
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  preload: false,
  variable: "--font-inter",
});

const { site } = wedding;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: site.title,
  description: site.description,
  robots: site.allowIndexing ? undefined : { index: false, follow: false },
  openGraph: {
    type: "website",
    url: "/",
    title: site.title,
    description: site.description,
    images: [{ url: site.ogImage, width: 1200, height: 630, alt: site.title }],
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
    images: [site.ogImage],
  },
};

export const viewport: Viewport = {
  themeColor: "#fbf7f1",
  colorScheme: "light",
};

// Without JavaScript the intro can't be opened, so skip it and show the page as-is.
const noScriptCss = `
  [data-intro] { display: none !important; }
  html { overflow: auto !important; }
  .content-deferred { content-visibility: visible !important; }
  [data-reveal] { opacity: 1 !important; transform: none !important; }
`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${greatVibes.variable} ${cormorant.variable} ${inter.variable}`}>
      <head>
        <noscript>
          <style>{noScriptCss}</style>
        </noscript>
      </head>
      <body>{children}</body>
    </html>
  );
}
