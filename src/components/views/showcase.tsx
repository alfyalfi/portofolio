"use client";

import {
  Fragment,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent,
} from "react";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import Image from "next/image";
import gsap from "gsap";
import {
  showcaseItems,
  type ShowcaseCategory,
  type ShowcaseItem,
} from "@/data/showcase";
import { workPictures } from "@/data/works";
import { sparklePath } from "@/components/svg/sparkle";
import { ArrowButton } from "@/components/ui/arrow-button";
import { bebasNeue } from "@/common/font";
import { cn, inOwnTask } from "@/lib/utils";

gsap.registerPlugin(useGSAP, ScrollTrigger, DrawSVGPlugin);

/** How far apart the flying ring cards set off, in lifetimes of a card. */
const STAGGER = 0.13;

// Each card's height off the middle at its closest (vh) and its width (vmin)
const spots = [
  [14, 38],
  [-20, 32],
  [6, 42],
  [-12, 30],
  [20, 36],
  [-6, 40],
  [-20, 32],
  [12, 38],
  [18, 30],
  [-16, 42],
  [2, 34],
  [-20, 36],
  [16, 40],
  [-10, 32],
  [20, 34],
  [-14, 38],
  [8, 30],
  [-4, 36],
];
const shapes = ["aspect-11/15", "aspect-square", "aspect-4/3"];

type ShowcaseViewProps = {
  lang?: {
    lang?: string;
    showcase_section?: {
      eyebrow?: string;
      title?: string;
      subtitle?: string;
      categories?: Record<ShowcaseCategory, string>;
      play_video?: string;
      pause_video?: string;
      see_detail?: string;
      close_preview?: string;
    };
  };
};

const defaultCategories: Record<
  ShowcaseCategory,
  { id: string; en: string }
> = {
  all: { id: "Semua Karya", en: "All Works" },
  video: { id: "Video & Reels", en: "Video & Reels" },
  property: { id: "Kampanye Properti", en: "Property Campaigns" },
  viral: { id: "Konten Viral", en: "Viral Content" },
  analytics: { id: "Data Iklan & GTM", en: "Ads & GTM Proof" },
};

// Asymmetric editorial column spans & vertical offsets (mirrors works.tsx staggered rhythm)
const cardLayouts = [
  "md:col-span-6 md:translate-y-0",
  "md:col-span-5 md:col-start-8 md:translate-y-24",
  "md:col-span-5 md:col-start-2 md:-translate-y-8",
  "md:col-span-6 md:col-start-7 md:translate-y-16",
  "md:col-span-6 md:translate-y-4",
  "md:col-span-5 md:col-start-8 md:translate-y-28",
];

const reducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Same word-roll animation as services.tsx: grey word rolls up, white copy rises behind it
const rollWords = (el: Element, on: boolean) => {
  const still = reducedMotion();
  gsap.to(el.querySelectorAll("[data-roll]"), {
    yPercent: on ? -100 : 0,
    duration: still ? 0 : 0.35,
    ease: "power3.inOut",
    stagger: still ? 0 : 0.06,
    overwrite: true,
  });
};

