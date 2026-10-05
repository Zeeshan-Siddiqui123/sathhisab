import { execFileSync } from "node:child_process";
import { getTestDatabaseUrl } from "../apps/server/prisma/testDatabase.js";

export default function globalSetup() {
  // Phase 0 tests do not touch MySQL. Explicit configuration enables the DB suite reset.
  if (!process.env.TEST_DATABASE_URL) return;
  getTestDatabaseUrl();
  execFileSync(process.execPath, ["apps/server/prisma/resetTestDb.js"], { stdio: "inherit" });
}
