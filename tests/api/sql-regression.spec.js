import { test, expect } from "@playwright/test";
import mysql from "mysql2/promise";
import { randomUUID } from "node:crypto";
import { databaseOptions } from "../../apps/server/database/config.js";

let db;
test.beforeAll(async () => {
  db = await mysql.createConnection(databaseOptions({ ...process.env, NODE_ENV: "test" }));
});
test.afterAll(async () => { await db?.end(); });

async function fixture(playwright) {
  const clients = [];
  const users = [];
  for (const name of ["Owner", "Member", "Outsider"]) {
    const api = await playwright.request.newContext({ baseURL: process.env.API_BASE_URL || "http://localhost:5000" });
    clients.push(api);
    const response = await api.post("/api/v1/auth/signup", { data: { name, email: `${randomUUID()}@example.com`, password: "Password123!" } });
    expect(response.status()).toBe(201);
    users.push((await response.json()).user);
  }
  const response = await clients[0].post("/api/v1/groups", { data: { name: "SQL regression", type: "FLAT" } });
  expect(response.status()).toBe(201);
  const { group } = await response.json();
  const invite = await clients[0].post(`/api/v1/groups/${group.id}/invitations`, { data: { expiresInDays: 7 } });
  const { invitation } = await invite.json();
  expect((await clients[1].post(`/api/v1/invitations/${invitation.token}/accept`)).status()).toBe(200);
  return { clients, users, group, invitation };
}

test("SQL expenses preserve exact shares, filters, idempotency, updates and soft deletion", async ({ playwright }) => {
  const { clients, users, group } = await fixture(playwright);
  const [owner, member, outsider] = clients;
  const path = `/api/v1/groups/${group.id}/expenses`;
  const data = { title: "O'Brien groceries", amount: 10001, paidBy: users[0].id, category: "GROCERY", splitMethod: "EQUAL", expenseDate: "2026-10-05", participants: [users[0].id, users[1].id] };
  try {
    const headers = { "Idempotency-Key": randomUUID() };
    const responses = await Promise.all([owner.post(path, { data, headers }), owner.post(path, { data, headers })]);
    expect(responses.map(r => r.status())).toEqual([201, 201]);
    const expense = await responses[0].json();
    expect((await responses[1].json()).id).toBe(expense.id);
    expect(expense.shares.reduce((sum, share) => sum + share.shareAmount, 0)).toBe(10001);
    expect(expense.expenseDate).toBe("2026-10-05T00:00:00.000Z");
    expect(expense.payer.id).toBe(users[0].id);
    const [counts] = await db.execute("SELECT COUNT(*) AS total FROM expenses WHERE group_id = ?", [group.id]);
    expect(Number(counts[0].total)).toBe(1);
    expect((await outsider.get(path)).status()).toBe(403);
    expect((await member.patch(`${path}/${expense.id}`, { data: { title: "Unauthorized" } })).status()).toBe(403);
    for (const amount of [0, -1, 1.2, Number.MAX_SAFE_INTEGER + 1]) {
      expect((await owner.post(path, { data: { ...data, amount } })).status()).toBe(400);
    }
    const invalidShares = [{ userId: users[0].id, amount: 1 }, { userId: users[1].id, amount: 1 }];
    expect((await owner.post(path, { data: { ...data, splitMethod: "CUSTOM", shares: invalidShares } })).status()).toBe(400);
    const list = await (await owner.get(path, { params: { search: "O'Brien", category: "GROCERY", page: "1", limit: "1", from: "2026-10-01", to: "2026-10-31" } })).json();
    expect(list.meta).toEqual({ total: 1, page: 1, limit: 1, totalPages: 1 });
    const injection = await (await owner.get(path, { params: { search: "' OR 1=1 --" } })).json();
    expect(injection.meta.total).toBe(0);
    const updated = await owner.patch(`${path}/${expense.id}`, { data: { amount: 9000, splitMethod: "CUSTOM", shares: [{ userId: users[0].id, amount: 3000 }, { userId: users[1].id, amount: 6000 }] } });
    expect(updated.status()).toBe(200);
    expect((await updated.json()).shares.reduce((sum, s) => sum + s.shareAmount, 0)).toBe(9000);
    const balances = await (await owner.get(`/api/v1/groups/${group.id}/balances`)).json();
    expect(balances.myBalance).toBe(6000);
    expect((await owner.delete(`/api/v1/groups/${group.id}/members/${users[1].id}`)).status()).toBe(409);
    const stats = await (await owner.get(`/api/v1/groups/${group.id}/balances/stats`)).json();
    expect(stats.totalSpend).toBe(9000);
    expect(stats.byMonth).toEqual([{ month: "2026-10", amount: 9000 }]);
    const activity = await (await owner.get(`/api/v1/groups/${group.id}/activity`, { params: { action: "EXPENSE_UPDATED" } })).json();
    expect(activity.data[0].meta.after.amount).toBe(9000);
    expect((await owner.delete(`${path}/${expense.id}`)).status()).toBe(200);
    expect((await owner.get(`${path}/${expense.id}`)).status()).toBe(404);
    expect((await (await owner.get(`/api/v1/groups/${group.id}/balances`)).json()).myBalance).toBe(0);
  } finally { await Promise.all(clients.map(api => api.dispose())); }
});

