import { expect, test, type Locator, type Page } from "@playwright/test";

const title = (page: Page) =>
  page.getByRole("heading", { name: "Selected works" });
const fill = (page: Page) =>
  title(page).evaluate((el) => getComputedStyle(el).getPropertyValue("--fill"));

async function openHome(page: Page) {
  await page.goto("/");
  await expect(page.getByTestId("intro-curtain")).toBeHidden();
}

test("title fills white with the pinned horizontal scroll (desktop)", async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, "desktop pins the section");
  await openHome(page);

  // The pin lasts as long as the track overflows the viewport
  const { top, distance } = await title(page).evaluate((el) => {
    const section = el.closest("section")!;
    const track = section.querySelector("article")!.parentElement!;
    return {
      top: section.getBoundingClientRect().top + scrollY,
      distance: track.scrollWidth - innerWidth,
    };
  });

  await page.evaluate((y) => window.scrollTo(0, y), top);
  await expect.poll(() => fill(page)).toBe("0%");

  await page.evaluate((y) => window.scrollTo(0, y), top + distance);
  await expect.poll(() => fill(page)).toBe("100%");

  // The track stops with the lime card in the middle of the screen
  const { width, height } = page.viewportSize()!;
  const offCenter = async () => {
    const card = (await page
      .locator("[data-panel] > div")
      .first()
      .boundingBox())!;
    return Math.max(
      Math.abs(card.x + card.width / 2 - width / 2),
      Math.abs(card.y + card.height / 2 - height / 2),
    );
  };
  await expect.poll(offCenter).toBeLessThan(2);
});

/** Scrolls to a share of the last card's scroll: 1 is the end of the section. */
async function scrollStage(page: Page, share: number) {
  await page.locator("[data-stage]").evaluate((stage, share) => {
    const { bottom } = stage.closest("section")!.getBoundingClientRect();
    window.scrollTo(0, bottom + scrollY - innerHeight * (1 + 5 * (1 - share)));
  }, share);
}

const grow = (page: Page) =>
  page
    .locator("[data-panel]")
    .evaluate((el) => getComputedStyle(el).getPropertyValue("--grow"));

test("the last card fills the screen, the wall passes, then it shrinks away", async ({
  page,
}) => {
  await openHome(page);
  const big = page.locator("[data-big]");
  const scale = () =>
    page
      .locator("[data-big-text]")
      .evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).a);

  const shiftY = (locator: Locator) =>
    locator.evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).m42);
  const cardLine = page.locator("[data-card] [data-line]").first();
  // Every line of the big text waits under its mask until its turn
  const waiting = () =>
    page
      .locator("[data-big] [data-line]")
      .evaluateAll((lines) =>
        lines.map(
          (line) => new DOMMatrix(getComputedStyle(line).transform).m42 > 0,
        ),
      );

  await scrollStage(page, 0);
  await expect.poll(() => grow(page)).toBe("0");
  await expect.poll(waiting).toEqual([true, true, true]);

  // The card starts to open first, its text still in place
  await scrollStage(page, 0.05);
  await expect.poll(async () => Number(await grow(page))).toBeGreaterThan(0.05);
  expect(await shiftY(cardLine)).toBe(0);

  // Full screen, the text in, the columns about to set off
  await scrollStage(page, 0.26);
  await expect.poll(() => grow(page)).toBe("1");
  await expect.poll(() => shiftY(cardLine)).toBeLessThan(0);
  await expect.poll(waiting).toEqual([false, false, false]);
  await expect(big).toBeVisible();
  // Up to the edges of the screen, on every side
  await expect
    .poll(() =>
      page.locator("[data-panel]").evaluate((el) => {
        const { left, right, top, bottom } = el.getBoundingClientRect();
        return (
          left <= 0 &&
          right >= innerWidth &&
          top <= 0 &&
          bottom >= innerHeight &&
          getComputedStyle(el).clipPath === "inset(0%)"
        );
      }),
    )
    .toBe(true);

  // The columns cross over the shrinking text, each the opposite way to its
  // neighbour. Waiting above the screen, not a pixel of them shows.
  const down = page.locator("[data-column]").first();
  const up = page.locator("[data-column]").nth(1);
  await expect(down.locator("img")).toHaveCount(4);
  await expect(down.locator("img").last()).not.toBeInViewport();
  await scrollStage(page, 0.5);
  await expect.poll(scale).toBeLessThan(1);
  const [downAt, upAt] = [await shiftY(down), await shiftY(up)];
  await scrollStage(page, 0.7);
  await expect.poll(() => shiftY(down)).toBeGreaterThan(downAt);
  await expect.poll(() => shiftY(up)).toBeLessThan(upAt);
  await expect(page.locator("[data-wall] img").first()).toBeInViewport();

  // The pictures have passed and the text stays, smaller
  await scrollStage(page, 0.91);
  await expect.poll(scale).toBeCloseTo(0.7, 3);
  await expect(big).toBeVisible();
  await expect(down.locator("img").first()).not.toBeInViewport();
  await expect(up.locator("img").last()).not.toBeInViewport();

  // The lime closes in, the same on every side, and the text keeps its size.
  // Still in place at first, so the top edge shows too.
  const panel = page.locator("[data-panel]");
  const sides = () =>
    panel.evaluate((el) =>
      Number(getComputedStyle(el).getPropertyValue("--shrink")),
    );
  const textWidth = async () =>
    (await page.locator("[data-big-text]").boundingBox())!.width;
  const textAtRest = await textWidth();
  await scrollStage(page, 1);
  await expect.poll(sides).toBeCloseTo(0.5, 2);
  expect(await panel.evaluate((el) => getComputedStyle(el).clipPath)).toMatch(
    /^inset\(7\.\d+%\)$/,
  );
  expect((await panel.boundingBox())!.y).toBeCloseTo(-1, 0);

  // Then on up with the page, over the black, as Expertise comes up
  await scrollStage(page, 1.1);
  await expect.poll(sides).toBeCloseTo(1, 2);
  await expect(
    page.getByRole("heading", { name: "Expertise" }),
  ).toBeInViewport();
  await expect(big).toBeVisible();
  expect(await textWidth()).toBeCloseTo(textAtRest, 0);
  await expect(page.getByText("Next", { exact: true })).toBeHidden();
  await expect(page.locator("[data-stage]")).toHaveCSS(
    "background-color",
    "rgb(10, 10, 10)",
  );

  // Scrolling back reverses it all
  await scrollStage(page, 0.9);
  await expect.poll(sides).toBeCloseTo(0, 2);
  await scrollStage(page, 0);
  await expect.poll(() => grow(page)).toBe("0");
  await expect.poll(waiting).toEqual([true, true, true]);
});

