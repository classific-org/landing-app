import { expect, test } from "@playwright/test";

test("work page shows the honest empty state", async ({ page }) => {
    await page.goto("/work");
    await expect(page.getByTestId("projects-empty")).toContainText(/no published projects yet/i);
    await expect(page.getByRole("link", { name: /explore what we build/i })).toBeVisible();
});

test("missing and draft project slugs are not-found", async ({ page }) => {
    await page.goto("/work/does-not-exist");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("does not exist");
    await page.goto("/work/draft-internal-tool");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("does not exist");
});
