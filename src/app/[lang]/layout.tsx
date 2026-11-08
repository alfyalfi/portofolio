import type { Metadata } from "next";
import { layGrotesk } from "@/common/font";
import { Analytics } from "@vercel/analytics/next";
import type { AppLocale } from "@/common/i18n";
import { buildSeoMetadata } from "@/common/seo-metadata";
import "@/app/globals.css";

export async function generateStaticParams() {
  return [{ lang: "en" }, { lang: "id" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const lang = resolvedParams.lang as AppLocale;

  return buildSeoMetadata({ lang });
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const resolvedParams = await params;
  const lang = resolvedParams.lang as AppLocale;

  return (
    <html
      lang={lang}
      className="no-scrollbar bg-[#0a0a0a] text-white"
    >
      <body className={`${layGrotesk.className} antialiased select-none`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
