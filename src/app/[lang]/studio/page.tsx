import type { Metadata } from "next";
import type { AppLocale } from "@/common/i18n";
import {
  buildStudioSeoMetadata,
  getStudioStructuredData,
} from "@/common/seo-metadata";
import PageClientLayout from "@/components/partials/page-client-layout";
import CursorPointer from "@/components/ui/cursor-pointer";
import IntroAnimation from "@/components/ui/intro-animation";
import StudioHomeView from "@/components/views/studio-home";
import getDictionary from "../dictionaries";

export async function generateMetadata(props: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const lang = params.lang as AppLocale;

  return buildStudioSeoMetadata({ lang });
}

export default async function StudioPage(props: {
  params: Promise<{ lang: string }>;
}) {
  const params = await props.params;
  const lang = params.lang as AppLocale;
  const t = await getDictionary(lang);
  const structuredData = JSON.stringify(getStudioStructuredData(lang)).replace(
    /</g,
    "\\u003c",
  );

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: structuredData }}
      />

      <IntroAnimation key={`studio-${lang}`} />

      <PageClientLayout>
        <StudioHomeView lang={t} />
      </PageClientLayout>

      <CursorPointer />
    </div>
  );
}
