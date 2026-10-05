import bcrypt from "bcrypt";
import { pool, query, one, transaction, newId } from "../src/lib/db.js";

try {
  const passwordHash = await bcrypt.hash("password123", 12);
  await transaction(async connection => {
    if ((await one("SELECT COUNT(*) AS total FROM users", [], connection)).total) {
      throw new Error("Seed requires an empty database. Existing data was preserved.");
    }
    const ids = [newId(), newId(), newId()];
    for (const [index, name] of ["Zeeshan", "Ali", "Ahmed"].entries()) {
      await query("INSERT INTO users (id, name, email, password_hash) VALUES (?, ?, ?, ?)", [ids[index], name, `${name.toLowerCase()}@example.com`, passwordHash], connection);
    }
    const groupId = newId();
    await query("INSERT INTO `groups` (id, name, type, created_by) VALUES (?, ?, 'FLAT', ?)", [groupId, "Gulshan Flat 402", ids[0]], connection);
    for (const [index, id] of ids.entries()) {
      await query("INSERT INTO group_members (id, group_id, user_id, role) VALUES (?, ?, ?, ?)", [newId(), groupId, id, index === 0 ? "OWNER" : "MEMBER"], connection);
    }
    for (const [title, amount, payer, category] of [["Monthly Grocery", 600000, ids[0], "GROCERY"], ["StormFiber Internet Bill", 300000, ids[1], "INTERNET"]]) {
      const expenseId = newId();
      await query("INSERT INTO expenses (id, group_id, title, amount, paid_by, category, split_method, expense_date, created_by) VALUES (?, ?, ?, ?, ?, ?, 'EQUAL', UTC_DATE(), ?)", [expenseId, groupId, title, amount, payer, category, payer], connection);
      for (const id of ids) await query("INSERT INTO expense_shares (id, expense_id, user_id, share_amount) VALUES (?, ?, ?, ?)", [newId(), expenseId, id, amount / 3], connection);
    }
  });
  console.log("Demo seed completed.");
} finally {
  await pool.end();
}
