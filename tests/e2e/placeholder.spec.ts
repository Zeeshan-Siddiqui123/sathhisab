import { test, expect } from "@playwright/test";

test("foundation loads, connects to API, and persists keyboard theme changes", async ({ page }, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "SaathHisab", exact: true })).toBeVisible();
  await expect(page.getByRole("status")).toContainText("Connected (test)");
  await expect(page.getByText("Rs 6,000", { exact: true })).toBeVisible();
  const surface = page.locator("section");
  await expect(surface).toHaveCSS("background-color", "rgb(255, 255, 255)");
  await page.screenshot({ path: testInfo.outputPath("foundation-light.png"), fullPage: true });
  await page.keyboard.press("Tab");
  const toggle = page.getByRole("button", { name: "Toggle theme" });
  await expect(toggle).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("html")).toHaveClass(/dark/);
  await expect(surface).toHaveCSS("background-color", "rgb(20, 26, 33)");
  await page.reload();
  await expect(page.locator("html")).toHaveClass(/dark/);
  await expect(toggle).toHaveAttribute("aria-pressed", "true");
  await page.screenshot({ path: testInfo.outputPath("foundation-dark.png"), fullPage: true });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await toggle.click();
  await expect(page.locator("html")).not.toHaveClass(/dark/);
  expect(errors).toEqual([]);
});

test("unknown route links back home", async ({ page }) => {
  await page.goto("/missing");
  await expect(page.getByRole("heading", { name: "404" })).toBeVisible();
  await page.getByRole("link", { name: "Go back home" }).click();
  await expect(page.getByRole("heading", { name: "SaathHisab", exact: true })).toBeVisible();
});
