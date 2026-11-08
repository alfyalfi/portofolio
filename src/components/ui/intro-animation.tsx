"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import {
  localeCookie,
  localeCookieMaxAge,
  type AppLocale,
} from "@/common/i18n";
import { useLenis } from "lenis/react";
import gsap from "gsap";

type LocaleSwitchEvent = CustomEvent<{ locale: AppLocale }>;

// Marks the reload after a language switch, which skips the greetings
const quickCookie = "curtain-quick";
// Reads it once, inline: the JS bundle comes after the first paint, too late
// to stop the first greeting from flashing
const quickOpen = `if(document.cookie.includes("${quickCookie}=")){document.cookie="${quickCookie}=;path=/;max-age=0";document.currentScript.parentElement.dataset.quick=""}`;

/** Every language shares one URL: remember the choice, then reload. */
function switchLocale(locale: AppLocale) {
  document.cookie = `${localeCookie}=${locale}; path=/; max-age=${localeCookieMaxAge}; samesite=lax`;
  document.cookie = `${quickCookie}=1; path=/; max-age=60; samesite=lax`;
  window.location.reload();
}

const words = [
  "Hello",
  "Bonjour",
  "Ciao",
  "Olá",
  "Hola",
  "Guten tag",
  "Hej",
  "नमस्ते",
  "やあ",
  "Здравствуйте",
  "안녕하세요",
  "Hallå",
  "Hallo",
];
// Word i shows from wordTimes[i] to wordTimes[i + 1], in ms: Hello holds, the
// others flick by, and the last stays until the words have faded out. Every
// time follows from words, so each one added lengthens the intro by a flick
const flick = 150;
const wordTimes = [
  0,
  ...words.slice(1).map((_, i) => 1000 + i * flick),
  1000 + (words.length - 2) * flick + 1100,
];
// The curtain opens only once the words are gone
const openDelay = wordTimes[words.length];

const halves = {
  top: { position: "top-0", open: "animate-curtain-up", yPercent: -100 },
  bottom: { position: "bottom-0", open: "animate-curtain-down", yPercent: 100 },
} as const;
const columns = ["left-0", "left-1/4", "left-2/4", "left-3/4"];

/**
 * Intro curtain: greetings flick by and fade out, then it splits at the
 * middle, the top half sliding up and the bottom half down. Desktop has four
 * columns that go right to left; mobile has one full-width pair. CSS runs it
 * from the first paint, so a slow phone never waits on the JS behind a white
 * screen. Before a language switch, GSAP closes it again, and the reload opens
 * it after a short hold, without the greetings.
 */
export default function IntroAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const greetingsRef = useRef<HTMLDivElement>(null);
  const [isActive, setIsActive] = useState(true);
  const lenis = useLenis();

  // Lenis scrolls programmatically, so body overflow alone can't lock it
  useEffect(() => {
    if (isActive) lenis?.stop();
    else lenis?.start();
  }, [lenis, isActive]);

  useEffect(() => {
    const container = containerRef.current!;
    window.scrollTo(0, 0);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const raf = requestAnimationFrame(() => setIsActive(false));
      // No curtain to close: switch the language straight away
      const switchNow = (e: Event) =>
        switchLocale((e as LocaleSwitchEvent).detail.locale);
      window.addEventListener("page-transition", switchNow);

      return () => {
        cancelAnimationFrame(raf);
        window.removeEventListener("page-transition", switchNow);
      };
    }

    // Done once the CSS has opened the curtain (maybe before this ran)
    document.body.style.overflow = "hidden";
    let disposed = false;
    Promise.all(
      container.getAnimations({ subtree: true }).map((a) => a.finished),
    )
      .then(() => {
        if (disposed) return;
        document.body.style.overflow = "";
        setIsActive(false);
      })
      .catch(() => {}); // cancelled by a language switch

    const ctx = gsap.context(() => {}, container);
    const blocks = (half: keyof typeof halves) =>
      gsap.utils.toArray<HTMLElement>(`[data-half=${half}]`, container);

    // Close the curtain, then switch the language behind it
    const handlePageTransition = (e: Event) => {
      const { locale } = (e as LocaleSwitchEvent).detail;

      // Hand the curtain from CSS to GSAP while it is still open: showing it
      // again would otherwise restart the CSS animations
      gsap.set(greetingsRef.current, { opacity: 0, animation: "none" });
      for (const half of ["top", "bottom"] as const) {
        gsap.set(blocks(half), {
          yPercent: halves[half].yPercent,
          animation: "none",
        });
      }
      setIsActive(true);
      document.body.style.overflow = "hidden";

      // Wait for React to remove the 'hidden' class, then close the shown blocks
      setTimeout(() => {
        ctx.add(() => {
          const tween = {
            yPercent: 0,
            duration: 0.8,
            ease: "power4.inOut",
            stagger: { from: "start", each: 0.1 },
          } as const;
          const shown = (half: keyof typeof halves) =>
            blocks(half).filter((block) => block.offsetParent);
          gsap
            .timeline({ onComplete: () => switchLocale(locale) })
            .to(shown("top"), tween, 0)
            .to(shown("bottom"), tween, 0);
        });
      }, 10);
    };

    window.addEventListener("page-transition", handlePageTransition);

    return () => {
      disposed = true;
      document.body.style.overflow = "";
      window.removeEventListener("page-transition", handlePageTransition);
      ctx.revert();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      data-testid="intro-curtain"
      className={`fixed inset-0 z-9999 data-quick:[--open-delay:500ms] motion-reduce:hidden ${isActive ? "" : "hidden"}`}
      aria-hidden="true"
      suppressHydrationWarning // quickOpen may add data-quick before hydration
    >
      <script dangerouslySetInnerHTML={{ __html: quickOpen }} />

      {(Object.keys(halves) as (keyof typeof halves)[]).map((half) => {
        const { position, open } = halves[half];
        return (
          <Fragment key={half}>
            <div
              data-half={half}
              style={{ animationDelay: `var(--open-delay, ${openDelay}ms)` }}
              className={`absolute ${position} ${open} left-0 h-[50.5%] w-full bg-primary md:hidden`}
            />
            {columns.map((left, i) => (
              <div
                key={left}
                data-half={half}
                // Right to left: the last column opens first
                style={{
                  animationDelay: `calc(var(--open-delay, ${openDelay}ms) + ${(columns.length - 1 - i) * 100}ms)`,
                }}
                className={`absolute ${position} ${open} ${left} hidden h-[50.5%] w-1/4 bg-primary md:block`}
              />
            ))}
          </Fragment>
        );
      })}

      <div
        ref={greetingsRef}
        style={{ animationDuration: `${openDelay}ms` }}
        className="absolute inset-0 grid animate-curtain-words place-items-center text-[40px] leading-none text-[#0a0a0a] in-data-quick:hidden md:text-[56px]"
      >
        {/* CSS draws each word from data-greeting, so none of them end up in
            the page text that search engines read */}
        {words.map((word, i) => (
          <span
            key={word}
            data-greeting={word}
            style={{
              animationDelay: `${wordTimes[i]}ms`,
              animationDuration: `${wordTimes[i + 1] - wordTimes[i]}ms`,
            }}
            className="invisible col-start-1 row-start-1 animate-curtain-word after:content-[attr(data-greeting)]"
          />
        ))}
      </div>
    </div>
  );
}
