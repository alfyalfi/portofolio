"use client";

import { Fragment, useRef, type PointerEvent } from "react";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import Image from "next/image";
import gsap from "gsap";
import { bebasNeue } from "@/common/font";
import { locales, type AppLocale } from "@/common/i18n";
import { sparklePath } from "@/components/svg/sparkle";
import { TextReveal } from "@/components/typography/text-reveal";
import { ArrowButton } from "@/components/ui/arrow-button";
import HeroBackground from "@/components/ui/hero-background";
import WorkImage from "@/components/ui/work-image";
import QuoteView from "@/components/views/quote";
import Footer from "@/components/partials/footer";
import { studioServices, studioWorkflow } from "@/data/studio-services";
import { cn, inOwnTask } from "@/lib/utils";

gsap.registerPlugin(useGSAP, ScrollTrigger, DrawSVGPlugin);

const reducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const rollWords = (el: Element, on: boolean) => {
  const still = reducedMotion();
  gsap.to(el.querySelectorAll("[data-roll]"), {
    yPercent: on ? -100 : 0,
    duration: still ? 0 : 0.3,
    ease: "power3.inOut",
    stagger: still ? 0 : 0.07,
    overwrite: true,
  });
};

const cardLayouts = [
  "md:col-span-6 md:translate-y-0",
  "md:col-span-5 md:col-start-8 md:translate-y-24",
  "md:col-span-5 md:col-start-1 md:-translate-y-6",
  "md:col-span-6 md:col-start-7 md:translate-y-20",
  "md:col-span-6 md:col-start-2 md:translate-y-4",
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function StudioHomeView({ lang }: { lang: any }) {
  const locale: AppLocale = lang?.lang === "id" ? "id" : "en";
  const isId = locale === "id";
  const rootRef = useRef<HTMLDivElement>(null);
  const heroStarRef = useRef<SVGSVGElement>(null);
  const servicesTitleRef = useRef<HTMLHeadingElement>(null);
  const servicesStarRef = useRef<SVGSVGElement>(null);
  const servicesStarPathRef = useRef<SVGPathElement>(null);
  const catalogRef = useRef<HTMLDivElement>(null);

  const { contextSafe } = useGSAP(
    (_, contextSafe) =>
      inOwnTask(
        contextSafe!(() => {
          const root = rootRef.current;
          if (!root) return;

          const media = gsap.matchMedia();

          media.add("(prefers-reduced-motion: no-preference)", () => {
            // 1. Hero Star continuous rotation
            if (heroStarRef.current) {
              gsap.to(heroStarRef.current, {
                rotation: 360,
                duration: 12,
                ease: "none",
                repeat: -1,
              });
            }

            // 2. Services Section Title Gradient Scrub
            if (servicesTitleRef.current) {
              gsap.to(servicesTitleRef.current, {
                "--fill": "100%",
                ease: "none",
                scrollTrigger: {
                  trigger: servicesTitleRef.current,
                  start: "top 85%",
                  end: "top 25%",
                  scrub: 1,
                },
              });
            }

            // 3. Services Star DrawSVG + Spin
            if (servicesStarRef.current && servicesStarPathRef.current) {
              gsap
                .timeline({
                  scrollTrigger: {
                    trigger: servicesStarRef.current,
                    start: "top 85%",
                    toggleActions: "play none none reverse",
                  },
                })
                .fromTo(
                  servicesStarPathRef.current,
                  { drawSVG: "0%", fillOpacity: 0 },
                  { drawSVG: "100%", duration: 1.2, ease: "power2.inOut" },
                )
                .to(
                  servicesStarPathRef.current,
                  { fillOpacity: 1, duration: 0.4, ease: "power1.out" },
                  "-=0.3",
                );

              gsap.to(servicesStarRef.current, {
                rotation: 360,
                duration: 10,
                ease: "none",
                repeat: -1,
              });
            }

            // 4. Service Cards Sky-400 Curtain Wipe + Zoom-Out + Overlapping Caption
            if (catalogRef.current) {
              const hidden = { clipPath: "inset(100% 0% 0% 0%)" };
              const shown = { clipPath: "inset(0% 0% 0% 0%)" };

              gsap.utils
                .toArray<HTMLElement>("[data-service-card]", catalogRef.current)
                .forEach((article) => {
                  const panel =
                    article.querySelector<HTMLElement>("[data-reveal-panel]");
                  const mediaBox =
                    article.querySelector<HTMLElement>("[data-reveal-media]");
                  const caption =
                    article.querySelector<HTMLElement>("[data-reveal-caption]");
                  if (!panel || !mediaBox || !caption) return;

                  gsap.set([panel, mediaBox], hidden);
                  gsap.set(caption, { yPercent: 35, opacity: 0 });

                  gsap
                    .timeline({
                      scrollTrigger: {
                        trigger: article,
                        start: "top 85%",
                        toggleActions: "play none none reverse",
                      },
                    })
                    .to(panel, {
                      ...shown,
                      duration: 0.7,
                      ease: "power3.inOut",
                    })
                    .to(
                      mediaBox,
                      {
                        ...shown,
                        duration: 0.85,
                        ease: "power4.out",
                      },
                      0.18,
                    )
                    .to(
                      caption,
                      {
                        yPercent: 0,
                        opacity: 1,
                        duration: 0.75,
                        ease: "power3.out",
                      },
                      0.4,
                    );
                });
            }
          });
        }),
      ),
    { scope: rootRef },
  );

  const onQuickLinkHover = (on: boolean) =>
    contextSafe(({ pointerType, currentTarget }: PointerEvent) => {
      if (pointerType !== "mouse") return;
      rollWords(currentTarget, on);
    });

  return (
    <div ref={rootRef} className="w-full bg-[#0a0a0a] text-white">
      {/* 1. STUDIO NAVBAR — Uses Custom Alfaristudio Creative Logo (A✦) */}
      <nav
        aria-label="Alfaristudio Creative Navigation"
        className="absolute top-4 z-50 w-full bg-transparent px-4 md:px-8"
      >
        <div className="flex h-16 w-full items-center justify-between">
          <a
            href="#studio-top"
            className="group flex items-center gap-3 py-1"
            aria-label="Alfaristudio Creative"
          >
            <div className="relative size-10 overflow-hidden transition-transform duration-300 group-hover:scale-105 md:size-11">
              <Image
                src="/assets/images/alfaristudio-logo.svg"
                alt="Alfaristudio Creative"
                fill
                sizes="44px"
                className="object-contain"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="text-sm leading-none font-bold tracking-tight text-white uppercase transition-colors group-hover:text-sky-400 md:text-base">
                Alfaristudio
              </span>
              <span className="mt-1 text-[10px] font-medium tracking-[0.2em] text-white/50 uppercase md:text-xs">
                Creative & Digital Growth
              </span>
            </div>
          </a>

          <div className="flex items-center gap-3 md:gap-5">
            <a
              href="/portofolio"
              className="border-b border-white/30 pb-0.5 text-[11px] font-medium tracking-[0.18em] text-white/75 uppercase transition-colors hover:border-sky-400 hover:text-white md:text-xs"
            >
              {isId ? "Portofolio Founder ↗" : "Founder Portfolio ↗"}
            </a>

            <div className="flex items-center gap-2">
              {locales.map((loc) => (
                <button
                  key={loc}
                  type="button"
                  lang={loc}
                  aria-pressed={loc === locale}
                  onClick={() => {
                    if (loc === locale) return;
                    window.dispatchEvent(
                      new CustomEvent("page-transition", {
                        detail: { locale: loc },
                      }),
                    );
                  }}
                  className="group relative flex h-12 w-12 cursor-pointer items-center justify-center overflow-hidden border border-white/20 bg-transparent text-base tracking-tight text-neutral-200 transition-colors duration-300 hover:border-sky-400 md:h-14 md:w-14 md:text-xl"
                >
                  <span className="relative block h-6 overflow-hidden">
                    <span className="block transition-transform duration-500 ease-out group-hover:-translate-y-7">
                      <span className="block -translate-y-0.5">
                        {loc.toUpperCase()}
                      </span>
                      <span
                        aria-hidden="true"
                        className="block -translate-y-0.5 text-sky-400"
                      >
                        {loc.toUpperCase()}
                      </span>
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* 2. HERO SECTION WITH ORIGINAL WEBGL SHADER */}
      <section
        id="studio-top"
        className="relative flex min-h-svh w-full flex-col justify-between overflow-hidden px-4 pt-28 pb-10 md:px-8 md:pt-32 md:pb-12"
      >
        <HeroBackground />

        <div className="relative z-10 my-auto pt-8 md:pt-12">
          <p className="mb-4 text-xs font-medium tracking-[0.25em] text-sky-400 uppercase md:text-sm">
            {isId
              ? "Agensi Digital Marketing & Produksi Kreatif — Palembang, ID"
              : "Performance Marketing & Creative Production Studio — Palembang, ID"}
          </p>

          <h1
            className={cn(
              bebasNeue.className,
              "text-[18vw] leading-[0.82] tracking-tight text-white uppercase md:text-[12.5vw]",
            )}
          >
            <span className="block">ALFARISTUDIO</span>
            <span className="flex items-center gap-[0.18em]">
              <span>CREATIVE</span>
              <svg
                ref={heroStarRef}
                viewBox="0 0 100 100"
                aria-hidden="true"
                className="size-[0.65em] shrink-0 overflow-visible text-sky-400"
              >
                <path d={sparklePath} fill="currentColor" />
              </svg>
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-relaxed text-neutral-300 md:mt-8 md:text-xl">
            {isId
              ? "Partner pertumbuhan bisnis terpadu — memadukan strategi iklan berbayar berbasis data (Meta Ads, Google Ads, TikTok Ads), produksi konten video & visual berkonversi tinggi, serta pembuatan website cepat."
              : "End-to-end digital growth partner — combining data-backed paid advertising (Meta, Google, TikTok Ads), high-converting video & creative production, and high-speed web engineering."}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4 md:mt-10">
            <a
              href="https://wa.me/6282176152196?text=Halo%20Alfaristudio%20Creative%2C%20saya%20ingin%20konsultasi%20layanan%20digital%20marketing%20untuk%20bisnis%20saya."
              target="_blank"
              rel="noopener noreferrer"
              className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <ArrowButton
                reversed
                upRight
                label={
                  isId ? "Konsultasi Bisnis Gratis" : "Free Growth Consultation"
                }
              />
            </a>

            <a
              href="/portofolio"
              className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <ArrowButton
                upRight
                label={
                  isId
                    ? "Lihat Portofolio Founder"
                    : "Explore Founder Portfolio"
                }
              />
            </a>
          </div>
        </div>

        {/* Bottom Editorial Index Strip */}
        <div className="relative z-10 mt-12 grid grid-cols-2 gap-6 border-t border-white/15 pt-6 md:grid-cols-4">
          {[
            {
              value: "1.190+",
              label: isId
                ? "Prospek Terkualifikasi (WA & Form)"
                : "Verified Qualified Leads",
            },
            {
              value: "Rp 2.850",
              label: isId
                ? "Rekor Cost Per Lead Terendah"
                : "Lowest Verified Cost Per Lead",
            },
            {
              value: "3.92%",
              label: isId
                ? "CTR Kampanye Kreatif"
                : "Peak Creative Campaign CTR",
            },
            {
              value: "GA4 & Meta",
              label: isId
                ? "Tersertifikasi Resmi Google & HubSpot"
                : "Google & HubSpot Certified Studio",
            },
          ].map((stat) => (
            <div key={stat.value}>
              <div
                className={cn(
                  bebasNeue.className,
                  "text-3xl leading-none tracking-tight text-white md:text-5xl",
                )}
              >
                {stat.value}
              </div>
              <div className="mt-1 text-xs text-white/50">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. POSITIONING STATEMENT + INTERACTIVE SERVICE INDEX */}
      <section className="w-full border-t border-white/15 px-4 py-24 md:px-8 md:py-36">
        <div className="flex flex-col justify-between gap-12 md:flex-row">
          <div className="md:w-1/3">
            <p className="text-xs font-medium tracking-[0.2em] text-white/40 uppercase">
              01 / ALFARISTUDIO CREATIVE
            </p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-neutral-400">
              {isId
                ? "Dipimpin langsung oleh M. Firdaus Alfarizi (Alfi), setiap kampanye dieksekusi berdasarkan metrik nyata—bukan asumsi."
                : "Led directly by M. Firdaus Alfarizi (Alfi), every campaign is engineered around measurable ROI—never guesswork."}
            </p>
          </div>

          <div className="md:w-2/3">
            <TextReveal className="hidden text-[clamp(1.5rem,3.6vw,3.2rem)] leading-[1.18] md:block">
              {isId
                ? "kami membantu developer properti, bisnis lokal, hingga perusahaan berkembang mengubah anggaran iklan dan konten kreatif menjadi prospek penjualan nyata setiap hari."
                : "we help property developers, local businesses, and growing companies turn advertising spend and creative content into qualified daily sales leads."}
            </TextReveal>
            <p className="text-3xl leading-tight tracking-tight md:hidden">
              {isId
                ? "kami membantu developer properti, bisnis lokal, hingga perusahaan berkembang mengubah anggaran iklan dan konten kreatif menjadi prospek penjualan nyata setiap hari."
                : "we help property developers, local businesses, and growing companies turn advertising spend and creative content into qualified daily sales leads."}
            </p>

            {/* Quick Interactive Jump List (services.tsx word-roll mechanics) */}
            <div className="mt-16 border-t border-white/15 pt-8">
              <p className="mb-6 text-xs font-medium tracking-[0.2em] text-white/40 uppercase">
                {isId
                  ? "5 Pilar Layanan Utama (Klik untuk Detail)"
                  : "5 Core Digital Pillars (Click to Explore)"}
              </p>
              <div
                className={cn(
                  bebasNeue.className,
                  "flex flex-wrap gap-x-6 gap-y-2 text-[11vw] leading-[0.9] tracking-tight text-white/35 uppercase md:text-[4.2vw]",
                )}
              >
                {studioServices.map((srv, idx) => (
                  <span key={srv.id} className="inline-flex items-baseline gap-4">
                    <a
                      href={`#${srv.id}`}
                      onPointerEnter={onQuickLinkHover(true)}
                      onPointerLeave={onQuickLinkHover(false)}
                      className="transition-colors duration-300 hover:text-white"
                    >
                      {srv.shortName.split(" ").map((word, wIdx) => (
                        <Fragment key={`${word}-${wIdx}`}>
                          <span className="inline-block [clip-path:inset(-0.04em_-0.08em_0.04em)]">
                            <span
                              data-roll
                              data-text={word}
                              className="relative block after:absolute after:top-full after:left-0 after:text-white after:content-[attr(data-text)]"
                            >
                              {word}
                            </span>
                          </span>{" "}
                        </Fragment>
                      ))}
                    </a>
                    {idx < studioServices.length - 1 && (
                      <span aria-hidden="true" className="text-white/20">
                        /
                      </span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. DEEP-DIVE DIGITAL SERVICES CATALOG (works.tsx Staggered Layout + Sky-400 Wipe + WorkImage Shader) */}
      <section
        id="layanan"
        className="w-full overflow-x-clip border-t border-white/15 px-4 pt-20 pb-28 md:px-8 md:pt-28 md:pb-40"
      >
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="mb-3 text-xs font-medium tracking-[0.2em] text-white/40 uppercase">
              {isId ? "02 / Katalog Jasa Digital" : "02 / Digital Services Catalog"}
            </p>
            <h2 className="flex items-center gap-[0.2em] text-[13vw] leading-none font-bold tracking-tight uppercase md:text-[6vw]">
              <span
                ref={servicesTitleRef}
                className="[--fill:100%] md:[--fill:0%] bg-[linear-gradient(90deg,#fff_var(--fill),rgb(255_255_255/0.2)_var(--fill))] bg-clip-text text-transparent"
              >
                {isId ? "Layanan Digital" : "Digital Services"}
              </span>
              <svg
                ref={servicesStarRef}
                viewBox="0 0 100 100"
                aria-hidden="true"
                className="size-[0.75em] shrink-0 overflow-visible text-sky-400"
              >
                <path
                  ref={servicesStarPathRef}
                  d={sparklePath}
                  fill="currentColor"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinejoin="round"
                />
              </svg>
            </h2>
          </div>

          <p className="max-w-md text-xs leading-relaxed text-neutral-400 md:text-sm">
            {isId
              ? "Pilih layanan spesifik yang dibutuhkan perusahaan Anda atau gunakan paket Full-Stack Growth untuk penanganan menyeluruh dari konten hingga iklan."
              : "Select a specialized digital service or partner with us for Full-Stack Growth covering creative production, web funnels, and paid ads."}
          </p>
        </div>

        <div
          ref={catalogRef}
          className="mt-16 flex flex-col gap-32 md:mt-24 md:grid md:grid-cols-12 md:gap-x-8 md:gap-y-44"
        >
          {studioServices.map((service, index) => {
            const layoutClass = cardLayouts[index % cardLayouts.length];
            const waText = encodeURIComponent(
              isId
                ? `Halo Alfaristudio Creative, saya tertarik mendiskusikan layanan "${service.title.id}" untuk bisnis saya.`
                : `Hi Alfaristudio Creative, I would like to discuss your "${service.title.en}" service.`,
            );

            return (
              <article
                key={service.id}
                id={service.id}
                data-service-card
                className={cn(
                  "group relative w-[90%] shrink-0 md:w-full",
                  index % 2 === 0 ? "self-start" : "self-end",
                  layoutClass,
                )}
              >
                {/* Top Metadata Line */}
                <div className="mb-3 flex items-baseline justify-between text-xs tracking-[0.2em] text-white/40 uppercase">
                  <span>{service.category[locale]}</span>
                  <span
                    className={cn(
                      bebasNeue.className,
                      "text-3xl leading-none text-white/30 transition-colors duration-300 group-hover:text-sky-400 md:text-4xl",
                    )}
                  >
                    {service.number}
                  </span>
                </div>

                {/* Frameless Media with Sky-400 Curtain Wipe + WebGL WorkImage Hover */}
                <figure className="relative aspect-11/15 w-full overflow-hidden bg-neutral-900">
                  <div
                    data-reveal-panel
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 z-0 bg-sky-400"
                  />
                  <div
                    data-reveal-media
                    className="relative z-10 size-full overflow-hidden"
                  >
                    <WorkImage
                      src={service.image}
                      hoverSrc={service.hoverImage}
                      alt={service.title[locale]}
                    />
                  </div>
                </figure>

                {/* Overlapping Title + Deliverables + Metric + CTA */}
                <div
                  data-reveal-caption
                  className="relative z-20 -mt-14 text-white md:-mt-16"
                >
                  <h3
                    className={cn(
                      "text-[11vw] leading-[0.95] font-medium tracking-tight md:ml-[-10%] md:text-[3.4vw]",
                      index % 2 === 0 ? "ml-[4%]" : "mr-[4%] text-right md:mr-0 md:text-left",
                    )}
                  >
                    {service.title[locale]}
                  </h3>

                  <div className="mt-4 max-w-lg md:ml-[-4%]">
                    <p className="text-sm leading-relaxed text-neutral-300 md:text-base">
                      {service.summary[locale]}
                    </p>

                    {/* Editorial Deliverables List */}
                    <ul className="mt-5 divide-y divide-white/10 border-t border-b border-white/15 text-xs text-neutral-300 md:text-sm">
                      {service.deliverables[locale].map((item) => (
                        <li
                          key={item}
                          className="flex items-center justify-between py-2.5"
                        >
                          <span>{item}</span>
                          <span className="text-sky-400">✦</span>
                        </li>
                      ))}
                    </ul>

                    {/* Highlight Metric & CTA */}
                    <div className="mt-5 flex flex-wrap items-end justify-between gap-6">
                      <div>
                        <div
                          className={cn(
                            bebasNeue.className,
                            "text-4xl leading-none tracking-tight text-white md:text-5xl",
                          )}
                        >
                          {service.highlightMetric.value}
                        </div>
                        <div className="mt-1 text-[11px] tracking-wider text-white/50 uppercase">
                          {service.highlightMetric.label[locale]}
                        </div>
                      </div>

                      <a
                        href={`https://wa.me/6282176152196?text=${waText}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group/btn block focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                      >
                        <ArrowButton
                          upRight
                          label={isId ? "Pesan Layanan Ini" : "Book This Service"}
                          className="w-fit"
                        />
                      </a>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* 5. WORKFLOW & FOUNDER PORTFOLIO BRIDGE */}
      <section className="w-full border-t border-white/15 px-4 py-24 md:px-8 md:py-36">
        <div className="grid grid-cols-1 gap-16 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="text-xs font-medium tracking-[0.2em] text-white/40 uppercase">
              {isId ? "03 / Tahapan Eksekusi" : "03 / Execution Blueprint"}
            </p>
            <h2
              className={cn(
                bebasNeue.className,
                "mt-3 text-[14vw] leading-[0.88] tracking-tight text-white uppercase md:text-[5.5vw]",
              )}
            >
              {isId
                ? "SISTEM KERJA TERUKUR & TRANSPARAN"
                : "MEASURABLE & TRANSPARENT WORKFLOW"}
            </h2>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-neutral-400">
              {isId
                ? "Lihat bukti nyata studi kasus properti, e-commerce, dan seluruh galeri karya M. Firdaus Alfarizi di halaman portofolio resmi."
                : "Explore verified real estate & e-commerce case studies and the complete creative archive of M. Firdaus Alfarizi on the official portfolio."}
            </p>

            <a
              href="/portofolio"
              className="group mt-8 inline-block focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <ArrowButton
                reversed
                upRight
                label={
                  isId
                    ? "Buka Portofolio (/portofolio)"
                    : "Open Portfolio (/portofolio)"
                }
              />
            </a>
          </div>

          <div className="divide-y divide-white/10 border-t border-white/15 md:col-span-7">
            {studioWorkflow.map((wf) => (
              <div
                key={wf.step}
                className="group flex flex-col justify-between gap-3 py-7 transition-colors md:flex-row md:items-baseline md:gap-8"
              >
                <span
                  className={cn(
                    bebasNeue.className,
                    "text-3xl leading-none text-white/35 transition-colors group-hover:text-sky-400 md:w-20 md:text-4xl",
                  )}
                >
                  {wf.step}
                </span>
                <div className="flex-1">
                  <h3 className="text-lg font-medium tracking-tight text-white md:text-xl">
                    {wf.title[locale]}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-neutral-400">
                    {wf.desc[locale]}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. ORIGINAL PINNED QUOTE + CTA + FOOTER */}
      <section className="relative z-10 block min-h-screen w-screen bg-[#0a0a0a]">
        <QuoteView lang={lang} />
      </section>
      <Footer lang={lang} />
    </div>
  );
}
