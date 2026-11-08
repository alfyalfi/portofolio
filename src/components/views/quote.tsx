"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { sparklePath } from "@/components/svg/sparkle";
import { CtaText } from "@/components/views/cta";
import gsap from "gsap";
import { inOwnTask } from "@/lib/utils";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

type QuoteViewProps = {
  lang: {
    quote_section: { quote: string };
    cta_section: { first: string[]; second: string[] };
  };
};

/** Scroll distance (px) of the text slide, the star growing, the CTA swap. */
const SLIDE = 5000;
const GROW = 1500;
const SWAP = 1500;

export default function QuoteView({ lang }: QuoteViewProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

  useGSAP(
    // Below the fold: set up after hydration, in a task of its own
    (_, contextSafe) =>
      inOwnTask(
        contextSafe!(() => {
          const root = rootRef.current;
          const text = textRef.current;
          if (!root || !text) return;

          const media = gsap.matchMedia();

          // The section pins while the one-line text slides in from the right;
          // each character starts scattered (random height and tilt) and drops
          // into the line as it crosses the screen (containerAnimation).
          media.add("(prefers-reduced-motion: no-preference)", () => {
            // inline-block: transforms don't apply to inline spans. The SVG star
            // is left out of the split and scattered like a character below.
            const { chars } = SplitText.create(text, {
              type: "chars, words",
              tag: "span",
              wordsClass: "inline-block",
              charsClass: "inline-block",
              ignore: "[data-star]",
              // The <p> is aria-hidden; screen readers get the sr-only copy
              aria: "none",
            });
            const star = text.querySelector<HTMLElement>("[data-star]")!;
            // The path, not the <svg>: GSAP gives an HTML-level <svg> a 3D
            // transform, which puts it on its own GPU layer, and the browser then
            // stretches its small bitmap (blurry). An SVG child is always redrawn.
            const starShape = star.querySelector("path")!;

            // One pin covers both phases; each phase scrubs its own range
            const pin = ScrollTrigger.create({
              trigger: root,
              pin: true,
              start: "top top",
              end: `+=${SLIDE + GROW + SWAP}`,
            });

            // Phase 1: the slide stops with the closing star in the middle of the
            // screen. offsetLeft ignores transforms, so a refresh mid-scroll works.
            const starCenter = () => star.offsetLeft + star.offsetWidth / 2;

            const scrollTween = gsap.to(text, {
              x: () => window.innerWidth / 2 - starCenter(),
              ease: "none",
              scrollTrigger: {
                trigger: root,
                start: "top top",
                end: `+=${SLIDE}`,
                scrub: true,
                invalidateOnRefresh: true,
              },
            });

            // Phase 2: the star grows, turning a little, until the screen is all
            // lime, the backdrop for the CTA.
            // The star's waist is ~0.18 of its size from the centre, so that
            // circle must reach the section's corners: diagonal / (0.36 × size),
            // with a little margin. The section, not the window: it is lvh tall,
            // taller than the window while a phone shows its address bar.
            gsap.to(starShape, {
              scale: () =>
                Math.hypot(root.offsetWidth, root.offsetHeight) /
                (star.offsetWidth * 0.34),
              rotation: 45,
              transformOrigin: "50% 50%",
              ease: "power2.in",
              scrollTrigger: {
                trigger: root,
                start: () => pin.start + SLIDE,
                end: () => pin.start + SLIDE + GROW,
                scrub: true,
                invalidateOnRefresh: true,
              },
            });

            // Phase 3, the CTA: the moment the screen is all lime, the first
            // text rises in on its own clock (the expertise list's reveal), with
            // no scrolling needed. Scrolling on rolls each row over to the second
            // text; a row's old and new line move up together, like one strip.
            const [first, second] = [...root.querySelectorAll("[data-cta-text]")];
            const lines = first.querySelectorAll("[data-cta-line]");
            // Each line rises with a slight tilt that settles, so the big type
            // does not move like stiff blocks. 120%, not 100%: a tilted line's
            // high corner would otherwise peek over the bottom of its mask.
            const hidden = {
              yPercent: 120,
              rotation: 3,
              transformOrigin: "50% 100%",
            };
            const reveal = gsap.from(lines, {
              ...hidden,
              duration: 1,
              ease: "power4.out",
              stagger: 0.1,
              paused: true,
            });
            const ctaStart = () => pin.start + SLIDE + GROW;

            // Scrolling back into the grow drops the text out fast. Reversing
            // the reveal would hold it in place for half a second (power4.out is
            // flat at the end) over a star that is already shrinking.
            let hide: gsap.core.Tween | undefined;
            ScrollTrigger.create({
              trigger: root,
              start: ctaStart,
              end: () => pin.end,
              onEnter: () => {
                hide?.kill();
                reveal.restart();
              },
              onLeaveBack: () => {
                reveal.pause();
                hide = gsap.to(lines, {
                  ...hidden,
                  duration: 0.25,
                  ease: "power2.in",
                });
              },
            });

            const roll = { duration: 0.5, stagger: 0.12, ease: "power2.inOut" };
            gsap
              .timeline({
                scrollTrigger: {
                  trigger: root,
                  start: ctaStart,
                  end: () => pin.end,
                  scrub: true,
                },
              })
              .to(
                first.querySelectorAll("[data-cta-roll]"),
                { yPercent: -100, ...roll },
                0.3,
              )
              .from(
                second.querySelectorAll("[data-cta-roll]"),
                { yPercent: 100, ...roll },
                0.3,
              )
              // Hold the second text for a moment before the pin lets go
              .to({}, { duration: 0.3 });

            [...chars, star].forEach((char) => {
              gsap.from(char, {
                yPercent: "random(-200, 200)",
                rotation: "random(-20, 20)",
                ease: "back.out(1.2)",
                scrollTrigger: {
                  trigger: char,
                  containerAnimation: scrollTween,
                  start: "left 100%",
                  // Land by the middle of the screen, where the ✦ comes to rest
                  end: "left 50%",
                  scrub: 1,
                },
              });
            });
          });
        }),
      ),
    { scope: rootRef },
  );

  return (
    // With motion the text is one long line that starts just off screen
    // (pl, 0.5em past 100vw: a scattered, tilted first letter would otherwise
    // poke in while the section above is still on screen); with reduced
    // motion it simply wraps and stays put.
    // min-h-lvh, not svh: the pinned box must fill the screen even when a
    // phone hides its address bar (the screen grows ~56px), or the grown star
    // would leave a dark strip at the bottom.
    <div
      ref={rootRef}
      className="relative flex min-h-lvh w-full items-center overflow-hidden motion-reduce:flex-col motion-reduce:gap-32 motion-reduce:pt-32"
    >
      {/* The visible line is split into letters for the animation */}
      <p className="sr-only">{lang.quote_section.quote}</p>
      <p
        ref={textRef}
        data-quote
        aria-hidden="true"
        // Padding is split by motion-reduce/motion-safe so a breakpoint
        // padding (md:px-8) can't override the off-screen start
        className="text-[26vw] leading-[1.1] tracking-tight md:text-[clamp(3rem,13vw,15rem)] motion-reduce:px-4 md:motion-reduce:px-8 motion-safe:flex motion-safe:w-max motion-safe:gap-[0.4em] motion-safe:whitespace-nowrap motion-safe:pl-[calc(100vw+0.5em)]"
      >
        {lang.quote_section.quote}{" "}
        {/* An SVG rather than the "✦" character: the font has no ✦ glyph,
            and the fallback each phone uses draws it off-centre in its box,
            so the star would not finish in the middle of the screen */}
        <span
          data-star
          className="inline-block self-center align-middle text-sky-400"
        >
          <svg
            viewBox="0 0 100 100"
            aria-hidden="true"
            className="block size-[0.8em] overflow-visible"
          >
            <path d={sparklePath} fill="currentColor" />
          </svg>
        </span>
      </p>
      <CtaText lang={lang} />
    </div>
  );
}
