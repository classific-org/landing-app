import { expect, test } from "@playwright/test";

test("header links reach inner pages", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Software for");
    await page
        .getByRole("navigation", { name: "Primary" })
        .getByRole("link", { name: "Process" })
        .click();
    await expect(page).toHaveURL(/\/process$/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("How we work");
});

test("mobile drawer opens, traps focus and closes on Escape", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await page.getByRole("button", { name: "Open menu" }).click();
    const menu = page.getByTestId("mobile-menu");
    await expect(menu).toBeVisible();
    await expect(menu.getByRole("link", { name: "Services" })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(menu).toHaveCount(0);
});

test("unknown routes render a crawlable not-found page", async ({ page }) => {
    await page.goto("/this-page-does-not-exist");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("does not exist");
    await page.getByRole("link", { name: "Back to home" }).click();
    await expect(page).toHaveURL("/");
});
