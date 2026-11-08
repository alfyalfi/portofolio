"use client";

import { useRef, type CSSProperties } from "react";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { workPictures } from "@/data/works";
import { inOwnTask } from "@/lib/utils";
import Image from "next/image";
import gsap from "gsap";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/** How far apart the cards set off, in lifetimes of a card. */
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

/**
 * Cards passing on a ring around the viewer: each comes in tiny on the right,
 * nears the middle at full size and shrinks away to the left, its path closing
 * in on the middle line at both ends. --p is the way across (1 to -1), --s how
 * close it is (0 to 1), in CSS so the layout needs no measuring.
 *
 * The section is only scroll distance: the cards sit in a fixed layer, which
 * section.tsx puts over the quote, and run on past the section's end. So the
 * quote pins and its text slides in while the last cards are still leaving.
 * With reduced motion the section is skipped.
 */
export default function ShowcaseView() {
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  useGSAP(
    // Below the fold: set up after hydration, in a task of its own
    (_, contextSafe) =>
      inOwnTask(
        contextSafe!(() => {
          const stage = stageRef.current!;

          gsap
            .matchMedia()
            .add("(prefers-reduced-motion: no-preference)", () => {
              const timeline = gsap.timeline({
                scrollTrigger: {
                  trigger: rootRef.current,
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

              // display: none the rest of the time, so the pictures load only
              // when they are about to be seen. Past the end, for the scrub.
              ScrollTrigger.create({
                trigger: rootRef.current,
                start: "top 200%",
                end: "bottom -150%",
                onToggle: ({ isActive }) =>
                  stage.toggleAttribute("data-active", isActive),
              });

              return () => stage.removeAttribute("data-active");
            });
        }),
      ),
    { scope: rootRef },
  );

  return (
    <div ref={rootRef} data-showcase className="h-[270vh] w-full">
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
            {/* shortcut: the work images, twice over, until the showcase has
                its own */}
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
  );
}
