import { defineConfig, devices } from "@playwright/test";
import { getTestDatabaseUrl } from "./apps/server/prisma/testDatabase.js";

const testDatabaseUrl = process.env.TEST_DATABASE_URL
  ? getTestDatabaseUrl()
  : "mysql://unconfigured:unconfigured@127.0.0.1:1/saathhisab_test";

export default defineConfig({
  testDir: "./tests",
  globalSetup: "./tests/globalSetup.js",
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  timeout: 30000,
  use: {
    baseURL: process.env.BASE_URL || "http://localhost:5173",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "engine",
      testMatch: /tests\/engine\/.*\.spec\.js$/,
      use: {},
    },
    {
      name: "api",
      testMatch: /tests\/api\/.*\.spec\.js$/,
      use: {
        baseURL: process.env.API_BASE_URL || "http://localhost:5000",
      },
    },
    {
      name: "chromium",
      testMatch: /tests\/e2e\/.*\.spec\.ts$/,
      use: {
        ...devices["Desktop Chrome"],
      },
    },
    {
      name: "mobile-chrome",
      testMatch: /tests\/e2e\/.*\.spec\.ts$/,
      use: {
        ...devices["Pixel 5"],
        viewport: { width: 375, height: 812 },
      },
    },
  ],
  webServer: [
    {
      command: "npm run dev:server",
      port: 5000,
      reuseExistingServer: false,
      env: {
        PORT: "5000",
        NODE_ENV: "test",
        DATABASE_URL: testDatabaseUrl,
        COOKIE_SECRET: "phase-zero-tests-only-cookie-secret",
        CLIENT_ORIGIN: "http://localhost:5173",
      },
    },
    {
      command: "npm run dev:web",
      port: 5173,
      reuseExistingServer: false,
    },
  ],
});
