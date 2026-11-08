"use client";

import { useRef } from "react";
import gsap from "gsap";

/**
 * Decorative display text whose letters stretch like a macOS dock under the
 * mouse: the nearest letter grows most. Renders a <span>, never a heading;
 * the hero's real <h1> is screen-reader text.
 */
export function DockText({ text, down = false }: { text: string; down?: boolean }) {
  const letterRefs = useRef<HTMLSpanElement[]>([]);
  // One reusable tween per letter, made on first hover
  const stretchTo = useRef<((scaleY: number) => void)[]>([]);

  const stretch = (scaleOf: (index: number) => number) => {
    letterRefs.current.forEach((letter, index) => {
      stretchTo.current[index] ??= gsap.quickTo(letter, "scaleY", {
        duration: 0.3,
        ease: "power2.out",
      });
      stretchTo.current[index](scaleOf(index));
    });
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    let closest = 0;
    let minDistance = Infinity;
    letterRefs.current.forEach((letter, index) => {
      const { left, width } = letter.getBoundingClientRect();
      const distance = Math.abs(event.clientX - (left + width / 2));
      if (distance < minDistance) {
        minDistance = distance;
        closest = index;
      }
    });
    stretch((index) => Math.max(1, 1.2 - Math.abs(index - closest) * 0.1));
  };

  return (
    <span
      onMouseMove={handleMouseMove}
      onMouseLeave={() => stretch(() => 1)}
      className="block cursor-pointer"
    >
      {text.split("").map((letter, index) => (
        <span
          key={index}
          ref={(el) => {
            if (el) letterRefs.current[index] = el;
          }}
          className={`inline-block ${down ? "origin-top" : "origin-bottom"}`}
        >
          {letter}
        </span>
      ))}
    </span>
  );
}
