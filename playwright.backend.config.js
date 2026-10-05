import { defineConfig } from "@playwright/test";
import { getTestDatabaseUrl } from "./apps/server/database/config.js";

process.env.API_BASE_URL = "http://localhost:5015";
const engineOnly = process.argv.includes("--project=engine");
export default defineConfig({
  testDir: "./tests",
  workers: 1,
  fullyParallel: false,
  timeout: 30000,
  globalSetup: engineOnly ? undefined : "./tests/globalSetup.js",
  projects: [
    { name: "engine", testMatch: /engine\/.*\.spec\.js$/ },
    { name: "api", testMatch: /api\/.*\.spec\.js$/, use: { baseURL: "http://localhost:5015" } },
  ],
  webServer: engineOnly ? undefined : {
    command: "node apps/server/src/server.js",
    url: "http://localhost:5015/api/v1/health",
    reuseExistingServer: false,
    env: { NODE_ENV: "test", PORT: "5015", TEST_DATABASE_URL: getTestDatabaseUrl(), COOKIE_SECRET: "sql-tests-only-cookie-secret", CLIENT_ORIGIN: "http://localhost:5173" },
  },
});
