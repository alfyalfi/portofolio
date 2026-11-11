"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn, inOwnTask } from "@/lib/utils";
import gsap from "gsap";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * A silent looping video. On desktop it starts small in the bottom right corner
 * and holds still there while it grows with the scroll to fill the screen:
 * sticky, so no ancestor may set overflow hidden (clip is fine). Phones show it
 * plain. No autoPlay attribute: it would download with the page, so the video
 * loads and plays once it nears the screen, and pauses when it leaves. Reduced
 * motion keeps it full size on its first frame.
 */
export function GrowingVideo({
  src,
  className,
}: {
  src: string;
  className?: string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useGSAP(
    // Below the fold: set up after hydration, in a task of its own
    (_, contextSafe) =>
      inOwnTask(
        contextSafe!(() => {
          const video = videoRef.current!;
          const media = gsap.matchMedia();

          media.add("(prefers-reduced-motion: reduce)", () => {
            video.preload = "metadata";
          });

          media.add(
            "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
            () => {
              gsap.fromTo(
                boxRef.current,
                { scale: 0.3 },
                {
                  scale: 1,
                  ease: "none",
                  scrollTrigger: {
                    trigger: rootRef.current,
                    start: "top top",
                    end: "bottom bottom",
                    scrub: true,
                  },
                },
              );
            },
          );

          media.add("(prefers-reduced-motion: no-preference)", () => {
            ScrollTrigger.create({
              trigger: rootRef.current,
              start: "top bottom",
              end: "bottom top",
              onToggle: ({ isActive }) => {
                if (isActive) video.play().catch(() => {});
                else video.pause();
              },
            });

            return () => video.pause();
          });
        }),
      ),
    { scope: rootRef },
  );

  return (
    <div
      ref={rootRef}
      className={cn(
        "pointer-events-none relative z-10 md:motion-safe:h-[200vh] md:motion-reduce:h-screen",
        className,
      )}
    >
      <div className="md:sticky md:top-0 md:h-screen">
        <div
          ref={boxRef}
          className="relative aspect-video w-full overflow-hidden md:absolute md:inset-x-0 md:inset-y-8 md:aspect-auto md:w-auto md:origin-bottom-right"
        >
          <video
            ref={videoRef}
            src={src}
            preload="none"
            muted
            loop
            playsInline
            disablePictureInPicture
            aria-hidden="true"
            className="size-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}
