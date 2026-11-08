import { expect, test, type Page } from "@playwright/test";
import { expertise } from "../src/data/expertise";

/** How many entries still sit shifted down inside their line mask. */
const shiftedEntries = (page: Page) =>
  page
    .locator("ul:has([data-tech]) li > span")
    .evaluateAll(
      (els) =>
        els.filter((el) => !["none", "matrix(1, 0, 0, 1, 0, 0)"].includes(getComputedStyle(el).transform))
          .length,
    );

/** Scroll the list into view and wait for the line reveal to finish. */
async function revealList(page: Page) {
  await page.locator("ul:has([data-tech])").evaluate((ul) => {
    window.scrollTo(0, ul.getBoundingClientRect().top + scrollY - innerHeight / 3);
  });
  await expect.poll(() => shiftedEntries(page)).toBe(0);
}

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await expect(page.getByTestId("intro-curtain")).toBeHidden();
});

test("lists every expertise entry from the data file, in order", async ({ page }) => {
  await expect(page.locator("[data-tech]")).toHaveText(expertise);
});

test("entries rise out of their line masks once the list is in view", async ({ page }) => {
  // Before the list is reached, every entry waits below its mask
  expect(await shiftedEntries(page)).toBe(expertise.length);
  await revealList(page);
});

test('a "/" shows only between entries on the same line', async ({ page }) => {
  const misplaced = await page.locator("ul:has([data-tech])").evaluate((ul) => {
    const right = ul.getBoundingClientRect().right;
    const items = [...ul.children];
    return items.flatMap((li, index) => {
      const next = items[index + 1];
      const sameLine =
        !!next && Math.round(next.getBoundingClientRect().top) === Math.round(li.getBoundingClientRect().top);
      // Visible = not pushed past the list's clipped right edge
      const visible = li.querySelector("[aria-hidden]")!.getBoundingClientRect().left < right - 1;
      return visible === sameLine ? [] : [li.textContent];
    });
  });
  expect(misplaced).toEqual([]);
});

test("the star next to the title draws in and fills once in view", async ({ page }) => {
  const star = page.locator("h2:has-text('Expertise') svg path");
  // Not drawn before the section is reached
  expect(await star.evaluate((el) => getComputedStyle(el).fillOpacity)).toBe("0");

  await star.evaluate((el) => {
    window.scrollTo(0, el.closest("section")!.getBoundingClientRect().top + scrollY);
  });
  await expect.poll(() => star.evaluate((el) => getComputedStyle(el).fillOpacity)).toBe("1");
});

test("hovering an entry turns only that entry lime (desktop)", async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, "touch screens have no hover");
  await revealList(page);
  const items = page.locator("[data-tech]");
  const color = (index: number) =>
    items.nth(index).evaluate((el) => getComputedStyle(el).color);

  const dimmed = await color(1);
  await items.nth(0).hover();
  await expect.poll(() => color(0)).not.toBe(dimmed);
  expect(await color(1)).toBe(dimmed);
});

test("the line crossing the middle of the screen lights up (mobile)", async ({
  page,
  isMobile,
}) => {
  test.skip(!isMobile, "hover screens use hover instead");
  await revealList(page);
  const item = page.locator("[data-tech]").nth(6);
  await item.evaluate((el) => {
    const rect = el.closest("li")!.getBoundingClientRect();
    window.scrollTo(0, rect.top + scrollY + rect.height / 2 - innerHeight / 2);
  });

  await expect(item).toHaveAttribute("data-active");
  // Only that one line is lit, not the lines around it
  const activeTops = await page
    .locator("[data-tech][data-active]")
    .evaluateAll((els) => [...new Set(els.map((el) => Math.round(el.getBoundingClientRect().top)))]);
  expect(activeTops).toHaveLength(1);
});
