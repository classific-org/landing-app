import { expect, test } from "@playwright/test";

async function assertNoHorizontalOverflow(page: import("@playwright/test").Page, width: number) {
    await page.setViewportSize({ width, height: 900 });
    const overflow = await page.evaluate(() => {
        const doc = document.documentElement;
        return {
            clientWidth: doc.clientWidth,
            scrollWidth: doc.scrollWidth,
        };
    });
    expect(overflow.scrollWidth, `horizontal overflow at ${width}px`).toBeLessThanOrEqual(
        overflow.clientWidth + 1,
    );
}

const pages = ["/", "/services", "/work", "/process", "/about", "/insights", "/contact"];

for (const path of pages) {
    for (const width of [390, 768, 1440]) {
        test(`${path} does not overflow at ${width}px`, async ({ page }) => {
            await page.goto(path);
            await assertNoHorizontalOverflow(page, width);
        });
    }
}

test("home does not overflow at 320 and 1920", async ({ page }) => {
    await page.goto("/");
    await assertNoHorizontalOverflow(page, 320);
    await assertNoHorizontalOverflow(page, 1920);
});
