import { expect, test } from "@playwright/test";
import { fillValidEnquiry, openEnquiry } from "./enquiry";

test("contact form validates required fields and a bad email", async ({ page }) => {
    await openEnquiry(page);
    await page.getByTestId("enquiry-submit").click();
    await expect(page.getByRole("alert").first()).toBeVisible();
    await page.getByLabel(/business email/i).fill("not-an-email");
    await page.getByTestId("enquiry-submit").click();
    await expect(page.getByText(/valid email/i)).toBeVisible();
});

test("does not claim success when the enquiry endpoint is unset", async ({ page }) => {
    await openEnquiry(page);
    await expect(page.getByTestId("form-status-notice")).toContainText(/not connected/i);
    await fillValidEnquiry(page);
    await page.getByTestId("enquiry-submit").click();
    await expect(page.getByTestId("form-status-unavailable")).toBeVisible();
    await expect(page.getByTestId("form-status-sent")).toHaveCount(0);
    await expect(page.getByText(/has been received/i)).toHaveCount(0);
});

test("the enquiry dialog closes on Escape", async ({ page }) => {
    const dialog = await openEnquiry(page);
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
});
