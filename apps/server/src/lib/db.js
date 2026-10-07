import mysql from "mysql2/promise";
import { randomUUID } from "node:crypto";
import { env } from "../config/env.js";
import { databaseOptions } from "../../database/config.js";

export const pool = mysql.createPool({
  ...databaseOptions(env),
  waitForConnections: true,
  connectionLimit: 10,
});
pool.on("connection", connection => {
  connection.query("SET time_zone = '+00:00'");
});

export const newId = randomUUID;

// Keep the public camelCase contract while the SQL schema uses snake_case.
export function mapRow(row) {
  return Object.fromEntries(Object.entries(row).map(([key, value]) => {
    if (["amount", "share_amount", "total"].includes(key) && value !== null) {
      value = Number(value);
      if (!Number.isSafeInteger(value)) throw new RangeError("Database integer exceeds the safe money range");
    }
    if (key === "meta" && typeof value === "string") value = JSON.parse(value);
    return [key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase()), value];
  }));
}

export async function query(sql, values = [], connection = pool) {
  try {
    const [result] = await connection.execute(sql, values);
    return Array.isArray(result) ? result.map(mapRow) : result;
  } catch (error) {
    console.error("Database query failed", {
      code: error.code,
      errno: error.errno,
      sqlState: error.sqlState,
      sqlMessage: error.sqlMessage,
    });
    throw error;
  }
}

export async function one(sql, values = [], connection = pool) {
  return (await query(sql, values, connection))[0] ?? null;
}

export async function transaction(work) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const result = await work(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function checkDatabase() {
  const [rows] = await pool.query("SELECT 1 AS ok");
  return rows?.[0]?.ok === 1;
}

export async function logActivity(connection, { groupId, actorId, action, entityType, entityId = null, meta = null }) {
  await query(
    "INSERT INTO activity_logs (id, group_id, actor_id, action, entity_type, entity_id, meta) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [newId(), groupId, actorId, action, entityType, entityId, meta === null ? null : JSON.stringify(meta)], connection,
  );
}
