/**
 * All editable wedding content lives in this file.
 *
 * Paths that start with "/" point into the `public/` folder, e.g.
 * "/images/couple-portrait.webp" is the file `public/images/couple-portrait.webp`.
 * If you replace an image with one of a different size, update its width and height
 * so the page can reserve the right space while it loads.
 */

export type Photo = {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** Where to anchor the crop when a photo is shown cropped (CSS object-position). */
  position?: string;
};

export type Venue = {
  label: string;
  name: string;
  address: string;
  /** Google Maps → Share → "Embed a map" → copy only the `src` value of the iframe. */
  mapEmbedUrl: string;
  /** Opened by the "Open in Google Maps" link. */
  mapUrl: string;
  /** Shows a "Sample location only" mark on the card. Remove once the real venue is set. */
  placeholder?: boolean;
};

export type Note = {
  title: string;
  body: string;
  /** Shows the bank QR codes directly under this note. */
  showGiftQRs?: boolean;
};

export type GiftAccount = {
  bank: string;
  qr: string;
  /** Pixel size of the QR image, so the page reserves the right space. */
  width: number;
  height: number;
};

export type EntourageColumn = {
  heading?: string;
  names: string[];
};

export type EntourageGroup = {
  title?: string;
  /** One column renders a centered list; two or three render side by side. */
  columns: EntourageColumn[];
};

export type AttireGroup = {
  title: string;
  items: { who: string; what: string }[];
};

export type Swatch = {
  name: string;
  hex: string;
};

export type Faq = {
  question: string;
  answer: string;
};

export type WeddingConfig = {
  site: {
    /** The address the site is deployed to. Used for link previews on Messenger, Facebook, etc. */
    url: string;
    title: string;
    description: string;
    ogImage: string;
    /** Keep false to ask search engines not to index the invitation. */
    allowIndexing: boolean;
  };
  couple: {
    groom: string;
    bride: string;
    monogram: [string, string];
  };
  envelope: {
    title: string;
    /** Bible verse under the title; the wedding hashtag is shown below it. */
    verse: { reference: string; text: string };
    prompt: string;
    letterGreeting: string;
  };
  date: {
    /** YYYY-MM-DD, used by the countdown. */
    iso: string;
    display: string;
    timeLine: string;
    short: string;
  };
  hero: {
    blessing: string;
    intro: string;
    invitation: string;
    photo: Photo;
  };
  rsvp: {
    /** The Google Form, offered on the RSVP page if a response can't be sent. */
    formUrl: string;
    deadline: string;
    /** Shown in the RSVP section of the invitation, above the button to the RSVP page. */
    message: string;
    /** The RSVP page (/rsvp) opens with these, above the deadline and the form. */
    tagline: string;
    intro: string;
    /** Shown under the form. */
    closing: string;
    questions: { attend: string; yes: string; no: string; names: string };
    thankYou: { yes: string; no: string };
    /**
     * Each response is saved to Cloudinary as a text file. Leave `cloudName` empty to send
     * guests to the Google Form instead.
     */
    cloudinary: { cloudName: string; uploadPreset: string };
  };
  venues: Venue[];
  notes: Note[];
  gifts: GiftAccount[];
  hashtag: {
    /** Small capitals above the heading. */
    eyebrow: string;
    heading: string;
    intro: string;
    /** Shown as numbered steps; the hashtag follows the last one. */
    steps: string[];
    tag: string;
    closing: string;
    /** Shown above the couple's names. */
    signOff: string;
    photo: Photo;
  };
  greetings: {
    /** Small capitals above the heading. */
    eyebrow: string;
    heading: string;
    intro: string;
    /** Label of the button in the hashtag section that opens the greetings page. */
    cta: string;
    thankYou: string;
    /** Longest greeting, in seconds. Recording stops here and longer videos are turned away. */
    maxSeconds: number;
    /** Cloudinary's free plan refuses videos over 100 MB. */
    maxFileMB: number;
    /**
     * Guests' videos upload straight to Cloudinary. Leave `cloudName` empty to hide the
     * greetings button and show "open soon" on the page until the account is set up.
     */
    cloudinary: { cloudName: string; uploadPreset: string };
    /** The combined video, published by the "Greetings compilation" GitHub workflow. */
    compilationUrl: string;
  };
  entourage: EntourageGroup[];
  gallery: Photo[];
  attire: {
    dressCode: string;
    intro: string;
    groups: AttireGroup[];
    palette: Swatch[];
    note: string;
  };
  faqs: Faq[];
  music: {
    src: string;
    /** 0 to 1. Browsers on iPhone ignore this and play at full volume. */
    volume: number;
  };
  closing: {
    message: string;
  };
};

