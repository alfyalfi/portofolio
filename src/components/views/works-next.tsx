import { bebasNeue } from "@/common/font";
import { arrowPath } from "@/components/svg/arrow";
import { workPictures } from "@/data/works";
import { cn } from "@/lib/utils";
import Image from "next/image";

type WorksNextProps = {
  lang: {
    expertise_section: { title: string };
    works_section: { next: string; up_next: string; teaser: string[] };
  };
};

// shortcut: the wall reuses the work images, swap in its own pictures once they
// exist
const pictures = workPictures;

/** A masked line for works.tsx to roll, CSS-generated to stay out of the page text. */
const Line = ({ text }: { text: string }) => (
  <span className="block overflow-clip">
    <span
      data-line
      data-text={text}
      className="block before:content-[attr(data-text)]"
    />
  </span>
);

/**
 * The end of the works track: a full screen with the lime card in its middle.
 * works.tsx plays it: --grow opens the card to the whole screen, [data-big]
 * rolls in, the [data-wall] columns cross over the text, every other one the
 * opposite way, and --shrink closes the clip in from every side as the panel
 * leaves. With reduced motion it stays a card. On desktop it starts one card gap
 * after the last work, reaching back over the empty side of its own screen.
 */
export function WorksNext({ lang }: WorksNextProps) {
  const { next, up_next: upNext, teaser } = lang.works_section;
  const expertise = lang.expertise_section.title;

  return (
    <div
      data-stage
      className="pointer-events-none relative z-10 -ml-4 flex h-lvh w-screen shrink-0 items-center justify-center [--card-h:calc(var(--card-w)*15/11)] [--card-w:clamp(15.625rem,80vw,26.25rem)] md:-ml-[calc(50vw-var(--card-w)/2)] md:h-full md:[--card-w:clamp(15.625rem,40vmin,26.25rem)]"
    >
      <p className="sr-only">{teaser.join(" ")}</p>

      {/* Under the panel, which swallows it on the way to full screen */}
      <div className="relative h-(--card-h) w-(--card-w)">
        <p
          data-caption
          className="absolute top-full mt-3 flex items-center gap-[0.2em] text-[16vw] leading-none tracking-tight text-white md:left-[-35%] md:text-[6vw]"
        >
          {next}
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="size-[0.8em]"
          >
            <path d={arrowPath} />
          </svg>
        </p>
      </div>

      {/* The card is a window on a full-screen panel: the clip runs from the
          card's edges to the screen's, and the card's text rides those edges.
          A pixel over the stage, which can stop a fraction off the screen. */}
      <div
        data-panel
        className="pointer-events-auto absolute -inset-px bg-sky-400 text-[#0a0a0a] [--edge-x:calc((50%-var(--card-w)/2)*(1-var(--grow))+15%*var(--shrink))] [--edge-y:calc((50%-var(--card-h)/2)*(1-var(--grow))+15%*var(--shrink))] [--grow:0] [--shrink:0] [clip-path:inset(var(--edge-y)_var(--edge-x))]"
      >
        <div
          aria-hidden="true"
          className="absolute flex flex-col justify-between p-5 inset-[var(--edge-y)_var(--edge-x)]"
        >
          <div
            data-card
            className={cn(
              bebasNeue.className,
              "text-[calc(var(--card-w)*0.15)] pt-8 leading-[0.8] uppercase",
            )}
          >
            {teaser.map((line) => (
              <Line key={line} text={line} />
            ))}
          </div>
          <div data-foot className="flex justify-between pb-4">
            <Line text={upNext} />
            <Line text={expertise} />
          </div>
        </div>

        <div data-big aria-hidden="true" className="invisible absolute inset-0">
          <div className="flex h-full items-center justify-center">
            <div
              data-big-text
              className={cn(
                bebasNeue.className,
                "text-center text-[14vw] leading-[0.9] text-nowrap uppercase md:text-[min(14vw,23vh)]",
              )}
            >
              {teaser.map((line) => (
                <Line key={line} text={line} />
              ))}
            </div>
          </div>
        </div>

        {/* Below the screen, over the text. Reduced motion never brings it up,
            so display: none keeps it from downloading; phones take two columns.
            Each column starts further along the pictures, so neighbours differ. */}
        <div
          data-wall
          aria-hidden="true"
          className="absolute inset-x-0 top-full grid grid-cols-2 gap-x-12 px-4 motion-reduce:hidden md:grid-cols-4 md:gap-x-[12vw] md:px-8"
        >
          {[0, 1, 2, 3].map((column) => (
            <div
              key={column}
              data-column
              className={cn(
                "flex flex-col gap-y-10 md:gap-y-[10vh]",
                column > 1 && "max-md:hidden",
                // Wider in the middle, for the text to show between them
                column === 1 && "md:relative md:left-[-3vw]",
                column === 2 && "md:relative md:left-[3vw]",
              )}
            >
              {[0, 1, 2, 3].map((row) => (
                <div key={row} className="relative aspect-11/15">
                  <Image
                    src={pictures[(column * 4 + row) % pictures.length]}
                    alt=""
                    fill
                    sizes="(max-width: 767px) 40vw, 15vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
