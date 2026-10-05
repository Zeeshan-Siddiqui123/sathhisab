import { prisma } from "../../lib/prisma.js";
import { computeBalances } from "./balance.engine.js";
import { suggestTransfers } from "./suggest.engine.js";

/**
 * Computes all member balances for a group and the current user's net balance.
 *
 * @param {string} groupId
 * @param {string} currentUserId
 */
export async function getGroupBalances(groupId, currentUserId) {
  const [expenses, shares, settlements, activeMembers] = await Promise.all([
    prisma.expense.findMany({
      where: { groupId, deletedAt: null },
      select: { id: true, paidBy: true, amount: true },
    }),
    prisma.expenseShare.findMany({
      where: { expense: { groupId, deletedAt: null } },
      select: { expenseId: true, userId: true, shareAmount: true },
    }),
    prisma.settlement.findMany({
      where: { groupId },
      select: { fromUserId: true, toUserId: true, amount: true, status: true },
    }),
    prisma.groupMember.findMany({
      where: { groupId, leftAt: null },
      include: {
        user: { select: { id: true, name: true, avatarUrl: true } },
      },
    }),
  ]);

  const balancesMap = computeBalances({
    expenses: expenses.map((e) => ({ id: e.id, paidBy: e.paidBy, amount: Number(e.amount) })),
    shares: shares.map((s) => ({ expenseId: s.expenseId, userId: s.userId, amount: Number(s.shareAmount) })),
    settlements: settlements.map((s) => ({
      from: s.fromUserId,
      to: s.toUserId,
      amount: Number(s.amount),
      status: s.status,
    })),
  });

  const members = activeMembers.map((m) => ({
    ...m.user,
    role: m.role,
    balance: balancesMap.get(m.user.id) || 0,
  }));

  const suggestions = suggestTransfers(balancesMap);

  // Enrich suggestions with user objects
  const userMap = Object.fromEntries(members.map((m) => [m.id, m]));
  const enrichedSuggestions = suggestions.map((s) => ({
    from: userMap[s.from] || { id: s.from },
    to: userMap[s.to] || { id: s.to },
    amount: s.amount,
  }));

  return {
    myBalance: balancesMap.get(currentUserId) || 0,
    members,
    suggestions: enrichedSuggestions,
  };
}

/**
 * Returns group-level spending stats for the dashboard.
 */
export async function getGroupStats(groupId, query) {
  const { from, to } = query || {};

  const where = {
    groupId,
    deletedAt: null,
    ...(from || to
      ? {
          expenseDate: {
            ...(from && { gte: new Date(from) }),
            ...(to && { lte: new Date(to) }),
          },
        }
      : {}),
  };

  const expenses = await prisma.expense.findMany({
    where,
    select: {
      amount: true,
      category: true,
      paidBy: true,
      expenseDate: true,
    },
  });

  // Total group spend
  const totalSpend = expenses.reduce((sum, e) => sum + Number(e.amount), 0);

  // By category
  const byCategory = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + Number(e.amount);
    return acc;
  }, {});

  // By month (YYYY-MM)
  const byMonth = expenses.reduce((acc, e) => {
    const key = e.expenseDate.toISOString().slice(0, 7);
    acc[key] = (acc[key] || 0) + Number(e.amount);
    return acc;
  }, {});

  return {
    totalSpend,
    byCategory: Object.entries(byCategory).map(([category, amount]) => ({ category, amount })),
    byMonth: Object.entries(byMonth)
      .map(([month, amount]) => ({ month, amount }))
      .sort((a, b) => a.month.localeCompare(b.month)),
  };
}
