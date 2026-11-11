"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  showcaseItems,
  type ShowcaseCategory,
  type ShowcaseItem,
} from "@/data/showcase";
import { sparklePath } from "@/components/svg/sparkle";

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

export default function ShowcaseView({ lang }: ShowcaseViewProps) {
  const locale = lang?.lang === "id" ? "id" : "en";
  const [activeCategory, setActiveCategory] =
    useState<ShowcaseCategory>("all");
  const [activeItem, setActiveItem] = useState<ShowcaseItem | null>(null);
  const [isInlinePlaying, setIsInlinePlaying] = useState(false);
  const inlineVideoRef = useRef<HTMLVideoElement>(null);

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

  // Pause inline video if category changes or modal opens
  useEffect(() => {
    if (inlineVideoRef.current && (activeCategory !== "all" && activeCategory !== "video" || activeItem)) {
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

  const toggleInlineVideo = (e: React.MouseEvent) => {
    e.stopPropagation();
    const video = inlineVideoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().then(() => setIsInlinePlaying(true)).catch(() => {});
    } else {
      video.pause();
      setIsInlinePlaying(false);
    }
  };

  return (
    <div
      id="showcase"
      className="w-full bg-[#0a0a0a] px-4 pt-16 pb-24 text-white md:px-8 md:pt-28 md:pb-36"
    >
      {/* Editorial Section Header — matches Expertise & Works */}
      <div className="flex flex-col justify-between gap-6 border-b border-white/15 pb-8 md:flex-row md:items-end">
        <div>
          <p className="mb-3 text-xs font-medium tracking-[0.2em] text-white/40 uppercase">
            {lang?.showcase_section?.eyebrow ||
              (locale === "id"
                ? "Arsip Visual & Produksi"
                : "Visual & Production Archive")}
          </p>
          <h2 className="flex items-center gap-[0.2em] text-[13vw] leading-none tracking-tight md:text-[6vw]">
            {lang?.showcase_section?.title ||
              (locale === "id" ? "Galeri Karya" : "Creative Archive")}
            <svg
              viewBox="0 0 100 100"
              aria-hidden="true"
              className="size-[0.75em] shrink-0 overflow-visible text-sky-400"
            >
              <path
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
              ? "Kumpulan produksi video walkthrough, poster kampanye properti, konten edukasi viral, hingga bukti performa Meta Ads & Google Tag Manager."
              : "Curated collection of walkthrough video productions, property campaign visuals, viral educational hooks, and verified Meta Ads & GTM data.")}
        </p>
      </div>

      {/* Thematic Filter Bar — Pure Editorial "/" Typography (Zero Pill Boxes) */}
      <nav
        aria-label={locale === "id" ? "Filter kategori karya" : "Filter works by category"}
        className="mt-8 mb-12 flex flex-wrap items-baseline gap-x-3 gap-y-2 border-b border-white/10 pb-6 text-lg tracking-tight md:mb-16 md:gap-x-5 md:text-2xl"
      >
        {categoryKeys.map((key, idx) => {
          const count =
            key === "all"
              ? showcaseItems.length
              : showcaseItems.filter((i) => i.category === key).length;
          const isActive = activeCategory === key;
          const label =
            lang?.showcase_section?.categories?.[key] ||
            defaultCategories[key][locale];

          return (
            <span key={key} className="inline-flex items-baseline gap-3 md:gap-5">
              <button
                type="button"
                onClick={() => setActiveCategory(key)}
                aria-pressed={isActive}
                className={`cursor-pointer transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                  isActive
                    ? "font-medium text-white underline decoration-1 underline-offset-8"
                    : "text-white/40 hover:text-white"
                }`}
              >
                <span>{label}</span>
                <sup className="ml-1 font-mono text-[11px] text-white/40">
                  {String(count).padStart(2, "0")}
                </sup>
              </button>
              {idx < categoryKeys.length - 1 && (
                <span aria-hidden="true" className="select-none text-white/25">
                  /
                </span>
              )}
            </span>
          );
        })}
      </nav>

      {/* Lightweight Editorial Preview Grid */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 md:gap-x-8 md:gap-y-16 lg:grid-cols-4">
        {filteredItems.map((item, index) => {
          const isWide = item.aspect === "wide";
          const displayIndex = String(index + 1).padStart(2, "0");

          return (
            <article
              key={item.id}
              className={`group flex flex-col ${
                isWide ? "col-span-2" : "col-span-1"
              }`}
            >
              {/* Top Metadata Line — Matches works.tsx */}
              <div className="mb-2 flex items-baseline justify-between text-[11px] tracking-[0.2em] text-white/40 uppercase">
                <span className="truncate pr-2">{item.tag[locale]}</span>
                <span className="font-mono text-[10px]">{displayIndex}</span>
              </div>

              {/* Frameless Media Canvas */}
              {item.type === "video" ? (
                <div
                  onClick={() => setActiveItem(item)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setActiveItem(item);
                    }
                  }}
                  className="relative aspect-3/4 w-full cursor-pointer overflow-hidden bg-neutral-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  <video
                    ref={inlineVideoRef}
                    src={item.src}
                    poster={item.poster}
                    preload="none"
                    playsInline
                    loop
                    onEnded={() => setIsInlinePlaying(false)}
                    className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />

                  {/* Minimalist Editorial Video Controls */}
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-black/80 via-black/20 to-transparent p-4">
                    <button
                      type="button"
                      onClick={toggleInlineVideo}
                      className="pointer-events-auto cursor-pointer border-b border-white pb-0.5 text-xs font-medium tracking-[0.2em] text-white uppercase transition-opacity hover:opacity-80"
                    >
                      {isInlinePlaying
                        ? lang?.showcase_section?.pause_video || "PAUSE ❚❚"
                        : lang?.showcase_section?.play_video || "PLAY VIDEO ▶"}
                    </button>
                    <span className="font-mono text-[11px] text-white/70">
                      00:41
                    </span>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setActiveItem(item)}
                  className={`relative w-full cursor-pointer overflow-hidden bg-neutral-900 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                    isWide ? "aspect-16/9" : "aspect-3/4"
                  }`}
                >
                  <Image
                    src={item.src}
                    alt={`${item.title[locale]} — ${item.client}`}
                    fill
                    loading="lazy"
                    quality={75}
                    sizes={
                      isWide
                        ? "(max-width: 768px) 100vw, 50vw"
                        : "(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                    }
                    className={`transition-transform duration-700 ease-out group-hover:scale-105 ${
                      isWide ? "object-contain bg-neutral-950 p-2" : "object-cover"
                    }`}
                  />
                </button>
              )}

              {/* Bottom Editorial Caption — Matches expertise.tsx & works.tsx */}
              <div className="mt-3 flex items-baseline justify-between gap-2 border-t border-white/15 pt-2.5">
                <div className="min-w-0">
                  <h3 className="truncate text-sm font-medium tracking-tight text-white md:text-base">
                    {item.title[locale]}
                  </h3>
                  <p className="mt-0.5 truncate text-xs text-white/40">
                    {item.client}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveItem(item)}
                  aria-label={`Preview ${item.title[locale]}`}
                  className="shrink-0 cursor-pointer text-xs text-white/40 transition-colors group-hover:text-white"
                >
                  ↗
                </button>
              </div>
            </article>
          );
        })}
      </div>

      {/* Full-Screen Editorial Preview Modal (Frameless & Lightweight) */}
      {activeItem && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={activeItem.title[locale]}
          onClick={() => setActiveItem(null)}
          className="fixed inset-0 z-50 flex flex-col justify-between bg-[#0a0a0a]/95 p-4 backdrop-blur-xs md:p-8"
        >
          {/* Top Bar */}
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
              className="cursor-pointer text-xs font-medium tracking-[0.2em] text-white/60 uppercase transition-colors hover:text-white"
            >
              {lang?.showcase_section?.close_preview || "CLOSE [×]"}
            </button>
          </div>

          {/* Center Media Stage */}
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

          {/* Bottom Bar */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex items-center justify-between border-t border-white/15 pt-4 text-xs tracking-[0.15em] text-white/40 uppercase"
          >
            <span>M. Firdaus Alfarizi — Archive</span>
            <a
              href={activeItem.src}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/60 transition-colors hover:text-white"
            >
              {locale === "id" ? "Buka Resolusi Penuh ↗" : "Open Original ↗"}
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