const mapEmbed = (query: string) =>
  `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;

const mapLink = (query: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

const ceremonyQuery = "Corpus Christi Parish, Tubod, Iligan City";
const receptionQuery = "Plaza Alemania Hotel, Quezon Avenue Extension, Iligan City";

const groom = "Mark Robert";
const bride = "Donabelle";
const rsvpDeadline = "November 10, 2026";
// The Cloudinary account that receives the video greetings and the RSVPs.
const cloudinaryCloudName = "fn9yk2m1";

export const wedding: WeddingConfig = {
  site: {
    url: "https://mark-donabelle-wedding.onrender.com",
    title: `${groom} & ${bride} · December 18, 2026`,
    description: `You are invited to celebrate the marriage of ${groom} and ${bride} on Friday, December 18, 2026.`,
    ogImage: "/images/og-image.jpg",
    allowIndexing: false,
  },

  couple: {
    groom,
    bride,
    monogram: ["M", "D"],
  },

  envelope: {
    title: "Gummery Nuptials",
    verse: {
      reference: "Mark 10:9",
      text: "Therefore what God has joined together, let no one separate.",
    },
    prompt: "Click to open",
    letterGreeting: "You are invited",
  },

  date: {
    iso: "2026-12-18",
    display: "December 18, 2026",
    timeLine: "Friday, 2 o'clock in the afternoon",
    short: "12 · 18 · 2026",
  },

  hero: {
    blessing: "By the grace of God and the blessing of our families",
    intro: "We,",
    invitation: "Request the honor of your presence at the celebration of our marriage before God",
    photo: {
      src: "/images/couple-portrait.webp",
      alt: `${groom} and ${bride} smiling at each other in Dubai, with the Burj Al Arab behind them`,
      width: 1066,
      height: 1600,
    },
  },

  rsvp: {
    formUrl: "https://forms.gle/EzxEQbRRSpzq3jsU6",
    deadline: rsvpDeadline,
    message:
      "Your presence is the most precious gift. Kindly let us know if you can celebrate with us by filling out our RSVP form.",
    tagline: "The countdown is on, and we’re saving you a seat!",
    intro: `Please join us as we celebrate the wedding of ${groom} and ${bride} Gummery.`,
    closing:
      "Your presence means so much to us, and we can’t wait to celebrate this special day with you!",
    questions: {
      attend: "Can you attend?",
      yes: "Yes, I’ll be there",
      no: "Sorry, can’t make it",
      names: "Complete name of the attendee/s",
    },
    thankYou: {
      yes: "Thank you! Your seat is saved. We can’t wait to see you on December 18.",
      no: "Thank you for letting us know. You will be missed, and we are grateful for your love and prayers.",
    },
    cloudinary: { cloudName: cloudinaryCloudName, uploadPreset: "wedding_rsvp" },
  },

  venues: [
    {
      label: "Ceremony",
      name: "Corpus Christi Parish",
      address: "Tubod, Iligan City, Lanao del Norte",
      mapEmbedUrl: mapEmbed(ceremonyQuery),
      mapUrl: mapLink(ceremonyQuery),
    },
    {
      label: "Reception",
      name: "Plaza Alemania Hotel",
      address: "6th Floor Berlin Hall, Iligan City, Lanao del Norte",
      mapEmbedUrl: mapEmbed(receptionQuery),
      mapUrl: mapLink(receptionQuery),
    },
  ],

  notes: [
    {
      title: "With Respect",
      body: "We'd love to include everyone, but due to limited space, we're only able to accommodate those listed on the invitation. However, if you have a special circumstance and need to bring someone, please let us know in advance. We hope for your understanding. Thank you.",
    },
    {
      title: "Gift Guide",
      body: "With all that we have, we've been truly blessed. Your presence and prayers are all that we request. But if you desire to give nonetheless, monetary gift is one we suggest.",
      showGiftQRs: true,
    },
  ],

  gifts: [{ bank: "InstaPay", qr: "/images/qr/instapay.png", width: 222, height: 269 }],

  hashtag: {
    eyebrow: "Don’t just attend",
    heading: "Share the Love!",
    intro: "Help us capture every moment of our special day!",
    steps: [
      "Take photos and videos.",
      "Upload them to Facebook or Instagram.",
      "Add our official wedding hashtag:",
    ],
    tag: "#MarkTheDateForDonnabelle",
    closing: "Let’s make our wedding memories last forever!",
    signOff: "With love,",
    photo: {
      src: "/images/hashtag-photo.webp",
      alt: `${groom} and ${bride} walking hand in hand on the beach near the Burj Al Arab`,
      width: 1600,
      height: 1066,
      position: "center 80%",
    },
  },

  greetings: {
    eyebrow: "Send your love",
    heading: "Video Greetings",
    intro: `Record a short message for ${groom} & ${bride}, up to one minute long. Every greeting will be put together into one video for them to keep.`,
    cta: "Send a video greeting",
    thankYou: "Thank you! Your greeting is on its way to the couple.",
    maxSeconds: 60,
    maxFileMB: 100,
    cloudinary: { cloudName: cloudinaryCloudName, uploadPreset: "wedding_greetings" },
    compilationUrl:
      "https://github.com/Lraccc/wedding-rvsp-jr-01/releases/download/greetings/greetings-compilation.mp4",
  },

  // Side-by-side columns are shown as pairs: the nth name of each column shares a row.
  entourage: [
    {
      title: "Principal Sponsors",
      columns: [
        {
          names: [
            "Mr. Segfred A. Abuel",
            "Mr. Emerito B. Batara",
            "Mr. Ferdie de Dios",
            "Mr. Janus Noel A. Padilla",
          ],
        },
        {
          names: [
            "Bernadette T. Abuel",
            "Cynthia A. Batara",
            "Chippy T. de Dios",
            "Beverly D. Padilla",
          ],
        },
      ],
    },
    {
      title: "Candle & Veil",
      columns: [
        { names: ["Mr. Estrellito P. Ypil", "Mr. Victor Panfila Q. Guanzon"] },
        { names: ["Mrs. Ma. Corazon P. Ypil", "Mrs. Marites P. Guanzon"] },
      ],
    },
    {
      title: "Cord",
      columns: [
        { names: ["Mr. Esperidion Y. Patalinghug"] },
        { names: ["Mrs. Mary Joy P. Patalinghug"] },
      ],
    },
    {
      columns: [
        { heading: "Bible Bearer", names: ["Pierce Adam P. Patalinghug"] },
        { heading: "Arras Bearer", names: ["Bruce Aaron P. Patalinghug"] },
        { heading: "Flower Girl / Ring Bearer", names: ["Christie Amari Y. Laride"] },
      ],
    },
    {
      title: "Love Offering",
      columns: [
        {
          names: [
            "Teresita Janet P. Tagab",
            "Elizabeth P. Buenaflor",
            "Ma. Corazon P. Ypil",
            "Marites P. Guanzon",
            "Lilian Simeon",
            "Mary Joy P. Padilla",
            "Mr. Steve & Mrs. Mandy Spraggette",
            "Mr. Rick Grist & Mrs. Genelyn Grist",
            "Mr. Tyrron Rode & Mrs. Christine Rode",
            "Mr. Isagani & Mrs. Jean Mendoza",
          ],
        },
      ],
    },
    {
      columns: [
        {
          heading: "Ushers",
          names: [
            "Dale Kristian P. Ypil",
            "Pierce Adam P. Patalinghug",
            "Kevin P. Guanzon",
            "Bruce Aaron P. Patalinghug",
            "Esper Anthony Ontolan",
            "August Anthony P. Encarnacion",
            "Mark P. Tagab",
          ],
        },
        {
          heading: "Usherettes",
          names: [
            "Ezra Christine P. Ypil",
            "Grace C. Cabalhin",
            "Jzietel Angel A. Guanzon",
            "Christiane Angelica Y. Laride",
            "Khate Angelie P. Simeon",
            "Nichole Pohlin P. Buenaflor",
            "Julibeth E. Sabar",
            "Kayle Erika Shayne P. Nayal",
            "Keira Franz Erin P. Nayal",
            "Shahanie T. Amo",
          ],
        },
      ],
    },
    {
      columns: [
        { heading: "Best Man", names: ["Esperidion Y. Patalinghug"] },
        { heading: "Matron of Honor", names: ["Elizabeth P. Buanaflor"] },
      ],
    },
    {
      columns: [
        {
          heading: "Bridesmaids",
          names: ["Lilian P. Simeon", "Juvelyn C. Corbita", "Jeanneth Kaamino"],
        },
      ],
    },
    {
      title: "Brother of the Bride",
      columns: [{ names: ["Edgardo Y. Patalinghug"] }],
    },
  ],

  // Shown top to bottom: the beach, then the orange and beige outfits, then the wedding.
  // Keep the ring photos together: the proposal ends one group and the ring exchange starts the next.
  gallery: [
    // Beach
    {
      src: "/images/gallery/photo-24.webp",
      alt: `${groom} and ${bride} strolling along the beach, with the Burj Al Arab in the distance`,
      width: 1600,
      height: 1066,
    },
    {
      src: "/images/gallery/photo-04.webp",
      alt: `${groom} and ${bride} nose to nose on the beach, with the Burj Al Arab in the distance`,
      width: 1600,
      height: 1066,
    },
    {
      src: "/images/gallery/photo-06.webp",
      alt: `${groom} lifting ${bride} in a hug at the water's edge`,
      width: 1600,
      height: 1066,
    },
    {
      src: "/images/gallery/photo-05.webp",
      alt: `${groom} and ${bride} sitting together on the seaside rocks`,
      width: 1600,
      height: 1066,
    },
    {
      src: "/images/gallery/photo-27.webp",
      alt: `Close-up of ${groom} in sunglasses smiling at ${bride} as the sea breeze lifts her hair`,
      width: 1600,
      height: 1066,
    },
    {
      src: "/images/gallery/photo-26.webp",
      alt: `${groom} giving ${bride} a piggyback ride along the shore`,
      width: 1600,
      height: 1066,
    },
    {
      src: "/images/gallery/photo-25.webp",
      alt: `${bride} leaning in for a kiss from ${groom} on the beach, with the Burj Al Arab on the horizon`,
      width: 1600,
      height: 1066,
    },
    {
      src: "/images/gallery/photo-28.webp",
      alt: `${groom} sweeping ${bride} off her feet on the beach`,
      width: 1600,
      height: 1066,
    },
    // Orange: by the Burj Al Arab, then at the wings sculpture below the Burj Khalifa
    {
      src: "/images/gallery/photo-22.webp",
      alt: `${groom} and ${bride} cheek to cheek, with the Burj Al Arab behind them`,
      width: 1600,
      height: 1066,
    },
    {
      src: "/images/gallery/photo-03.webp",
      alt: `${groom} kissing ${bride} on the forehead`,
      width: 1066,
      height: 1600,
    },
    {
      src: "/images/gallery/photo-23.webp",
      alt: `${bride} smiling at the camera as ${groom} kisses her forehead`,
      width: 1066,
      height: 1600,
    },
    {
      src: "/images/gallery/photo-11.webp",
      alt: `Title card reading "Mark & Dona, Pre-Wedding Dubai UAE" over a photo of ${groom} and ${bride} at a winged sculpture below the Burj Khalifa`,
      width: 1600,
      height: 1066,
    },
    {
      src: "/images/gallery/photo-02.webp",
      alt: `${groom} and ${bride} embracing in front of a winged sculpture in Downtown Dubai`,
      width: 1600,
      height: 1066,
    },
    {
      src: "/images/gallery/photo-17.webp",
      alt: `${groom} and ${bride} embracing between the bronze wings of a sculpture, with the Burj Khalifa rising behind them`,
      width: 1066,
      height: 1600,
    },
    {
      src: "/images/gallery/photo-18.webp",
      alt: `${bride} hugging ${groom} between the bronze wings, both smiling at the camera`,
      width: 1600,
      height: 1066,
    },
    {
      src: "/images/gallery/photo-19.webp",
      alt: `${groom} and ${bride} gazing at each other on the pedestal of the winged sculpture`,
      width: 1066,
      height: 1600,
    },
    {
      src: "/images/gallery/photo-20.webp",
      alt: `${groom} and ${bride} beneath the winged sculpture, with the Burj Khalifa towering above them`,
      width: 1066,
      height: 1600,
    },
    {
      src: "/images/gallery/photo-21.webp",
      alt: `${groom} and ${bride} standing together under the bronze wings`,
      width: 1066,
      height: 1600,
    },
    // Beige: the Palace Downtown pools below the Burj Khalifa, ending with the proposal
    {
      src: "/images/gallery/photo-16.webp",
      alt: `${groom} and ${bride} at the end of a long reflecting pool in front of the Palace Downtown`,
      width: 1600,
      height: 1044,
    },
    {
      src: "/images/gallery/photo-13.webp",
      alt: `${groom} and ${bride} embracing beside a palm-lined pool in Downtown Dubai`,
      width: 1066,
      height: 1600,
    },
    {
      src: "/images/gallery/photo-14.webp",
      alt: `${groom} kissing ${bride} on the cheek beside a pool under a carved wooden arch`,
      width: 1600,
      height: 1066,
    },
    {
      src: "/images/gallery/photo-01.webp",
      alt: `${groom} kneeling to propose to ${bride} beside a reflecting pool below the Burj Khalifa`,
      width: 1066,
      height: 1600,
    },
    {
      src: "/images/gallery/photo-15.webp",
      alt: `${groom} kneeling to offer ${bride} a ring on a poolside walkway below the Burj Khalifa`,
      width: 1066,
      height: 1600,
    },
    {
      src: "/images/gallery/photo-12.webp",
      alt: `${groom} on one knee proposing to ${bride} beside the pools of the Palace Downtown, with the Burj Khalifa behind them`,
      width: 1600,
      height: 1248,
    },
    // Wedding, starting with the ring exchange
    {
      src: "/images/gallery/photo-09.webp",
      alt: `${groom} and ${bride} exchanging rings at their civil ceremony in Abu Dhabi`,
      width: 1600,
      height: 1066,
    },
    {
      src: "/images/gallery/photo-10.webp",
      alt: `Close-up of ${groom} slipping the ring onto ${bride}'s finger`,
      width: 1600,
      height: 1066,
    },
    {
      src: "/images/gallery/photo-37.webp",
      alt: `Close-up of ${bride} slipping the ring onto ${groom}'s finger`,
      width: 1600,
      height: 1066,
    },
    {
      src: "/images/gallery/photo-39.webp",
      alt: `${groom} raising a fist in celebration beside ${bride}, holding her bouquet, under the Abu Dhabi Civil Family Court sign`,
      width: 961,
      height: 1280,
    },
    {
      src: "/images/gallery/photo-40.webp",
      alt: `${groom} and ${bride} laughing together in the doorway of the Abu Dhabi Civil Family Court`,
      width: 960,
      height: 1280,
    },
    {
      src: "/images/gallery/photo-31.webp",
      alt: `${groom} and ${bride} in their wedding attire in a grand lobby with a patterned marble floor`,
      width: 1200,
      height: 1600,
    },
    {
      src: "/images/gallery/photo-29.webp",
      alt: `${bride} in her wedding gown, veil and tiara, holding a bouquet of red and white roses`,
      width: 978,
      height: 1600,
    },
    {
      src: "/images/gallery/photo-41.webp",
      alt: `${groom} and ${bride} in their wedding attire in a sunlit atrium under a glass roof`,
      width: 960,
      height: 1280,
    },
    {
      src: "/images/gallery/photo-07.webp",
      alt: `${groom} and ${bride} in their wedding attire on a grand staircase`,
      width: 1066,
      height: 1600,
    },
    {
      src: "/images/gallery/photo-43.webp",
      alt: `${bride} smiling with her bouquet beside ${groom} at the foot of a staircase`,
      width: 1280,
      height: 853,
    },
    {
      src: "/images/gallery/photo-36.webp",
      alt: `${groom} and ${bride} posing together on the staircase beside the escalator`,
      width: 1066,
      height: 1600,
    },
    {
      src: "/images/gallery/photo-34.webp",
      alt: `${groom} sitting on the stairs and holding ${bride}'s hand as she stands beside him`,
      width: 1066,
      height: 1600,
    },
    {
      src: "/images/gallery/photo-33.webp",
      alt: `${groom} and ${bride} in their wedding attire beside a wall of copper slats`,
      width: 1066,
      height: 1600,
    },
    {
      src: "/images/gallery/photo-08.webp",
      alt: `${bride} holding her bridal bouquet beside ${groom}`,
      width: 1600,
      height: 1066,
    },
    {
      src: "/images/gallery/photo-42.webp",
      alt: `${groom} and ${bride} sharing a kiss beside a wall of copper slats, her bouquet of red and white roses between them`,
      width: 1280,
      height: 960,
    },
  ],

  attire: {
    dressCode: "Formal",
    intro:
      "We would love to see you in rich shades of red with a touch of gold. Here is a little guide to help you dress for the day.",
    groups: [
      {
        title: "Principal Sponsors",
        items: [
          { who: "Ninong", what: "Barong Tagalog with black slacks" },
          { who: "Ninang", what: "Long gown or Filipiniana in red or gold" },
        ],
      },
      {
        title: "Guests",
        items: [
          { who: "Gentlemen", what: "Long-sleeved polo or barong with slacks" },
          { who: "Ladies", what: "Cocktail or long dress in our color palette" },
        ],
      },
    ],
    palette: [
      { name: "Cherry Red", hex: "#BE1E2D" },
      { name: "Crimson", hex: "#961A30" },
      { name: "Burgundy", hex: "#64121F" },
      { name: "Champagne", hex: "#EADBBE" },
      { name: "Gold", hex: "#CBA65F" },
      { name: "Antique Gold", hex: "#9E7B3B" },
    ],
    note: "Kindly refrain from wearing white, ivory, or denim.",
  },

  faqs: [
    {
      question: "When is the RSVP deadline?",
      answer: `Please confirm your attendance through the RSVP form at the end of this invitation on or before ${rsvpDeadline} so we can prepare your seat.`,
    },
    {
      question: "Can I bring a plus one?",
      answer:
        "Due to limited space, we can only accommodate the guests named on your invitation. If you have a special circumstance, please message us in advance.",
    },
    {
      question: "What time should I arrive?",
      answer:
        "The ceremony begins at 2:00 in the afternoon. Please arrive by 1:30 PM so you can be seated before the processional.",
    },
    {
      question: "Is there parking at the venues?",
      answer: "Parking is limited at both venues, so we encourage carpooling.",
    },
    {
      question: "Can I take photos during the ceremony?",
      answer:
        "Yes, of course! You are welcome to take photos and videos during the ceremony and the reception. Share them with our hashtag!",
    },
    {
      question: "What should I wear?",
      answer:
        "Formal attire in shades of red with a touch of gold. Our Attire Guide above has the full color palette.",
    },
    {
      question: "What gift should we give?",
      answer:
        "Anything from the heart is welcome, but your presence and prayers mean the most to us. If you wish to give a monetary gift, that is very much appreciated too, and you can send it through the QR code in our Gift Guide.",
    },
  ],

  music: {
    src: "/audio/how-do-i-live-sax-cover.mp3",
    volume: 0.55,
  },

  closing: {
    message: "We can't wait to celebrate with you!",
  },
};
