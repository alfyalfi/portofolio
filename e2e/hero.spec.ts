import { expect, test, type Page } from "@playwright/test";

/** Scroll to a multiple of the viewport height. */
async function scrollToScreens(page: Page, screens: number) {
  await expect
    .poll(() =>
      page.evaluate((screens) => {
        const y = Math.round(screens * window.innerHeight);
        window.scrollTo(0, y);
        return Math.abs(window.scrollY - y);
      }, screens),
    )
    .toBeLessThan(2);
}

/** Where "CREATIVE ✦" + "DEVELOPER" sit, rounded so small subpixel drift counts as centered. */
function heroTitle(page: Page) {
  return page.getByTestId("hero-title").evaluate((el) => {
    const style = getComputedStyle(el);
    const [creative, developer] = [...el.children].map((child) =>
      child.getBoundingClientRect(),
    );
    const left = Math.min(creative.left, developer.left);
    const right = Math.max(creative.right, developer.right);
    const top = Math.min(creative.top, developer.top);
    const bottom = Math.max(creative.bottom, developer.bottom);
    const offCenterX = Math.abs((left + right) / 2 - window.innerWidth / 2);
    const offCenterY = Math.abs((top + bottom) / 2 - window.innerHeight / 2);

    return {
      visible: style.visibility !== "hidden" && Number(style.opacity) > 0.99,
      lines: Math.abs(creative.top - developer.top) < 2 ? 1 : 2,
      centered: offCenterX <= 4 && offCenterY <= 8,
      fits: right - left <= window.innerWidth,
    };
  });
}

async function openHome(page: Page) {
  await page.goto("/");
  // The intro resets scroll to the top on mount and locks Lenis until it finishes
  await expect(page.getByTestId("intro-curtain")).toBeHidden();
}

test.describe("desktop", () => {
  test.skip(({ isMobile }) => isMobile, "desktop layout only");

  test("title merges into one centered line that fits the screen", async ({
    page,
  }) => {
    await openHome(page);
    // 1.5 screens = end of the footer pin, where the hero animation completes
    await scrollToScreens(page, 1.5);
    await expect
      .poll(() => heroTitle(page))
      .toEqual({ visible: true, lines: 1, centered: true, fits: true });
  });

  test("title stays centered after a resize mid-animation", async ({
    page,
  }) => {
    await openHome(page);
    // Resizing triggers a ScrollTrigger refresh while the merge is half done
    await scrollToScreens(page, 0.75);
    await page.setViewportSize({
      width: 1024,
      height: page.viewportSize()!.height,
    });
    await page.waitForTimeout(500);
    await scrollToScreens(page, 1.5);
    await expect
      .poll(() => heroTitle(page))
      .toEqual({ visible: true, lines: 1, centered: true, fits: true });
  });

  test("shrinking to phone width mid-animation switches to the mobile title", async ({
    page,
  }) => {
    // Mobile emulation can't resize its layout viewport, so a desktop context
    // stands in for a phone rotating across the md breakpoint
    await openHome(page);
    await scrollToScreens(page, 0.75);
    await page.setViewportSize({
      width: 390,
      height: page.viewportSize()!.height,
    });
    await page.waitForTimeout(500);
    await scrollToScreens(page, 1.5);
    await expect
      .poll(() => heroTitle(page))
      .toEqual({ visible: true, lines: 2, centered: true, fits: true });
  });
});

test.describe("mobile", () => {
  test.skip(({ isMobile }) => !isMobile, "mobile layout only");

  test("title is hidden at first, then rises to the center as two lines", async ({
    page,
  }) => {
    await openHome(page);
    expect((await heroTitle(page)).visible).toBe(false);

    await scrollToScreens(page, 1.5);
    await expect
      .poll(() => heroTitle(page))
      .toEqual({ visible: true, lines: 2, centered: true, fits: true });
  });
});

/** In percent: the content's scale and opacity, then the shader's opacity. */
function heroDepth(page: Page) {
  return Promise.all([
    page
      .getByTestId("hero-scene")
      .evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).a),
    page
      .getByTestId("hero-scene")
      .evaluate((el) => Number(getComputedStyle(el).opacity)),
    page
      .getByTestId("hero-shader")
      .evaluate((el) => Number(getComputedStyle(el).opacity)),
  ]).then((values) => values.map((n) => Math.round(n * 100)));
}

test("the hero content backs away and fades while the shader only dims", async ({
  page,
}) => {
  await openHome(page);
  await scrollToScreens(page, 1.4);
  expect(await heroDepth(page)).toEqual([100, 100, 100]);

  await scrollToScreens(page, 1.75);
  await expect.poll(() => heroDepth(page)).toEqual([90, 50, 85]);

  await scrollToScreens(page, 2);
  await expect.poll(() => heroDepth(page)).toEqual([80, 0, 70]);

  // Faded out, so the language buttons stop taking clicks
  await scrollToScreens(page, 2.1);
  await expect(page.getByTestId("hero-scene")).toBeHidden();

  // The shader behind it stays full size
  const shaderBox = page.locator("#home canvas").locator("..");
  expect(
    await shaderBox.evaluate((el) => el.getBoundingClientRect().width),
  ).toBe(page.viewportSize()!.width);

  // Scrolling back undoes it
  await scrollToScreens(page, 1.4);
  await expect.poll(() => heroDepth(page)).toEqual([100, 100, 100]);
  await expect(page.getByTestId("hero-scene")).toBeVisible();
});

test("reduced motion keeps the hero still", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await openHome(page);
  await scrollToScreens(page, 2);
  await page.waitForTimeout(300);
  expect(await heroDepth(page)).toEqual([100, 100, 100]);
});

test("hero has no nested scroll containers (no stray scroll indicator)", async ({
  page,
}) => {
  await openHome(page);
  const scrollers = await page.evaluate(() =>
    [...document.querySelectorAll("#home *")]
      .filter((el) => {
        const { overflowX, overflowY } = getComputedStyle(el);
        const scrollable = (o: string) => o === "auto" || o === "scroll";
        return (
          (scrollable(overflowY) && el.scrollHeight > el.clientHeight) ||
          (scrollable(overflowX) && el.scrollWidth > el.clientWidth)
        );
      })
      .map((el) => el.className),
  );
  expect(scrollers).toEqual([]);
});

test("hero has no horizontal overflow", async ({ page }) => {
  await page.goto("/");
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  );
  expect(overflow).toBe(0);
});
