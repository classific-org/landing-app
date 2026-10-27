import { describe, expect, it } from "vitest";
import { buildPublicRoutes } from "@/content/routes";
import { buildSitemapEntries, buildSitemapXml } from "@/lib/seo/sitemap";

const ORIGIN = "https://www.classific.example";

describe("sitemap builder", () => {
    it("emits one loc per public route and lastmod only when present", () => {
        const routes = buildPublicRoutes();
        const entries = buildSitemapEntries(ORIGIN, routes);
        expect(entries).toHaveLength(routes.length);
        expect(entries.every((entry) => entry.loc.startsWith(ORIGIN))).toBe(true);
        expect(entries.find((entry) => entry.loc === `${ORIGIN}/`)?.lastmod).toBeUndefined();
        expect(
            entries.find(
                (entry) => entry.loc === `${ORIGIN}/insights/what-discovery-actually-decides`,
            )?.lastmod,
        ).toBe("2026-02-10");
    });

    it("serializes valid XML and escapes reserved characters", () => {
        const xml = buildSitemapXml(ORIGIN, [
            {
                path: "/a&b",
                kind: "about",
                title: "A",
                description: "B",
                ogType: "website",
                lastmod: "2026-01-01",
                breadcrumbs: [],
            },
        ]);
        expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
        expect(xml).toContain("<urlset");
        expect(xml).toContain(`${ORIGIN}/a&amp;b`);
        expect(xml).toContain("<lastmod>2026-01-01</lastmod>");
        expect(xml).not.toContain(`${ORIGIN}/404`);
    });
});
