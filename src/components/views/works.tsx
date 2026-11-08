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
      timeline_badge?: string;
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
      {/* md:contents drops this wrapper's box on desktop */}
      <div className="px-4 pt-12 pb-2 md:contents">
        <h2
          ref={titleRef}
          className="pointer-events-none text-[11vw] uppercase font-bold tracking-tight md:absolute md:left-8 md:top-[8vh] md:z-0 md:max-w-[90vw] md:text-[6vw] [--fill:100%] md:[--fill:0%] bg-[linear-gradient(90deg,#fff_var(--fill),rgb(255_255_255/0.2)_var(--fill))] bg-clip-text text-transparent"
        >
          {lang.works_section.title}
        </h2>
      </div>

      <div className="md:h-full md:overflow-hidden">
        <div
          ref={trackRef}
          className="flex flex-col gap-16 px-4 pt-6 md:h-full md:w-max md:flex-row md:items-center md:gap-[15vw] md:pt-0 md:pr-0 md:pl-[20vw]"
        >
          {works.map((work, index) => (
            <article
              key={work.id}
              className={`w-full max-w-md shrink-0 md:w-[480px] lg:w-[520px] md:self-auto ${
                index % 2 === 0
                  ? "self-start md:translate-y-[4vh]"
                  : "self-end md:translate-y-[-3vh]"
              }`}
            >
              <div className="group relative rounded-2xl border border-white/10 bg-neutral-950/85 backdrop-blur-xl p-5 md:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.6)] transition-all duration-300 hover:border-sky-400/40 hover:shadow-[0_0_35px_rgba(56,189,248,0.15)]">
                {/* Timeline Header with Period Pill & Counter */}
                <div className="flex items-center justify-between pb-3.5 border-b border-white/10">
                  <div className="flex items-center gap-2.5">
                    <span className="flex size-7 items-center justify-center rounded-lg bg-sky-400/10 text-sky-400 font-mono text-xs font-bold border border-sky-400/30">
                      0{index + 1}
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-400/10 px-3 py-1 text-xs font-semibold text-sky-400 border border-sky-400/30">
                      <span className="size-1.5 rounded-full bg-sky-400 animate-pulse" />
                      {work.period}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono uppercase tracking-widest text-neutral-400">
                    Step 0{index + 1} / 0{works.length}
                  </span>
                </div>

                {/* Company & Role Details */}
                <div className="mt-3.5">
                  <p className="text-xs uppercase tracking-wider font-semibold text-neutral-300">
                    {work.company[locale]}
                  </p>
                  {work.subCompany && (
                    <p className="text-[11px] text-neutral-400 font-medium mt-0.5">
                      {work.subCompany[locale]}
                    </p>
                  )}
                  <h3 className="text-xl md:text-2xl font-bold tracking-tight text-white mt-1.5 group-hover:text-sky-300 transition-colors">
                    {work.role[locale]}
                  </h3>
                </div>

                {/* Interactive Media Showcase */}
                <figure className="relative aspect-16/10 overflow-hidden rounded-xl border border-white/10 bg-neutral-900 mt-4 group-hover:border-sky-400/30 transition-colors">
                  {/* Mobile reveal: lime panel shown before the image */}
                  <div
                    data-reveal-panel
                    aria-hidden="true"
                    className="absolute inset-0 bg-sky-400 md:hidden z-10"
                  />
                  <WorkImage
                    src={work.image}
                    hoverSrc={work.hoverImage}
                    alt={work.title}
                  />
                  <div className="pointer-events-none absolute bottom-2.5 left-2.5 z-10 px-2.5 py-1 rounded-md bg-black/75 backdrop-blur-md border border-white/10 text-[11px] font-medium text-neutral-200">
                    {work.category}
                  </div>
                </figure>

                {/* Description & Key Highlights */}
                <div className="relative mt-4 text-white">
                  <p className="text-xs md:text-sm text-neutral-400 leading-relaxed">
                    {work.description[locale]}
                  </p>

                  <ul className="mt-3 space-y-1.5 text-xs text-neutral-300">
                    {work.highlights[locale].map((point, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="mt-1 size-1.5 rounded-full bg-sky-400 shrink-0" />
                        <span className="leading-snug">{point}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Skills tags */}
                  <div className="flex flex-wrap gap-1.5 mt-3.5 pt-3 border-t border-white/5">
                    {work.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-white/5 text-neutral-400 border border-white/5 hover:text-neutral-200 transition-colors"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <a
                    href="#contact"
                    className="mt-4 block focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 rounded-lg"
                  >
                    <ArrowButton
                      label={lang.works_section.see_work}
                      className="w-full justify-between"
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
