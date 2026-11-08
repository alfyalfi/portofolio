"use client";

import { TextReveal } from "@/components/typography/text-reveal";
import { GrowingVideo } from "@/components/ui/growing-video";
import RevealImage from "@/components/ui/reveal-image";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function AboutView({ lang }: { lang: any }) {
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
