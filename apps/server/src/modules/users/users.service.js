import { one, query, transaction } from "../../lib/db.js";
import { NotFoundError } from "../../lib/errors.js";

export async function updateProfile(userId, { name, avatarUrl }) {
  return transaction(async connection => {
    if (!await one("SELECT id FROM users WHERE id = ? FOR UPDATE", [userId], connection)) throw new NotFoundError("User not found");
    const columns = ["updated_at = UTC_TIMESTAMP(3)"];
    const values = [];
    if (name !== undefined) { columns.push("name = ?"); values.push(name.trim()); }
    if (avatarUrl !== undefined) { columns.push("avatar_url = ?"); values.push(avatarUrl); }
    await query(`UPDATE users SET ${columns.join(", ")} WHERE id = ?`, [...values, userId], connection);
    return one("SELECT id, name, email, avatar_url, created_at, updated_at FROM users WHERE id = ?", [userId], connection);
  });
}
