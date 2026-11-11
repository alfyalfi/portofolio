"use client";

import { locales, type AppLocale } from "@/common/i18n";
import Image from "next/image";

export default function NavigationBar({ lang }: { lang: AppLocale }) {
  const isId = lang === "id";

  return (
    <nav
      id="navigation-bar"
      className="w-full px-4 md:px-8 absolute top-4 z-50 transition-all duration-300 ease-in-out bg-transparent"
    >
      <div className="w-full h-16 flex items-center justify-between">
        <a
          href="#home"
          className="group flex items-center gap-3 py-1 px-2 rounded-xl transition-all duration-300 hover:bg-white/5 active:scale-95"
          aria-label="M. Firdaus Alfarizi"
        >
          <div className="relative size-10 md:size-11 overflow-hidden rounded-xl shadow-[0_0_20px_rgba(56,189,248,0.35)] transition-transform duration-300 group-hover:scale-105">
            <Image
              src="/assets/images/brand-f.png"
              alt="M. Firdaus Alfarizi"
              fill
              sizes="44px"
              className="object-cover"
              priority
            />
          </div>
          <div className="hidden sm:flex flex-col">
            <span className="text-sm md:text-base font-bold tracking-tight text-white group-hover:text-sky-400 transition-colors uppercase leading-none">
              Alfarizi
            </span>
            <span className="text-[10px] md:text-xs text-neutral-400 tracking-wider uppercase font-medium mt-1">
              Creative & Marketer
            </span>
          </div>
        </a>

        <div className="flex items-center justify-center text-center gap-3 md:gap-5">
          <a
            href="/"
            className="border-b border-white/30 pb-0.5 text-[11px] md:text-xs font-medium tracking-[0.18em] text-white/75 uppercase transition-colors hover:border-sky-400 hover:text-white"
          >
            {isId ? "← Alfaristudio Creative" : "← Alfaristudio Home"}
          </a>

          {/* Every language shares one URL, so these switch the language in
              place (intro-animation.tsx closes the curtain, then reloads) */}
          {locales.map((locale) => (
            <button
              key={locale}
              type="button"
              lang={locale}
              aria-pressed={locale === lang}
              onClick={() => {
                if (locale === lang) return;
                window.dispatchEvent(
                  new CustomEvent("page-transition", { detail: { locale } }),
                );
              }}
              className="cursor-pointer opacity-100 md:opacity-60 hover:opacity-100 duration-500 ease-out w-14 h-14 bg-transparent text-xl tracking-tight text-neutral-200 px-3 py-2 border border-neutral-700 hover:border-sky-400 group flex items-center justify-center gap-2 relative overflow-hidden rounded-lg transition-colors"
            >
              <span className="relative block h-6 overflow-hidden">
                <span className="block transition-transform duration-500 ease-out group-hover:-translate-y-7">
                  <span className="block -translate-y-0.5">
                    {locale.toUpperCase()}
                  </span>
                  <span aria-hidden="true" className="block -translate-y-0.5 text-sky-400">
                    {locale.toUpperCase()}
                  </span>
                </span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
