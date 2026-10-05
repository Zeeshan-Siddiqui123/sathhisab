import { test, expect } from "@playwright/test";
import { toPaisa, formatPKR } from "../../apps/server/src/lib/money.js";
import { toPaisa as webToPaisa, formatPKR as webFormatPKR } from "../../apps/web/src/lib/money.ts";

test("frontend and backend agree on supported currency inputs", () => {
  for (const amount of ["100.50", "100.5", "6000", "0.05", "0", "-33.33"]) {
    expect(webToPaisa(amount)).toBe(toPaisa(amount));
    expect(webFormatPKR(webToPaisa(amount))).toBe(formatPKR(toPaisa(amount)));
  }
  for (const amount of ["", "abc", "100.555"]) {
    expect(() => webToPaisa(amount)).toThrow();
    expect(() => toPaisa(amount)).toThrow();
  }
});

test.describe("Money Utilities (Node / Server)", () => {
  test("converts string rupee amounts to integer paisa", () => {
    expect(toPaisa("100.50")).toBe(10050);
    expect(toPaisa("100.5")).toBe(10050);
    expect(toPaisa("100")).toBe(10000);
    expect(toPaisa("6000")).toBe(600000);
    expect(toPaisa("0.05")).toBe(5);
    expect(toPaisa("0")).toBe(0);
  });

  test("converts numeric rupee amounts to integer paisa", () => {
    expect(toPaisa(100.5)).toBe(10050);
    expect(toPaisa(6000)).toBe(600000);
    expect(toPaisa(0)).toBe(0);
  });

  test("rejects invalid money strings", () => {
    expect(() => toPaisa("")).toThrow();
    expect(() => toPaisa("abc")).toThrow();
    expect(() => toPaisa("100.555")).toThrow();
  });

  test("formats integer paisa to PKR strings", () => {
    expect(formatPKR(600000)).toBe("Rs 6,000");
    expect(formatPKR(10050)).toBe("Rs 100.50");
    expect(formatPKR(3333)).toBe("Rs 33.33");
    expect(formatPKR(3334)).toBe("Rs 33.34");
    expect(formatPKR(0)).toBe("Rs 0");
    expect(formatPKR(-300000)).toBe("-Rs 3,000");
    expect(formatPKR(-10050)).toBe("-Rs 100.50");
  });
});
