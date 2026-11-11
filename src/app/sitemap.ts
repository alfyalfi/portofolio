import type { MetadataRoute } from "next";
import {
  getPortfolioUrl,
  getSiteUrl,
  lastModified,
} from "@/common/seo-metadata";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  const portfolioUrl = getPortfolioUrl();

  // "/" is Alfaristudio Creative Homepage and "/portofolio" is the Personal Portfolio
  return [
    {
      url: `${siteUrl}/`,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
      images: [`${siteUrl}/assets/images/og-image.png`],
    },
    {
      url: portfolioUrl,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
      images: [
        `${siteUrl}/assets/images/og-image.png`,
        `${siteUrl}/assets/images/alfarizi.jpg`,
      ],
    },
  ];
}
