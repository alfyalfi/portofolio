"use client";

import { TextReveal } from "@/components/typography/text-reveal";
import { GrowingVideo } from "@/components/ui/growing-video";
import RevealImage from "@/components/ui/reveal-image";
import { careerTimeline } from "@/data/career";

type AboutViewProps = {
  lang: {
    lang: string;
    about_section: {
      title: string;
      paragraph: string;
      timeline_badge?: string;
      timeline_title?: string;
    };
  };
};

export default function AboutView({ lang }: AboutViewProps) {
  const locale = lang.lang === "id" ? "id" : "en";

  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="md:min-h-screen w-full px-4 md:px-8 relative pt-24 pb-10 overflow-clip"
    >
      {/* The design shows no visible section title, but the section still
          needs one so the document outline is not a flat list of divs. */}
      <h2 id="about-heading" className="sr-only">
        {lang.about_section.title}
      </h2>

      {/* Desktop Image. Measured from the top: the video's scroll comes after
          it and must not move it. */}
      <div className="hidden md:block w-[28vw] h-auto absolute top-[calc(150vh+10.5rem)] left-24 -translate-y-1/2 aspect-3/4 overflow-hidden">
        <RevealImage
          src="/assets/images/alfarizi.jpg"
          alt="M. Firdaus Alfarizi"
          width={1024}
          height={768}
          quality={90}
          sizes="35vw"
          style={{ height: "auto" }}
          className="size-full object-cover scale-125"
        />
      </div>

      <div className="w-full flex justify-between relative z-10">
        <div className="w-[85%] md:w-2/5 h-full"></div>
        <div className="flex flex-col">
          {/* Desktop Text */}
          <TextReveal className="hidden md:block max-w-[56vw] text-[clamp(1.2rem,4vw,3.5rem)] leading-[1.2]">
            {lang.about_section.paragraph}
          </TextReveal>

          {/* Mobile Text */}
          <p className="mt-10 md:hidden text-4xl px-4 tracking-tight font-normal text-pretty">
            {lang.about_section.paragraph}
          </p>

          {/* Professional Career Journey - Pure Original Editorial Styling */}
          <div className="mt-14 md:mt-20 max-w-[56vw] max-md:max-w-full max-md:px-4">
            <p className="text-xs uppercase tracking-[0.2em] text-white/40 mb-6 font-medium">
              {lang.about_section.timeline_title || "Perjalanan Profesional (2021 — 2026)"}
            </p>

            <div className="border-t border-white/15 divide-y divide-white/10">
              {careerTimeline.map((item, idx) => (
                <div
                  key={idx}
                  className="group py-5 flex flex-col md:flex-row md:items-baseline justify-between gap-1 md:gap-8 transition-colors"
                >
                  <div className="text-sm font-medium tracking-tight text-white/40 group-hover:text-white transition-colors shrink-0 md:w-32">
                    {item.period}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base md:text-lg font-medium tracking-tight text-white group-hover:text-white transition-colors">
                      {item.role[locale]}
                    </h3>
                    <p className="text-sm text-white/60 mt-0.5">
                      {item.company[locale]} • {item.category[locale]}
                    </p>
                    <p className="text-sm text-neutral-400 mt-1 leading-relaxed">
                      {item.summary[locale]}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="md:hidden flex flex-col w-full">
        {/* Mobile Image */}
        <div className="relative mt-12 w-55 aspect-2/3 overflow-hidden">
          <RevealImage
            src="/assets/images/alfarizi.jpg"
            alt="M. Firdaus Alfarizi"
            width={1024}
            height={768}
            quality={90}
            sizes="275px"
            className="size-full object-cover scale-125"
          />
        </div>
      </div>

      {/* Desktop: reaches back a screen, less the text's padding, so the small
          video arrives beside the text, not after it */}
      <GrowingVideo
        src="/assets/videos/test-video.mp4"
        className="max-md:mt-12 md:motion-safe:-mt-[calc(100vh-8rem)]"
      />
    </section>
  );
}
