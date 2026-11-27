import { expect, test } from "@playwright/test";

// The home page is the whole site: the older pages send visitors to the matching section.
const redirects = [
    { from: "/services", to: "/#services" },
    { from: "/services/web-applications", to: "/#web-applications" },
    { from: "/services/mobile-applications", to: "/#mobile-applications" },
    { from: "/services/desktop-applications", to: "/#desktop-applications" },
    { from: "/services/crm-cms-erp", to: "/#crm-cms-erp" },
    { from: "/services/custom-software", to: "/#custom-software" },
    { from: "/services/not-a-service", to: "/#services" },
    { from: "/work", to: "/#work" },
    { from: "/work/any-project", to: "/#work" },
    { from: "/process", to: "/#process" },
    { from: "/about", to: "/#about" },
    { from: "/contact", to: "/#contact" },
    { from: "/insights", to: "/" },
    { from: "/insights/what-discovery-actually-decides", to: "/" },
    { from: "/blog", to: "/" },
];

for (const { from, to } of redirects) {
    test(`${from} opens the home page at ${to}`, async ({ page }) => {
        await page.goto(from);
        await expect(page).toHaveURL(new RegExp(`${to.replace("/", "\\/")}$`));
        const id = to.split("#")[1];
        if (id) {
            await expect(page.locator(`[id="${id}"]`)).toBeInViewport();
        }
    });
}