export default function ShowcaseView({ lang }: ShowcaseViewProps) {
  const locale = lang?.lang === "id" ? "id" : "en";
  const rootRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const starRef = useRef<SVGSVGElement>(null);
  const starPathRef = useRef<SVGPathElement>(null);
  const filterListRef = useRef<HTMLUListElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const ringTriggerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const inlineVideoRef = useRef<HTMLVideoElement>(null);

  const [activeCategory, setActiveCategory] =
    useState<ShowcaseCategory>("all");
  const [activeItem, setActiveItem] = useState<ShowcaseItem | null>(null);
  const [isInlinePlaying, setIsInlinePlaying] = useState(false);

  const filteredItems =
    activeCategory === "all"
      ? showcaseItems
      : showcaseItems.filter((item) => item.category === activeCategory);

  const categoryKeys: ShowcaseCategory[] = [
    "all",
    "video",
    "property",
    "viral",
    "analytics",
  ];

  // 1. Header, Star, Filter Line-Reveal & 3D Ring Setup (once after hydration)
  const { contextSafe } = useGSAP(
    (_, contextSafe) =>
      inOwnTask(
        contextSafe!(() => {
          const root = rootRef.current;
          const title = titleRef.current;
          const star = starRef.current;
          const starPath = starPathRef.current;
          const filterList = filterListRef.current;
          const ringTrigger = ringTriggerRef.current;
          const stage = stageRef.current;
          if (!root) return;

          const media = gsap.matchMedia();

          media.add("(prefers-reduced-motion: no-preference)", () => {
            // A. Title gradient fill scrub (same as works.tsx)
            if (title) {
              gsap.to(title, {
                "--fill": "100%",
                ease: "none",
                scrollTrigger: {
                  trigger: title,
                  start: "top 85%",
                  end: "top 25%",
                  scrub: 1,
                },
              });
            }

            // B. Sparkle star DrawSVG + continuous spin (same as expertise.tsx)
            if (star && starPath) {
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
            }

            // C. Filter list masked line-reveal (same as expertise.tsx)
            if (filterList) {
              const rows = new Map<number, HTMLElement[]>();
              gsap.utils
                .toArray<HTMLElement>("li", filterList)
                .forEach((li) => {
                  const row = rows.get(li.offsetTop) ?? [];
                  rows.set(li.offsetTop, [
                    ...row,
                    li.firstElementChild as HTMLElement,
                  ]);
                });
              const lines = [...rows.values()];

              gsap.set(lines.flat(), { yPercent: 100 });
              const reveal = gsap.timeline({
                scrollTrigger: {
                  trigger: filterList,
                  start: "top 80%",
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
            }

            // D. Original 3D Flying Ring Cards over QuoteView (original showcase.tsx)
            if (ringTrigger && stage) {
              const timeline = gsap.timeline({
                scrollTrigger: {
                  trigger: ringTrigger,
                  start: "top 70%",
                  end: "bottom -110%",
                  scrub: 1,
                },
              });

              gsap.utils
                .toArray<HTMLElement>("[data-fly]", stage)
                .forEach((card, index) => {
                  const at = index * STAGGER;
                  timeline
                    .to(
                      card,
                      { "--p": -1, duration: 1, ease: "sine.inOut" },
                      at,
                    )
                    .to(card, { "--s": 1, duration: 0.5, ease: "sine.out" }, at)
                    .to(
                      card,
                      { "--s": 0, duration: 0.5, ease: "sine.in" },
                      at + 0.5,
                    );
                });

              ScrollTrigger.create({
                trigger: ringTrigger,
                start: "top 200%",
                end: "bottom -150%",
                onToggle: ({ isActive }) =>
                  stage.toggleAttribute("data-active", isActive),
              });

              return () => stage.removeAttribute("data-active");
            }
          });
        }),
      ),
    { scope: rootRef },
  );

  // 2. Gallery Card Curtain-Wipe + Zoom + Overlapping Caption Reveal & Magnetic Hover
  useGSAP(
    () => {
      const gallery = galleryRef.current;
      if (!gallery) return;

      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        const hidden = { clipPath: "inset(100% 0% 0% 0%)" };
        const shown = { clipPath: "inset(0% 0% 0% 0%)" };

        const articles = gsap.utils.toArray<HTMLElement>(
          "[data-gallery-card]",
          gallery,
        );

        articles.forEach((article) => {
          const panel = article.querySelector<HTMLElement>("[data-reveal-panel]");
          const mediaBox = article.querySelector<HTMLElement>("[data-reveal-media]");
          const zoomEl = article.querySelector<HTMLElement>("[data-reveal-zoom]");
          const caption = article.querySelector<HTMLElement>("[data-reveal-caption]");
          if (!panel || !mediaBox || !zoomEl || !caption) return;

          gsap.set([panel, mediaBox], hidden);
          gsap.set(zoomEl, { scale: 1.28 });
          gsap.set(caption, { yPercent: 45, opacity: 0 });

          gsap
            .timeline({
              scrollTrigger: {
                trigger: article,
                start: "top 86%",
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
              zoomEl,
              {
                scale: 1,
                duration: 1.25,
                ease: "power3.out",
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
              0.42,
            );
        });

        ScrollTrigger.refresh();
      });

      // Desktop magnetic parallax drift on card pointermove (same quickTo feel as services.tsx)
      media.add(
        "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
        () => {
          const cleanups: (() => void)[] = [];
          gsap.utils
            .toArray<HTMLElement>("[data-gallery-card]", gallery)
            .forEach((article) => {
              const fig = article.querySelector<HTMLElement>("figure");
              const zoomEl = article.querySelector<HTMLElement>("[data-reveal-zoom]");
              if (!fig || !zoomEl) return;

              const xTo = gsap.quickTo(zoomEl, "x", {
                duration: 0.7,
                ease: "power3.out",
              });
              const yTo = gsap.quickTo(zoomEl, "y", {
                duration: 0.7,
                ease: "power3.out",
              });

              const onMove = (e: MouseEvent) => {
                const rect = fig.getBoundingClientRect();
                const relX = (e.clientX - rect.left) / rect.width - 0.5;
                const relY = (e.clientY - rect.top) / rect.height - 0.5;
                xTo(relX * -24);
                yTo(relY * -24);
              };
              const onLeave = () => {
                xTo(0);
                yTo(0);
              };

              fig.addEventListener("pointermove", onMove);
              fig.addEventListener("pointerleave", onLeave);
              cleanups.push(() => {
                fig.removeEventListener("pointermove", onMove);
                fig.removeEventListener("pointerleave", onLeave);
              });
            });

          return () => cleanups.forEach((fn) => fn());
        },
      );
    },
    { scope: galleryRef, dependencies: [activeCategory], revertOnUpdate: true },
  );

  // Keep active category word rolled up
  useEffect(() => {
    const filterList = filterListRef.current;
    if (!filterList) return;
    filterList.querySelectorAll<HTMLElement>("[data-cat-btn]").forEach((btn) => {
      const isSelected = btn.getAttribute("data-cat-btn") === activeCategory;
      rollWords(btn, isSelected);
    });
  }, [activeCategory]);

  // Pause inline video if category changes or modal opens
  useEffect(() => {
    if (
      inlineVideoRef.current &&
      ((activeCategory !== "all" && activeCategory !== "video") || activeItem)
    ) {
      inlineVideoRef.current.pause();
      setIsInlinePlaying(false);
    }
  }, [activeCategory, activeItem]);

  // Close lightbox on Escape key
  useEffect(() => {
    if (!activeItem) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveItem(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeItem]);

  const onFilterHover = (key: ShowcaseCategory, on: boolean) =>
    contextSafe(({ pointerType, currentTarget }: PointerEvent) => {
      if (pointerType !== "mouse") return;
      if (key === activeCategory && !on) return;
      rollWords(currentTarget, on);
    });

  const toggleInlineVideo = (e: React.MouseEvent) => {
    e.stopPropagation();
    const video = inlineVideoRef.current;
    if (!video) return;
    if (video.paused) {
      video
        .play()
        .then(() => setIsInlinePlaying(true))
        .catch(() => {});
    } else {
      video.pause();
      setIsInlinePlaying(false);
    }
  };

  return (
    <div ref={rootRef} id="showcase" className="relative w-full bg-[#0a0a0a] text-white">
      {/* Main Archive Container */}
      <div className="w-full overflow-x-clip px-4 pt-20 pb-24 md:px-8 md:pt-[10vh] md:pb-36">
        {/* Section Title — Same Gradient Scrub + Spinning Star ✦ as works.tsx & expertise.tsx */}
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="mb-3 text-xs font-medium tracking-[0.2em] text-white/40 uppercase">
              {lang?.showcase_section?.eyebrow ||
                (locale === "id"
                  ? "Arsip Visual & Produksi"
                  : "Visual & Production Archive")}
            </p>
            <h2 className="flex items-center gap-[0.2em] text-[13vw] leading-none font-bold tracking-tight uppercase md:text-[6vw]">
              <span
                ref={titleRef}
                className="[--fill:100%] md:[--fill:0%] bg-[linear-gradient(90deg,#fff_var(--fill),rgb(255_255_255/0.2)_var(--fill))] bg-clip-text text-transparent"
              >
                {lang?.showcase_section?.title ||
                  (locale === "id" ? "Galeri Karya" : "Creative Archive")}
              </span>
              <svg
                ref={starRef}
                viewBox="0 0 100 100"
                aria-hidden="true"
                className="size-[0.75em] shrink-0 overflow-visible text-sky-400"
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
          </div>

          <p className="max-w-md text-xs leading-relaxed text-neutral-400 md:text-sm">
            {lang?.showcase_section?.subtitle ||
              (locale === "id"
                ? "Eksplorasi karya produksi video, materi kampanye properti, konten kreatif viral, serta bukti autentik performa Meta Ads & Google Tag Manager."
                : "Exploration of video productions, property campaign visuals, viral creative hooks, and verified Meta Ads & Google Tag Manager performance proof.")}
          </p>
        </div>

        {/* Category Filter — Exact expertise.tsx "/" Right-Aligned List + services.tsx Word Roll */}
        <ul
          ref={filterListRef}
          aria-label={
            locale === "id" ? "Filter kategori karya" : "Filter works by category"
          }
          className={`${bebasNeue.className} ml-auto flex flex-wrap justify-end gap-x-[0.7em] overflow-x-clip pt-12 text-right text-[11vw] leading-[0.95] tracking-tight text-white/35 uppercase md:max-w-[85vw] md:pt-16 md:text-[5vw]`}
        >
          {categoryKeys.map((key) => {
            const count =
              key === "all"
                ? showcaseItems.length
                : showcaseItems.filter((i) => i.category === key).length;
            const isActive = activeCategory === key;
            const label =
              lang?.showcase_section?.categories?.[key] ||
              defaultCategories[key][locale];

            return (
              <li key={key} className="my-[-0.1em] overflow-y-clip py-[0.1em]">
                <span className="relative inline-block">
                  <button
                    type="button"
                    data-cat-btn={key}
                    aria-pressed={isActive}
                    onClick={() => setActiveCategory(key)}
                    onPointerEnter={onFilterHover(key, true)}
                    onPointerLeave={onFilterHover(key, false)}
                    className={cn(
                      "cursor-pointer text-right uppercase transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white",
                      isActive ? "text-white" : "text-white/35",
                    )}
                  >
                    {label.split(" ").map((word, wIdx) => (
                      <Fragment key={`${word}-${wIdx}`}>
                        <span className="inline-block [clip-path:inset(-0.05em_-0.08em_0.04em)]">
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
                    <sup
                      className={cn(
                        "ml-1 font-mono text-[0.28em] tracking-normal transition-colors duration-300",
                        isActive ? "text-sky-400" : "text-white/40",
                      )}
                    >
                      {String(count).padStart(2, "0")}
                    </sup>
                  </button>
                  <span
                    aria-hidden="true"
                    className="absolute top-0 left-full w-[0.7em] text-center text-white/25"
                  >
                    /
                  </span>
                </span>
              </li>
            );
          })}
        </ul>

        {/* Asymmetric Staggered Gallery — Exact works.tsx Sky-400 Wipe + Overlapping Typography */}
        <div
          ref={galleryRef}
          className="mt-16 flex flex-col gap-28 md:mt-24 md:grid md:grid-cols-12 md:gap-x-8 md:gap-y-40"
        >
          {filteredItems.map((item, index) => {
            const isWide = item.aspect === "wide";
            const displayIndex = String(index + 1).padStart(2, "0");
            const layoutClass = isWide
              ? index % 2 === 0
                ? "md:col-span-8 md:col-start-1"
                : "md:col-span-8 md:col-start-5"
              : cardLayouts[index % cardLayouts.length];

            return (
              <article
                key={item.id}
                data-gallery-card
                className={cn(
                  "group relative w-[88%] shrink-0 md:w-full",
                  index % 2 === 0 ? "self-start" : "self-end",
                  layoutClass,
                )}
              >
                {/* Top Editorial Metadata Bar */}
                <div className="mb-3 flex items-baseline justify-between text-xs tracking-[0.2em] text-white/40 uppercase">
                  <span>
                    {item.client} — {item.tag[locale]}
                  </span>
                  <span
                    className={`${bebasNeue.className} text-2xl leading-none text-white/30 transition-colors duration-300 group-hover:text-sky-400 md:text-3xl`}
                  >
                    {displayIndex}
                  </span>
                </div>

                {/* Frameless Media Figure with Sky-400 Reveal Panel (works.tsx pattern) */}
                <figure
                  onClick={() => setActiveItem(item)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setActiveItem(item);
                    }
                  }}
                  className={cn(
                    "relative w-full cursor-pointer overflow-hidden bg-neutral-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-white",
                    isWide ? "aspect-16/10" : "aspect-11/15",
                  )}
                >
                  {/* Sky-400 panel wipes up first, then the image wipes over it */}
                  <div
                    data-reveal-panel
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 z-0 bg-sky-400"
                  />

                  <div
                    data-reveal-media
                    className="relative z-10 size-full overflow-hidden bg-neutral-950"
                  >
                    {item.type === "video" ? (
                      <div data-reveal-zoom className="relative size-full">
                        <video
                          ref={inlineVideoRef}
                          src={item.src}
                          poster={item.poster}
                          preload="none"
                          playsInline
                          loop
                          onEnded={() => setIsInlinePlaying(false)}
                          className="size-full object-cover scale-105"
                        />
                        {/* Inline Play/Pause Trigger */}
                        <div className="pointer-events-none absolute top-4 right-4 z-20 flex items-center gap-3">
                          <button
                            type="button"
                            onClick={toggleInlineVideo}
                            className="pointer-events-auto cursor-pointer bg-[#0a0a0a]/80 px-3 py-1.5 text-[11px] font-medium tracking-[0.2em] text-white uppercase backdrop-blur-xs transition-colors hover:bg-sky-400 hover:text-[#0a0a0a]"
                          >
                            {isInlinePlaying
                              ? lang?.showcase_section?.pause_video || "JEDA ❚❚"
                              : lang?.showcase_section?.play_video || "PUTAR ▶"}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div data-reveal-zoom className="relative size-full">
                        <Image
                          src={item.src}
                          alt={`${item.title[locale]} — ${item.client}`}
                          fill
                          loading="lazy"
                          quality={80}
                          sizes={
                            isWide
                              ? "(max-width: 768px) 90vw, 65vw"
                              : "(max-width: 768px) 88vw, 45vw"
                          }
                          className={cn(
                            "scale-105",
                            isWide ? "object-contain p-2 md:p-4" : "object-cover",
                          )}
                        />
                      </div>
                    )}

                    {/* Bottom Shade for Overlapping Title (exact works.tsx treatment) */}
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-linear-to-t from-[#0a0a0a]/85 via-[#0a0a0a]/30 to-transparent"
                    />
                  </div>
                </figure>

                {/* Overlapping Display Title & ArrowButton (exact works.tsx treatment) */}
                <div
                  data-reveal-caption
                  className="relative z-20 -mt-12 text-white md:-mt-16"
                >
                  <h3
                    className={cn(
                      "text-[11vw] leading-[0.95] font-medium tracking-tight md:text-[3.4vw]",
                      index % 2 === 0
                        ? "ml-[6%] md:ml-[-8%]"
                        : "mr-[6%] text-right md:mr-0 md:ml-[-8%] md:text-left",
                    )}
                  >
                    {item.title[locale]}
                  </h3>

                  <button
                    type="button"
                    onClick={() => setActiveItem(item)}
                    className={cn(
                      "mt-4 block cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white md:ml-[-4%] md:mr-0",
                      index % 2 === 0 ? "ml-[6%]" : "ml-auto mr-[6%]",
                    )}
                  >
                    <ArrowButton
                      upRight
                      label={
                        lang?.showcase_section?.see_detail ||
                        (locale === "id" ? "Lihat Karya" : "View Work")
                      }
                      className="w-fit"
                    />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* Original 3D Flying Cards Ring Stage (flies over QuoteView as you scroll down) */}
      <div
        ref={ringTriggerRef}
        data-showcase
        className="h-[220vh] w-full motion-reduce:hidden"
      >
        <div
          ref={stageRef}
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 hidden overflow-hidden data-active:block"
        >
          {spots.map(([y, width], index) => (
            <div
              key={index}
              data-fly
              style={{ "--y": `${y}vh`, width: `${width}vmin` } as CSSProperties}
              className={`absolute top-1/2 left-1/2 will-change-transform [--p:1] [--s:0] transform-[translate(calc(-50%+var(--p)*34vw),calc(-50%+var(--s)*var(--y)))_scale(var(--s))] ${shapes[index % shapes.length]}`}
            >
              <Image
                src={workPictures[index % workPictures.length]}
                alt=""
                fill
                sizes="40vmin"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Full-Screen Editorial Preview Modal */}
      {activeItem && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={activeItem.title[locale]}
          onClick={() => setActiveItem(null)}
          className="fixed inset-0 z-50 flex flex-col justify-between bg-[#0a0a0a]/95 p-4 backdrop-blur-xs md:p-8"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex items-baseline justify-between border-b border-white/15 pb-4"
          >
            <div>
              <p className="text-[11px] tracking-[0.2em] text-white/40 uppercase">
                {activeItem.client} — {activeItem.tag[locale]}
              </p>
              <h3 className="mt-1 text-lg font-medium tracking-tight text-white md:text-2xl">
                {activeItem.title[locale]}
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setActiveItem(null)}
              className="cursor-pointer text-xs font-medium tracking-[0.2em] text-white/60 uppercase transition-colors hover:text-sky-400"
            >
              {lang?.showcase_section?.close_preview || "CLOSE [×]"}
            </button>
          </div>

          <div
            onClick={(e) => e.stopPropagation()}
            className="relative my-auto flex max-h-[78vh] w-full items-center justify-center overflow-hidden py-4"
          >
            {activeItem.type === "video" ? (
              <video
                src={activeItem.src}
                poster={activeItem.poster}
                controls
                autoPlay
                playsInline
                className="max-h-[75vh] w-auto max-w-full object-contain"
              />
            ) : (
              <div className="relative h-[72vh] w-full max-w-5xl">
                <Image
                  src={activeItem.src}
                  alt={activeItem.title[locale]}
                  fill
                  quality={90}
                  sizes="90vw"
                  className="object-contain"
                />
              </div>
            )}
          </div>

          <div
            onClick={(e) => e.stopPropagation()}
            className="flex items-center justify-between border-t border-white/15 pt-4 text-xs tracking-[0.15em] text-white/40 uppercase"
          >
            <span>M. Firdaus Alfarizi — Archive</span>
            <a
              href={activeItem.src}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/60 transition-colors hover:text-sky-400"
            >
              {locale === "id" ? "Buka Resolusi Penuh ↗" : "Open Original ↗"}
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
