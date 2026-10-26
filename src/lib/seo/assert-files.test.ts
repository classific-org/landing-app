import { describe, expect, it } from "vitest";
import {
    REQUIRED_SEO_FILES,
    assertNoLocalhost,
    assertRobotsShape,
    assertSitemapShape,
} from "@/lib/seo/assert-files";

const ORIGIN = "https://www.classific.example";

describe("SEO file assertions", () => {
    it("lists the files a production build must emit", () => {
        expect(REQUIRED_SEO_FILES).toContain("robots.txt");
        expect(REQUIRED_SEO_FILES).toContain("sitemap.xml");
        expect(REQUIRED_SEO_FILES).toContain("og/classific-og.png");
    });

    it("rejects localhost hosts", () => {
        expect(() => assertNoLocalhost("https://www.classific.example", "ok")).not.toThrow();
        expect(() => assertNoLocalhost("http://localhost:4173", "meta")).toThrow(/localhost/);
    });

    it("validates sitemap and robots shape", () => {
        expect(() =>
            assertSitemapShape(`<urlset><url><loc>${ORIGIN}/</loc></url></urlset>`, ORIGIN),
        ).not.toThrow();
        expect(() => assertSitemapShape("<html></html>", ORIGIN)).toThrow(/urlset/);
        expect(() => assertSitemapShape("<urlset></urlset>", ORIGIN)).toThrow(/origin/);
        expect(() =>
            assertSitemapShape(`<urlset><loc>${ORIGIN}/404</loc></urlset>`, ORIGIN),
        ).toThrow(/not-found/);

        const robots = `User-agent: *\nAllow: /\n\nSitemap: ${ORIGIN}/sitemap.xml\n`;
        expect(() => assertRobotsShape(robots, ORIGIN)).not.toThrow();
        expect(() => assertRobotsShape("Allow: /", ORIGIN)).toThrow(/user-agent/);
        expect(() => assertRobotsShape("User-agent: *", ORIGIN)).toThrow(/public pages/);
        expect(() => assertRobotsShape("User-agent: *\nAllow: /\n", ORIGIN)).toThrow(/sitemap/);
        expect(() =>
            assertRobotsShape(`User-agent: *\nAllow: /\nDisallow: /assets\nSitemap: ${ORIGIN}/sitemap.xml`, ORIGIN),
        ).toThrow(/assets/);
    });
});
