export type ShowcaseCategory =
  | "all"
  | "video"
  | "property"
  | "viral"
  | "carousel"
  | "flyer"
  | "analytics";

export type ShowcaseItem = {
  id: string;
  type: "video" | "image";
  category: Exclude<ShowcaseCategory, "all">;
  src: string;
  poster?: string;
  aspect?: "portrait" | "wide";
  client: string;
  title: {
    id: string;
    en: string;
  };
  tag: {
    id: string;
    en: string;
  };
};

const materialItems: ShowcaseItem[] = [
  {
    id: "reel-hl-goat",
    type: "video",
    category: "video",
    src: "/assets/videos/reels/HL-GOAT.mp4",
    poster: "/assets/gallery/posters/hl-goat.webp",
    aspect: "portrait",
    client: "Driving Academy",
    title: { id: "HL-GOAT — Video Reels", en: "HL-GOAT — Video Reel" },
    tag: { id: "Video Reels", en: "Video Reel" },
  },
  {
    id: "reel-alzafa3-tanahkavling",
    type: "video",
    category: "video",
    src: "/assets/videos/reels/alzafa3-tanahkavling.mp4",
    poster: "/assets/gallery/posters/alzafa3.webp",
    aspect: "portrait",
    client: "Alzafa Residence Tahap 3",
    title: { id: "Tanah Kavling Alzafa 3", en: "Alzafa 3 Land Plots" },
    tag: { id: "Video Reels Properti", en: "Property Video Reel" },
  },
  {
    id: "reel-alzafa3-tarik",
    type: "video",
    category: "video",
    src: "/assets/videos/reels/alzafa3-tarik.mp4",
    poster: "/assets/gallery/posters/alzafa3.webp",
    aspect: "portrait",
    client: "Alzafa Residence Tahap 3",
    title: { id: "Tarik Promo Alzafa 3", en: "Alzafa 3 Promo" },
    tag: { id: "Video Reels Properti", en: "Property Video Reel" },
  },
  {
    id: "reel-bir2-modal100rb",
    type: "video",
    category: "video",
    src: "/assets/videos/reels/bir2-modal100rb.mp4",
    poster: "/assets/gallery/posters/bir2.webp",
    aspect: "portrait",
    client: "BIR2",
    title: { id: "BIR2 — Modal 100 Ribu", en: "BIR2 — 100K Down Payment" },
    tag: { id: "Video Reels Properti", en: "Property Video Reel" },
  },
  {
    id: "reel-ads-harigini",
    type: "video",
    category: "video",
    src: "/assets/videos/reels/ads-harigini.mp4",
    poster: "/assets/gallery/posters/ammaia.webp",
    aspect: "portrait",
    client: "The Ammaia Hills",
    title: { id: "Ads Hari Gini", en: "Ads Like This" },
    tag: { id: "Video Reels Properti", en: "Property Video Reel" },
  },
  ...[
    ["21tahun", "21 Tahun Berkarya", "Creative Campaign"],
    ["alzafa3-artimerdeka", "Alzafa 3 — Promo Kemerdekaan", "Property Campaign"],
    ["avana-mannequin", "Avana — Creative Campaign", "Property Campaign"],
    ["bir4-sogokduit", "BIR4 — Sogok Duit", "Property Campaign"],
    ["SPAM-LIVE-2", "Spam Live — Campaign Visual", "Content Creative"],
  ].map(([id, title, tag]) => ({
    id: `cover-${id.toLowerCase().replaceAll(" ", "-")}`,
    type: "image" as const,
    category: id.toLowerCase().includes("spam") ? ("viral" as const) : ("property" as const),
    src: `/assets/gallery/covers/${id}${id === "SPAM-LIVE-2" ? ".jpg" : ".png"}`,
    aspect: "portrait" as const,
    client: id.toLowerCase().includes("bir") ? "BIR Property" : "RK Group Property",
    title: { id: title, en: title },
    tag: { id: tag, en: tag },
  })),
  ...[
    ...Array.from({ length: 5 }, (_, index) => ({
      src: `/assets/gallery/carousel/Alzafa-3/${index + 1}.jpg`,
      id: `alzafa3-${index + 1}`,
      client: "Alzafa Residence Tahap 3",
      title: `Alzafa 3 — Carousel ${index + 1}`,
    })),
    ...Array.from({ length: 5 }, (_, index) => ({
      src: `/assets/gallery/carousel/BIR2/${index + 1}.${index === 3 ? "jpg" : "png"}`,
      id: `bir2-${index + 1}`,
      client: "BIR2",
      title: `BIR2 — Carousel ${index + 1}`,
    })),
    ...Array.from({ length: 5 }, (_, index) => ({
      src: `/assets/gallery/carousel/BIR2/wm (${index + 1}).jpg`,
      id: `bir2-wm-${index + 1}`,
      client: "BIR2",
      title: `BIR2 — Carousel ${index + 1}`,
    })),
    ...Array.from({ length: 5 }, (_, index) => ({
      src: `/assets/gallery/carousel/BIR4/crsl-bir4-${index + 1}.jpg`,
      id: `bir4-${index + 1}`,
      client: "BIR4",
      title: `BIR4 — Carousel ${index + 1}`,
    })),
  ].map(({ src, id, client, title }) => ({
    id: `carousel-${id}`,
    type: "image" as const,
    category: "carousel" as const,
    src,
    aspect: "portrait" as const,
    client,
    title: { id: title, en: title },
    tag: { id: "Slide Carousel", en: "Carousel Slide" },
  })),
  ...[
    ["adha2026-v1.jpg", "Promo Iduladha 2026 — Versi 1", "RK Group Property"],
    ["adha2026-v2.jpg", "Promo Iduladha 2026 — Versi 2", "RK Group Property"],
    ["alzafa-cetak (P).jpg", "Flyer Cetak Alzafa", "Alzafa Residence Tahap 3"],
    ["Alzafa3-81merdeka.jpg", "Alzafa 3 — Promo Kemerdekaan", "Alzafa Residence Tahap 3"],
    ["avam-9gift-aug.jpg", "Avana — Promo Gift Agustus", "Avana Hills Palembang"],
    ["avam-choice-aug-foot-blue.jpg", "Avana — Promo Pilihan Agustus", "Avana Hills Palembang"],
    ["banner-bir2-belakang (1.75x2).jpg", "BIR2 — Banner Belakang", "BIR2"],
    ["buat-capcut.jpg", "Materi Promo untuk CapCut", "RK Group Property"],
    ["flyer-libur-ammaia.jpg", "Informasi Libur Ammaia", "The Ammaia Hills"],
    ["simple-ads.jpg", "Simple Ads — Property Campaign", "RK Group Property"],
  ].map(([file, title, client]) => ({
    id: `flyer-${file.toLowerCase().replaceAll(/[^a-z0-9]+/g, "-")}`,
    type: "image" as const,
    category: "flyer" as const,
    src: `/assets/gallery/flyers/${file}`,
    aspect: file.includes("banner") ? ("wide" as const) : ("portrait" as const),
    client,
    title: { id: title, en: title },
    tag: { id: "Flyer & Materi Promosi", en: "Flyer & Promotion" },
  })),
];

