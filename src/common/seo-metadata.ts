import type { Metadata } from "next";
import { locales, type AppLocale } from "@/common/i18n";
import { expertise } from "@/data/expertise";
import { email, socials } from "@/data/socials";
import { works } from "@/data/works";

const siteUrl = "https://alfaristudio.my.id";
/** Homepage is "/" and Personal Portfolio is "/portofolio" (see src/proxy.ts). */
const pageUrl = `${siteUrl}/portofolio`;
const siteName = "M. Firdaus Alfarizi";
const personName = "M. Firdaus Alfarizi";
const profileImage = `${siteUrl}/assets/images/alfarizi.jpg`;
const ogImage = "/assets/images/og-image.png";
const ogImageSmall = "/assets/images/og-image-800-600.png";

// Set when the page is built, so it moves with every deploy
const lastModified = new Date().toISOString();

const ids = {
  person: `${pageUrl}#person`,
  website: `${siteUrl}/#website`,
  webpage: `${pageUrl}#webpage`,
  works: `${pageUrl}#works`,
};

const localizedSeo = {
  en: {
    locale: "en_US",
    title: "M. Firdaus Alfarizi | Creative & Marketer Portfolio",
    description:
      "Official portfolio of M. Firdaus Alfarizi (Alfi) at alfaristudio.my.id/portofolio — digital marketer, ads specialist, and content creator in Palembang, Indonesia.",
    siteDescription:
      "Work experience, case studies, and creative archive of M. Firdaus Alfarizi, founder of Alfaristudio Creative.",
    worksName: "Featured case studies",
    ogImageAlt: "M. Firdaus Alfarizi - Creative & Marketer",
    keywords: [
      "M. Firdaus Alfarizi",
      "Alfi",
      "Alfaristudio Creative",
      "Creative & Marketer",
      "Digital Marketer Palembang",
      "Ads Specialist Indonesia",
      "Meta Ads Specialist",
      "TikTok Ads Specialist",
      "Google Ads Specialist",
      "Content Creator Palembang",
      "Performance Marketer Indonesia",
    ],
  },
  id: {
    locale: "id_ID",
    title: "M. Firdaus Alfarizi | Portofolio Creative & Marketer",
    description:
      "Portofolio resmi M. Firdaus Alfarizi (Alfi) di alfaristudio.my.id/portofolio — creative marketer, ads specialist, dan founder Alfaristudio Creative asal Palembang.",
    siteDescription:
      "Perjalanan karir, studi kasus kampanye, dan galeri karya M. Firdaus Alfarizi, ads specialist dan digital marketer di Palembang.",
    worksName: "Studi kasus pilihan",
    ogImageAlt: "M. Firdaus Alfarizi - Creative & Marketer",
    keywords: [
      "M. Firdaus Alfarizi",
      "Alfi",
      "Alfaristudio Creative",
      "Creative & Marketer",
      "Digital Marketing Palembang",
      "Ads Specialist Indonesia",
      "Jasa Iklan Meta",
      "Jasa Iklan TikTok",
      "Jasa Iklan Google",
      "Content Creator Palembang",
      "Performance Marketing Indonesia",
    ],
  },
} satisfies Record<
  AppLocale,
  {
    locale: string;
    title: string;
    description: string;
    siteDescription: string;
    worksName: string;
    ogImageAlt: string;
    keywords: string[];
  }
>;

export const socialProfiles = socials.map((social) => social.href);

export function getSiteUrl() {
  return siteUrl;
}

export function getPortfolioUrl() {
  return pageUrl;
}

/** SEO & Browser Icon ("F" logo) for /portofolio */
export function buildSeoMetadata({ lang }: { lang: AppLocale }): Metadata {
  const seo = localizedSeo[lang];
  const otherLocales = locales
    .filter((locale) => locale !== lang)
    .map((locale) => localizedSeo[locale].locale);

  return {
    metadataBase: new URL(siteUrl),
    title: seo.title,
    description: seo.description,
    applicationName: siteName,
    referrer: "origin-when-cross-origin",
    category: "marketing",
    keywords: seo.keywords,
    authors: [{ name: personName, url: pageUrl }],
    creator: personName,
    publisher: personName,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    icons: {
      icon: [{ url: "/assets/images/brand-f.png", type: "image/png" }],
      shortcut: "/assets/images/brand-f.png",
      apple: "/assets/images/brand-f.png",
    },
    alternates: { canonical: "/portofolio" },
    openGraph: {
      type: "profile",
      firstName: "M. Firdaus",
      lastName: "Alfarizi",
      locale: seo.locale,
      alternateLocale: otherLocales,
      url: "/portofolio",
      siteName,
      title: seo.title,
      description: seo.description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: seo.ogImageAlt,
          type: "image/png",
        },
        {
          url: ogImageSmall,
          width: 800,
          height: 600,
          alt: seo.ogImageAlt,
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
      images: [{ url: ogImage, alt: seo.ogImageAlt }],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    verification: {
      google:
        process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ||
        process.env.GOOGLE_SITE_VERIFICATION,
    },
  };
}

/** SEO & Custom Studio Browser Icon ("A✦" logo) for "/" (Alfaristudio Creative Homepage) */
export function buildStudioSeoMetadata({ lang }: { lang: AppLocale }): Metadata {
  const isId = lang === "id";
  const title = isId
    ? "Alfaristudio Creative | Jasa Digital Marketing, Meta Ads & Produksi Konten"
    : "Alfaristudio Creative | Performance Ads, Creative Production & Web Studio";
  const description = isId
    ? "Alfaristudio Creative (alfaristudio.my.id) menyediakan jasa pengelolaan iklan digital (Meta Ads, Google Ads, TikTok Ads), produksi video & desain kreatif berkonversi tinggi, pembuatan website/landing page, serta setup Google Tag Manager & GA4."
    : "Alfaristudio Creative (alfaristudio.my.id) is a digital growth studio offering Meta, Google & TikTok Ads management, high-converting video & creative production, web development, and GA4/GTM tracking.";

  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    applicationName: "Alfaristudio Creative",
    referrer: "origin-when-cross-origin",
    category: "marketing",
    keywords: [
      "Alfaristudio Creative",
      "alfaristudio.my.id",
      "Jasa Digital Marketing Palembang",
      "Jasa Meta Ads",
      "Jasa Google Ads",
      "Jasa TikTok Ads",
      "Jasa Pembuatan Konten Video",
      "Jasa Landing Page",
      "M. Firdaus Alfarizi",
    ],
    authors: [{ name: personName, url: pageUrl }],
    creator: "Alfaristudio Creative",
    publisher: "Alfaristudio Creative",
    icons: {
      icon: [{ url: "/assets/images/alfaristudio-logo.svg", type: "image/svg+xml" }],
      shortcut: "/assets/images/alfaristudio-logo.svg",
      apple: "/assets/images/alfaristudio-logo.svg",
    },
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      locale: isId ? "id_ID" : "en_US",
      url: "/",
      siteName: "Alfaristudio Creative",
      title,
      description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: "Alfaristudio Creative",
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [{ url: ogImage, alt: "Alfaristudio Creative" }],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    verification: {
      google:
        process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ||
        process.env.GOOGLE_SITE_VERIFICATION,
    },
  };
}

