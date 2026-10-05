import { one, query, newId, transaction, logActivity } from "../../lib/db.js";
import { NotFoundError, ForbiddenError, BadRequestError } from "../../lib/errors.js";
import { splitEqual, validateCustomSplit } from "../balances/balance.engine.js";

const expenseSelect = `SELECT e.*, p.name AS payer_name, p.avatar_url AS payer_avatar_url, c.name AS creator_name
  FROM expenses e JOIN users p ON p.id = e.paid_by JOIN users c ON c.id = e.created_by`;

async function formatExpense(e, connection) {
  const shares = await query("SELECT s.id, s.user_id, s.share_amount, u.name, u.avatar_url FROM expense_shares s JOIN users u ON u.id = s.user_id WHERE s.expense_id = ? ORDER BY s.id", [e.id], connection);
  return {
    id: e.id, groupId: e.groupId, title: e.title, amount: e.amount, paidBy: e.paidBy,
    payer: { id: e.paidBy, name: e.payerName, avatarUrl: e.payerAvatarUrl },
    category: e.category, splitMethod: e.splitMethod, expenseDate: e.expenseDate, note: e.note,
    receiptUrl: e.receiptUrl, createdBy: e.createdBy, creator: { id: e.createdBy, name: e.creatorName },
    createdAt: e.createdAt, updatedAt: e.updatedAt,
    shares: shares.map(s => ({ id: s.id, userId: s.userId, shareAmount: s.shareAmount, user: { id: s.userId, name: s.name, avatarUrl: s.avatarUrl } })),
  };
}

async function readExpense(groupId, expenseId, connection) {
  const expense = await one(`${expenseSelect} WHERE e.id = ? AND e.group_id = ? AND e.deleted_at IS NULL`, [expenseId, groupId], connection);
  if (!expense) throw new NotFoundError("Expense not found");
  return formatExpense(expense, connection);
}

async function validateMembers(groupId, paidBy, participants, connection) {
  const rows = await query("SELECT user_id FROM group_members WHERE group_id = ? AND left_at IS NULL", [groupId], connection);
  const ids = new Set(rows.map(m => m.userId));
  if (paidBy && !ids.has(paidBy)) throw new BadRequestError("Payer is not an active member of this group");
  for (const id of participants || []) {
    if (!ids.has(id)) throw new BadRequestError(`Participant ${id} is not an active member of this group`);
  }
}

function buildShares(amount, method, participants, customShares) {
  if (!Number.isSafeInteger(amount) || amount <= 0) throw new BadRequestError("Amount must be a positive integer in paisa");
  if (!participants.length || new Set(participants).size !== participants.length) throw new BadRequestError("Participants must be unique and non-empty");
  if (method === "EQUAL") return splitEqual(amount, participants);
  if (!customShares?.length) throw new BadRequestError("Custom split requires share amounts for each participant");
  if (customShares.length !== participants.length || new Set(customShares.map(s => s.userId)).size !== participants.length || customShares.some(s => !participants.includes(s.userId))) {
    throw new BadRequestError("Custom shares must match participants");
  }
  validateCustomSplit(amount, customShares);
  return customShares;
}

async function saveShares(connection, expenseId, shares) {
  for (const share of shares) {
    await query("INSERT INTO expense_shares (id, expense_id, user_id, share_amount) VALUES (?, ?, ?, ?)", [newId(), expenseId, share.userId, share.amount], connection);
  }
}

