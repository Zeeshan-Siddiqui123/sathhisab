/**
 * @typedef {number} Paisa Integer paisa
 */

/**
 * Computes suggested settlements using greedy matching of debtors and creditors.
 *
 * 1. Split into creditors (balance > 0) and debtors (balance < 0, use absolute value).
 * 2. Sort both descending by amount.
 * 3. Repeatedly match largest debtor with largest creditor, transfer min(debt, credit), reduce both, remove zeros.
 *
 * @param {Map<string, Paisa> | Record<string, Paisa>} balances Map or object of userId -> balance
 * @returns {{from: string, to: string, amount: Paisa}[]}
 */
export function suggestTransfers(balances) {
  const creditors = []; // balance > 0 (owed money)
  const debtors = [];   // balance < 0 (owes money)

  const entries = balances instanceof Map ? balances.entries() : Object.entries(balances);

  for (const [userId, bal] of entries) {
    const balance = Number(bal);
    if (balance > 0) {
      creditors.push({ userId, amount: balance });
    } else if (balance < 0) {
      debtors.push({ userId, amount: Math.abs(balance) });
    }
  }

  // Sort descending by amount
  creditors.sort((a, b) => b.amount - a.amount);
  debtors.sort((a, b) => b.amount - a.amount);

  const transfers = [];

  let i = 0; // debtor index
  let j = 0; // creditor index

  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i];
    const creditor = creditors[j];

    const transferAmount = Math.min(debtor.amount, creditor.amount);

    if (transferAmount > 0) {
      transfers.push({
        from: debtor.userId,
        to: creditor.userId,
        amount: transferAmount,
      });

      debtor.amount -= transferAmount;
      creditor.amount -= transferAmount;
    }

    if (debtor.amount === 0) {
      i++;
    }
    if (creditor.amount === 0) {
      j++;
    }
  }

  return transfers;
}
