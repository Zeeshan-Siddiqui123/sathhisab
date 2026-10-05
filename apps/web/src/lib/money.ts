/**
 * Money utilities - strictly integer paisa (1 PKR = 100 paisa).
 * Stored and computed values must always be BigInt or Number integers.
 */

/**
 * Converts a rupee string or number to integer paisa without floating point inaccuracies.
 * E.g. "100.50" -> 10050, "100.5" -> 10050, 6000 -> 600000.
 */
export function toPaisa(value: string | number | bigint): number {
  if (typeof value === "bigint") {
    return Number(value);
  }
  if (typeof value === "number") {
    if (!Number.isFinite(value)) {
      throw new Error("Invalid amount: must be finite");
    }
    value = value.toString();
  }
  if (typeof value !== "string") {
    throw new Error("Invalid amount type");
  }

  const trimmed = value.trim();
  if (!trimmed) {
    throw new Error("Amount cannot be empty");
  }

  const match = trimmed.match(/^(-)?(\d+)(?:\.(\d{1,2}))?$/);
  if (!match) {
    throw new Error(`Invalid currency format: "${value}"`);
  }

  const isNegative = !!match[1];
  const rupeesPart = parseInt(match[2], 10);
  const paisaPartRaw = match[3] || "";
  const paisaPart = parseInt(paisaPartRaw.padEnd(2, "0"), 10);

  const totalPaisa = rupeesPart * 100 + paisaPart;
  return isNegative ? -totalPaisa : totalPaisa;
}

/**
 * Converts integer paisa to decimal rupees string for input display (e.g. 10050 -> "100.50" or "100.5")
 */
export function fromPaisa(paisa: number | bigint): string {
  const num = typeof paisa === "bigint" ? Number(paisa) : paisa;
  if (!Number.isFinite(num)) return "0";
  const abs = Math.abs(num);
  const rupees = Math.floor(abs / 100);
  const cents = abs % 100;
  const sign = num < 0 ? "-" : "";
  if (cents === 0) return `${sign}${rupees}`;
  return `${sign}${rupees}.${cents.toString().padStart(2, "0")}`;
}

/**
 * Formats integer paisa to PKR string.
 * Examples:
 *   600000 -> "Rs 6,000"
 *   10050 -> "Rs 100.50"
 *   3333 -> "Rs 33.33"
 *   0 -> "Rs 0"
 */
export function formatPKR(paisa: number | bigint): string {
  const num = typeof paisa === "bigint" ? Number(paisa) : paisa;
  if (!Number.isFinite(num)) return "Rs 0";

  const isNegative = num < 0;
  const abs = Math.abs(num);
  const rupees = Math.floor(abs / 100);
  const cents = abs % 100;

  const formattedRupees = rupees.toLocaleString("en-US");

  const sign = isNegative ? "-" : "";
  if (cents === 0) {
    return `${sign}Rs ${formattedRupees}`;
  }

  const paddedCents = cents.toString().padStart(2, "0");
  return `${sign}Rs ${formattedRupees}.${paddedCents}`;
}
