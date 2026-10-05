import { test, expect } from "@playwright/test";

test("catalogue renders every section in both themes without runtime errors or overflow", async ({ page }, testInfo) => {
  test.setTimeout(90000);
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
  await page.emulateMedia({ colorScheme: "light" });
  for (const theme of ["light", "dark"]) {
    for (const section of ["", "/controls", "/overlays", "/data", "/layouts"]) {
      await page.goto("/_playground" + section);
      await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible();
      if (theme === "dark" && await page.getByRole("button", { name: "Toggle theme" }).getAttribute("aria-pressed") !== "true") {
        await page.getByRole("button", { name: "Toggle theme" }).click();
      }
      await expect(page.getByRole("button", { name: "Toggle theme" })).toHaveAttribute("aria-pressed", String(theme === "dark"));
      await expect(page.locator("vite-error-overlay")).toHaveCount(0);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
      await page.screenshot({ path: testInfo.outputPath((section.slice(1) || "overview") + "-" + theme + ".png"), fullPage: true });
    }
  }
  expect(errors).toEqual([]);
  const navigation = page.getByRole("navigation", { name: "Main navigation" });
  await expect(navigation.filter({ visible: true })).toHaveCount(1);
});

test("money stays exact, rejects invalid input, and search is debounced", async ({ page }) => {
  await page.goto("/_playground/controls");
  const money = page.getByRole("textbox", { name: "Amount in rupees" });
  await money.fill("100.5");
  await expect(page.getByTestId("paisa-value")).toHaveText("10050");
  await money.press("x");
  await expect(money).toHaveValue("100.5");
  await money.fill("");
  await expect(page.getByTestId("paisa-value")).toHaveText("—");
  await money.fill("0.01");
  await expect(page.getByTestId("paisa-value")).toHaveText("1");
  await money.fill("0.001");
  await expect(money).toHaveValue("0.01");
  await page.getByRole("textbox", { name: "Search expenses" }).fill("grocery");
  await expect(page.getByTestId("search-value")).toHaveText("grocery");
  const password = page.getByLabel("Password", { exact: true });
  await expect(password).toHaveAttribute("type", "password");
  await page.getByRole("button", { name: "Show password" }).click();
  await expect(password).toHaveAttribute("type", "text");
});

test("selection and participant actions work by keyboard", async ({ page }) => {
  await page.goto("/_playground/controls");
  const select = page.getByRole("button", { name: "Equal Select", exact: true });
  await select.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("listbox")).toBeVisible();
  await page.keyboard.press("End");
  await page.keyboard.press("Enter");
  await expect(page.getByRole("button", { name: "Custom Select", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Select all", exact: true }).click();
  await expect(page.getByRole("button", { name: "Clear selection", exact: true })).toBeVisible();
});

test("dialogs trap focus, return it, and show async confirmation failures", async ({ page }) => {
  await page.goto("/_playground/overlays");
  const trigger = page.getByRole("button", { name: "Open modal", exact: true });
  await trigger.click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  for (let i = 0; i < 5; i++) {
    await page.keyboard.press("Tab");
    expect(await dialog.evaluate(element => element.contains(document.activeElement))).toBe(true);
  }
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
  await page.getByRole("button", { name: "Confirm payment", exact: true }).click();
  await page.getByRole("button", { name: "Record payment", exact: true }).click();
  await expect(page.getByText("Last action: Payment preview confirmed.")).toBeVisible();
  await page.getByRole("button", { name: "Try failed action", exact: true }).click();
  await page.getByRole("button", { name: "Confirm", exact: true }).click();
  await expect(page.getByRole("alert")).toContainText("Demo failure");
  await page.getByRole("button", { name: "Cancel", exact: true }).click();
});

test("file selection validates and previews local images", async ({ page }) => {
  await page.goto("/_playground/overlays");
  const input = page.locator('input[type="file"]');
  await input.setInputFiles({ name: "bad.txt", mimeType: "text/plain", buffer: Buffer.from("bad") });
  await expect(page.getByRole("alert").filter({ hasText: "Choose a JPEG" })).toBeVisible();
  await input.setInputFiles({ name: "pixel.png", mimeType: "image/png", buffer: Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jO1sAAAAASUVORK5CYII=", "base64") });
  await expect(page.getByRole("img", { name: "Receipt preview" })).toBeVisible();
  await page.getByRole("button", { name: "Remove image" }).click();
  await expect(page.getByRole("img", { name: "Receipt preview" })).toHaveCount(0);
});
