import mysql from "mysql2/promise";
import { databaseOptions, getTestDatabaseUrl } from "./config.js";

// Never fall back to development configuration for a destructive reset.
getTestDatabaseUrl();
const connection = await mysql.createConnection(databaseOptions({ ...process.env, NODE_ENV: "test" }));
try {
  await connection.beginTransaction();
  for (const table of ["activity_logs", "expense_shares", "expenses", "settlements", "invitations", "group_members", "groups", "sessions", "users"]) {
    await connection.query(`DELETE FROM \`${table}\``);
  }
  await connection.commit();
  console.log("Isolated test database reset.");
} catch (error) {
  await connection.rollback();
  throw error;
} finally {
  await connection.end();
}
