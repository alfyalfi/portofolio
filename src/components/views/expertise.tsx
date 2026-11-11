"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { expertise } from "@/data/expertise";
import { sparklePath } from "@/components/svg/sparkle";
import gsap from "gsap";
import { inOwnTask } from "@/lib/utils";
import Image from "next/image";

gsap.registerPlugin(useGSAP, ScrollTrigger, DrawSVGPlugin);

type ExpertiseViewProps = {
  lang: {
    lang?: string;
    expertise_section: {
      title: string;
      cert_badge?: string;
      cert_title?: string;
      cert_desc?: string;
    };
  };
};

export default function ExpertiseView({ lang }: ExpertiseViewProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const starRef = useRef<SVGSVGElement>(null);
  const starPathRef = useRef<SVGPathElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useGSAP(
    // Below the fold: set up after hydration, in a task of its own
    (_, contextSafe) =>
      inOwnTask(
        contextSafe!(() => {
          const star = starRef.current;
          const starPath = starPathRef.current;
          const media = gsap.matchMedia();

          // The star next to the title draws its outline, fills in, then
          // keeps spinning slowly (paused while off screen to save frames).
          media.add("(prefers-reduced-motion: no-preference)", () => {
            if (!star || !starPath) return;

            gsap
              .timeline({
                scrollTrigger: {
                  trigger: star,
                  start: "top 85%",
                  toggleActions: "play none none reverse",
                },
              })
              .fromTo(
                starPath,
                { drawSVG: "0%", fillOpacity: 0 },
                { drawSVG: "100%", duration: 1.2, ease: "power2.inOut" },
              )
              .to(
                starPath,
                { fillOpacity: 1, duration: 0.4, ease: "power1.out" },
                "-=0.3",
              );

            const spin = gsap.to(star, {
              rotation: 360,
              duration: 10,
              ease: "none",
              repeat: -1,
              paused: true,
            });
            ScrollTrigger.create({
              trigger: star,
              start: "top bottom",
              end: "bottom top",
              onToggle: (self) => (self.isActive ? spin.play() : spin.pause()),
            });
          });

          // Line reveal (masked lines rising in, one after another, once): every
          // <li> is a mask and its content slides up from below. Entries on the
          // same visual line rise together, lines are staggered top to bottom.
          media.add("(prefers-reduced-motion: no-preference)", () => {
            const rows = new Map<number, HTMLElement[]>();
            gsap.utils.toArray<HTMLElement>("li", listRef.current).forEach((li) => {
              const row = rows.get(li.offsetTop) ?? [];
              rows.set(li.offsetTop, [...row, li.firstElementChild as HTMLElement]);
            });
            const lines = [...rows.values()];

            gsap.set(lines.flat(), { yPercent: 100 });
            const reveal = gsap.timeline({
              scrollTrigger: {
                trigger: listRef.current,
                start: "top 75%",
                once: true,
              },
            });
            lines.forEach((line, index) =>
              reveal.to(
                line,
                { yPercent: 0, duration: 1, ease: "power4.out" },
                index * 0.1,
              ),
            );
          });

          // Touch screens have no hover, so the item crossing the middle of the
          // screen lights up instead (data-active), following the scroll.
          media.add("(hover: none)", () => {
            const items = gsap.utils.toArray<HTMLElement>(
              "[data-tech]",
              listRef.current,
            );

            items.forEach((item) => {
              const li = item.closest("li")!;
              // The <li> line box never moves during the line reveal (its content
              // does). Its 0.1em mask padding overlaps the neighbouring lines, so
              // trim it off, or two lines would light up at once.
              const pad = () => parseFloat(getComputedStyle(li).paddingTop);

              ScrollTrigger.create({
                trigger: li,
                start: () => `top+=${pad()} center`,
                end: () => `bottom-=${pad()} center`,
                onToggle: (self) =>
                  item.toggleAttribute("data-active", self.isActive),
              });
            });

            return () =>
              items.forEach((item) => item.removeAttribute("data-active"));
          });
        }),
      ),
    { scope: rootRef },
  );

  return (
    <div
      ref={rootRef}
      className="flex min-h-screen flex-col px-4 pt-12 pb-24 md:px-8 md:pt-[8vh] md:pb-32"
    >
      {/* Same title treatment and spot as "Selected works" */}
      <h2 className="flex items-center gap-[0.2em] text-[14vw] tracking-tight md:text-[6vw]">
        {lang.expertise_section.title}
        {/* Four-point sparkle star ✦ */}
        <svg
          ref={starRef}
          viewBox="0 0 100 100"
          aria-hidden="true"
          className="size-[0.8em] shrink-0 overflow-visible text-sky-400"
        >
          <path
            ref={starPathRef}
            d={sparklePath}
            fill="currentColor"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinejoin="round"
          />
        </svg>
      </h2>

      {/* Same dimmed white as the unfilled title; on mobile
          the same size as the title too. Each "/" sits in the gap after its
          item. The last item of every line ends flush with the right edge, so
          its "/" falls outside the list and overflow-x-clip hides it: a "/"
          only ever shows between two items on the same line. */}
      <ul
        ref={listRef}
        className="my-auto ml-auto flex flex-wrap justify-end gap-x-[0.8em] overflow-x-clip pt-12 text-right text-[11vw] leading-[1.01] tracking-tight text-white/40 md:max-w-[80vw] md:pt-16 md:text-[6vw]"
      >
        {expertise.map((name) => (
          // overflow-y-clip makes the <li> the mask for the line reveal (only
          // vertically, so the "/" outside it still shows); the padding and
          // matching negative margin keep descenders (g, j, p) inside it
          <li key={name} className="my-[-0.1em] overflow-y-clip py-[0.1em]">
            <span className="relative inline-block">
              <span
                data-tech
                className="transition-colors duration-300 hover:text-white data-active:text-white"
              >
                {name}
              </span>
              <span
                aria-hidden="true"
                className="absolute top-0 left-full w-[0.8em] text-center"
              >
                /
              </span>
            </span>
          </li>
        ))}
      </ul>

      {/* Official Certifications & Credentials - Pure Editorial Layout */}
      <div className="mt-20 md:mt-28 border-t border-white/15 pt-12">
        <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4 mb-8">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-white/40 mb-2 font-medium">
              {lang.expertise_section.cert_badge || "Kredensial Resmi"}
            </p>
            <h3 className="text-2xl md:text-3xl font-medium tracking-tight text-white">
              {lang.expertise_section.cert_title || "Sertifikasi Terverifikasi"}
            </h3>
          </div>
          <p className="text-xs md:text-sm text-neutral-400 max-w-md leading-relaxed">
            {lang.expertise_section.cert_desc}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8">
          {[
            {
              src: "/assets/images/cert-google-analytics.png",
              alt: "Google Analytics Certification - M. Firdaus Alfarizi",
              title: "Google Analytics (GA4)",
              issuer: "Google Skillshop",
            },
            {
              src: "/assets/images/cert-google-ads.png",
              alt: "Google Ads Certification - M. Firdaus Alfarizi",
              title: "Google Ads App Certification",
              issuer: "Google Skillshop",
            },
            {
              src: "/assets/images/cert-hubspot.png",
              alt: "HubSpot Academy Digital Marketing Certification - M. Firdaus Alfarizi",
              title: "Digital Marketing Certified",
              issuer: "HubSpot Academy",
            },
          ].map((cert) => (
            <a
              key={cert.src}
              href={cert.src}
              target="_blank"
              rel="noopener noreferrer"
              className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <div className="relative aspect-[11/8.5] w-full overflow-hidden bg-neutral-900 transition-opacity duration-300 group-hover:opacity-90">
                <Image
                  src={cert.src}
                  alt={cert.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 30vw"
                  className="object-contain p-2 transition-transform duration-500 ease-out group-hover:scale-105"
                />
              </div>
              <div className="mt-3 flex items-baseline justify-between border-t border-white/10 pt-2">
                <div>
                  <h4 className="text-sm font-medium text-white group-hover:text-white transition-colors">
                    {cert.title}
                  </h4>
                  <p className="text-xs text-white/40 mt-0.5">
                    {cert.issuer}
                  </p>
                </div>
                <span className="text-xs text-white/40 group-hover:text-white transition-colors">
                  ↗
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