test("the last card still plays after crossing the breakpoint (desktop)", async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, "starts wide, then narrows");
  await openHome(page);
  await page.setViewportSize({ width: 600, height: 800 });

  await expect
    .poll(async () => {
      await scrollStage(page, 0.3);
      return grow(page);
    })
    .toBe("1");
  await scrollStage(page, 1.15);
  await expect(
    page.getByRole("heading", { name: "Expertise" }),
  ).toBeInViewport();
});

test("with reduced motion the last card stays a card", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await openHome(page);

  // The section ends at the card, with nothing left to scroll through
  await scrollStage(page, 1);
  await expect(page.getByText("Next", { exact: true })).toBeInViewport();
  expect(await grow(page)).toBe("0");
  await expect(page.locator("[data-big]")).toBeHidden();
  await expect(page.locator("[data-wall]")).toBeHidden();
});

// The big text is sized like the CTA's and must fit in both languages
for (const locale of ["en", "id"]) {
  for (const width of [320, 390, 768, 1024, 1280, 1920]) {
    test(`the last card's text fits at ${width}px (${locale})`, async ({
      page,
      baseURL,
    }) => {
      await page
        .context()
        .addCookies([{ name: "i18nlang", value: locale, url: baseURL }]);
      await page.setViewportSize({ width, height: 800 });
      await openHome(page);

      // Relative to the stage, which waits off screen at the end of the track
      const { left, right } = await page
        .locator("[data-big-text]")
        .evaluate((text) => {
          const stage = text.closest("[data-stage]")!.getBoundingClientRect();
          const { left, right } = text.getBoundingClientRect();
          return { left: left - stage.left, right: right - stage.left };
        });
      expect(left).toBeGreaterThanOrEqual(0);
      expect(right).toBeLessThanOrEqual(width);
    });
  }
}

test("works stack vertically and reveal lime first (mobile)", async ({
  page,
  isMobile,
}) => {
  test.skip(!isMobile, "mobile lists the works vertically");
  await openHome(page);

  // Plain white title (no scroll fill on mobile)
  expect(await fill(page)).toBe("100%");

  // Cards follow each other down the page, nothing scrolls sideways
  const cardTops = await page
    .locator("article")
    .evaluateAll((cards) =>
      cards.map((card) => card.getBoundingClientRect().top),
    );
  expect(cardTops).toEqual([...cardTops].sort((a, b) => a - b));
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth - innerWidth,
    ),
  ).toBe(0);

  // Mid-reveal, the lime panel is ahead of the image (less of it is clipped)
  const card = page.locator("article").first();
  await card.evaluate((el) => {
    window.scrollTo(
      0,
      el.getBoundingClientRect().top + scrollY - innerHeight * 0.65,
    );
  });
  await expect
    .poll(() =>
      card.evaluate((el) => {
        const panel = el.querySelector("[data-reveal-panel]")!;
        const inset = (node: Element) =>
          parseFloat(getComputedStyle(node).clipPath.replace("inset(", "")) ||
          0;
        return inset(panel) < inset(panel.nextElementSibling!);
      }),
    )
    .toBe(true);
});

test("a work's hover image loads on the first hover only (desktop)", async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, "hover only");
  await openHome(page);

  await title(page).evaluate((el) => {
    window.scrollTo(
      0,
      el.closest("section")!.getBoundingClientRect().top + scrollY,
    );
  });
  const figure = page.locator("article figure").first();
  const canvas = figure.locator("canvas");
  // Nothing set up (no WebGL, no hover image download) before a hover
  await expect(canvas).toHaveCSS("opacity", "0");

  const box = (await figure.boundingBox())!;
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, {
    steps: 4,
  });

  // With a GPU the WebGL reveal takes over; on a software renderer (headless
  // Chrome without a GPU) the effect is skipped and the plain image stays
  const hardware = await page.evaluate(() => {
    const gl = document.createElement("canvas").getContext("webgl");
    const info = gl?.getExtension("WEBGL_debug_renderer_info");
    const name = gl
      ? String(gl.getParameter(info?.UNMASKED_RENDERER_WEBGL ?? gl.RENDERER))
      : "";
    return !!gl && !/swiftshader|llvmpipe|software|basic render/i.test(name);
  });
  if (hardware) await expect(canvas).toHaveCSS("opacity", "1");
  else {
    await page.waitForTimeout(1000);
    await expect(canvas).toHaveCSS("opacity", "0");
    await expect(figure.locator("img")).toBeVisible();
  }
});
