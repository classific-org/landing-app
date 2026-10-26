import { expect, test } from "@playwright/test";

const services = [
    { slug: "web-applications", title: /web software/i },
    { slug: "mobile-applications", title: /mobile/i },
    { slug: "desktop-applications", title: /desktop/i },
    { slug: "crm-cms-erp", title: /business systems/i },
    { slug: "custom-software", title: /software built for the problem/i },
];

for (const service of services) {
    test(`service page ${service.slug} has a title and project CTA`, async ({ page }) => {
        await page.goto(`/services/${service.slug}`);
        await expect(page.getByRole("heading", { level: 1 })).toHaveText(service.title);
        await expect(page.getByRole("link", { name: /discuss a project|start a project/i }).first()).toBeVisible();
    });
}
