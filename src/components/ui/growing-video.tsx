"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn, inOwnTask } from "@/lib/utils";
import gsap from "gsap";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * A silent looping video. On desktop it starts small in the bottom right corner
 * and holds still there while it grows with the scroll to fill the screen:
 * sticky, so no ancestor may set overflow hidden (clip is fine). Phones show it
 * plain. Loads immediately with faststart optimization and poster image.
 */
export function GrowingVideo({
  src,
  poster,
  className,
}: {
  src: string;
  poster?: string;
  className?: string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);

  const toggleSound = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

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
          className="group relative aspect-video w-full overflow-hidden rounded-2xl border border-white/10 shadow-2xl md:absolute md:inset-x-0 md:inset-y-8 md:aspect-auto md:w-auto md:origin-bottom-right"
        >
          <video
            ref={videoRef}
            src={src}
            poster={poster}
            preload="metadata"
            muted
            loop
            playsInline
            disablePictureInPicture
            aria-hidden="true"
            className="size-full object-cover"
          />

          {/* Luxury ambient overlay & Sound toggle */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 pointer-events-none" />

          <button
            type="button"
            onClick={toggleSound}
            aria-label={isMuted ? "Unmute video" : "Mute video"}
            className="pointer-events-auto absolute bottom-6 right-6 z-20 flex items-center gap-2.5 rounded-full bg-neutral-900/80 px-4 py-2 text-xs font-medium text-white shadow-lg backdrop-blur-md border border-neutral-700 hover:border-sky-400 hover:bg-neutral-800 transition-all duration-300"
          >
            {isMuted ? (
              <>
                <svg
                  className="size-4 text-neutral-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
                  />
                </svg>
                <span>Nyalakan Suara</span>
              </>
            ) : (
              <>
                <svg
                  className="size-4 text-sky-400 animate-pulse"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                  />
                </svg>
                <span className="text-sky-400 font-semibold">Suara Aktif</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
