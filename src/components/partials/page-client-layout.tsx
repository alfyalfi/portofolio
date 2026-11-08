"use client";

import { ReactLenis, useLenis } from "lenis/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "lenis/dist/lenis.css";

gsap.registerPlugin(ScrollTrigger);

export default function PageClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Keep ScrollTrigger in sync with every Lenis scroll frame
  useLenis(ScrollTrigger.update);

  return (
    <ReactLenis root options={{ autoRaf: true }}>
      {children}
    </ReactLenis>
  );
}
