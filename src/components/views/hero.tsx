/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { DockText } from "@/components/typography/dock-text";
import { bebasNeue, layGrotesk } from "@/common/font";
import { ArrowButton } from "@/components/ui/arrow-button";
import { socialPaths } from "@/components/svg/social-icons";
import { useRef } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { cn, inOwnTask } from "@/lib/utils";
import { socials } from "@/data/socials";
import { sparklePath } from "@/components/svg/sparkle";
import NavigationBar from "@/components/partials/navbar";
import HeroBackground from "@/components/ui/hero-background";
import gsap from "gsap";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const buttonLink =
  "group active:scale-90 transition-transform duration-300 ease-in-out";

// Mobile size makes the wider line, "CREATIVE ✦" (~3.44em), fill the padded width
const displayText = `${bebasNeue.className} block text-end text-[calc((100vw-2rem)/3.45)] md:text-[clamp(4rem,18vw,16rem)] tracking-[-0.025em] font-medium text-white leading-[0.85] md:leading-[0.8] uppercase will-change-transform`;

function ResumeButton({ lang }: { lang: any }) {
  const label = lang.home_section.button_text;

  return (
    <a
      href={
        lang.lang === "en"
          ? process.env.NEXT_PUBLIC_CV_EN
          : process.env.NEXT_PUBLIC_CV_ID
      }
      target="_blank"
      rel="noopener"
      aria-label={`${label} - M. Firdaus Alfarizi (PDF)`}
      className={buttonLink}
    >
      <ArrowButton label={label} upRight reversed />
    </a>
  );
}

function SocialLinks({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      {socials.map(({ name, handle, href }) => (
        <a
          key={href}
          href={href}
          target="_blank"
          rel="noopener noreferrer me"
          aria-label={`${name}: ${handle} (opens in a new tab)`}
          className={buttonLink}
        >
          <ArrowButton label={name} icon={socialPaths[name]} upRight />
        </a>
      ))}
    </div>
  );
}

