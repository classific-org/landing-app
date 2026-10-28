import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const pages = [
    { name: "home", path: "/" },
    { name: "web applications", path: "/services/web-applications" },
    { name: "contact", path: "/contact" },
    { name: "article", path: "/insights/what-discovery-actually-decides" },
];

// Axe samples colours at the moment it runs. Reduced motion shows the settled page rather than a
// frame from the middle of a fade-in, which would report contrast the visitor never sees.
test.use({ reducedMotion: "reduce" });

for (const pageInfo of pages) {
    test(`has no serious axe violations on ${pageInfo.name}`, async ({ page }) => {
        await page.goto(pageInfo.path);
        const results = await new AxeBuilder({ page })
            .withTags(["wcag2a", "wcag2aa", "wcag22aa"])
            .analyze();
        const serious = results.violations.filter(
            (violation) => violation.impact === "serious" || violation.impact === "critical",
        );
        expect(serious, JSON.stringify(serious, null, 2)).toEqual([]);
    });
}
