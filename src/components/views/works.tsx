"use client";

import { useRef } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { works } from "@/data/works";
import { useGSAP } from "@gsap/react";
import { ArrowButton } from "@/components/ui/arrow-button";
import { WorksNext } from "@/components/views/works-next";
import { inOwnTask } from "@/lib/utils";
import gsap from "gsap";
import WorkImage from "@/components/ui/work-image";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/** Screens of scroll the last card takes, from card to the next section. */
const STAGE_SCREENS = 5;

type WorksViewProps = {
  lang: {
    lang: string;
    expertise_section: { title: string };
    works_section: {
      title: string;
      badge?: string;
      challenge_label?: string;
      strategy_label?: string;
      results_label?: string;
      see_work: string;
      next: string;
      up_next: string;
      teaser: string[];
    };
  };
};

export default function WorksView({ lang }: WorksViewProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const locale = lang.lang === "id" ? "id" : "en";

  useGSAP(
    // Below the fold: set up after hydration, in a task of its own
    (_, contextSafe) =>
      inOwnTask(
        contextSafe!(() => {
          const root = rootRef.current;
          const title = titleRef.current;
          const track = trackRef.current;
          if (!root || !title || !track) return;

          const media = gsap.matchMedia();
          media.add(
            {
              wide: "(min-width: 768px)",
              motion: "(prefers-reduced-motion: no-preference)",
            },
            ({ conditions }) => {
              const { wide, motion } = conditions!;
              if (!wide && !motion) return;

              const stage = track.querySelector<HTMLElement>("[data-stage]")!;
              const panel = stage.querySelector<HTMLElement>("[data-panel]")!;
              const wall = stage.querySelector<HTMLElement>("[data-wall]")!;
              const big = stage.querySelector("[data-big]");
              const lines = (scope: string) =>
                gsap.utils.toArray(`${scope} [data-line]`, stage);

              const distance = () =>
                wide ? Math.max(0, track.scrollWidth - window.innerWidth) : 0;
              const stageScroll = () =>
                motion ? window.innerHeight * STAGE_SCREENS : 0;
              // From below the screen to above it, or back
              const crossing = () => panel.offsetHeight + wall.offsetHeight;

              // Desktop pins the whole section, mobile only the last screen
              const pin = ScrollTrigger.create({
                trigger: wide ? root : stage,
                start: "top top",
                end: () => `+=${distance() + stageScroll()}`,
                pin: true,
                // GSAP turns it off by default in a flex parent (the mobile track)
                pinSpacing: true,
                invalidateOnRefresh: true,
                // Rebuilt after later sections when the breakpoint changes
                refreshPriority: 1,
              });

              // Desktop: the title fills white from left to right (--fill) with
              // the pinned horizontal scroll. Mobile keeps it plain white
              // (--fill: 100%).
              if (wide) {
                gsap
                  .timeline({
                    defaults: { ease: "none" },
                    scrollTrigger: {
                      trigger: root,
                      start: "top top",
                      end: () => `+=${distance()}`,
                      scrub: 1,
                      invalidateOnRefresh: true,
                    },
                  })
                  .to(track, { x: () => -distance() })
                  .to(title, { "--fill": "100%" }, 0);
              }

              if (!motion) return;

              // The last half screen of the pin goes to the shrink
              const played = () => pin.end - window.innerHeight * 0.5;

              // The big text waits under its masks. Set here and not with a
              // from() in the timeline: a refresh undoes a from() until its
              // tween starts, so the staggered lines would show before their turn.
              gsap.set(big, { autoAlpha: 1 });
              gsap.set(lines("[data-big]"), { yPercent: 100 });

              // From the moment the card sits centered: it opens to the whole
              // screen, its text rolling out once it has grown a little and the
              // big text rolling in at the end, then the columns cross over the
              // shrinking text, odd ones down, even ones up. Same scrub as the
              // track, so the two stay in step.
              gsap
                .timeline({
                  defaults: { ease: "none" },
                  scrollTrigger: {
                    trigger: stage,
                    start: () => pin.start + distance(),
                    end: played,
                    scrub: 1,
                    invalidateOnRefresh: true,
                  },
                })
                .to(
                  panel,
                  { "--grow": 1, duration: 0.2, ease: "power2.inOut" },
                  0,
                )
                // Once covered: the last work, the title and the caption must
                // not show around the panel when it shrinks
                .set(stage, { backgroundColor: "#0a0a0a" }, 0.2)
                .set("[data-caption]", { autoAlpha: 0 }, 0.2)
                .to(
                  lines("[data-card]"),
                  { yPercent: -100, duration: 0.06, stagger: 0.015 },
                  0.06,
                )
                .to(
                  lines("[data-foot]"),
                  { yPercent: 100, duration: 0.06 },
                  0.06,
                )
                .to(
                  lines("[data-big]"),
                  {
                    yPercent: 0,
                    duration: 0.07,
                    stagger: 0.01,
                    ease: "power2.out",
                  },
                  0.19,
                )
                .fromTo(
                  "[data-column]",
                  { y: (i: number) => (i % 2 ? 0 : -crossing()) },
                  {
                    y: (i: number) => (i % 2 ? -crossing() : 0),
                    duration: 0.7,
                  },
                  0.3,
                )
                .to("[data-big-text]", { scale: 0.7, duration: 0.7 }, 0.3);

              // Leaving for the next section, the lime closes in from every side:
              // in place at first, or its top edge would never be seen, then on
              // up with the page. By the clip, not by scaling, so the text keeps
              // its size.
              gsap.to(panel, {
                "--shrink": 1,
                ease: "none",
                scrollTrigger: {
                  trigger: stage,
                  start: played,
                  end: () => pin.end + window.innerHeight * 0.5,
                  scrub: true,
                },
              });
            },
          );

          // Mobile cards reveal as they scroll in: a lime panel wipes up from the
          // bottom (clip-path), the image follows over it while zooming out, then
          // the caption rises in.
          media.add(
            "(max-width: 767.98px) and (prefers-reduced-motion: no-preference)",
            () => {
              const hidden = { clipPath: "inset(100% 0% 0% 0%)" };
              const shown = { clipPath: "inset(0% 0% 0% 0%)" };

              gsap.utils
                .toArray<HTMLElement>("article", track)
                .forEach((article) => {
                  const panel = article.querySelector("[data-reveal-panel]");
                  const image = article.querySelector(
                    "[data-reveal-panel] + *",
                  );
                  const img = image?.querySelector("img");
                  const caption = article.querySelector("figure + div");
                  if (!panel || !image || !img || !caption) return;

                  gsap
                    .timeline({
                      defaults: { ease: "none" },
                      scrollTrigger: {
                        trigger: article,
                        // Spread over most of the screen, eased a little, so the
                        // reveal does not rush by
                        start: "top bottom",
                        end: "top 15%",
                        scrub: 0.5,
                      },
                    })
                    .fromTo(panel, hidden, shown)
                    .fromTo(image, hidden, shown, 0.25)
                    .fromTo(img, { scale: 1.25 }, { scale: 1 }, 0.25)
                    .fromTo(
                      caption,
                      { yPercent: 40, opacity: 0 },
                      { yPercent: 0, opacity: 1, ease: "power2.out" },
                      0.55,
                    );
                });
            },
          );
        }),
      ),
    { scope: rootRef },
  );

  return (
    // Mobile: a vertical list, clipped sideways so nothing scrolls horizontally
    <div
      ref={rootRef}
      className="relative w-full overflow-x-clip bg-[#0a0a0a] text-white md:h-dvh md:overflow-hidden"
    >
      {/* Section Title Header with gradient fill mask */}
      <div className="px-4 pt-12 pb-2 md:contents">
        <h2
          ref={titleRef}
          className="pointer-events-none text-[11vw] uppercase font-bold tracking-tight md:absolute md:left-8 md:top-[8vh] md:z-0 md:max-w-[90vw] md:text-[5.5vw] [--fill:100%] md:[--fill:0%] bg-[linear-gradient(90deg,#fff_var(--fill),rgb(255_255_255/0.2)_var(--fill))] bg-clip-text text-transparent"
        >
          {lang.works_section.title}
        </h2>
      </div>

      <div className="md:h-full md:overflow-hidden">
        <div
          ref={trackRef}
          className="flex flex-col gap-24 px-4 pt-6 md:h-full md:w-max md:flex-row md:items-center md:gap-[18vw] md:pt-0 md:pr-0 md:pl-[20vw]"
        >
          {works.map((work, index) => (
            <article
              key={work.id}
              className={`w-[85%] min-w-68 max-w-120 shrink-0 md:w-[44vmin] md:self-auto ${
                index % 2 === 0
                  ? "self-start md:translate-y-[8vh]"
                  : "self-end md:translate-y-[-4vh]"
              }`}
            >
              {/* Header: Pure Editorial Metadata */}
              <div className="mb-3 flex items-baseline justify-between text-xs uppercase tracking-[0.2em] text-white/40">
                <span>{work.theme[locale]}</span>
                <span className="font-mono text-[11px]">{work.period}</span>
              </div>

              {/* Frameless Media Showcase (Original WebGL WorkImage) */}
              <figure className="relative aspect-11/15 overflow-hidden">
                <div
                  data-reveal-panel
                  aria-hidden="true"
                  className="absolute inset-0 bg-sky-400 md:hidden"
                />
                <WorkImage
                  src={work.image}
                  hoverSrc={work.hoverImage}
                  alt={work.title}
                />
              </figure>

              {/* Overlapping Typography & Case Study Content */}
              <div className="relative -mt-16 text-white">
                <h3
                  className={`text-[13vw] leading-none tracking-tight md:ml-[-25%] md:mr-0 md:text-left md:text-[4.5vw] font-medium ${
                    index % 2 === 0 ? "ml-[4%]" : "mr-[4%] text-right"
                  }`}
                >
                  {work.client}
                </h3>

                <div className="mt-3 md:ml-[-10%] max-w-md">
                  <p className="text-sm md:text-base text-neutral-300 font-normal leading-relaxed">
                    {work.tagline[locale]}
                  </p>

                  {/* Editorial Problem & Strategy Lines */}
                  <div className="mt-4 pt-3 border-t border-white/15 text-xs text-neutral-400 flex flex-col gap-2">
                    <p className="leading-relaxed">
                      <span className="text-white uppercase tracking-wider font-semibold mr-1.5">
                        {lang.works_section.challenge_label}:
                      </span>
                      {work.problem[locale]}
                    </p>
                    <p className="leading-relaxed">
                      <span className="text-white uppercase tracking-wider font-semibold mr-1.5">
                        {lang.works_section.strategy_label}:
                      </span>
                      {work.strategy[locale]}
                    </p>
                  </div>

                  {/* Proven Metrics - Pure Typographic Numbers (No Box Containers) */}
                  <div className="mt-4 pt-3 border-t border-white/15 flex items-baseline justify-between gap-4">
                    {work.metrics.map((metric, mIdx) => (
                      <div key={mIdx}>
                        <div className="text-2xl md:text-3xl font-bold tracking-tight text-white">
                          {metric.value}
                        </div>
                        <div className="text-[11px] text-white/50 tracking-wide mt-0.5">
                          {metric.label[locale]}
                        </div>
                      </div>
                    ))}
                  </div>

                  <a
                    href="#contact"
                    className="mt-6 block focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  >
                    <ArrowButton
                      label={lang.works_section.see_work}
                      className="w-fit"
                    />
                  </a>
                </div>
              </div>
            </article>
          ))}
          <WorksNext lang={lang} />
        </div>
      </div>
    </div>
  );
}
