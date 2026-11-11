import {
  getPortfolioUrl,
  getSiteUrl,
  socialProfiles,
} from "@/common/seo-metadata";
import { expertise } from "@/data/expertise";
import { email } from "@/data/socials";
import { works } from "@/data/works";
import { careerTimeline } from "@/data/career";
import { studioServices } from "@/data/studio-services";

// llms.txt (https://llmstxt.org): a plain summary for AI assistants.
export const dynamic = "force-static";

export function GET() {
  const siteUrl = getSiteUrl();
  const portfolioUrl = getPortfolioUrl();

  const body = `# Alfaristudio Creative & M. Firdaus Alfarizi (Alfi)

> Creative & Marketer, Ads Specialist, and Founder of Alfaristudio Creative based in Palembang, Indonesia. Helps companies scale through data-driven Meta Ads, Google Ads, TikTok Ads, high-converting creative production, and Next.js web engineering.

- Alfaristudio Creative (Digital Services Homepage): ${siteUrl}/
- Personal Portfolio of M. Firdaus Alfarizi: ${portfolioUrl}

## Alfaristudio Creative — Digital Services (${siteUrl}/)

${studioServices.map((s) => `- [${s.number}] ${s.title.en} (${s.category.en}): ${s.summary.en}`).join("\n")}

## Career Journey (2021 — 2026)

${careerTimeline.map((item) => `- [${item.period}] ${item.role.en} at ${item.company.en} (${item.category.en}): ${item.summary.en}`).join("\n")}

## Featured Case Studies & Creative Works (${portfolioUrl})

${works.map((work) => `- [${work.theme.en}] ${work.title}: ${work.tagline.en} | Metrics: ${work.metrics.map((m) => `${m.value} (${m.label.en})`).join(", ")}`).join("\n")}

## Expertise & Tools

${expertise.join(", ")}

## Contact

- Email: ${email}
${socialProfiles.map((url) => `- ${url}`).join("\n")}
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
