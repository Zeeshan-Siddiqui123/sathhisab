import mysql from "mysql2/promise";
import { readFile } from "node:fs/promises";
import { databaseOptions } from "./config.js";

const options = databaseOptions();
const { database, ...serverOptions } = options;
const connection = await mysql.createConnection(serverOptions);
try {
  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
  await connection.changeUser({ database });
  const [tables] = await connection.query("SHOW TABLES");
  if (tables.length) {
    console.log(`Database ${database} already contains tables. No schema or data was changed.`);
  } else {
    const sql = await readFile(new URL("./schema.sql", import.meta.url), "utf8");
    for (const statement of sql.replace(/^--.*$/gm, "").split(";").map(s => s.trim()).filter(Boolean)) {
      await connection.query(statement);
    }
    console.log(`Created schema in ${database}.`);
  }
} finally {
  await connection.end();
}
