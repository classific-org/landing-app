import { expect, test } from "@playwright/test";

test("insights lists published essays and hides the draft", async ({ page }) => {
    await page.goto("/insights");
    await expect(
        page.getByRole("heading", { name: /what discovery actually decides/i }),
    ).toBeVisible();
    await expect(
        page.getByRole("heading", { name: /choosing between web, mobile and desktop/i }),
    ).toBeVisible();
    await expect(
        page.getByRole("heading", { name: /what launch support should include/i }),
    ).toBeVisible();
    await expect(page.getByText(/measuring engineering outcomes/i)).toHaveCount(0);
});

test("a published article renders and a missing slug is not-found", async ({ page }) => {
    await page.goto("/insights/what-discovery-actually-decides");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
        /what discovery actually decides/i,
    );
    await expect(page.getByText("By Classific")).toBeVisible();
    await page.goto("/insights/draft-measuring-engineering-outcomes");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("does not exist");
    await page.goto("/insights/not-an-article");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("does not exist");
});
