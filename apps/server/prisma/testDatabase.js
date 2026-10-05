import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

dotenv.config({ path: fileURLToPath(new URL("../.env", import.meta.url)), quiet: true });

/** Resolve only an explicitly configured, separate test schema; never fall back to DATABASE_URL. */
export function getTestDatabaseUrl(environment = process.env) {
  if (!environment.TEST_DATABASE_URL) {
    throw new Error("TEST_DATABASE_URL is required for database tests.");
  }
  const test = new URL(environment.TEST_DATABASE_URL);
  const schema = decodeURIComponent(test.pathname.slice(1));
  if (test.protocol !== "mysql:" || !/^[a-zA-Z0-9_]+_test$/.test(schema)) {
    throw new Error("Test database must be MySQL with a schema name ending in _test.");
  }
  if (environment.DATABASE_URL) {
    const development = new URL(environment.DATABASE_URL);
    if (decodeURIComponent(development.pathname.slice(1)).toLowerCase() === schema.toLowerCase()) {
      throw new Error("Development and test database names must differ.");
    }
  }
  return test.href;
}
