import type { MetadataRoute } from "next";
import {
  getSiteUrl,
  getStudioSiteUrl,
  lastModified,
} from "@/common/seo-metadata";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  const studioUrl = getStudioSiteUrl();

  // Every language is served at "/" (see src/proxy.ts), so each domain is a
  // single canonical URL. The old /en and /id URLs 301 to it.
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
    {
      url: `${studioUrl}/`,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
      images: [`${studioUrl}/assets/images/og-image.png`],
    },
  ];
}
