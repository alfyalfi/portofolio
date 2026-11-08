import { bebasNeue } from "@/common/font";
import { cn } from "@/lib/utils";

type CtaTextProps = {
  lang: { cta_section: { first: string[]; second: string[] } };
};

/**
 * The CTA's two 3-line texts. With motion they lie over the quote's pinned
 * screen, and quote.tsx plays them once its star has filled the screen lime:
 * [data-cta-line] rises in, then each [data-cta-roll] row rolls over to the
 * second text. With reduced motion they stack in a lime block of their own.
 */
export function CtaText({ lang }: CtaTextProps) {
  return (
    <div className="pointer-events-none flex min-h-lvh w-full items-center justify-center bg-sky-400 px-4 py-16 text-[#0a0a0a] md:px-8 motion-safe:absolute motion-safe:inset-0 motion-safe:min-h-0 motion-safe:bg-transparent">
      {/* Both texts share one grid cell so the second replaces the first */}
      <div
        className={cn(
          bebasNeue.className,
          "grid gap-[0.5em] text-center text-[16vw] leading-[0.9] uppercase motion-safe:gap-0 md:text-[min(16vw,26vh)]",
        )}
      >
        {[lang.cta_section.first, lang.cta_section.second].map((lines, i) => {
          const Tag = i === 0 ? "h2" : "p";
          return (
            <Tag
              key={i}
              data-cta-text
              className="motion-safe:col-start-1 motion-safe:row-start-1"
            >
              {lines.map((line) => (
                // Each row is a mask: the line rises in inside the row, and
                // the row rolls up to swap texts (nested, so they never clash)
                <span key={line} className="block overflow-clip">
                  <span data-cta-roll className="block">
                    <span data-cta-line className="block">
                      {line}
                    </span>
                  </span>
                </span>
              ))}
            </Tag>
          );
        })}
      </div>
    </div>
  );
}
