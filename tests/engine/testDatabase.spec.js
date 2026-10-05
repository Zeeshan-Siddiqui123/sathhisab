import { test, expect } from "@playwright/test";
import { getTestDatabaseUrl } from "../../apps/server/database/config.js";

test("database reset requires an explicit separate test schema", () => {
  expect(() => getTestDatabaseUrl({})).toThrow("TEST_DATABASE_URL");
  expect(() => getTestDatabaseUrl({ TEST_DATABASE_URL: "mysql://localhost/app" })).toThrow("_test");
  expect(() => getTestDatabaseUrl({
    TEST_DATABASE_URL: "mysql://localhost/app_test",
    DATABASE_URL: "mysql://127.0.0.1/app_test",
  })).toThrow("must differ");
  expect(getTestDatabaseUrl({
    TEST_DATABASE_URL: "mysql://localhost/app_test",
    DATABASE_URL: "mysql://localhost/app",
  })).toBe("mysql://localhost/app_test");
});
