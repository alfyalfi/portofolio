import type { Metadata } from "next";
import type { AppLocale } from "@/common/i18n";
import { buildSeoMetadata, getHomeStructuredData } from "@/common/seo-metadata";
import Footer from "@/components/partials/footer";
import PageClientLayout from "@/components/partials/page-client-layout";
import Section from "@/components/partials/section";
import CursorPointer from "@/components/ui/cursor-pointer";
import IntroAnimation from "@/components/ui/intro-animation";

// Language Dictionary
import getDictionary from "./dictionaries";

export async function generateMetadata(props: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const lang = params.lang as AppLocale;

  return buildSeoMetadata({ lang });
}

export default async function Page(props: {
  params: Promise<{ lang: string }>;
}) {
  const params = await props.params;
  const lang = params.lang as AppLocale;
  const t = await getDictionary(lang);
  // "<" is escaped so no string in the data can close the <script> early
  const structuredData = JSON.stringify(getHomeStructuredData(lang)).replace(
    /</g,
    "\\u003c",
  );

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: structuredData }}
      />

      <IntroAnimation key={lang} />

      <PageClientLayout>
        <Section id="hero" lang={t}></Section>
        <Section id="about" lang={t}></Section>
        <Section id="services" lang={t}></Section>
        <Section id="works" lang={t}></Section>
        <Section id="expertise" lang={t}></Section>
        <Section id="quote" lang={t}></Section>
        <Footer lang={t} />
      </PageClientLayout>

      <CursorPointer />
    </div>
  );
}
