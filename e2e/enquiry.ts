import { expect, type Page } from "@playwright/test";

/** The enquiry form lives in a dialog on the home page, opened by the header's Start a Project. */
export async function openEnquiry(page: Page) {
    await page.goto("/");
    await page
        .getByRole("banner")
        .getByRole("link", { name: /start a project/i })
        .click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    return dialog;
}

export async function fillValidEnquiry(page: Page) {
    await page.getByLabel(/^name/i).fill("Alex Rivera");
    await page.getByLabel(/business email/i).fill("alex@company.com");
    await page.getByRole("combobox", { name: /service interest/i }).click();
    await page.getByRole("option", { name: "Web Applications" }).click();
    await page
        .getByLabel(/project description/i)
        .fill("We need a customer portal that replaces a set of shared spreadsheets.");
    await page.getByLabel(/privacy policy/i).check();
}
