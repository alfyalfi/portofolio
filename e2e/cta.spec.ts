import { expect, test, type Page } from "@playwright/test";

const footer = (page: Page) => page.locator("#contact");

/** Scroll to `px` past the top of the quote section (the CTA shares its pin). */
const scrollIntoQuote = (page: Page, px: number) =>
  page.locator("[data-quote]").evaluate((el, px) => {
    window.scrollTo(0, el.closest("section")!.getBoundingClientRect().top + scrollY + px);
  }, px);

/** How many screen corners the quote's ✦ covers. */
const cornersUnderStar = (page: Page) =>
  page.evaluate(() => {
    const star = document.querySelector("[data-star]")!;
    const corners = [
      [1, 1],
      [innerWidth - 2, 1],
      [1, innerHeight - 2],
      [innerWidth - 2, innerHeight - 2],
    ];
    return corners.filter(([x, y]) => star.contains(document.elementFromPoint(x, y))).length;
  });

/** Rows of the first and second CTA text that sit in place (risen in, not rolled away). */
const rowsInPlace = (page: Page) =>
  page.locator("[data-cta-text]").evaluateAll((texts) =>
    texts.map(
      (text) =>
        [...text.querySelectorAll("[data-cta-roll]")].filter((roll) =>
          [roll, roll.firstElementChild!].every((el) =>
            ["none", "matrix(1, 0, 0, 1, 0, 0)"].includes(getComputedStyle(el).transform),
          ),
        ).length,
    ),
  );

test("the ✦ fills the screen, the CTA text appears at once, then swaps", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByTestId("intro-curtain")).toBeHidden();

  // Before the star is full grown the CTA is hidden
  await scrollIntoQuote(page, 6000);
  await expect.poll(() => rowsInPlace(page)).toEqual([0, 0]);

  // Pin: 5000px of slide, 1500px of growing; at its end the first text
  // rises in on its own, with no further scrolling
  await scrollIntoQuote(page, 6550);
  await expect.poll(() => cornersUnderStar(page)).toBe(4);
  await expect(page.locator("[data-cta-text]").first()).toBeInViewport();
  await expect.poll(() => rowsInPlace(page)).toEqual([3, 0]);

  // Back into the grow, the text drops out fast instead of lingering over
  // the shrinking star
  await scrollIntoQuote(page, 6250);
  await expect.poll(() => rowsInPlace(page), { timeout: 600 }).toEqual([0, 0]);
  await scrollIntoQuote(page, 6550);
  await expect.poll(() => rowsInPlace(page)).toEqual([3, 0]);

  // 1500px more: every row has rolled over to the second text
  await scrollIntoQuote(page, 8000);
  await expect.poll(() => rowsInPlace(page)).toEqual([0, 3]);
});

test("the footer stays put while the screen above slides up off it", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByTestId("intro-curtain")).toBeHidden();

  await footer(page).evaluate((el) => {
    window.scrollTo(0, el.getBoundingClientRect().top + scrollY - innerHeight / 2);
  });
  const tops = await footer(page).evaluate((el) => [
    Math.round(el.getBoundingClientRect().top),
    Math.round(el.querySelector("[data-footer-panel]")!.getBoundingClientRect().top),
  ]);
  // Half revealed, yet the panel's top is already at the top of the screen
  expect(tops[0]).toBeGreaterThan(100);
  expect(tops[1]).toBe(0);
});

test("the footer links to email, WhatsApp and the social profiles", async ({ page }) => {
  await page.goto("/");

  await expect(footer(page).getByRole("heading", { level: 2 })).toHaveText(
    "Let's work together",
  );
  await expect(
    footer(page).getByRole("link", { name: "achmaddaniel@nielcode.com" }),
  ).toHaveAttribute(
    "href",
    "mailto:achmaddaniel@nielcode.com?subject=Let's%20work%20together",
  );
  await expect(
    footer(page).getByRole("link", { name: /^\+62 858-1428-7663/ }),
  ).toHaveAttribute("href", "https://wa.me/6285814287663");

  for (const name of ["Instagram", "GitHub", "LinkedIn"]) {
    // The handle is screen-reader-only text, e.g. "Instagram : @achmaddaniel__"
    const link = footer(page).getByRole("link", { name: new RegExp(`^${name} ?:`) });
    await expect(link).toHaveAttribute("target", "_blank");
    await expect(link).toHaveAttribute("rel", /noopener/);
  }
});

test("with reduced motion nothing grows and the CTA texts stack", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  await expect(page.locator("[data-star] path")).not.toHaveAttribute("transform", /./);
  const [first, second] = await page
    .locator("[data-cta-text]")
    .evaluateAll((texts) => texts.map((text) => text.getBoundingClientRect()));
  expect(second.top).toBeGreaterThanOrEqual(first.bottom);
});
