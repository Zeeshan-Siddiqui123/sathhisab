import { defineConfig, devices } from "@playwright/test";

// Phase 1 is UI-only: no database setup, reset or backend server is needed.
export default defineConfig({
  testDir: "./tests/e2e",
  testMatch: "design-system.spec.ts",
  workers: 1,
  timeout: 30000,
  use: { baseURL: "http://localhost:5180", trace: "retain-on-failure" },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 5"], viewport: { width: 375, height: 812 } } },
  ],
  webServer: {
    command: "npm run dev --workspace=apps/web -- --port 5180 --strictPort",
    url: "http://localhost:5180",
    reuseExistingServer: false,
  },
});
