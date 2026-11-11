export type CaseStudyMetric = {
  value: string;
  label: {
    id: string;
    en: string;
  };
  sublabel: {
    id: string;
    en: string;
  };
};

export type Work = {
  id: number;
  period: string;
  theme: {
    id: string;
    en: string;
  };
  client: string;
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
  tagline: {
    id: string;
    en: string;
  };
  problem: {
    id: string;
    en: string;
  };
  strategy: {
    id: string;
    en: string;
    points: {
      id: string[];
      en: string[];
    };
  };
  metrics: CaseStudyMetric[];
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
    period: "2025 — 2026",
    theme: {
      id: "Real Estate & Properti Scaling",
      en: "Real Estate & Property Scaling",
    },
    client: "RK Group Property",
    role: {
      id: "Ads Specialist & Content Creator",
      en: "Ads Specialist & Content Creator",
    },
    company: {
      id: "RK Group Property",
      en: "RK Group Property",
    },
    subCompany: {
      id: "Avana • Ammaia Ecoforest • Alzafa 3",
      en: "Avana • Ammaia Ecoforest • Alzafa 3",
    },
    title: "RK Group Property — Scale-Up Iklan Properti Komersil & Subsidi",
    category: "Real Estate Lead Gen & Meta Ads",
    href: "#contact",
    image: "/assets/images/avana-1m-aja.png",
    hoverImage: "/assets/images/dashboard-avana.jpg",
    hoverBackground: "#0c4a6e",
    tagline: {
      id: "Mengakuisisi 1.190+ prospek pembeli rumah tervalidasi dengan Meta Ads presisi & video tour influencer.",
      en: "Acquiring 1,190+ qualified property buyer leads via precision Meta Ads and influencer house tours.",
    },
    problem: {
      id: "Tingginya persaingan pasar properti dan biaya iklan konvensional (billboard/brosur) yang tidak terukur. Banyak leads pesan biasa tidak lolos kualifikasi BI Checking (SLIK OJK) perbankan untuk KPR, sehingga membuang waktu tindak lanjut tim sales.",
      en: "Saturated regional real estate market and bloated untracked conventional ads. Inbound social leads regularly failed bank SLIK/OJK mortgage checks, wasting sales agents' closing hours.",
    },
    strategy: {
      id: "Membangun funnel multi-level: video house-tour influencer di Instagram & TikTok untuk daya tarik emosional, dilanjutkan Meta Ads terarah (Custom & Lookalike Audiences) dengan formulir instan penyaring kualifikasi KPR sebelum dialirkan ke tim sales WhatsApp.",
      en: "Engineered a multi-tier funnel: high-production influencer walkthroughs creating emotional living appeal, retargeted with Meta Instant Forms pre-qualifying mortgage readiness before routing to sales WhatsApp.",
      points: {
        id: [
          "Produksi video house-tour selebriti/influencer & video sinematik unit",
          "Formulir kualifikasi KPR instan menyaring penghasilan & kesiapan DP",
          "A/B testing visual kreatif dan optimasi rasio biaya per hasil (CPR)",
        ],
        en: [
          "Influencer walkthrough reels and cinematic property unit tours",
          "Instant lead forms screening income, DP readiness, and credit health",
          "A/B testing visual creatives and optimizing cost-per-result (CPR)",
        ],
      },
    },
    metrics: [
      {
        value: "1.190+",
        label: {
          id: "Qualified Leads",
          en: "Qualified Leads",
        },
        sublabel: {
          id: "Total Prospek KPR Tervalidasi",
          en: "Validated Home-Buyer Inquiries",
        },
      },
      {
        value: "Rp 2.850",
        label: {
          id: "Rekor CPR Terendah",
          en: "Lowest Record CPR",
        },
        sublabel: {
          id: "Perumahan Subsidi Alzafa 3",
          en: "Alzafa 3 Affordable Housing",
        },
      },
      {
        value: "3.92%",
        label: {
          id: "Rata-rata CTR Iklan",
          en: "Average Ad CTR",
        },
        sublabel: {
          id: "Klaster Ammaia Ecoforest",
          en: "Ammaia Ecoforest Smart Cluster",
        },
      },
    ],
    description: {
      id: "Memimpin strategi iklan berbayar (Meta Ads & TikTok Ads) dan produksi konten kreatif untuk portofolio properti RK Group Property (Avana, Ammaia Ecoforest, Alzafa 3), mendatangkan ribuan prospek pembeli rumah tervalidasi dengan biaya efisien.",
      en: "Led paid advertising campaigns (Meta Ads & TikTok Ads) and creative video production for RK Group Property developments (Avana, Ammaia Ecoforest, Alzafa 3), acquiring thousands of qualified home-buyer leads at scale.",
    },
    highlights: {
      id: [
        "168+ buyer leads Avana Commercial di CPR optimal Rp 3.420",
        "342+ qualified WhatsApp leads Ammaia Ecoforest (CTR 3.92%, CPL Rp 3.150)",
        "680+ prospek KPR tervalidasi Alzafa 3 di rekor biaya hemat Rp 2.850",
      ],
      en: [
        "168+ Avana Commercial buyer leads acquired at optimal Rp 3,420 CPR",
        "342+ qualified WhatsApp leads for Ammaia Ecoforest (3.92% CTR, Rp 3,150 CPL)",
        "680+ mortgage-qualified leads for Alzafa 3 at record Rp 2,850 CPR",
      ],
    },
    tags: [
      "Meta Ads (FB & IG)",
      "WhatsApp Funnel",
      "KPR Lead Generation",
      "Influencer House Tour",
      "ROAS Optimization",
    ],
  },
  {
    id: 2,
    period: "2024 — 2025",
    theme: {
      id: "E-Commerce & Retail Omnichannel",
      en: "E-Commerce & Retail Omnichannel",
    },
    client: "CV Eltech Sriwijaya Abadi",
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
    title: "CV Eltech Sriwijaya Abadi — Omnichannel E-Commerce & Retail Growth",
    category: "Marketplace Ads & Omnichannel Sales",
    href: "#contact",
    image: "/assets/images/work-omnichannel-growth.jpg",
    hoverImage: "/assets/images/meta-dashboard-1.jpg",
    hoverBackground: "#0f172a",
    tagline: {
      id: "Transformasi penjualan perangkat CCTV & pendingin ruangan dari toko fisik ke ekosistem marketplace & digital beromset tinggi.",
      en: "Transforming physical retail CCTV and air-conditioner sales into a high-converting digital marketplace ecosystem.",
    },
    problem: {
      id: "Ketergantungan pada pelanggan offline di toko fisik, minimnya visibilitas official store online di Shopee & Tokopedia, serta katalog produk teknis yang membingungkan calon pembeli dan menghambat keputusan checkout.",
      en: "Over-reliance on physical walk-in foot traffic, low organic visibility across Shopee and Tokopedia official stores, and technical listings that overwhelmed buyers and hurt conversion rates.",
    },
    strategy: {
      id: "Merestrukturisasi seluruh katalog produk dengan visual infografis edukatif, optimasi SEO kata kunci marketplace, bundling paket instalasi siap pakai, serta kampanye Shopee Ads & Meta Ads lokal yang terintegrasi dengan chat konsultasi cepat.",
      en: "Overhauled product listings with educational infographic visuals, marketplace SEO optimization, turnkey installation packages, and targeted Shopee + Meta Ads channeled into instant consultation chat.",
      points: {
        id: [
          "Optimasi visual katalog produk & deskripsi fokus solusi pengguna",
          "Strategi bundling paket siap pasang untuk perumahan dan kantor",
          "Integrasi paid traffic ke saluran closing chat dan follow-up cepat",
        ],
        en: [
          "Product catalog optimization focused on user benefit infographics",
          "Turnkey installation bundling strategy for residential and office clients",
          "Paid traffic integration into real-time consultative sales closing",
        ],
      },
    },
    metrics: [
      {
        value: "4.2x",
        label: {
          id: "Average ROAS",
          en: "Average ROAS",
        },
        sublabel: {
          id: "Promo Kampanye & Flash Sale",
          en: "Payday Promo & Flash Campaigns",
        },
      },
      {
        value: "+240%",
        label: {
          id: "Pertumbuhan GMV",
          en: "GMV Sales Growth",
        },
        sublabel: {
          id: "Penjualan Online Marketplace",
          en: "Online Marketplace Channels",
        },
      },
      {
        value: "4.9 / 5.0",
        label: {
          id: "Rating Toko Resmi",
          en: "Official Store Rating",
        },
        sublabel: {
          id: "Ratusan Review Kepuasan Pembeli",
          en: "Hundreds of Verified Reviews",
        },
      },
    ],
    description: {
      id: "Mengelola ekosistem digital marketing dan operasional e-commerce untuk unit bisnis Station CCTV dan Rumah AC, meningkatkan closing rate penjualan dan memenangkan pasar perangkat keamanan lokal.",
      en: "Managed digital marketing operations and omnichannel e-commerce channels for Station CCTV and Rumah AC, driving higher sales conversion and dominating the regional security equipment niche.",
    },
    highlights: {
      id: [
        "Pengelolaan official store marketplace (Shopee & Tokopedia) Station CCTV & Rumah AC",
        "Peningkatan penjualan unit dan instalasi dengan ROAS stabil di atas 4x",
        "Penetapan standar customer service konsultasi cepat berkonversi tinggi",
      ],
      en: [
        "Official marketplace store management (Shopee & Tokopedia) for Station CCTV & Rumah AC",
        "Scaled unit sales and service installations maintaining consistent 4x+ ROAS",
        "Standardized consultative customer service workflows driving rapid order closing",
      ],
    },
    tags: [
      "Shopee & Tokopedia Ads",
      "Catalog SEO",
      "Omnichannel Retail",
      "Station CCTV",
      "Rumah AC",
    ],
  },
  {
    id: 3,
    period: "2021 — 2023",
    theme: {
      id: "Creative Content & Media Viral",
      en: "Creative Content & Viral Media",
    },
    client: "Driving Academy & Brand Lokal",
    role: {
      id: "Personal Content Creator & Local Influencer",
      en: "Personal Content Creator & Local Influencer",
    },
    company: {
      id: "Independent / Local Influencer",
      en: "Independent / Local Influencer",
    },
    subCompany: {
      id: "Palembang Creative Media",
      en: "Palembang Creative Media",
    },
    title: "Viral Media & Brand Growth Strategy — Konten Edukasi Berkonversi",
    category: "Short-Form Video & Organic Growth",
    href: "#contact",
    image: "/assets/images/tips-posisi.jpg",
    hoverImage: "/assets/images/brand-tiktok.jpg",
    hoverBackground: "#0e7490",
    tagline: {
      id: "Menciptakan serial konten video edukatif viral dengan hook psikologis yang melipatgandakan pendaftaran siswa baru secara organik.",
      en: "Crafting viral educational tutorials with psychological hooks, multiplying organic customer acquisitions.",
    },
    problem: {
      id: "Bisnis kursus mengemudi dan brand lokal mengalami penurunan atensi audiens karena promosi konvensional yang kaku, membosankan, dan terus dilewati oleh pengguna media sosial muda di timeline TikTok & Instagram.",
      en: "Driving academies and local commercial brands experienced audience fatigue due to rigid promotional formats repeatedly skipped on fast-moving TikTok and Instagram feeds.",
    },
    strategy: {
      id: "Merancang konten video vertikal berbasis empati: menjawab kecemasan terbesar pemula saat belajar menyetir ('tips rasa kopling', 'posisi duduk anti tegang') dengan hook 3 detik awal yang kuat, storytelling santai khas lokal, dan ritme editing dinamis.",
      en: "Engineered high-empathy vertical video series addressing beginners' greatest road anxieties with sharp 3-second tension hooks, relatable conversational storytelling, and dynamic rhythmic editing.",
      points: {
        id: [
          "Riset pain points emosional terbesar audiens pemula saat belajar menyetir",
          "Hook 3 detik pertama pencegah scroll dengan visual demonstrasi langsung",
          "Call to action organik yang memicu ratusan komentar, shares, dan bookmark",
        ],
        en: [
          "Targeted research on beginners' emotional road anxieties and hesitation points",
          "Thumb-stopping 3-second visual demonstration hooks preventing scroll-past",
          "Organic conversation-starter CTAs driving hundreds of saves and shares",
        ],
      },
    },
    metrics: [
      {
        value: "2.8M+",
        label: {
          id: "Organic Video Views",
          en: "Organic Video Views",
        },
        sublabel: {
          id: "Jangkauan Viral Tanpa Budget Iklan",
          en: "Zero-Ad-Spend Viral Reach",
        },
      },
      {
        value: "+310%",
        label: {
          id: "Pendaftaran Siswa Baru",
          en: "New Student Enrollment",
        },
        sublabel: {
          id: "Peningkatan Akuisisi Organik",
          en: "Inbound Organic Inquiries",
        },
      },
      {
        value: "8.6%",
        label: {
          id: "Average Engagement",
          en: "Average Engagement",
        },
        sublabel: {
          id: "Interaksi Aktif Komunitas",
          en: "High Retention & Comment Rate",
        },
      },
    ],
    description: {
      id: "Membangun personal branding dan memproduksi konten digital kreatif di TikTok & Instagram, berkolaborasi dengan berbagai brand & bisnis lokal Palembang untuk mendongkrak brand awareness serta engagement audiens.",
      en: "Built personal branding and produced creative viral short-form content across TikTok & Instagram, collaborating with local brands and businesses to drive organic reach and high audience engagement.",
    },
    highlights: {
      id: [
        "Serial video viral tutorial menyetir dengan retensi tontonan di atas 70%",
        "Lonjakan pendaftaran siswa kursus mengemudi secara organik tanpa biaya iklan berlebih",
        "Kemitraan endorsement sukses dengan brand lokal dan UMKM Palembang",
      ],
      en: [
        "Viral driving tutorial series achieving over 70% average watch retention",
        "Massive surge in student academy registrations with zero paid ad reliance",
        "Successful promotional endorsement partnerships with local commercial brands",
      ],
    },
    tags: [
      "TikTok & Reels Viral",
      "CapCut & Premiere",
      "Psychological Hooks",
      "Storytelling",
      "Organic Acquisition",
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
