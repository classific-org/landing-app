import { expect, test } from "@playwright/test";
import { fillValidEnquiry, openEnquiry } from "./enquiry";

test("mock success reports delivery only after the endpoint responds", async ({ page }) => {
    await page.route("**/api/enquiry", async (route) => {
        await route.fulfill({ status: 202, contentType: "application/json", body: '{"ok":true}' });
    });
    await openEnquiry(page);
    await fillValidEnquiry(page);
    await page.getByTestId("enquiry-submit").click();
    await expect(page.getByTestId("form-status-sent")).toBeVisible();
});

test("mock failure never claims the enquiry was sent", async ({ page }) => {
    await page.route("**/api/enquiry", async (route) => {
        await route.fulfill({ status: 500, body: "no" });
    });
    await openEnquiry(page);
    await fillValidEnquiry(page);
    await page.getByTestId("enquiry-submit").click();
    await expect(page.getByTestId("form-status-error")).toBeVisible();
    await expect(page.getByTestId("form-status-sent")).toHaveCount(0);
});