/** JSON-LD for the portfolio page (/portofolio), as one @graph so the entities can reference each other. */
export function getHomeStructuredData(lang: AppLocale) {
  const seo = localizedSeo[lang];

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": ids.person,
        name: personName,
        givenName: "M. Firdaus",
        familyName: "Alfarizi",
        alternateName: ["Alfi", "Firdaus Alfarizi"],
        url: pageUrl,
        mainEntityOfPage: { "@id": ids.webpage },
        image: {
          "@type": "ImageObject",
          url: profileImage,
          caption: personName,
        },
        jobTitle: "Creative & Marketer",
        description: seo.description,
        email: `mailto:${email}`,
        sameAs: [`${siteUrl}/`, ...socialProfiles],
        address: {
          "@type": "PostalAddress",
          addressLocality: "Palembang",
          addressRegion: "Sumatera Selatan",
          addressCountry: "ID",
        },
        nationality: { "@type": "Country", name: "Indonesia" },
        knowsLanguage: [
          { "@type": "Language", name: "Indonesian", alternateName: "id" },
          { "@type": "Language", name: "English", alternateName: "en" },
        ],
        knowsAbout: [
          "Digital Marketing",
          "Ads Optimization",
          "Creative Strategy",
          "Content Creation",
          ...expertise,
        ],
      },
      {
        "@type": "WebSite",
        "@id": ids.website,
        url: `${siteUrl}/`,
        name: "Alfaristudio Creative",
        description: seo.siteDescription,
        inLanguage: [...locales],
        publisher: { "@id": ids.person },
      },
      {
        "@type": "ProfilePage",
        "@id": ids.webpage,
        url: pageUrl,
        name: seo.title,
        description: seo.description,
        inLanguage: lang,
        dateModified: lastModified,
        isPartOf: { "@id": ids.website },
        about: { "@id": ids.person },
        mainEntity: { "@id": ids.person },
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: `${siteUrl}${ogImage}`,
          width: 1200,
          height: 630,
        },
        hasPart: { "@id": ids.works },
      },
      {
        "@type": "ItemList",
        "@id": ids.works,
        name: seo.worksName,
        numberOfItems: works.length,
        itemListOrder: "https://schema.org/ItemListOrderAscending",
        itemListElement: works.map((work, index) => ({
          "@type": "ListItem",
          position: index + 1,
          item: {
            "@type": "CreativeWork",
            "@id": `${pageUrl}#work-${work.title.toLowerCase()}`,
            name: work.title,
            description: work.description[lang],
            url: work.href,
            image: `${siteUrl}${work.image}`,
            genre: work.category,
            inLanguage: lang,
            author: { "@id": ids.person },
            creator: { "@id": ids.person },
          },
        })),
      },
    ],
  };
}

export function getStudioStructuredData(lang: AppLocale) {
  const isId = lang === "id";
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${siteUrl}/#agency`,
    name: "Alfaristudio Creative",
    url: `${siteUrl}/`,
    logo: `${siteUrl}/assets/images/alfaristudio-logo.svg`,
    image: `${siteUrl}${ogImage}`,
    founder: {
      "@type": "Person",
      name: personName,
      url: pageUrl,
    },
    description: isId
      ? "Agensi dan studio pertumbuhan digital yang berfokus pada Performance Ads (Meta, Google, TikTok Ads), Produksi Konten Video & Visual Kreatif, Web Development, serta Analitik Konversi."
      : "Digital growth studio specializing in Performance Ads (Meta, Google, TikTok Ads), Creative Video & Visual Production, Web Development, and Conversion Analytics.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Palembang",
      addressRegion: "Sumatera Selatan",
      addressCountry: "ID",
    },
    email: `mailto:${email}`,
    sameAs: [pageUrl, ...socialProfiles],
  };
}

export { lastModified };
