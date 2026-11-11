export type StudioService = {
  id: string;
  number: string;
  shortName: string;
  title: {
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
  deliverables: {
    id: string[];
    en: string[];
  };
  highlightMetric: {
    value: string;
    label: {
      id: string;
      en: string;
    };
  };
  image: string;
  hoverImage: string;
};

export const studioServices: StudioService[] = [
  {
    id: "performance-ads",
    number: "01",
    shortName: "PERFORMANCE ADS",
    title: {
      id: "Meta, Google & TikTok Ads Management",
      en: "Meta, Google & TikTok Ads Management",
    },
    category: {
      id: "Akuisisi Prospek & Optimasi ROAS",
      en: "Lead Generation & ROAS Scaling",
    },
    summary: {
      id: "Pengelolaan kampanye iklan berbayar berbasis data untuk mendatangkan prospek WhatsApp berkualitas tinggi dengan biaya per konversi (CPL/CPR) paling efisien bagi properti, otomotif, klinik, hingga brand retail.",
      en: "Data-driven paid traffic management engineered to acquire high-intent WhatsApp & form leads at the lowest possible CPL/CPR for real estate, automotive, clinics, and retail brands.",
    },
    deliverables: {
      id: [
        "Riset Audiens, Kompetitor & Struktur Funnel",
        "Setup Kampanye & A/B Testing Materi Kreatif",
        "Optimasi Harian CPC, CTR & Cost Per Lead",
        "Retargeting Pixel & Laporan Performa Transparan",
      ],
      en: [
        "Audience, Competitor & Funnel Architecture",
        "Campaign Setup & Creative A/B Testing",
        "Daily CPC, CTR & Cost-Per-Lead Optimization",
        "Pixel Retargeting & Transparent Analytics Reporting",
      ],
    },
    highlightMetric: {
      value: "Rp 2.850",
      label: {
        id: "Rata-rata CPL Terendah",
        en: "Lowest Verified CPL",
      },
    },
    image: "/assets/images/dashboard-ammaia.jpg",
    hoverImage: "/assets/images/dashboard-alzafa.jpg",
  },
  {
    id: "creative-production",
    number: "02",
    shortName: "CREATIVE & VIDEO",
    title: {
      id: "Produksi Video Reels, TikTok & Desain Visual Iklan",
      en: "Reels/TikTok Video Production & Ad Key Visuals",
    },
    category: {
      id: "Produksi Konten Berkonversi Tinggi",
      en: "High-Converting Creative Production",
    },
    summary: {
      id: "Produksi video vertikal 9:16 (House Tour, Review Produk, Konten Edukasi Viral) dengan psikologi 3-second hook serta desain poster/key visual iklan ber-CTR tinggi yang menghentikan scroll audiens.",
      en: "End-to-end 9:16 vertical video production (House Tours, Product Demos, Viral Hooks) with 3-second retention psychology and high-CTR advertising key visuals.",
    },
    deliverables: {
      id: [
        "Penulisan Naskah & Psikologi 3-Second Hook",
        "Shooting Video Walkthrough & Editing (CapCut/Premiere)",
        "Desain Key Visual Kampanye & Poster Iklan",
        "Desain Carousel Edukasi & Thumbnail Viral",
      ],
      en: [
        "Scriptwriting & 3-Second Hook Psychology",
        "Walkthrough Shooting & Video Editing (CapCut/Premiere)",
        "Campaign Key Visual & Ad Poster Design",
        "Educational Carousels & Viral Thumbnails",
      ],
    },
    highlightMetric: {
      value: "3.92%",
      label: {
        id: "CTR Kreatif Tertinggi",
        en: "Peak Creative CTR",
      },
    },
    image: "/assets/images/avana-1m-aja.png",
    hoverImage: "/assets/images/cine-avan-100826.png",
  },
  {
    id: "web-development",
    number: "03",
    shortName: "WEB & LANDING PAGE",
    title: {
      id: "Pembuatan Website & Landing Page Iklan",
      en: "Web Engineering & High-Converting Landing Pages",
    },
    category: {
      id: "Next.js, React & Optimasi Konversi",
      en: "Next.js, React & Conversion Optimization",
    },
    summary: {
      id: "Pengembangan website perusahaan, katalog properti/produk, dan landing page kampanye berkecepatan tinggi dengan arsitektur Next.js modern, animasi interaktif, dan integrasi langsung ke WhatsApp Sales.",
      en: "Custom high-speed company websites, property/product catalogs, and dedicated campaign landing pages built with Next.js, interactive GSAP motion, and direct WhatsApp lead routing.",
    },
    deliverables: {
      id: [
        "UI/UX Editorial Modern & Responsif Mobile-First",
        "Pengembangan Next.js / React / Tailwind CSS Cepat",
        "Optimasi Technical SEO, Schema.org & Core Web Vitals",
        "Integrasi CTA WhatsApp Rotator & Lead Form",
      ],
      en: [
        "Modern Editorial UI/UX & Mobile-First Architecture",
        "High-Speed Next.js / React / Tailwind CSS Build",
        "Technical SEO, Schema.org & Core Web Vitals",
        "Direct WhatsApp CTA & Lead Form Integration",
      ],
    },
    highlightMetric: {
      value: "99/100",
      label: {
        id: "Skor Performa & SEO",
        en: "Performance & SEO Score",
      },
    },
    image: "/assets/images/ammaia-callme.png",
    hoverImage: "/assets/images/alzafa3-udahgila.png",
  },
  {
    id: "tracking-analytics",
    number: "04",
    shortName: "GTM & ANALYTICS",
    title: {
      id: "Setup Google Tag Manager, GA4 & Meta Pixel",
      en: "Google Tag Manager, GA4 & Meta Pixel Architecture",
    },
    category: {
      id: "Atribusi Data & Pelacakan Konversi",
      en: "Data Attribution & Conversion Tracking",
    },
    summary: {
      id: "Instalasi dan audit sistem tracking presisi agar setiap klik tombol WhatsApp, pengisian formulir, dan perilaku pengunjung terekam akurat untuk melatih algoritma iklan menuju konversi terbaik.",
      en: "Precision tracking setup ensuring every WhatsApp click, form submission, and user action is accurately attributed to train ad algorithms for lower acquisition costs.",
    },
    deliverables: {
      id: [
        "Arsitektur Tag Google Tag Manager (GTM)",
        "Konfigurasi Custom Event Google Analytics 4 (GA4)",
        "Setup Meta Pixel, Custom Regex Triggers & Data Layer",
        "Audit Kebocoran Funnel & Dashboard Metrik",
      ],
      en: [
        "Google Tag Manager (GTM) Tag Architecture",
        "Google Analytics 4 (GA4) Custom Event Setup",
        "Meta Pixel, Custom Regex Triggers & Data Layer",
        "Funnel Drop-Off Audit & Metrics Dashboard",
      ],
    },
    highlightMetric: {
      value: "100%",
      label: {
        id: "Akurasi Event Tracking",
        en: "Event Tracking Accuracy",
      },
    },
    image: "/assets/images/meta-dashboard-1.jpg",
    hoverImage: "/assets/images/meta-analytics-2.jpg",
  },
  {
    id: "social-ecommerce",
    number: "05",
    shortName: "SOCIAL & COMMERCE",
    title: {
      id: "Social Media Management & E-Commerce Growth",
      en: "Social Media Management & E-Commerce Growth",
    },
    category: {
      id: "Pertumbuhan Organik & Marketplace",
      en: "Organic Brand & Marketplace Scaling",
    },
    summary: {
      id: "Pengelolaan terpadu konten media sosial (Instagram & TikTok) serta optimasi toko marketplace (Shopee, Tokopedia, TikTok Shop & Live) untuk membangun otoritas brand sekaligus penjualan harian.",
      en: "Integrated social media management (Instagram & TikTok) and marketplace store optimization (Shopee, Tokopedia, TikTok Shop & Live) to drive both brand authority and daily sales.",
    },
    deliverables: {
      id: [
        "Perencanaan Content Pillar & Kalender Editorial",
        "Strategi Kampanye TikTok Live & Promo Interaktif",
        "Optimasi Katalog, SEO Produk & Iklan Marketplace",
        "Evaluasi Insight Bulanan & Pertumbuhan Followers",
      ],
      en: [
        "Content Pillar Strategy & Editorial Calendar",
        "TikTok Live Campaign & Interactive Promo Strategy",
        "Marketplace Catalog SEO & In-App Ads Optimization",
        "Monthly Growth Insights & Audience Retention",
      ],
    },
    highlightMetric: {
      value: "1.190+",
      label: {
        id: "Total Prospek & Konversi",
        en: "Total Verified Leads",
      },
    },
    image: "/assets/images/spam-live-1.png",
    hoverImage: "/assets/images/tips-posisi.jpg",
  },
];

export const studioWorkflow = [
  {
    step: "01",
    title: {
      id: "Audit Bisnis & Riset Funnel",
      en: "Business Audit & Funnel Research",
    },
    desc: {
      id: "Membedah produk, target market, kompetitor, dan kebocoran konversi saat ini untuk menyusun strategi akuisisi berbasis data.",
      en: "Analyzing your offer, target audience, competitors, and current funnel leaks to blueprint a data-backed acquisition strategy.",
    },
  },
  {
    step: "02",
    title: {
      id: "Produksi Kreatif & Infrastruktur Tracking",
      en: "Creative Production & Tracking Setup",
    },
    desc: {
      id: "Memproduksi video/visual ber-hook kuat, menyiapkan landing page cepat, serta memasang GTM, GA4, dan Meta Pixel.",
      en: "Producing high-hook videos/visuals, deploying fast landing pages, and configuring GTM, GA4, and Meta Pixel tracking.",
    },
  },
  {
    step: "03",
    title: {
      id: "Peluncuran Kampanye & A/B Testing",
      en: "Campaign Launch & Creative Testing",
    },
    desc: {
      id: "Menjalankan kampanye iklan dengan pengujian beberapa sudut pandang kreatif dan audiens untuk menemukan pemenang ber-CPL terendah.",
      en: "Launching multi-angle ad sets and creative A/B tests to identify winning hooks with the lowest cost per lead.",
    },
  },
  {
    step: "04",
    title: {
      id: "Optimasi Harian & Scaling Omzet",
      en: "Daily Optimization & Revenue Scaling",
    },
    desc: {
      id: "Memangkas anggaran pada iklan yang kurang efektif dan melipatgandakan bujet pada kampanye pemenang secara terukur.",
      en: "Cutting wasted ad spend and systematically scaling winning campaigns with transparent performance reporting.",
    },
  },
];
