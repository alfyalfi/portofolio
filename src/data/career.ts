export type CareerMilestone = {
  period: string;
  role: {
    id: string;
    en: string;
  };
  company: {
    id: string;
    en: string;
  };
  category: {
    id: string;
    en: string;
  };
  summary: {
    id: string;
    en: string;
  };
};

export const careerTimeline: CareerMilestone[] = [
  {
    period: "2021 — 2023",
    role: {
      id: "Personal Content Creator & Local Influencer",
      en: "Personal Content Creator & Local Influencer",
    },
    company: {
      id: "Independent / Local Influencer",
      en: "Independent / Local Influencer",
    },
    category: {
      id: "Creative Media & Viral Content",
      en: "Creative Media & Viral Content",
    },
    summary: {
      id: "Membangun personal branding & memproduksi video kreatif viral dengan jangkauan ratusan ribu views dan kemitraan brand lokal.",
      en: "Built personal branding & produced viral short-form video content with high organic engagement and local brand partnerships.",
    },
  },
  {
    period: "2024 — 2025",
    role: {
      id: "Staff Digital Marketing & E-Commerce",
      en: "Digital Marketing & E-Commerce Staff",
    },
    company: {
      id: "CV Eltech Sriwijaya Abadi",
      en: "CV Eltech Sriwijaya Abadi",
    },
    category: {
      id: "Station CCTV & Rumah AC",
      en: "Station CCTV & Rumah AC",
    },
    summary: {
      id: "Mengelola toko resmi marketplace Shopee & Tokopedia, optimasi SEO katalog produk, dan funnel promo konversi penjualan.",
      en: "Managed official marketplace stores (Shopee & Tokopedia), product catalog SEO, and high-converting promotional funnels.",
    },
  },
  {
    period: "2025 — 2026",
    role: {
      id: "Ads Specialist & Content Creator",
      en: "Ads Specialist & Content Creator",
    },
    company: {
      id: "RK Group Property",
      en: "RK Group Property",
    },
    category: {
      id: "Developer Perumahan Subsidi & Komersil",
      en: "Subsidized & Commercial Real Estate Developer",
    },
    summary: {
      id: "Merancang strategi Meta & TikTok Ads properti skala besar (Avana, Ammaia, Alzafa) dan memproduksi video tour akuisisi prospek KPR.",
      en: "Executed large-scale property Meta & TikTok Ads (Avana, Ammaia, Alzafa) and produced house-tour video content acquiring KPR buyers.",
    },
  },
];
