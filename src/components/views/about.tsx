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
      <div className="hidden md:block w-[32vw] h-auto absolute top-[calc(150vh+10.5rem)] left-24 -translate-y-1/2 aspect-4/3 overflow-hidden rounded-xl border border-neutral-800 shadow-2xl">
        <RevealImage
          src="/assets/images/alfarizi.jpg"
          alt="M. Firdaus Alfarizi"
          width={1024}
          height={768}
          quality={90}
          sizes="35vw"
          style={{ height: "auto" }}
          className="size-full object-cover scale-105"
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

          {/* Professional Career Journey */}
          <div className="mt-10 md:mt-14 max-w-[56vw] max-md:max-w-full max-md:px-4">
            <div className="flex items-center gap-2 mb-3.5">
              <span className="size-2 rounded-full bg-sky-400 animate-pulse" />
              <p className="text-xs uppercase tracking-widest font-mono text-sky-400 font-semibold">
                {lang.about_section.timeline_title || "Perjalanan Profesional (2021 — 2026)"}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
              {careerTimeline.map((item, idx) => (
                <div
                  key={idx}
                  className="group relative rounded-xl border border-white/10 bg-neutral-950/70 p-4 backdrop-blur-md transition-all duration-300 hover:border-sky-400/40 hover:bg-neutral-900/80 shadow-lg"
                >
                  <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-white/5">
                    <span className="text-[11px] font-mono font-bold text-sky-400 bg-sky-400/10 px-2 py-0.5 rounded-full border border-sky-400/20">
                      {item.period}
                    </span>
                    <span className="text-[10px] font-mono text-neutral-400 uppercase">
                      0{idx + 1}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white tracking-tight leading-snug group-hover:text-sky-300 transition-colors">
                    {item.role[locale]}
                  </h3>
                  <p className="text-xs font-semibold text-neutral-300 mt-1">
                    {item.company[locale]}
                  </p>
                  <p className="text-[11px] text-neutral-400 mt-1.5 leading-relaxed">
                    {item.summary[locale]}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="md:hidden flex flex-col w-full">
        {/* Mobile Image */}
        <div className="relative mt-12 w-full max-w-[320px] aspect-4/3 overflow-hidden rounded-xl border border-neutral-800">
          <RevealImage
            src="/assets/images/alfarizi.jpg"
            alt="M. Firdaus Alfarizi"
            width={1024}
            height={768}
            quality={90}
            sizes="320px"
            className="size-full object-cover scale-105"
          />
        </div>
      </div>

      {/* Desktop: reaches back a screen, less the text's padding, so the small
          video arrives beside the text, not after it */}
      <GrowingVideo
        src="/assets/videos/real-estate-walkthrough.mp4"
        poster="/assets/images/cine-avan-100826.png"
        className="max-md:mt-12 md:motion-safe:-mt-[calc(100vh-8rem)]"
      />
    </section>
  );
}
