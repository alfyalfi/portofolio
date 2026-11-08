export type Work = {
  id: number;
  period: string;
  role: {
    en: string;
    id: string;
  };
  company: {
    en: string;
    id: string;
  };
  subCompany?: {
    en: string;
    id: string;
  };
  title: string;
  category: string;
  href: string;
  image: string;
  hoverImage: string;
  hoverBackground: string;
  description: {
    en: string;
    id: string;
  };
  highlights: {
    en: string[];
    id: string[];
  };
  tags: string[];
};

export const works: Work[] = [
  {
    id: 1,
    period: "2021 — 2023",
    role: {
      id: "Personal Content Creator & Local Influencer",
      en: "Personal Content Creator & Local Influencer",
    },
    company: {
      id: "Independent / Local Influencer",
      en: "Independent / Local Influencer",
    },
    subCompany: {
      id: "Palembang Creative & Social Media",
      en: "Palembang Creative & Social Media",
    },
    title: "Personal Content Creator & Local Influencer",
    category: "Content Creation & Viral Reach",
    href: "#contact",
    image: "/assets/images/tips-posisi.jpg",
    hoverImage: "/assets/images/brand-tiktok.jpg",
    hoverBackground: "#0e7490",
    description: {
      id: "Membangun personal branding dan memproduksi konten digital kreatif di TikTok & Instagram, berkolaborasi dengan berbagai brand & bisnis lokal Palembang untuk mendongkrak brand awareness serta engagement audiens.",
      en: "Built personal branding and produced creative viral short-form content across TikTok & Instagram, collaborating with local brands and businesses to drive organic reach and high audience engagement.",
    },
    highlights: {
      id: [
        "Memproduksi video pendek kreatif & tutorial dengan pendekatan storytelling dan retensi penonton tinggi",
        "Membangun personal branding yang konsisten dan interaksi komunitas media sosial yang aktif",
        "Bekerja sama dalam endorsement & promosi brand lokal Palembang untuk meningkatkan brand awareness",
      ],
      en: [
        "Produced creative short-form video content with high audience retention and viral organic reach",
        "Established consistent personal branding and active social media community engagement",
        "Partnered with local Palembang brands and businesses for impactful promotional campaigns",
      ],
    },
    tags: [
      "Content Creation",
      "Personal Branding",
      "Short-Form Video",
      "TikTok & Reels",
      "Organic Growth",
    ],
  },
  {
    id: 2,
    period: "2024 — 2025",
    role: {
      id: "Staff Digital Marketing & E-Commerce",
      en: "Digital Marketing & E-Commerce Staff",
    },
    company: {
      id: "CV Eltech Sriwijaya Abadi",
      en: "CV Eltech Sriwijaya Abadi",
    },
    subCompany: {
      id: "Station CCTV & Rumah AC",
      en: "Station CCTV & Rumah AC",
    },
    title: "Staff Digital Marketing & E-Commerce — CV Eltech Sriwijaya Abadi",
    category: "Omnichannel E-Commerce & Ads",
    href: "#contact",
    image: "/assets/images/work-omnichannel-growth.jpg",
    hoverImage: "/assets/images/meta-dashboard-1.jpg",
    hoverBackground: "#0f172a",
    description: {
      id: "Mengelola ekosistem digital marketing dan operasional e-commerce untuk unit bisnis Station CCTV dan Rumah AC. Bertanggung jawab atas pengelolaan marketplace, strategi promosi digital, optimasi katalog produk, dan peningkatan closing rate penjualan.",
      en: "Managed digital marketing operations and omnichannel e-commerce channels for Station CCTV and Rumah AC. Spearheaded marketplace campaigns, catalog optimization, digital promos, and customer conversion improvements.",
    },
    highlights: {
      id: [
        "Mengelola operasional toko resmi marketplace (Shopee & Tokopedia) Station CCTV & Rumah AC",
        "Merancang strategi promosi berkala, optimasi SEO katalog produk, dan funnel konversi pembeli",
        "Mengintegrasikan traffic digital berbayar & organik ke saluran penjualan langsung dan chat konsultasi",
      ],
      en: [
        "Managed official marketplace store operations (Shopee & Tokopedia) for Station CCTV & Rumah AC",
        "Designed promotional campaigns, product catalog optimization, and buyer conversion funnels",
        "Integrated paid and organic digital traffic into direct consultation and sales closing pipelines",
      ],
    },
    tags: [
      "Digital Marketing",
      "E-Commerce",
      "Marketplace Ads",
      "Station CCTV",
      "Rumah AC",
      "Sales Funnel",
    ],
  },
  {
    id: 3,
    period: "2025 — 2026",
    role: {
      id: "Ads Specialist & Content Creator",
      en: "Ads Specialist & Content Creator",
    },
    company: {
      id: "RK Group Property",
      en: "RK Group Property",
    },
    subCompany: {
      id: "Developer Perumahan Subsidi & Komersil",
      en: "Subsidized & Commercial Housing Developer",
    },
    title: "Ads Specialist & Content Creator — RK Group Property",
    category: "Meta Ads & Real Estate Marketing",
    href: "#contact",
    image: "/assets/images/avana-1m-aja.png",
    hoverImage: "/assets/images/dashboard-avana.jpg",
    hoverBackground: "#0c4a6e",
    description: {
      id: "Memimpin perancangan & eksekusi strategi iklan berbayar (Meta Ads & TikTok Ads) serta produksi konten visual/video kreatif untuk klaster perumahan subsidi dan komersil (Avana, Ammaia Ecoforest, Alzafa 3). Menghasilkan ratusan prospek KPR tervalidasi dengan CPR efisien.",
      en: "Led paid advertising campaigns (Meta Ads & TikTok Ads) and creative visual/video production for subsidized and commercial housing developments (Avana, Ammaia Ecoforest, Alzafa 3), acquiring hundreds of qualified home-buyer leads at scale.",
    },
    highlights: {
      id: [
        "Menjalankan kampanye Meta Ads & TikTok Ads terarah untuk klaster perumahan subsidi & komersil",
        "Memproduksi video house-tour influencer & materi kreatif iklan dengan sudut psikologis pembeli",
        "Mendatangkan ratusan prospek (leads) KPR WhatsApp tervalidasi dengan CPR sangat optimal",
      ],
      en: [
        "Executed high-performance Meta & TikTok Ads campaigns for subsidized & commercial housing clusters",
        "Produced influencer house-tour video content and creative assets with strong conversion hooks",
        "Acquired hundreds of qualified WhatsApp KPR mortgage leads at industry-leading cost-per-result",
      ],
    },
    tags: [
      "Meta Ads",
      "TikTok Ads",
      "Property Marketing",
      "KPR Lead Gen",
      "Creative Video Tour",
      "ROAS Optimization",
    ],
  },
];

/** Every work picture, once, plus authentic Meta campaign analytics & visual assets. */
export const workPictures = [
  ...new Set([
    ...works.flatMap(({ image, hoverImage }) => [image, hoverImage]),
    "/assets/images/dashboard-avana.jpg",
    "/assets/images/dashboard-ammaia.jpg",
    "/assets/images/dashboard-alzafa.jpg",
    "/assets/images/cine-avan-100826.png",
    "/assets/images/ammaia-pesansekalilihat.png",
    "/assets/images/alzafa3-tarik.png",
    "/assets/images/bir2-fotokalah.png",
    "/assets/images/spam-live-1.png",
    "/assets/images/flexing.png",
    "/assets/images/brand-meta.jpg",
    "/assets/images/brand-f.png",
    "/assets/images/cert-google-analytics.png",
    "/assets/images/cert-google-ads.png",
    "/assets/images/cert-hubspot.png",
    "/assets/images/ammaia-cine.png",
    "/assets/images/tips-rasa kopling.jpg",
    "/assets/images/meta-dashboard-2.jpg",
  ]),
];
