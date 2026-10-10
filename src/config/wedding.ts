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
    formUrl: string;
    /**
     * Optional. To show the form on the page, open your Google Form → Send → "<>" (embed)
     * and paste the iframe `src` here. Leave empty to show only the button.
     */
    embedUrl: string;
    deadline: string;
    message: string;
  };
  venues: Venue[];
  notes: Note[];
  gifts: GiftAccount[];
  hashtag: {
    tag: string;
    message: string;
    driveUrl: string;
    photo: Photo;
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
const receptionQuery = "Fiesta Infanta Restaurant, Gen. Luna St, Infanta, Quezon";

const groom = "Mark Robert";
const bride = "Donabelle";
const rsvpDeadline = "October 31, 2026";

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
    formUrl: "https://forms.gle/your-google-form-id",
    embedUrl: "",
    deadline: rsvpDeadline,
    message:
      "Your presence is the most precious gift. Kindly let us know if you can celebrate with us by filling out our RSVP form.",
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
      name: "Fiesta Infanta Restaurant",
      address: "Gen. Luna St, Purok 2, Infanta, Quezon",
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
      title: "Unplugged Ceremony",
      body: "A professional photographer will capture our special moments. Please turn off and put away your devices during the ceremony so you can be fully present with us.",
    },
    {
      title: "Gift Guide",
      body: "With all that we have, we've been truly blessed. Your presence and prayers are all that we request. But if you desire to give nonetheless, monetary gift is one we suggest.",
      showGiftQRs: true,
    },
  ],

  gifts: [
    { bank: "UnionBank", qr: "/images/qr/unionbank.png" },
    { bank: "LandBank", qr: "/images/qr/landbank.png" },
    { bank: "GoTyme", qr: "/images/qr/gotyme.png" },
  ],

  hashtag: {
    tag: "#MarkRobertAndDonabelle",
    message:
      "Help us capture our special day and share it by using our hashtag! Please upload your photos to our shared Drive.",
    driveUrl: "https://drive.google.com/drive/folders/your-shared-folder-id",
    photo: {
      src: "/images/hashtag-photo.webp",
      alt: `${groom} and ${bride} walking hand in hand on the beach near the Burj Al Arab`,
      width: 1600,
      height: 1066,
      position: "center 80%",
    },
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
            "Mr. Janus Noel A. Padilla",
            "Mr. Ferdie de Dios",
          ],
        },
        {
          names: [
            "Bernadette T. Abuel",
            "Cynthia A. Batara",
            "Beverly D. Padilla",
            "Chippy T. de Dios",
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
        { heading: "Arras Bearer", names: ["Bruce Aron P. Patalinghug"] },
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
            "Khate Angelie P. Simeon",
            "Esper Ontolan",
          ],
        },
        {
          heading: "Usherettes",
          names: [
            "Ezra Cristine P. Ypil",
            "Grace C. Cabalhin",
            "Jzietel Angel A. Guanzon",
            "Christiane Angelica Y. Laride",
            "Nicole Pulin P. Buenaflor",
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
          names: ["Lilian P. Simeon", "Jovelyn Restivo Corbita", "Jeanneth Kaamino"],
        },
      ],
    },
    {
      title: "Brother of the Bride",
      columns: [{ names: ["Edgardo Y. Patalinghug"] }],
    },
  ],

  gallery: [
    {
      src: "/images/gallery/photo-01.webp",
      alt: `${groom} kneeling to propose to ${bride} beside a reflecting pool below the Burj Khalifa`,
      width: 1066,
      height: 1600,
    },
    {
      src: "/images/gallery/photo-02.webp",
      alt: `${groom} and ${bride} embracing in front of a winged sculpture in Downtown Dubai`,
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
      src: "/images/gallery/photo-04.webp",
      alt: `${groom} and ${bride} nose to nose on the beach, with the Burj Al Arab in the distance`,
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
      src: "/images/gallery/photo-06.webp",
      alt: `${groom} lifting ${bride} in a hug at the water's edge`,
      width: 1600,
      height: 1066,
    },
    {
      src: "/images/gallery/photo-07.webp",
      alt: `${groom} and ${bride} in their wedding attire on a grand staircase`,
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
  ],

  attire: {
    dressCode: "Formal",
    intro:
      "We would love to see you in soft, earthy neutrals. Here is a little guide to help you dress for the day.",
    groups: [
      {
        title: "Principal Sponsors",
        items: [
          { who: "Ninong", what: "Barong Tagalog with black slacks" },
          { who: "Ninang", what: "Long gown or Filipiniana in champagne or taupe" },
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
      { name: "Champagne", hex: "#E9DCC9" },
      { name: "Taupe", hex: "#C9B5A5" },
      { name: "Mocha", hex: "#A88B7D" },
      { name: "Dusty Rose", hex: "#C9A59B" },
      { name: "Sage", hex: "#A9B39B" },
      { name: "Espresso", hex: "#5C4A3F" },
    ],
    note: "Kindly refrain from wearing white, ivory, or denim.",
  },

  faqs: [
    {
      question: "When is the RSVP deadline?",
      answer: `Please confirm your attendance through our Google Form on or before ${rsvpDeadline} so we can prepare your seat.`,
    },
    {
      question: "Can I bring a plus one?",
      answer:
        "Due to limited space, we can only accommodate the guests named on your invitation. If you have a special circumstance, please message us in advance.",
    },
    {
      question: "Are children welcome?",
      answer:
        "We love your little ones! Apart from the children in our entourage, though, we have planned an adults-only celebration.",
    },
    {
      question: "What time should I arrive?",
      answer:
        "The ceremony begins at 2:00 in the afternoon. Please arrive by 1:30 PM so you can be seated before the processional.",
    },
    {
      question: "Can I take photos during the ceremony?",
      answer:
        "We are having an unplugged ceremony, so please keep your phone away until it ends. You are welcome to take photos at the reception. Share them with our hashtag!",
    },
    {
      question: "What should I wear?",
      answer: "Formal attire in soft neutrals. Our Attire Guide above has the full color palette.",
    },
    {
      question: "What gift should we give?",
      answer:
        "Your presence and prayers are more than enough. If you wish to give, a monetary gift through the QR codes in our Gift Guide is greatly appreciated.",
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
