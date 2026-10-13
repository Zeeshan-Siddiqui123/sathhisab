import { test, expect } from "@playwright/test";
import { contrastRatio } from "../helpers/contrast.js";

test.describe("Stage N0 — Design Tokens & Contrast Tests", () => {
  test("token color contrasts satisfy WCAG requirements in light and dark mode", () => {
    // Light Mode Token Checks against nm-bg (#E6EBF2)
    const nmBgLight = "#E6EBF2";
    const fgLight = "#1E293B";
    const mutedLight = "#5B6577";
    const hairlineLight = "#6B7588";
    const primaryLight = "#0B7F70";
    const successLight = "#166534";
    const dangerLight = "#B91C1C";
    const warningLight = "#92400E";

    // Foreground text on nm-bg >= 4.5:1
    expect(contrastRatio(fgLight, nmBgLight)).toBeGreaterThanOrEqual(4.5);

    // Muted text on nm-bg >= 4.5:1
    expect(contrastRatio(mutedLight, nmBgLight)).toBeGreaterThanOrEqual(4.5);

    // Hairline non-text boundary on nm-bg >= 3.0:1
    expect(contrastRatio(hairlineLight, nmBgLight)).toBeGreaterThanOrEqual(3.0);

    // Semantic text colors on nm-bg >= 4.5:1
    expect(contrastRatio(successLight, nmBgLight)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(dangerLight, nmBgLight)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(warningLight, nmBgLight)).toBeGreaterThanOrEqual(4.5);

    // White text on primary button (#0B7F70) >= 4.5:1
    expect(contrastRatio("#FFFFFF", primaryLight)).toBeGreaterThanOrEqual(4.5);

    // Dark Mode Token Checks against nm-bg (#1C222B)
    const nmBgDark = "#1C222B";
    const fgDark = "#E6EAF0";
    const mutedDark = "#9AA6B8";
    const hairlineDark = "#7C8799";
    const primaryDark = "#2CC5AF";
    const primaryFgDark = "#06201C";
    const successDark = "#4ADE80";
    const dangerDark = "#F87171";
    const warningDark = "#FBBF24";

    // Foreground text in dark mode >= 4.5:1
    expect(contrastRatio(fgDark, nmBgDark)).toBeGreaterThanOrEqual(4.5);

    // Muted text in dark mode >= 4.5:1
    expect(contrastRatio(mutedDark, nmBgDark)).toBeGreaterThanOrEqual(4.5);

    // Hairline non-text in dark mode >= 3.0:1
    expect(contrastRatio(hairlineDark, nmBgDark)).toBeGreaterThanOrEqual(3.0);

    // Semantic status in dark mode >= 4.5:1
    expect(contrastRatio(successDark, nmBgDark)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(dangerDark, nmBgDark)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(warningDark, nmBgDark)).toBeGreaterThanOrEqual(4.5);

    // Dark primary button text (#06201C on #2CC5AF) >= 4.5:1
    expect(contrastRatio(primaryFgDark, primaryDark)).toBeGreaterThanOrEqual(4.5);
  });

  test("Playwright e2e: Neumorphism section renders in playground and effects toggle works", async ({ page }) => {
    await page.goto("/_playground/neumorphism");
    await expect(page.getByRole("heading", { level: 2, name: "Surface System & Elevation Tokens" })).toBeVisible();

    // Verify initial attribute
    const html = page.locator("html");
    await expect(html).toHaveAttribute("data-nm", "on");

    // Click EffectsToggle
    const effectsBtn = page.getByRole("button", { name: /Switch to Flat effects/i }).first();
    await effectsBtn.click();

    // Verify toggled to flat
    await expect(html).toHaveAttribute("data-nm", "off");

    // Click again to toggle back to soft
    const softBtn = page.getByRole("button", { name: /Switch to Soft effects/i }).first();
    await softBtn.click();
    await expect(html).toHaveAttribute("data-nm", "on");
  });
});
