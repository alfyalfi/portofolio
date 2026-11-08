import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    // AVIF first: smaller than WebP for the work photos, WebP as the fallback
    formats: ["image/avif", "image/webp"],
    // 90 for the about photo, which is already compressed by hand
    qualities: [75, 90],
  },
  experimental: {
    // One page of Tailwind CSS (~10KB): in the HTML it no longer blocks the
    // first paint behind extra requests
    inlineCss: true,
  },
};

export default nextConfig;
