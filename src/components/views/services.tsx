/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { Fragment, useRef, type PointerEvent } from "react";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { bebasNeue } from "@/common/font";
import { cn, inOwnTask } from "@/lib/utils";
import gsap from "gsap";
import Image from "next/image";

gsap.registerPlugin(useGSAP, ScrollTrigger);

// `place` is relative to the section. A picture is at most 12% wide and 24%
// tall: keep them further apart than that so they don't overlap.
// shortcut: `src` reuses the work images as placeholders, swap in the 1:1
// pictures once they exist
const roles = [
  {
    name: "DIGITAL MARKETING",
    shots: [
      { src: "/assets/images/avana-1m-aja.png", place: "left-[2%] top-[6%]" },
      { src: "/assets/images/dashboard-avana.jpg", place: "left-[32%] top-[14%]" },
      { src: "/assets/images/ammaia-callme.png", place: "right-[2%] top-[11%]" },
      { src: "/assets/images/brand-f.png", place: "left-[75%] top-[52%]" },
      { src: "/assets/images/alfarizi.jpg", place: "left-[8%] bottom-[6%]" },
    ],
  },
  {
    name: "ADS SPECIALIST",
    shots: [
      { src: "/assets/images/brand-meta.jpg", place: "left-[6%] top-[30%]" },
      { src: "/assets/images/dashboard-ammaia.jpg", place: "left-[58%] top-[16%]" },
      { src: "/assets/images/alzafa3-udahgila.png", place: "right-[3%] top-[8%]" },
      { src: "/assets/images/dashboard-alzafa.jpg", place: "right-[4%] bottom-[8%]" },
      { src: "/assets/images/alfarizi.jpg", place: "left-[24%] bottom-[6%]" },
    ],
  },
  {
    name: "CONTENT CREATOR",
    shots: [
      { src: "/assets/images/tips-posisi.jpg", place: "left-[14%] top-[5%]" },
      { src: "/assets/images/cine-avan-100826.png", place: "left-[62%] top-[5%]" },
      { src: "/assets/images/bir2-fotokalah.png", place: "left-[3%] bottom-[8%]" },
      { src: "/assets/images/brand-tiktok.jpg", place: "left-[56%] bottom-[9%]" },
      { src: "/assets/images/alfarizi.jpg", place: "right-[3%] top-[44%]" },
    ],
  },
];

const reducedMotion = () =>
  matchMedia("(prefers-reduced-motion: reduce)").matches;

// Each grey word goes up and out, its white copy (::after) comes up behind it
const rollWords = (heading: Element, on: boolean) => {
  const still = reducedMotion();
  gsap.to(heading.querySelectorAll("[data-roll]"), {
    yPercent: on ? -100 : 0,
    duration: still ? 0 : 0.3,
    ease: "power3.inOut",
    stagger: still ? 0 : 0.08,
    overwrite: true,
  });
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function ServicesView({ lang }: { lang: any }) {
  const sectionRef = useRef<HTMLElement>(null);

  const { contextSafe } = useGSAP(
    // Below the fold: set up after hydration, in a task of its own
    (_, contextSafe) =>
      inOwnTask(
        contextSafe!(() => {
          const section = sectionRef.current;
          if (!section) return;

          const media = gsap.matchMedia();

          // Touch can't hover: the row crossing the middle of the screen rolls
          media.add("(pointer: coarse)", () => {
            gsap.utils
              .toArray<HTMLElement>("h2", section)
              .forEach((heading) => {
                ScrollTrigger.create({
                  trigger: heading,
                  start: "top center",
                  end: "bottom center",
                  onToggle: contextSafe!((self: ScrollTrigger) =>
                    rollWords(heading, self.isActive),
                  ),
                });
              });
          });

          // Scale 0 keeps them out of sight, so they grow in without a fade
          media.add("(prefers-reduced-motion: no-preference)", () => {
            gsap.set(gsap.utils.toArray("[data-shot]", section), {
              autoAlpha: 1,
              scale: 0,
            });
          });

          // Each picture drifts toward the cursor by its own amount
          media.add(
            "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
            () => {
              const follow = { duration: 0.8, ease: "power3.out" };
              const pictures = gsap.utils
                .toArray<HTMLElement>("[data-follow]", section)
                .map((picture) => ({
                  xTo: gsap.quickTo(picture, "x", follow),
                  yTo: gsap.quickTo(picture, "y", follow),
                  pull: gsap.utils.random(0.06, 0.16),
                }));

              const move = ({ clientX, clientY }: MouseEvent) => {
                pictures.forEach(({ xTo, yTo, pull }) => {
                  xTo((clientX - innerWidth / 2) * pull);
                  yTo((clientY - innerHeight / 2) * pull);
                });
              };
              section.addEventListener("pointermove", move);
              return () => section.removeEventListener("pointermove", move);
            },
          );
        }),
      ),
    { scope: sectionRef },
  );

  // Touch fires these too, on every tap: only a mouse hovers
  const hover = (row: number, on: boolean) =>
    contextSafe(({ pointerType, currentTarget }: PointerEvent) => {
      if (pointerType !== "mouse") return;
      rollWords(currentTarget, on);

      gsap.to(`[data-shot="${row}"]`, {
        ...(reducedMotion()
          ? { autoAlpha: on ? 1 : 0 }
          : { scale: on ? 1 : 0 }),
        duration: 0.3,
        ease: on ? "power3.out" : "power2.in",
        // One by one, in a new order each time
        stagger: on ? { each: 0.12, from: "random" } : 0,
        overwrite: true,
      });
    });

  return (
    <section
      ref={sectionRef}
      id="services"
      className="relative w-full h-screen overflow-hidden"
    >
      {/* Under the text. display: none on touch keeps them from downloading.
          Two boxes: the hover tween overwrites what runs on [data-shot], which
          must not stop the cursor following on [data-follow]. */}
      {roles.map(({ shots }, row) =>
        shots.map(({ src, place }) => (
          <div
            key={place}
            data-follow
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute aspect-square w-[min(12vw,24vh)] max-md:hidden pointer-coarse:hidden",
              place,
            )}
          >
            <div data-shot={row} className="invisible relative size-full">
              <Image
                src={src}
                alt=""
                fill
                sizes="12vw"
                className="object-cover"
              />
            </div>
          </div>
        )),
      )}

      {/* Sized in vw: the longest row is ~6.2em, so 15.5% of the padded width
          fits it on a phone. From md the rows take about half the width,
          leaving the sides to the pictures, and stop growing at 14rem. */}
      <div
        className={`${bebasNeue.className} relative flex flex-col items-center justify-center h-full uppercase tracking-tight leading-[0.8] text-nowrap text-[calc((100vw-2rem)*0.155)] md:text-[min(8.5vw,14rem)]`}
      >
        {roles.map(({ name }, row) => (
          <h2
            key={name}
            aria-label={name}
            onPointerEnter={hover(row, true)}
            onPointerLeave={hover(row, false)}
            className="text-neutral-500"
          >
            {/* The white copy is CSS-generated, so it stays out of the page
                text. The clip passes the round letters above, and stops short
                of the copy waiting below. */}
            {name.split(" ").map((word) => (
              <Fragment key={word}>
                <span className="inline-block [clip-path:inset(-0.03em_-0.1em_0.05em)]">
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
          </h2>
        ))}
      </div>
    </section>
  );
}
