import { expect, test } from "@playwright/test";

const siteUrl = "https://achmaddaniel.nielcode.com";
const escapedSiteUrl = siteUrl.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

test.describe("one URL for every language", () => {
  test("an English browser gets English at /", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
  });

  test("an Indonesian browser gets Indonesian at the same URL", async ({
    browser,
  }) => {
    const context = await browser.newContext({ locale: "id-ID" });
    const page = await context.newPage();
    await page.goto("/");
    await expect(page).toHaveURL(/\/$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "id");
    await context.close();
  });

  test("bots that send no usable language get the default (English)", async ({
    request,
  }) => {
    for (const acceptLanguage of ["", "*"]) {
      const res = await request.get("/", {
        headers: { "accept-language": acceptLanguage },
      });
      expect(res.status()).toBe(200);
      expect(await res.text()).toContain('<html lang="en"');
    }
  });

  test("old /id and /en links move to / and keep their language", async ({
    page,
  }) => {
    await page.goto("/id");
    await expect(page).toHaveURL(/\/$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "id");

    await page.goto("/en");
    await expect(page).toHaveURL(/\/$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
  });

  test("the ID button switches the language in place", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByTestId("intro-curtain")).toBeHidden();

    await page.getByRole("button", { name: "ID", exact: true }).click();
    await expect(page.locator("html")).toHaveAttribute("lang", "id");
    await expect(page).toHaveURL(/\/$/);
    await expect(
      page.getByRole("button", { name: "ID", exact: true }),
    ).toHaveAttribute("aria-pressed", "true");
  });
});

test("home page exposes core SEO tags", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    new RegExp(`^${escapedSiteUrl}/?$`),
  );
  // One URL serves every language, so there are no hreflang alternates
  await expect(page.locator("link[hreflang]")).toHaveCount(0);
  await expect(
    page.locator('meta[property="og:image"]').first(),
  ).toHaveAttribute("content", `${siteUrl}/assets/images/og-image.png`);

  const graph = JSON.parse(
    (await page.locator('script[type="application/ld+json"]').textContent())!,
  )["@graph"];
  expect(graph.map((node: { "@type": string }) => node["@type"])).toEqual([
    "Person",
    "Organization",
    "WebSite",
    "ProfilePage",
    "ItemList",
  ]);
});

test("search and AI crawler files are served", async ({ request }) => {
  const sitemap = await (await request.get("/sitemap.xml")).text();
  expect(sitemap).toContain(`<loc>${siteUrl}/</loc>`);
  expect(sitemap).not.toMatch(/\/(en|id)<\/loc>/);

  expect((await request.get("/robots.txt")).status()).toBe(200);

  const llms = await request.get("/llms.txt");
  expect(llms.status()).toBe(200);
  expect(await llms.text()).toContain("# Achmad Daniel Syahputra");
});

test("the intro ends on its last greeting, kept out of the page text", async ({
  page,
}) => {
  await page.goto("/");
  const curtain = page.getByTestId("intro-curtain");
  await expect(curtain).toHaveText("");

  await expect
    .poll(
      () =>
        curtain
          .locator("[data-greeting]")
          .evaluateAll((words) =>
            words
              .filter((word) => getComputedStyle(word).visibility === "visible")
              .map((word) => word.getAttribute("data-greeting")),
          ),
      { intervals: [100] },
    )
    .toEqual(["Hallo"]);
  await expect(curtain).toBeHidden();
});

test("a language switch opens the curtain without the greetings, once", async ({
  page,
}) => {
  await page.goto("/");
  const curtain = page.getByTestId("intro-curtain");
  const greetings = curtain.locator("[data-greeting]").first().locator("..");
  await expect(greetings).toHaveCSS("display", "grid");
  await expect(curtain).toBeHidden();

  await page.getByRole("button", { name: "ID", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute("lang", "id");
  await expect(greetings).toHaveCSS("display", "none");
  await expect(curtain).toBeHidden();

  // A plain reload after that is a full intro again
  await page.reload();
  await expect(greetings).toHaveCSS("display", "grid");
});

test("Lenis scrolls the page once the intro finishes", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("html.lenis")).toBeAttached();
  await expect(page.getByTestId("intro-curtain")).toBeHidden();
  await expect(page.locator("html.lenis-stopped")).toHaveCount(0);

  await page.mouse.move(200, 400);
  await page.mouse.wheel(0, 400);
  await expect
    .poll(() => page.evaluate(() => window.scrollY))
    .toBeGreaterThan(0);
});
