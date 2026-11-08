"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

gsap.registerPlugin(useGSAP);

/**
 * A ring that trails the mouse. quickTo reuses one tween per axis, so the
 * ring costs nothing while the mouse rests. Mouse only, and not with
 * reduced motion.
 */
export default function CursorPointer() {
  const ringRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const ring = ringRef.current;
    if (
      !ring ||
      !matchMedia("(hover: hover) and (pointer: fine)").matches ||
      matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const follow = { duration: 0.6, ease: "power3.out" };
    const xTo = gsap.quickTo(ring, "x", follow);
    const yTo = gsap.quickTo(ring, "y", follow);
    gsap.set(ring, { xPercent: -50, yPercent: -50 });

    const move = (event: PointerEvent) => {
      // First move: jump to the pointer, then show the ring
      if (!ring.style.opacity) {
        gsap.set(ring, { x: event.clientX, y: event.clientY, opacity: 1 });
      }
      xTo(event.clientX);
      yTo(event.clientY);
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  });

  return (
    <div
      ref={ringRef}
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-9999 size-24 rounded-full border-2 border-white/65 opacity-0"
    />
  );
}