export async function createExpense(groupId, actorId, data) {
  return transaction(async connection => {
    await one("SELECT id FROM `groups` WHERE id = ? FOR UPDATE", [groupId], connection);
    if (data.idempotencyKey) {
      const existing = await one(`${expenseSelect} WHERE e.group_id = ? AND e.created_by = ? AND e.idempotency_key = ?`, [groupId, actorId, data.idempotencyKey], connection);
      if (existing) return formatExpense(existing, connection);
    }
    const { title, amount, paidBy, category = "OTHER", splitMethod, expenseDate, participants, shares, note } = data;
    await validateMembers(groupId, paidBy, participants, connection);
    const sharesData = buildShares(amount, splitMethod, participants, shares);
    const id = newId();
    await query("INSERT INTO expenses (id, group_id, title, amount, paid_by, category, split_method, expense_date, note, created_by, idempotency_key) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [id, groupId, title.trim(), amount, paidBy, category, splitMethod, new Date(expenseDate), note?.trim() || null, actorId, data.idempotencyKey || null], connection);
    await saveShares(connection, id, sharesData);
    await logActivity(connection, { groupId, actorId, action: "EXPENSE_CREATED", entityType: "EXPENSE", entityId: id, meta: { title: title.trim(), amount, paidBy, splitMethod } });
    return readExpense(groupId, id, connection);
  });
}

export async function listExpenses(groupId, { page = 1, limit = 20, category, paidBy, from, to, search } = {}) {
  const clauses = ["e.group_id = ?", "e.deleted_at IS NULL"];
  const values = [groupId];
  if (category) { clauses.push("e.category = ?"); values.push(category); }
  if (paidBy) { clauses.push("e.paid_by = ?"); values.push(paidBy); }
  if (from) { clauses.push("e.expense_date >= ?"); values.push(new Date(from)); }
  if (to) { clauses.push("e.expense_date <= ?"); values.push(new Date(to)); }
  if (search) { clauses.push("e.title LIKE ?"); values.push(`%${search}%`); }
  const where = clauses.join(" AND ");
  const { total } = await one(`SELECT COUNT(*) AS total FROM expenses e WHERE ${where}`, values);
  const expenses = await query(`${expenseSelect} WHERE ${where} ORDER BY e.expense_date DESC, e.created_at DESC, e.id DESC LIMIT ? OFFSET ?`, [...values, String(limit), String((page - 1) * limit)]);
  return { data: await Promise.all(expenses.map(e => formatExpense(e))), meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
}

export const getExpense = (groupId, expenseId) => readExpense(groupId, expenseId);

export async function updateExpense(groupId, expenseId, actorId, actorRole, data) {
  return transaction(async connection => {
    await one("SELECT id FROM `groups` WHERE id = ? FOR UPDATE", [groupId], connection);
    const existing = await readExpense(groupId, expenseId, connection);
    if (existing.createdBy !== actorId && actorRole !== "OWNER") throw new ForbiddenError("Only the expense creator or a group owner can edit this expense");
    const amount = data.amount ?? existing.amount;
    const splitMethod = data.splitMethod ?? existing.splitMethod;
    const paidBy = data.paidBy ?? existing.paidBy;
    const participants = data.participants ?? existing.shares.map(s => s.userId);
    await validateMembers(groupId, data.paidBy, data.participants, connection);
    const shares = buildShares(amount, splitMethod, participants, data.shares ?? existing.shares.map(s => ({ userId: s.userId, amount: s.shareAmount })));
    const before = { title: existing.title, amount: existing.amount, paidBy: existing.paidBy, category: existing.category, splitMethod: existing.splitMethod };
    const after = { title: data.title?.trim() ?? existing.title, amount, paidBy, category: data.category ?? existing.category, splitMethod };
    await query("UPDATE expenses SET title = ?, amount = ?, paid_by = ?, category = ?, split_method = ?, expense_date = ?, note = ?, updated_at = UTC_TIMESTAMP(3) WHERE id = ?", [after.title, amount, paidBy, after.category, splitMethod, data.expenseDate ? new Date(data.expenseDate) : existing.expenseDate, data.note !== undefined ? data.note?.trim() || null : existing.note, expenseId], connection);
    await query("DELETE FROM expense_shares WHERE expense_id = ?", [expenseId], connection);
    await saveShares(connection, expenseId, shares);
    await logActivity(connection, { groupId, actorId, action: "EXPENSE_UPDATED", entityType: "EXPENSE", entityId: expenseId, meta: { before, after } });
    return readExpense(groupId, expenseId, connection);
  });
}

export async function deleteExpense(groupId, expenseId, actorId, actorRole) {
  return transaction(async connection => {
    await one("SELECT id FROM `groups` WHERE id = ? FOR UPDATE", [groupId], connection);
    const existing = await readExpense(groupId, expenseId, connection);
    if (existing.createdBy !== actorId && actorRole !== "OWNER") throw new ForbiddenError("Only the expense creator or a group owner can delete this expense");
    await query("UPDATE expenses SET deleted_at = UTC_TIMESTAMP(3), updated_at = UTC_TIMESTAMP(3) WHERE id = ?", [expenseId], connection);
    await logActivity(connection, { groupId, actorId, action: "EXPENSE_DELETED", entityType: "EXPENSE", entityId: expenseId, meta: { title: existing.title, amount: existing.amount } });
    return { success: true };
  });
}
