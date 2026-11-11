export type ShowcaseCategory = "all" | "video" | "property" | "viral" | "analytics";

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

export const showcaseItems: ShowcaseItem[] = [
  {
    id: "video-walkthrough-avana",
    type: "video",
    category: "video",
    src: "/assets/videos/real-estate-walkthrough.mp4",
    poster: "/assets/images/cine-avan-100826.png",
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
