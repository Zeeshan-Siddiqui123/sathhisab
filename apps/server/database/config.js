import dotenv from "dotenv";
import { fileURLToPath } from "node:url";

dotenv.config({ path: fileURLToPath(new URL("../.env", import.meta.url)), quiet: true });

export function getTestDatabaseUrl(environment = process.env) {
  if (!environment.TEST_DATABASE_URL) throw new Error("TEST_DATABASE_URL is required for database tests.");
  const test = new URL(environment.TEST_DATABASE_URL);
  const schema = decodeURIComponent(test.pathname.slice(1));
  if (test.protocol !== "mysql:" || !/^[a-zA-Z0-9_]+_test$/.test(schema)) {
    throw new Error("Test database must be MySQL with a schema name ending in _test.");
  }
  const developmentSchema = environment.DB_NAME || "saathhisab";
  if (developmentSchema.toLowerCase() === schema.toLowerCase()) {
    throw new Error("Development and test database names must differ.");
  }
  return test.href;
}

export function databaseOptions(environment = process.env) {
  let options = {
    host: environment.DB_HOST || "localhost",
    port: Number(environment.DB_PORT || 3306),
    user: environment.DB_USER ?? "root",
    password: environment.DB_PASSWORD ?? "",
    database: environment.DB_NAME || "saathhisab",
  };
  if (environment.NODE_ENV === "test") {
    const url = new URL(getTestDatabaseUrl(environment));
    options = { host: url.hostname, port: Number(url.port || 3306), user: decodeURIComponent(url.username), password: decodeURIComponent(url.password), database: decodeURIComponent(url.pathname.slice(1)) };
  }
  if (!/^[a-zA-Z0-9_]+$/.test(options.database)) throw new Error("Invalid database name");
  return { ...options, timezone: "Z", supportBigNumbers: true, bigNumberStrings: true, charset: "utf8mb4" };
}
