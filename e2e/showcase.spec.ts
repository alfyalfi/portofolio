import { expect, test, type Page } from "@playwright/test";

const stage = (page: Page) => page.locator("[data-showcase] > div");

/** How close each card is: 0 is out of sight, 1 at full size. */
const closeness = (page: Page) =>
  page
    .locator("[data-fly]")
    .evaluateAll((cards) =>
      cards.map((card) =>
        Number(getComputedStyle(card).getPropertyValue("--s")),
      ),
    );

const onScreen = async (page: Page) =>
  (await closeness(page)).filter((card) => card > 0.02).length;

/** Screens past the moment the quote reaches the top and pins. */
async function scrollPastPin(page: Page, screens: number) {
  await page.locator("[data-showcase]").evaluate((section, screens) => {
    const { bottom } = section.getBoundingClientRect();
    window.scrollTo(0, bottom + scrollY + innerHeight * screens);
  }, screens);
}

test("the cards pass, and the quote comes in before the last one leaves", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.getByTestId("intro-curtain")).toBeHidden();
  await expect(stage(page)).toBeHidden();

  await scrollPastPin(page, -2);
  await expect.poll(() => onScreen(page)).toBeGreaterThan(2);

  // The quote is pinned, its text on the way in, with cards still on screen
  const quote = page.locator("[data-quote]");
  const shift = () =>
    quote.evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).m41);
  await scrollPastPin(page, 0.5);
  await expect.poll(shift).toBeLessThan(-100);
  await expect.poll(() => onScreen(page)).toBeGreaterThan(1);

  // All gone, and the layer with them
  await scrollPastPin(page, 1.7);
  await expect.poll(() => onScreen(page)).toBe(0);
  await expect(stage(page)).toBeHidden();

  // Back up, they return
  await scrollPastPin(page, -2);
  await expect.poll(() => onScreen(page)).toBeGreaterThan(2);
});

test.describe("reduced motion", () => {
  test.use({ reducedMotion: "reduce" });

  test("the section is skipped", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByTestId("intro-curtain")).toBeHidden();
    await expect(page.locator("[data-showcase]")).toBeHidden();
  });
});