export const showcaseItems: ShowcaseItem[] = [
  ...materialItems,
  {
    id: "video-walkthrough-avana",
    type: "video",
    category: "video",
    src: "/assets/videos/real-estate-walkthrough.mp4",
    poster: "/assets/gallery/posters/avana.webp",
    aspect: "portrait",
    client: "RK Group Property",
    title: {
      id: "House Tour & Cinematic Walkthrough",
      en: "House Tour & Cinematic Walkthrough",
    },
    tag: {
      id: "Video Reels 9:16",
      en: "9:16 Video Reels",
    },
  },
  {
    id: "avana-1m-hook",
    type: "image",
    category: "property",
    src: "/assets/images/avana-1m-aja.png",
    aspect: "portrait",
    client: "Avana Hills Palembang",
    title: {
      id: "Cluster Mewah 1M-an — Ad Hook",
      en: "1M Luxury Cluster — Ad Hook",
    },
    tag: {
      id: " Kampanye Properti",
      en: "Property Campaign",
    },
  },
  {
    id: "avana-cinematic-poster",
    type: "image",
    category: "property",
    src: "/assets/images/cine-avan-100826.png",
    aspect: "portrait",
    client: "Avana Hills Palembang",
    title: {
      id: "Rumah Idaman Masa Kini",
      en: "Modern Dream Residence",
    },
    tag: {
      id: "Key Visual",
      en: "Key Visual",
    },
  },
  {
    id: "ammaia-cinematic-cover",
    type: "image",
    category: "property",
    src: "/assets/images/ammaia-cine.png",
    aspect: "portrait",
    client: "The Ammaia Hills",
    title: {
      id: "Where Nature Meets Comfort",
      en: "Where Nature Meets Comfort",
    },
    tag: {
      id: "Cinematic Cover",
      en: "Cinematic Cover",
    },
  },
  {
    id: "ammaia-call-me",
    type: "image",
    category: "property",
    src: "/assets/images/ammaia-callme.png",
    aspect: "portrait",
    client: "The Ammaia Hills",
    title: {
      id: "So, Call Me Maybe — Lead Gen",
      en: "So, Call Me Maybe — Lead Gen",
    },
    tag: {
      id: "Meta Ads Creative",
      en: "Meta Ads Creative",
    },
  },
  {
    id: "ammaia-secret-promo",
    type: "image",
    category: "property",
    src: "/assets/images/ammaia-pesansekalilihat.png",
    aspect: "portrait",
    client: "The Ammaia Hills",
    title: {
      id: "Pesan Rahasia Promo Bulan Depan",
      en: "Secret Next-Month Promo Hook",
    },
    tag: {
      id: "Interactive Hook",
      en: "Interactive Hook",
    },
  },
  {
    id: "alzafa-subsidi-komersil",
    type: "image",
    category: "property",
    src: "/assets/images/alzafa3-udahgila.png",
    aspect: "portrait",
    client: "Alzafa Residence Tahap 3",
    title: {
      id: "Rumah Subsidi Rasa Komersil",
      en: "Commercial-Grade Subsidized Home",
    },
    tag: {
      id: "High-CTR Ad",
      en: "High-CTR Ad",
    },
  },
  {
    id: "rk-tarik-promo",
    type: "image",
    category: "property",
    src: "/assets/images/alzafa3-tarik.png",
    aspect: "portrait",
    client: "RK Group Property",
    title: {
      id: "Tarik Promo Besar Kemerdekaan",
      en: "Independence Day Mega Promo",
    },
    tag: {
      id: "Seasonal Campaign",
      en: "Seasonal Campaign",
    },
  },
  {
    id: "rk-jangan-flexing",
    type: "image",
    category: "property",
    src: "/assets/images/flexing.png",
    aspect: "portrait",
    client: "RK Group Property",
    title: {
      id: "Jangan Flexing Kalo Belum Lihat Ini",
      en: "Don't Flex Before Seeing This",
    },
    tag: {
      id: "Reels Thumbnail",
      en: "Reels Thumbnail",
    },
  },
  {
    id: "viral-yang-difoto-kalah",
    type: "image",
    category: "viral",
    src: "/assets/images/bir2-fotokalah.png",
    aspect: "portrait",
    client: "RK Group Creative",
    title: {
      id: "Challenge: Yang Difoto Kalah!",
      en: "Challenge: Caught on Camera Loses!",
    },
    tag: {
      id: "Konten Viral",
      en: "Viral Content",
    },
  },
  {
    id: "amanah-spam-live",
    type: "image",
    category: "viral",
    src: "/assets/images/spam-live-1.png",
    aspect: "portrait",
    client: "Amanah Drive",
    title: {
      id: "SPAM LIVE — TikTok Live Campaign",
      en: "SPAM LIVE — TikTok Live Campaign",
    },
    tag: {
      id: "TikTok Live",
      en: "TikTok Live",
    },
  },
  {
    id: "amanah-tips-kopling",
    type: "image",
    category: "viral",
    src: "/assets/images/tips-rasa kopling.jpg",
    aspect: "portrait",
    client: "Amanah Drive",
    title: {
      id: "AutoTips Part 1: Titik Kopling",
      en: "AutoTips Part 1: Clutch Control",
    },
    tag: {
      id: "Edukasi Viral",
      en: "Viral Education",
    },
  },
  {
    id: "amanah-tips-posisi",
    type: "image",
    category: "viral",
    src: "/assets/images/tips-posisi.jpg",
    aspect: "portrait",
    client: "Amanah Drive",
    title: {
      id: "AutoTips Part 2: Posisi Lajur Mobil",
      en: "AutoTips Part 2: Lane Positioning",
    },
    tag: {
      id: "Edukasi Viral",
      en: "Viral Education",
    },
  },
  {
    id: "proof-avana-dashboard",
    type: "image",
    category: "analytics",
    src: "/assets/images/dashboard-avana.jpg",
    aspect: "portrait",
    client: "Meta Ads — Avana Hills",
    title: {
      id: "168 Prospek WA @ Rp 3.420 CPR",
      en: "168 WA Leads @ Rp 3,420 CPR",
    },
    tag: {
      id: "Performa Iklan",
      en: "Ad Performance",
    },
  },
  {
    id: "proof-ammaia-dashboard",
    type: "image",
    category: "analytics",
    src: "/assets/images/dashboard-ammaia.jpg",
    aspect: "portrait",
    client: "Meta Ads — Ammaia Ecoforest",
    title: {
      id: "342 Leads & 3.92% CTR",
      en: "342 Leads & 3.92% CTR",
    },
    tag: {
      id: "Performa Iklan",
      en: "Ad Performance",
    },
  },
  {
    id: "proof-alzafa-dashboard",
    type: "image",
    category: "analytics",
    src: "/assets/images/dashboard-alzafa.jpg",
    aspect: "portrait",
    client: "Meta Ads — Alzafa 3",
    title: {
      id: "680+ Qualified Leads @ Rp 2.850",
      en: "680+ Qualified Leads @ Rp 2,850",
    },
    tag: {
      id: "Scaling Funnel",
      en: "Scaling Funnel",
    },
  },
  {
    id: "proof-meta-ads-manager",
    type: "image",
    category: "analytics",
    src: "/assets/images/meta-dashboard-2.jpg",
    aspect: "wide",
    client: "Meta Ads Manager",
    title: {
      id: "Dashboard Kampanye Aktif — CPC Rp 336",
      en: "Live Campaign Dashboard — Rp 336 CPC",
    },
    tag: {
      id: "Ads Manager",
      en: "Ads Manager",
    },
  },
  {
    id: "proof-gtm-tags",
    type: "image",
    category: "analytics",
    src: "/assets/images/meta-dashboard-1.jpg",
    aspect: "wide",
    client: "Google Tag Manager",
    title: {
      id: "Arsitektur Tag GA4 & Meta Pixel",
      en: "GA4 & Meta Pixel Tag Architecture",
    },
    tag: {
      id: "GTM Tracking",
      en: "GTM Tracking",
    },
  },
  {
    id: "proof-gtm-triggers",
    type: "image",
    category: "analytics",
    src: "/assets/images/meta-analytics-2.jpg",
    aspect: "wide",
    client: "Google Tag Manager",
    title: {
      id: "Custom Regex Triggers — WhatsApp Funnel",
      en: "Custom Regex Triggers — WhatsApp Funnel",
    },
    tag: {
      id: "Event Attribution",
      en: "Event Attribution",
    },
  },
  {
    id: "proof-gtm-variables",
    type: "image",
    category: "analytics",
    src: "/assets/images/meta-analytics-1.jpg",
    aspect: "wide",
    client: "Google Tag Manager",
    title: {
      id: "Data Layer Variables Configuration",
      en: "Data Layer Variables Configuration",
    },
    tag: {
      id: "Data Layer",
      en: "Data Layer",
    },
  },
];
