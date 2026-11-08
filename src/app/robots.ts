import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/common/seo-metadata";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Deliberately NOT blocking /_next/ : Googlebot needs the JS, CSS
      // and /_next/image responses to render this page at all.
    },
    sitemap: `${siteUrl}/sitemap.xml`,
    // `host` is a Yandex-only, non-standard directive. Google ignores it.
    // Canonicalisation is handled by <link rel="canonical"> instead.
  };
}
