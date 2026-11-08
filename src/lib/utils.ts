import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Runs `setup` in a task of its own, after the ones queued before it, and
 * returns its cancel. Below-the-fold animation setup goes through this, so
 * it does not all run inside React's hydration as one long blocking task;
 * call order keeps ScrollTrigger pins in page order.
 */
export function inOwnTask(setup: () => void) {
  const id = setTimeout(setup, 0);
  return () => clearTimeout(id);
}
