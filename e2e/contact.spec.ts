import { expect, test } from "@playwright/test";

test("contact form validates required fields and a bad email", async ({ page }) => {
    await page.goto("/contact");
    await page.getByTestId("enquiry-submit").click();
    await expect(page.getByRole("alert").first()).toBeVisible();
    await page.getByLabel(/business email/i).fill("not-an-email");
    await page.getByTestId("enquiry-submit").click();
    await expect(page.getByText(/valid email/i)).toBeVisible();
});

test("does not claim success when the enquiry endpoint is unset", async ({ page }) => {
    await page.goto("/contact");
    await expect(page.getByTestId("form-status-notice")).toContainText(/not connected/i);
    await page.getByLabel(/^name/i).fill("Alex Rivera");
    await page.getByLabel(/business email/i).fill("alex@company.com");
    await page.getByLabel(/service interest/i).selectOption("web-applications");
    await page
        .getByLabel(/project description/i)
        .fill("We need a customer portal that replaces a set of shared spreadsheets.");
    await page.getByLabel(/privacy policy/i).check();
    await page.getByTestId("enquiry-submit").click();
    await expect(page.getByTestId("form-status-unavailable")).toBeVisible();
    await expect(page.getByTestId("form-status-sent")).toHaveCount(0);
    await expect(page.getByText(/has been received/i)).toHaveCount(0);
});
