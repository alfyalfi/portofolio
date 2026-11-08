import { expect, test, type Locator, type Page } from "@playwright/test";

// The three roles are sized in vw and must fit on one line at every width
for (const width of [320, 390, 768, 1280, 1440, 1920]) {
  test(`services lines fit at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await expect(page.getByTestId("intro-curtain")).toBeHidden();

    const fits = await page.locator("#services h2").evaluateAll((lines) =>
      lines.map((line) => {
        const { left, right } = line.getBoundingClientRect();
        return left >= 0 && right <= innerWidth;
      }),
    );
    expect(fits).toEqual([true, true, true]);
  });
}

async function openServices(page: Page) {
  await page.goto("/");
  await expect(page.getByTestId("intro-curtain")).toBeHidden();
  await page.evaluate(() => {
    const top =
      document.getElementById("services")!.getBoundingClientRect().top +
      scrollY;
    window.scrollTo(0, top);
  });
}

/** Whether every word of a row has rolled up to its white copy. */
const rolled = (row: Locator) =>
  row.locator("[data-roll]").evaluateAll((words) =>
    words.every((word) => {
      const { m42 } = new DOMMatrix(getComputedStyle(word).transform);
      return Math.abs(m42 + word.getBoundingClientRect().height) < 1;
    }),
  );

test("hovering a role rolls its words and scales in its pictures one by one", async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, "needs a mouse");
  await openServices(page);

  const android = page.getByRole("heading", { name: "ANDROID ENGINEER" });
  const own = page.locator('[data-shot="1"]');
  await expect(own).toHaveCount(5);
  await expect(own.first()).toBeHidden();
  // Scale alone hides them, so they don't fade in
  await expect(own.first()).toHaveCSS("opacity", "1");

  // The white copies stay out of the page text
  await expect(android).toHaveText("ANDROID ENGINEER");
  const copy = await android
    .locator("[data-roll]")
    .first()
    .evaluate((word) => {
      const { color, content } = getComputedStyle(word, "::after");
      return { color, content };
    });
  expect(copy).toEqual({ color: "rgb(255, 255, 255)", content: '"ANDROID"' });

  // Lazy, yet loaded at scale 0 from being near the screen, before any hover
  await expect
    .poll(() =>
      page
        .locator("[data-shot] img")
        .evaluateAll((images) =>
          images.every((image) => (image as HTMLImageElement).naturalWidth > 0),
        ),
    )
    .toBe(true);

  // When each picture starts to grow
  const started = page.evaluate(
    () =>
      new Promise<number[]>((resolve) => {
        const shots = [...document.querySelectorAll('[data-shot="1"]')];
        const times = new Map<Element, number>();
        const tick = (now: number) => {
          for (const shot of shots) {
            if (!times.has(shot) && shot.getBoundingClientRect().width > 0) {
              times.set(shot, now);
            }
          }
          if (times.size === shots.length) resolve([...times.values()]);
          else requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }),
  );

  await android.hover();
  await expect.poll(() => rolled(android)).toBe(true);
  for (const shot of await own.all()) await expect(shot).toBeVisible();
  await expect(page.locator('[data-shot="0"]').first()).toBeHidden();

  const times = await started;
  expect(Math.max(...times) - Math.min(...times)).toBeGreaterThan(200);

  await page.mouse.move(0, 0);
  await expect.poll(() => rolled(android)).toBe(false);
  await expect(own.first()).toBeHidden();

  // Leaving early cancels the pictures still waiting for their turn
  await android.hover();
  await page.mouse.move(0, 0);
  await page.waitForTimeout(1000);
  for (const shot of await own.all()) await expect(shot).toBeHidden();
});

test("the pictures drift toward the cursor while hovered", async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, "needs a mouse");
  await openServices(page);

  const row = page.getByRole("heading", { name: "ANDROID ENGINEER" });
  const box = (await row.boundingBox())!;
  const pictureX = () =>
    page
      .locator("[data-follow]")
      .first()
      .evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).m41);

  await page.mouse.move(box.x + 10, box.y + box.height / 2);
  await expect.poll(pictureX).toBeLessThan(0);

  // Still following once the hover tween has run
  await page.mouse.move(box.x + box.width - 10, box.y + box.height / 2);
  await expect.poll(pictureX).toBeGreaterThan(0);
});

test("reduced motion swaps the row and shows the pictures without moving them", async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, "needs a mouse");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await openServices(page);

  const android = page.getByRole("heading", { name: "ANDROID ENGINEER" });
  await android.hover();
  await expect.poll(() => rolled(android)).toBe(true);

  const shot = page.locator('[data-shot="1"]').first();
  await expect(shot).toBeVisible();
  await expect(shot).toHaveCSS("transform", "none");
  await expect(page.locator("[data-follow]").first()).toHaveCSS(
    "transform",
    "none",
  );
});

test("on touch the middle row rolls and the pictures never load", async ({
  page,
  isMobile,
}) => {
  test.skip(!isMobile, "needs touch");
  await openServices(page);

  const rows = page.locator("#services h2");
  await expect
    .poll(async () => {
      const crossing = await rows.evaluateAll((lines) =>
        lines.map((line) => {
          const { top, bottom } = line.getBoundingClientRect();
          return top <= innerHeight / 2 && bottom >= innerHeight / 2;
        }),
      );
      const done = await Promise.all((await rows.all()).map(rolled));
      return done.join() === crossing.join() && done.includes(true);
    })
    .toBe(true);

  await expect(page.locator("[data-shot]").first()).toBeHidden();
  const widths = await page
    .locator("[data-shot] img")
    .evaluateAll((images) =>
      images.map((image) => (image as HTMLImageElement).naturalWidth),
    );
  expect(Math.max(...widths)).toBe(0);
});
