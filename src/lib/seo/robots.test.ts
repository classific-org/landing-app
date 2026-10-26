import { describe, expect, it } from "vitest";
import { buildRobotsTxt } from "@/lib/seo/robots";
import { assertRobotsShape } from "@/lib/seo/assert-files";

describe("robots.txt builder", () => {
    it("allows the site and points at the production sitemap", () => {
        const origin = "https://www.classific.example";
        const text = buildRobotsTxt(origin);
        expect(text).toContain("User-agent: *");
        expect(text).toContain("Allow: /");
        expect(text).toContain("Sitemap: https://www.classific.example/sitemap.xml");
        expect(text.toLowerCase()).not.toContain("disallow: /assets");
        assertRobotsShape(text, origin);
    });
});