export default function HeroView({ lang }: { lang: any }) {
  const heroRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  // Our own pin spacers: ScrollTrigger then pins in place instead of moving
  // the layer into a new <div>, which the browser would count as a fresh
  // paint, pushing the Largest Contentful Paint back to after the JS
  const bgSpacerRef = useRef<HTMLDivElement>(null);
  const footerSpacerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const shaderRef = useRef<HTMLDivElement>(null);
  const leftAreaRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const creativeRef = useRef<HTMLSpanElement>(null);
  const developerRef = useRef<HTMLSpanElement>(null);
  const starRef = useRef<SVGSVGElement>(null);

  useGSAP(
    // In a task of its own, after hydration: the hero's start state is
    // plain CSS, and the curtain covers it for the first half second
    (_, contextSafe) =>
      inOwnTask(
        contextSafe!(() => {
          const bg = bgRef.current;
          const leftArea = leftAreaRef.current;
          const wrapper = wrapperRef.current;
          const creative = creativeRef.current;
          const developer = developerRef.current;
          const star = starRef.current;
          if (!bg || !leftArea || !wrapper || !creative || !developer || !star)
            return;

          // 1. Background & text layer stays pinned for 250% while the footer
          // and the next section slide over it (pinSpacing: false keeps it out of the flow).
          ScrollTrigger.create({
            trigger: bg,
            start: "top top",
            end: "+=250%",
            pin: true,
            pinSpacing: false,
            pinSpacer: bgSpacerRef.current,
          });

          // 2. Footer layer is pinned for 150% and scrubs the hero timeline.
          // When its pin ends the title is centered and the footer scrolls away.
          // refreshPriority: matchMedia rebuilds this trigger after later sections
          // exist (e.g. on phone rotation); its pin spacing must still be measured first.
          const heroTimeline = () =>
            gsap.timeline({
              defaults: { duration: 1, ease: "power2.inOut", force3D: true },
              scrollTrigger: {
                trigger: footerRef.current,
                start: "top top",
                end: "+=150%",
                pin: true,
                pinSpacer: footerSpacerRef.current,
                scrub: 1,
                invalidateOnRefresh: true,
                refreshPriority: 1,
              },
            });

          const media = gsap.matchMedia();

          // Desktop: "CREATIVE ✦ MARKETER" merges into one line, centered in the
          // hero and scaled to fit its width. offset* values ignore transforms and
          // scroll, so a refresh mid-animation still measures the start layout.
          media.add("(min-width: 768px)", () => {
            const layout = () => {
              // Same 0.05em as between "CREATIVE" and the star
              const gap =
                parseFloat(getComputedStyle(creative).fontSize) * 0.05;
              const mergedW =
                creative.offsetWidth + gap + developer.offsetWidth;
              const wrapperW = wrapper.offsetWidth;

              return {
                x: bg.clientWidth / 2 - (wrapper.offsetLeft + wrapperW / 2),
                y:
                  bg.clientHeight / 2 -
                  (wrapper.offsetTop + wrapper.offsetHeight / 2),
                scale: Math.min(1.2, (bg.clientWidth - 64) / mergedW),
                creativeX: creative.offsetWidth - mergedW / 2 - wrapperW / 2,
                developerX: mergedW / 2 - wrapperW / 2,
              };
            };

            heroTimeline()
              .to(leftArea, { xPercent: -30, opacity: 0 }, 0)
              .to(
                wrapper,
                {
                  x: () => layout().x,
                  y: () => layout().y,
                  scale: () => layout().scale,
                },
                0,
              )
              .to(creative, { x: () => layout().creativeX, yPercent: 50 }, 0)
              .to(developer, { x: () => layout().developerX, yPercent: -50 }, 0)
              .to(star, { rotation: 180, transformOrigin: "50% 50%" }, 0);
          });

          // Mobile: the title starts hidden below the hero and rises with the
          // scroll to the center, keeping its two staggered lines. CSS anchors it
          // at left/top 50%; xPercent/yPercent center it on that point. x: 0
          // drops any px translate GSAP parses from a leftover transform when
          // this re-runs (StrictMode, breakpoint change), which doubled the shift.
          media.add("(max-width: 767.98px)", () => {
            gsap.set(wrapper, { x: 0, xPercent: -50, yPercent: -50 });

            heroTimeline()
              .to(leftArea, { xPercent: -30, opacity: 0 }, 0)
              .fromTo(
                wrapper,
                {
                  y: () => (bg.clientHeight + wrapper.offsetHeight) / 2,
                  autoAlpha: 0,
                },
                { y: 0, autoAlpha: 1 },
                0,
              )
              .to(star, { rotation: 180, transformOrigin: "50% 50%" }, 0);
          });

          // 3. While the next section slides over, the hero backs away and
          // dims. This moves a child, as a pinned layer must not be animated,
          // and runs after the footer pin has set the hero's full height. It
          // ends halfway up: the centered title is covered by then.
          media.add("(prefers-reduced-motion: no-preference)", () => {
            gsap
              .timeline({
                defaults: { ease: "none" },
                scrollTrigger: {
                  trigger: heroRef.current,
                  start: "bottom bottom",
                  end: "bottom center",
                  scrub: true,
                },
              })
              // autoAlpha: once faded out, its buttons must not take clicks
              .to(sceneRef.current, { scale: 0.8, autoAlpha: 0 }, 0)
              .to(shaderRef.current, { opacity: 0.7 }, 0);
          });
        }),
      ),
    { scope: heroRef },
  );

  return (
    <div id="home" ref={heroRef} className="relative w-screen">
      <h1 className="sr-only">
        {`M. Firdaus Alfarizi (Alfi), ${lang.home_section.role}. ${lang.home_section.location}, Indonesia.`}
      </h1>

      {/* 1. Background & text layer (pinned for 250%, see useGSAP above) */}
      <div ref={bgSpacerRef}>
        <div
          ref={bgRef}
          className="absolute top-0 w-full h-svh md:h-screen overflow-hidden z-0"
        >
          {/* Outside the scene: it only dims, while the content backs away.
              The wrapper keeps that tween off the opacity set on the shader */}
          <div
            ref={shaderRef}
            data-testid="hero-shader"
            className="absolute inset-0"
          >
            <HeroBackground className="absolute top-0 left-0 w-screen h-[88svh] md:h-[85vh] opacity-80 md:opacity-65 pointer-events-none" />
          </div>

          <div
            ref={sceneRef}
            data-testid="hero-scene"
            className="relative size-full flex flex-col"
          >
            <NavigationBar lang={lang.lang} />

            {/* Mobile: name block is vertically centered in the visible background (88svh) */}
            <div className="flex-1 flex flex-col justify-center md:justify-start w-screen px-4 md:px-8 pb-[12svh] md:pb-0 md:pt-[12vh] z-10">
              {/* Name + CTA */}
              <div
                ref={leftAreaRef}
                className="w-full text-[calc((100vw-2rem)/5.3)] md:text-[clamp(4rem,5.5vw,14rem)] tracking-[-0.06em] font-medium leading-[0.85] uppercase text-neutral-300"
              >
                <div className="flex flex-col md:flex-row md:items-center md:gap-6">
                  <DockText text="M. Firdaus" />
                </div>
                <div className="md:flex md:items-end md:gap-2 md:mt-2">
                  <DockText text="Alfarizi" down />
                  <div
                    className={`${layGrotesk.className} mt-6 md:mt-0 md:ml-4 md:translate-y-[-0.6vw] flex flex-wrap items-center gap-3 text-base leading-normal tracking-normal`}
                  >
                    <ResumeButton lang={lang} />
                    {/* contents: they wrap with the button above, not as a block */}
                    <SocialLinks className="contents md:hidden" />
                  </div>
                </div>
              </div>

              {/* CREATIVE ✦ MARKETER */}
              <div
                ref={wrapperRef}
                data-testid="hero-title"
                className="absolute max-md:left-1/2 max-md:top-1/2 max-md:w-max max-md:invisible md:bottom-[16vh] md:right-8 flex flex-col items-end will-change-transform"
              >
                <span ref={creativeRef} className={displayText}>
                  <span className="flex flex-row items-center gap-[0.05em] justify-end">
                    <DockText text="CREATIVE" />
                    {/* The site sparkle, its points level with the capitals:
                        Bebas caps are 0.71em tall (the star's ink is 96% of
                        its box) and sit 0.055em above the line box's center */}
                    <svg
                      ref={starRef}
                      viewBox="0 0 100 100"
                      aria-hidden="true"
                      className="size-[0.74em] shrink-0 translate-y-[-0.055em] text-sky-400"
                    >
                      <path d={sparklePath} fill="currentColor" />
                    </svg>
                  </span>
                </span>
                <span ref={developerRef} className={displayText}>
                  <DockText text="MARKETER" down />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Footer layer (pinned for 150%, drives the scroll height). The
          spacer takes no clicks: it covers the hero while pinned */}
      <div ref={footerSpacerRef} className="pointer-events-none">
        <div
          ref={footerRef}
          className="relative w-full h-svh md:h-screen flex flex-col justify-end pointer-events-none z-10"
        >
          <div className="bg-[#0a0a0a] w-full px-4 md:px-8 pt-8 pb-6 md:pb-[4vh] flex justify-between items-end gap-4 pointer-events-auto relative">
            {/* Subpixel gap fix: overhang to cover GSAP pin-spacer rounding errors */}
            <div className="absolute -bottom-0.5 left-0 w-full h-1 bg-[#0a0a0a]" />
            <p className="text-neutral-500 text-2xl md:text-4xl md:tracking-tight">
              {lang.home_section.location}, Indonesia
            </p>
            <SocialLinks className="hidden md:flex" />
          </div>
        </div>
      </div>
    </div>
  );
}
