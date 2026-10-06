import { query } from "../../lib/db.js";
import { computeBalances } from "./balance.engine.js";
import { suggestTransfers } from "./suggest.engine.js";

export async function loadBalances(groupId, connection) {
  const expenses = await query("SELECT id, paid_by, amount FROM expenses WHERE group_id = ? AND deleted_at IS NULL", [groupId], connection);
  const shares = await query("SELECT s.expense_id, s.user_id, s.share_amount FROM expense_shares s JOIN expenses e ON e.id = s.expense_id WHERE e.group_id = ? AND e.deleted_at IS NULL", [groupId], connection);
  const settlements = await query("SELECT from_user_id, to_user_id, amount, status FROM settlements WHERE group_id = ?", [groupId], connection);
  return computeBalances({ expenses, shares: shares.map(s => ({ expenseId: s.expenseId, userId: s.userId, amount: s.shareAmount })), settlements: settlements.map(s => ({ from: s.fromUserId, to: s.toUserId, amount: s.amount, status: s.status })) });
}

function publicUser(user) {
  if (!user) return user;
  return { id: user.id, name: user.name, avatarUrl: user.avatarUrl, role: user.role };
}

export async function getGroupBalances(groupId, currentUserId) {
  const balances = await loadBalances(groupId);
  const rows = await query("SELECT u.id, u.name, u.avatar_url, m.role FROM group_members m JOIN users u ON u.id = m.user_id WHERE m.group_id = ? AND m.left_at IS NULL", [groupId]);
  const users = Object.fromEntries(rows.map(m => [m.id, m]));
  const myBalance = balances.get(currentUserId) || 0;
  const mine = suggestTransfers(balances)
    .filter(s => s.from === currentUserId || s.to === currentUserId)
    .map(s => ({ from: publicUser(users[s.from]) || { id: s.from }, to: publicUser(users[s.to]) || { id: s.to }, amount: s.amount }));
  const toCollect = mine.filter(s => s.to.id === currentUserId);
  const toPay = mine.filter(s => s.from.id === currentUserId);
  return {
    myBalance,
    members: rows.map(m => publicUser(m)),
    suggestions: mine,
    toCollect,
    toPay,
  };
}

export async function getGroupStats(groupId, { from, to } = {}) {
  const clauses = ["group_id = ?", "deleted_at IS NULL"];
  const values = [groupId];
  if (from) { clauses.push("expense_date >= ?"); values.push(new Date(from)); }
  if (to) { clauses.push("expense_date <= ?"); values.push(new Date(to)); }
  const expenses = await query(`SELECT amount, category, expense_date FROM expenses WHERE ${clauses.join(" AND ")}`, values);
  const byCategory = {};
  const byMonth = {};
  let totalSpend = 0;
  for (const expense of expenses) {
    totalSpend += expense.amount;
    byCategory[expense.category] = (byCategory[expense.category] || 0) + expense.amount;
    const month = expense.expenseDate.toISOString().slice(0, 7);
    byMonth[month] = (byMonth[month] || 0) + expense.amount;
  }
  return { totalSpend, byCategory: Object.entries(byCategory).map(([category, amount]) => ({ category, amount })), byMonth: Object.entries(byMonth).map(([month, amount]) => ({ month, amount })).sort((a, b) => a.month.localeCompare(b.month)) };
}
