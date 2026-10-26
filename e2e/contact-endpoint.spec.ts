import { expect, test } from "@playwright/test";

async function fillValidEnquiry(page: import("@playwright/test").Page) {
    await page.getByLabel(/^name/i).fill("Alex Rivera");
    await page.getByLabel(/business email/i).fill("alex@company.com");
    await page.getByLabel(/service interest/i).selectOption("web-applications");
    await page
        .getByLabel(/project description/i)
        .fill("We need a customer portal that replaces a set of shared spreadsheets.");
    await page.getByLabel(/privacy policy/i).check();
}

test("mock success reports delivery only after the endpoint responds", async ({ page }) => {
    await page.route("**/api/enquiry", async (route) => {
        await route.fulfill({ status: 202, contentType: "application/json", body: "{\"ok\":true}" });
    });
    await page.goto("/contact");
    await fillValidEnquiry(page);
    await page.getByTestId("enquiry-submit").click();
    await expect(page.getByTestId("form-status-sent")).toBeVisible();
});

test("mock failure never claims the enquiry was sent", async ({ page }) => {
    await page.route("**/api/enquiry", async (route) => {
        await route.fulfill({ status: 500, body: "no" });
    });
    await page.goto("/contact");
    await fillValidEnquiry(page);
    await page.getByTestId("enquiry-submit").click();
    await expect(page.getByTestId("form-status-error")).toBeVisible();
    await expect(page.getByTestId("form-status-sent")).toHaveCount(0);
});
