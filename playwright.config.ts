import { defineConfig, devices } from "@playwright/test";

// E2E_PORT: run on another port when 3000 is taken by a different app
const port = process.env.E2E_PORT ?? "3000";
const baseURL = `http://localhost:${port}`;

export default defineConfig({
  testDir: "./e2e",
  // The intro alone runs for nearly the default 5s wait
  expect: { timeout: 10_000 },
  use: { baseURL, locale: "en-US" },
  projects: [
    { name: "desktop", use: devices["Desktop Chrome"] },
    { name: "mobile", use: devices["Pixel 7"] },
  ],
  webServer: {
    command: `bun dev --port ${port}`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
  },
});
