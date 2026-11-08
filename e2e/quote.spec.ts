import { expect, test, type Page } from "@playwright/test";

const quote = "the possibilities are endless, the only limit is my imagination";

const text = (page: Page) => page.locator("[data-quote]");

/** Characters resting in the line (no leftover offset or tilt). */
const settledChars = (page: Page) =>
  text(page)
    .locator("span:not(:has(span))")
    .evaluateAll(
      (chars) =>
        chars.filter((char) =>
          ["none", "matrix(1, 0, 0, 1, 0, 0)"].includes(getComputedStyle(char).transform),
        ).length,
    );

/** Horizontal distance between the closing ✦ and the middle of the screen. */
const starOffCenter = (page: Page) =>
  page.locator("[data-star]").evaluate((star) => {
    const rect = star.getBoundingClientRect();
    return Math.round(Math.abs(rect.left + rect.width / 2 - innerWidth / 2));
  });

const scrollIntoQuote = (page: Page, px: number) =>
  text(page).evaluate((el, px) => {
    const top = el.closest("section")!.getBoundingClientRect().top + scrollY;
    window.scrollTo(0, top + px);
  }, px);

test("the text pins, drops into line and finishes with the ✦ centered", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByTestId("intro-curtain")).toBeHidden();

  // Screen readers get the whole sentence from a hidden copy; the split
  // letters are aria-hidden (an aria-label is not allowed on a <p>)
  await expect(text(page)).toHaveAttribute("aria-hidden", "true");
  await expect(text(page)).not.toHaveAttribute("aria-label", /./);
  await expect(page.locator("p.sr-only", { hasText: quote })).toHaveCount(1);

  const total = await text(page).locator("span:not(:has(span))").count();
  await scrollIntoQuote(page, 0);
  await expect.poll(() => settledChars(page)).toBe(0);

  // The pin lasts 5000px; by its end every character has landed and the
  // lime ✦ sits in the middle of the screen
  await scrollIntoQuote(page, 5000);
  await expect.poll(() => settledChars(page)).toBe(total);
  await expect.poll(() => starOffCenter(page)).toBeLessThanOrEqual(2);
});

test("with reduced motion it is plain wrapped text", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  await expect(text(page)).toContainText(quote);
  await expect(text(page)).toHaveCSS("white-space", "normal");
  // Not split (SplitText marks its span pieces aria-hidden) and not pinned
  await expect(text(page).locator("span[aria-hidden]")).toHaveCount(0);
  await expect(page.locator("section:has([data-quote]) .pin-spacer")).toHaveCount(0);
});
