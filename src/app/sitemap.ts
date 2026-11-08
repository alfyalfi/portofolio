import type { MetadataRoute } from "next";
import { getSiteUrl, lastModified } from "@/common/seo-metadata";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();

  // Every language is served at "/" (see src/proxy.ts), so the site is a
  // single URL. The old /en and /id URLs 301 to it and stay out of here.
  return [
    {
      url: `${siteUrl}/`,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
      images: [
        `${siteUrl}/assets/images/og-image.png`,
        `${siteUrl}/assets/images/alfarizi.jpg`,
      ],
    },
  ];
}
