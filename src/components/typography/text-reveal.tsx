"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";
import { cn, inOwnTask } from "@/lib/utils";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/** Text pinned for a screen while its words light up one by one on scroll. */
export function TextReveal({
  children,
  className,
}: {
  children: string;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useGSAP(
    // Below the fold: set up after hydration, in a task of its own
    (_, contextSafe) =>
      inOwnTask(
        contextSafe!(() => {
          // Unlit words at 40%: dimmer fails the contrast check (3:1)
          gsap.fromTo(
            "[data-word]",
            { opacity: 0.4 },
            {
              opacity: 1,
              stagger: 0.1,
              ease: "none",
              scrollTrigger: {
                trigger: containerRef.current,
                pin: textRef.current,
                start: "top top",
                end: "bottom 80%",
                scrub: 1,
              },
            },
          );
        }),
      ),
    { scope: containerRef, dependencies: [children] },
  );

  return (
    <div ref={containerRef} className={cn("relative h-[200vh]", className)}>
      <div
        ref={textRef}
        className="flex h-screen items-center justify-center py-20"
      >
        <span className="flex flex-wrap md:py-8">
          {children.split(" ").map((word, i) => (
            <span
              key={i}
              data-word
              className="mx-1 inline-block text-white opacity-40 lg:mx-1.5"
            >
              {word}
            </span>
          ))}
        </span>
      </div>
    </div>
  );
}
