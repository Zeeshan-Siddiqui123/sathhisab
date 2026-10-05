/**
 * @typedef {number} Paisa Integer paisa
 */

/**
 * Pure calculation engine for member balances.
 * 
 * Formula:
 * balance(user) =
 *     SUM(expenses paid by user, not deleted)
 *   - SUM(shares assigned to user, on non-deleted expenses)
 *   + SUM(CONFIRMED settlements where from_user = user)
 *   - SUM(CONFIRMED settlements where to_user = user)
 *
 * @param {{
 *   expenses: {id: string, paidBy: string, amount: Paisa, deletedAt?: any}[],
 *   shares: {expenseId: string, userId: string, amount?: Paisa, shareAmount?: Paisa}[],
 *   settlements: {from?: string, fromUserId?: string, to?: string, toUserId?: string, amount: Paisa,
 *                 status: 'PENDING'|'CONFIRMED'|'REJECTED'|'CANCELLED'}[]
 * }} input
 * @returns {Map<string, Paisa>} userId -> balance
 */
export function computeBalances(input) {
  const balances = new Map();

  const getBalance = (userId) => balances.get(userId) || 0;
  const setBalance = (userId, amount) => balances.set(userId, amount);
  const addBalance = (userId, amount) => setBalance(userId, getBalance(userId) + amount);

  // Filter non-deleted expenses
  const activeExpenses = (input.expenses || []).filter((e) => !e.deletedAt);
  const activeExpenseIds = new Set(activeExpenses.map((e) => e.id));

  // 1. Add amount paid by payer
  for (const exp of activeExpenses) {
    const paidBy = exp.paidBy || exp.paid_by;
    const amount = Number(exp.amount);
    if (paidBy && Number.isFinite(amount)) {
      addBalance(paidBy, amount);
    }
  }

  // 2. Subtract share amount assigned to user
  for (const share of input.shares || []) {
    const expenseId = share.expenseId || share.expense_id;
    if (activeExpenseIds.has(expenseId)) {
      const userId = share.userId || share.user_id;
      const shareAmount = Number(share.shareAmount !== undefined ? share.shareAmount : share.amount);
      if (userId && Number.isFinite(shareAmount)) {
        addBalance(userId, -shareAmount);
      }
    }
  }

  // 3. Process settlements (ONLY CONFIRMED ones affect balance)
  for (const s of input.settlements || []) {
    if (s.status === "CONFIRMED") {
      const fromUser = s.from || s.fromUserId || s.from_user_id;
      const toUser = s.to || s.toUserId || s.to_user_id;
      const amount = Number(s.amount);

      if (Number.isFinite(amount)) {
        if (fromUser) addBalance(fromUser, amount); // payer settled their debt (balance increases)
        if (toUser) addBalance(toUser, -amount);   // receiver got paid (their credit decreases)
      }
    }
  }

  // Sanity check: sum of all balances in a closed system must be 0
  let total = 0;
  for (const val of balances.values()) {
    total += val;
  }
  if (total !== 0 && process.env.NODE_ENV !== "production") {
    console.warn(`[BalanceEngine] Sum of balances is non-zero: ${total} paisa`);
  }

  return balances;
}

/**
 * Splits an amount equally among participants with deterministic remainder distribution.
 *
 * @param {Paisa} amount
 * @param {string[]} userIdsSorted
 * @returns {{userId: string, amount: Paisa}[]}
 */
export function splitEqual(amount, userIdsSorted) {
  if (!Array.isArray(userIdsSorted) || userIdsSorted.length === 0) {
    throw new Error("At least one participant is required for split");
  }
  const n = userIdsSorted.length;
  const numAmount = Number(amount);
  if (!Number.isInteger(numAmount) || numAmount <= 0) {
    throw new Error("Amount must be a positive integer in paisa");
  }

  // Sort userIds deterministically
  const sorted = [...userIdsSorted].sort();
  const base = Math.floor(numAmount / n);
  const remainder = numAmount % n;

  return sorted.map((userId, index) => ({
    userId,
    amount: index < remainder ? base + 1 : base,
  }));
}

/**
 * Validates that custom shares sum exactly to total amount.
 *
 * @param {Paisa} amount
 * @param {{userId: string, amount: Paisa}[]} shares
 */
export function validateCustomSplit(amount, shares) {
  const numAmount = Number(amount);
  if (!Number.isInteger(numAmount) || numAmount <= 0) {
    throw new Error("Expense amount must be a positive integer in paisa");
  }
  if (!Array.isArray(shares) || shares.length === 0) {
    throw new Error("At least one share is required");
  }

  let totalShares = 0;
  const seenUsers = new Set();

  for (const share of shares) {
    if (!share.userId) {
      throw new Error("Each share must specify a userId");
    }
    if (seenUsers.has(share.userId)) {
      throw new Error(`Duplicate share for user: ${share.userId}`);
    }
    seenUsers.add(share.userId);

    const shareAmt = Number(share.amount);
    if (!Number.isInteger(shareAmt) || shareAmt < 0) {
      throw new Error(`Share amount for user ${share.userId} must be a non-negative integer`);
    }
    totalShares += shareAmt;
  }

  if (totalShares !== numAmount) {
    throw new Error(
      `Sum of shares (${totalShares} paisa) does not equal expense amount (${numAmount} paisa)`
    );
  }

  return true;
}
