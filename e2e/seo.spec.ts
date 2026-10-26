import { expect, test } from "@playwright/test";

const PRODUCTION_ORIGIN = "https://www.classific.example";

test("production SEO files exist, parse, and contain no localhost hosts", async ({ request }) => {
    const robots = await request.get("/robots.txt");
    expect(robots.ok()).toBeTruthy();
    const robotsText = await robots.text();
    expect(robotsText).toContain("User-agent: *");
    expect(robotsText).toContain(`${PRODUCTION_ORIGIN}/sitemap.xml`);
    expect(robotsText).not.toMatch(/localhost|127\.0\.0\.1/);

    const sitemap = await request.get("/sitemap.xml");
    expect(sitemap.ok()).toBeTruthy();
    const xml = await sitemap.text();
    expect(xml).toContain("<urlset");
    expect(xml).toContain(`${PRODUCTION_ORIGIN}/services/web-applications`);
    expect(xml).toContain(`${PRODUCTION_ORIGIN}/insights/what-discovery-actually-decides`);
    expect(xml).not.toContain("draft-measuring-engineering-outcomes");
    expect(xml).not.toContain("/404");
    expect(xml).not.toMatch(/localhost|127\.0\.0\.1/);

    const llms = await request.get("/llms.txt");
    expect(llms.ok()).toBeTruthy();
    expect(await llms.text()).toContain(PRODUCTION_ORIGIN);

    const full = await request.get("/llms-full.txt");
    expect(full.ok()).toBeTruthy();
    expect(await full.text()).not.toContain("Draft content. Not for publication.");
});

test("home JSON-LD is valid and omits unpublished facts", async ({ page }) => {
    await page.goto("/");
    const payloads = await page.locator("script[type='application/ld+json']").allTextContents();
    expect(payloads.length).toBeGreaterThan(0);
    for (const raw of payloads) {
        const data = JSON.parse(raw) as Record<string, unknown>;
        expect(data["@type"]).toBeTruthy();
        expect(JSON.stringify(data)).not.toMatch(/localhost|127\.0\.0\.1/);
        expect(data).not.toHaveProperty("review");
        expect(data).not.toHaveProperty("aggregateRating");
    }
});
