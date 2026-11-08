"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { bebasNeue } from "@/common/font";
import { sparklePath } from "@/components/svg/sparkle";
import { LinkButton } from "@/components/ui/link-button";
import { email, socials, whatsapp } from "@/data/socials";
import { cn } from "@/lib/utils";
import gsap from "gsap";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type FooterProps = {
  lang: {
    contact_section: {
      eyebrow: string;
      title: string;
      body: string;
      subject: string;
    };
  };
};

export default function Footer({ lang }: FooterProps) {
  const t = lang.contact_section;
  const rootRef = useRef<HTMLElement>(null);
  const starRef = useRef<SVGSVGElement>(null);

  useGSAP(
    () => {
      const media = gsap.matchMedia();

      // The star turns as the footer is uncovered. The trigger is the
      // <footer> box, which scrolls normally; the panel inside is sticky.
      media.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.to(starRef.current, {
          rotation: 180,
          ease: "none",
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top bottom",
            end: "bottom bottom",
            scrub: true,
          },
        });
      });

      return () => media.revert();
    },
    { scope: rootRef },
  );

  return (
    // Sticky reveal: the quote/CTA screen above slides up off a footer that
    // stays put. The <footer> scrolls in like any block and clips
    // (clip-path) a screen-high panel that sticks to the screen inside a
    // taller track. lvh, so the footer fills a phone's screen once the
    // address bar hides (svh would leave the screen above showing at the
    // top). While the bar shows, the page end cuts lvh - svh off the top,
    // so the top padding adds that much.
    <footer
      ref={rootRef}
      id="contact"
      className="relative h-lvh [clip-path:polygon(0_0,100%_0,100%_100%,0_100%)]"
    >
      <div className="relative top-[-100lvh] h-[200lvh]">
        <div
          data-footer-panel
          className="sticky top-0 flex h-lvh flex-col justify-between gap-8 bg-[#0a0a0a] px-4 pt-[calc(100lvh-100svh+2rem)] pb-6 text-neutral-200 md:px-8 md:pb-[4vh]"
        >
          <div className="flex items-start justify-between gap-4">
            <p className="text-lg font-semibold text-neutral-400 uppercase md:text-[clamp(1rem,1.3vw,1.8rem)]">
              {t.eyebrow}
            </p>
            <svg
              ref={starRef}
              viewBox="0 0 100 100"
              aria-hidden="true"
              className="size-[clamp(2.5rem,5vw,5rem)] shrink-0 text-sky-400"
            >
              <path d={sparklePath} fill="currentColor" />
            </svg>
          </div>

          <div>
            <h2
              className={cn(
                bebasNeue.className,
                "text-[24vw] leading-[0.85] uppercase md:text-[min(13vw,16rem)]",
              )}
            >
              {t.title}
            </h2>
            <p className="mt-4 text-lg text-neutral-400 md:mt-6 md:text-[clamp(1.1rem,1.6vw,2rem)]">
              {t.body}
            </p>
          </div>

          <div className="flex flex-col gap-6 md:gap-10">
            <div className="flex flex-col gap-1 text-[6vw] font-semibold tracking-tight md:text-[clamp(1.5rem,2.6vw,3rem)]">
              <LinkButton
                href={`mailto:${email}?subject=${encodeURIComponent(t.subject)}`}
              >
                {email}
              </LinkButton>
              <LinkButton href={whatsapp.href} external>
                {whatsapp.number}
                <span className="sr-only"> (WhatsApp, opens in a new tab)</span>
              </LinkButton>
            </div>

            {/* Copyright on the left, socials on the right; on phones the
                socials come first and the copyright closes the page */}
            <div className="flex flex-col-reverse gap-4 border-t border-neutral-800 pt-4 md:flex-row md:items-center md:justify-between">
              {/* Same size and case as the socials, regular weight */}
              <p className="text-lg text-neutral-400 uppercase md:text-[clamp(1rem,1.3vw,1.8rem)]">
                {/* The year is set at build time; a visit in a later year
                    renders a newer one, which is expected */}
                &copy;{" "}
                <span suppressHydrationWarning>{new Date().getFullYear()}</span>{" "}
                M. Firdaus Alfarizi
              </p>
              <ul
                // One row on phones too: spread across the width, tighter gaps
                className="flex flex-wrap justify-between gap-x-3 gap-y-2 text-lg font-semibold uppercase md:justify-start md:gap-x-6 md:text-[clamp(1rem,1.3vw,1.8rem)]"
              >
                {socials.map(({ name, handle, href }) => (
                  <li key={name}>
                    {/* A bigger arrow: the default suits lowercase text.
                        Phones have no hover to show it, and its empty space
                        would keep the last link off the right edge. */}
                    <LinkButton
                      href={href}
                      external
                      className="[&>svg]:size-[0.7em] max-md:[&>svg]:hidden"
                    >
                      {name}
                      <span className="sr-only">
                        {`: ${handle} (opens in a new tab)`}
                      </span>
                    </LinkButton>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