test("settlement SQL locks prevent double confirmation and only confirmed payments affect balances", async ({ playwright }) => {
  const { clients, users, group } = await fixture(playwright);
  const [owner, member] = clients;
  const root = `/api/v1/groups/${group.id}`;
  try {
    expect((await owner.post(`${root}/expenses`, { data: { title: "Rent", amount: 10000, paidBy: users[0].id, splitMethod: "EQUAL", expenseDate: "2026-10-05", participants: [users[0].id, users[1].id] } })).status()).toBe(201);
    const data = { toUserId: users[0].id, amount: 2000 };
    const headers = { "Idempotency-Key": randomUUID() };
    const responses = await Promise.all([member.post(`${root}/settlements`, { data, headers }), member.post(`${root}/settlements`, { data, headers })]);
    expect(responses.map(r => r.status())).toEqual([201, 201]);
    const settlement = await responses[0].json();
    expect((await responses[1].json()).id).toBe(settlement.id);
    expect((await (await owner.get(`${root}/balances`)).json()).myBalance).toBe(5000);
    expect((await member.post(`${root}/settlements/${settlement.id}/confirm`)).status()).toBe(403);
    const confirms = await Promise.all([owner.post(`${root}/settlements/${settlement.id}/confirm`), owner.post(`${root}/settlements/${settlement.id}/confirm`)]);
    expect(confirms.map(r => r.status()).sort()).toEqual([200, 409]);
    expect((await (await owner.get(`${root}/balances`)).json()).myBalance).toBe(3000);
    const [logs] = await db.execute("SELECT COUNT(*) AS total FROM activity_logs WHERE entity_id = ? AND action = 'SETTLEMENT_CONFIRMED'", [settlement.id]);
    expect(Number(logs[0].total)).toBe(1);
    for (const action of ["reject", "cancel"]) {
      const next = await (await member.post(`${root}/settlements`, { data })).json();
      const actor = action === "reject" ? owner : member;
      expect((await actor.post(`${root}/settlements/${next.id}/${action}`)).status()).toBe(200);
    }
    const confirmed = await (await owner.get(`${root}/settlements`, { params: { status: "CONFIRMED", userId: users[0].id } })).json();
    expect(confirmed).toHaveLength(1);
    expect((await (await owner.get(`${root}/balances`)).json()).myBalance).toBe(3000);
  } finally { await Promise.all(clients.map(api => api.dispose())); }
});

test("failed activity insertion rolls back the expense and its shares", async ({ playwright }) => {
  const { clients, users, group } = await fixture(playwright);
  const trigger = `test_rollback_${randomUUID().replaceAll("-", "")}`;
  try {
    // A real database failure after expense and shares have been inserted.
    await db.query(`CREATE TRIGGER \`${trigger}\` BEFORE INSERT ON activity_logs FOR EACH ROW BEGIN IF NEW.group_id = ${db.escape(group.id)} AND NEW.action = 'EXPENSE_CREATED' THEN SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'intentional rollback test'; END IF; END`);
    const response = await clients[0].post(`/api/v1/groups/${group.id}/expenses`, { data: { title: "Must roll back", amount: 10000, paidBy: users[0].id, splitMethod: "EQUAL", expenseDate: "2026-10-05", participants: [users[0].id, users[1].id] } });
    expect(response.status()).toBe(500);
    const [expenses] = await db.execute("SELECT id FROM expenses WHERE group_id = ?", [group.id]);
    expect(expenses).toEqual([]);
    const [orphans] = await db.query("SELECT s.id FROM expense_shares s LEFT JOIN expenses e ON e.id = s.expense_id WHERE e.id IS NULL");
    expect(orphans).toEqual([]);
    const [logs] = await db.execute("SELECT id FROM activity_logs WHERE group_id = ? AND action = 'EXPENSE_CREATED'", [group.id]);
    expect(logs).toEqual([]);
  } finally {
    await db.query(`DROP TRIGGER IF EXISTS \`${trigger}\``);
    await Promise.all(clients.map(api => api.dispose()));
  }
});

test("expired invites are denied and owner departure transfers ownership atomically", async ({ playwright }) => {
  const { clients, users, group, invitation } = await fixture(playwright);
  const [owner, member, outsider] = clients;
  try {
    await db.execute("UPDATE invitations SET expires_at = ? WHERE id = ?", [new Date("2000-01-01T00:00:00Z"), invitation.id]);
    expect((await outsider.get(`/api/v1/invitations/${invitation.token}`)).status()).toBe(404);
    expect((await outsider.post(`/api/v1/invitations/${invitation.token}/accept`)).status()).toBe(404);
    expect((await owner.post(`/api/v1/groups/${group.id}/leave`)).status()).toBe(200);
    const detail = await (await member.get(`/api/v1/groups/${group.id}`)).json();
    expect(detail.group.myRole).toBe("OWNER");
    expect(detail.group.members.map(m => m.id)).toEqual([users[1].id]);
    expect((await owner.get(`/api/v1/groups/${group.id}`)).status()).toBe(403);
  } finally { await Promise.all(clients.map(api => api.dispose())); }
});
