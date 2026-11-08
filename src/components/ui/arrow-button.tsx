import { arrowPath, arrowUpRightPath } from "@/components/svg/arrow";
import { cn } from "@/lib/utils";

const Icon = ({ path, className }: { path: string; className: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className={cn("absolute inset-0 m-auto size-[55%]", className)}
  >
    <path d={path} />
  </svg>
);

/**
 * A label and an icon (an arrow by default) in a bright blue square. On the hover/focus
 * of the link around it (`group`), the blue spreads from the square over the
 * whole button, the label rolls up to its copy and a new icon slides in, up and
 * to the right with `upRight`. `reversed` starts from the blue and goes the other
 * way.
 */
export function ArrowButton({
  label,
  icon,
  upRight,
  reversed,
  className,
}: {
  label: string;
  icon?: string;
  upRight?: boolean;
  reversed?: boolean;
  className?: string;
}) {
  const path = icon ?? (upRight ? arrowUpRightPath : arrowPath);

  return (
    <span
      className={cn(
        "relative flex h-[calc(var(--square)+2*var(--gap))] items-center justify-between gap-6 overflow-hidden bg-neutral-900 pr-(--gap) pl-4 text-base leading-normal font-medium tracking-tight text-(--ink) normal-case [--gap:0.375rem] [--square:2.25rem] motion-reduce:**:transition-none md:pl-5 md:text-lg md:[--square:2.75rem]",
        // --ink is the label at rest and the icon that slides in, --paper the
        // other two
        reversed
          ? "[--ink:#0a0a0a] [--paper:#fff]"
          : "[--ink:#fff] [--paper:#0a0a0a]",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "absolute inset-0 bg-sky-400 transition-[clip-path] duration-300 ease-in-out",
          reversed
            ? "[clip-path:inset(0)] group-hover:[clip-path:inset(var(--gap)_var(--gap)_var(--gap)_calc(100%-var(--gap)-var(--square)))] group-focus-visible:[clip-path:inset(var(--gap)_var(--gap)_var(--gap)_calc(100%-var(--gap)-var(--square)))]"
            : "[clip-path:inset(var(--gap)_var(--gap)_var(--gap)_calc(100%-var(--gap)-var(--square)))] group-hover:[clip-path:inset(0)] group-focus-visible:[clip-path:inset(0)]",
        )}
      />

      <span className="relative overflow-hidden">
        <span
          data-text={label}
          className="relative block transition-transform duration-300 ease-in-out group-hover:-translate-y-full group-focus-visible:-translate-y-full after:absolute after:top-full after:left-0 after:text-(--paper) after:content-[attr(data-text)/'']"
        >
          {label}
        </span>
      </span>

      <span
        aria-hidden="true"
        className={cn(
          "relative size-(--square) shrink-0 overflow-hidden transition-colors duration-300 ease-in-out",
          reversed
            ? "bg-[#0a0a0a] group-hover:bg-transparent group-focus-visible:bg-transparent"
            : "group-hover:bg-[#0a0a0a] group-focus-visible:bg-[#0a0a0a]",
        )}
      >
        <Icon
          path={path}
          className={cn(
            "text-(--paper) transition-transform duration-300 ease-in-out group-hover:translate-x-[180%] group-focus-visible:translate-x-[180%]",
            upRight &&
              "group-hover:translate-y-[-180%] group-focus-visible:translate-y-[-180%]",
          )}
        />
        <Icon
          path={path}
          className={cn(
            "translate-x-[-180%] text-(--ink) transition-transform duration-300 ease-in-out group-hover:translate-x-0 group-focus-visible:translate-x-0",
            upRight &&
              "translate-y-[180%] group-hover:translate-y-0 group-focus-visible:translate-y-0",
          )}
        />
      </span>
    </span>
  );
}
