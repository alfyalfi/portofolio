import { expect, test, type Page } from "@playwright/test";

// The about photo appears through RevealImage's WebGL pixel grid, then the
// <img> takes over again: CSS scales the canvas bitmap (blurry), while the
// browser draws the <img> sharp. No WebGL error may be thrown (a lost
// context after a StrictMode remount used to throw on every frame).
test("about photo reveals through WebGL, then shows the sharp original", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(page.getByTestId("intro-curtain")).toBeHidden();

  const photo = page.locator("#about img:visible");
  await photo.scrollIntoViewIfNeeded();
  await expect(photo.locator("xpath=following-sibling::canvas[1]")).toHaveCSS(
    "opacity",
    "0",
  );
  await expect(photo).toHaveCSS("opacity", "1");
  // Sized for the screen by the image optimizer, at quality 90 (the source
  // is already compressed by hand)
  expect(
    await photo.evaluate((img: HTMLImageElement) => img.currentSrc),
  ).toMatch(/achmad-daniel\.webp.*q=90/);
  expect(errors).toEqual([]);
});

const video = (page: Page) => page.locator("#about video");
const box = (page: Page) => video(page).locator("..");
const scale = (page: Page) =>
  box(page).evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).a);

/** Scrolls to where the video's block sits a number of screens past the top. */
async function scrollBlock(page: Page, screens: number) {
  await video(page).evaluate((el, screens) => {
    const block = el.parentElement!.parentElement!.parentElement!;
    const { top } = block.getBoundingClientRect();
    window.scrollTo(0, top + scrollY + innerHeight * screens);
  }, screens);
}

test("the about video is silent, loops and has no controls", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.getByTestId("intro-curtain")).toBeHidden();

  const element = video(page);
  await expect(element).toHaveJSProperty("muted", true);
  await expect(element).toHaveJSProperty("loop", true);
  await expect(element).toHaveJSProperty("controls", false);
  // Nothing downloads with the page
  await expect(element).toHaveJSProperty("preload", "none");
});

test("the about video grows in place, anchored to the bottom right (desktop)", async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, "desktop holds it still");
  await page.goto("/");
  await expect(page.getByTestId("intro-curtain")).toBeHidden();

  const { width, height } = page.viewportSize()!;
  const corner = async () => {
    const { x, y, width: w, height: h } = (await box(page).boundingBox())!;
    return { right: Math.round(x + w), bottom: Math.round(y + h) };
  };
  const anchored = { right: width - 32, bottom: height - 32 };

  await scrollBlock(page, 0);
  await expect.poll(() => scale(page)).toBeCloseTo(0.3, 2);
  expect(await corner()).toEqual(anchored);

  await scrollBlock(page, 0.5);
  await expect.poll(() => scale(page)).toBeCloseTo(0.65, 2);
  expect(await corner()).toEqual(anchored);

  await scrollBlock(page, 1);
  await expect.poll(() => scale(page)).toBe(1);
  expect(await corner()).toEqual(anchored);

  // Scrolling back shrinks it
  await scrollBlock(page, 0.5);
  await expect.poll(() => scale(page)).toBeCloseTo(0.65, 2);
});

test("the about video sits under the photo at full size (mobile)", async ({
  page,
  isMobile,
}) => {
  test.skip(!isMobile, "phones show it plain");
  await page.goto("/");
  await expect(page.getByTestId("intro-curtain")).toBeHidden();

  const photo = (await page.locator("#about img:visible").boundingBox())!;
  const { y } = (await box(page).boundingBox())!;
  expect(y).toBeGreaterThan(photo.y + photo.height);

  await scrollBlock(page, -0.5);
  await expect(video(page)).toBeInViewport();
  expect(await scale(page)).toBe(1);
});

test.describe("reduced motion", () => {
  test.use({ reducedMotion: "reduce" });

  test("about photo stays a plain image", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByTestId("intro-curtain")).toBeHidden();
    const photo = page.locator("#about img:visible");
    await photo.scrollIntoViewIfNeeded();
    await expect(photo).toHaveCSS("opacity", "1");
  });

  test("the about video stays full size and still", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByTestId("intro-curtain")).toBeHidden();

    await scrollBlock(page, 0);
    await expect.poll(() => scale(page)).toBe(1);
    await expect(video(page)).toHaveJSProperty("preload", "metadata");
    await expect(video(page)).toHaveJSProperty("paused", true);
  });
});
