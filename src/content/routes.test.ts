import { describe, expect, it } from "vitest";
import { articles } from "@/data/insights";
import { buildPublicRoutes, findPublicRoute, listPublicPaths } from "@/content/routes";

const ORIGIN_PATHS = [
    "/",
    "/services",
    "/services/web-applications",
    "/services/mobile-applications",
    "/services/desktop-applications",
    "/services/crm-cms-erp",
    "/services/custom-software",
    "/work",
    "/process",
    "/about",
    "/insights",
    "/contact",
    "/privacy",
    "/terms",
];

describe("public route table", () => {
    it("lists every indexable marketing route exactly once", () => {
        const paths = listPublicPaths();
        for (const path of ORIGIN_PATHS) {
            expect(paths).toContain(path);
        }
        expect(new Set(paths).size).toBe(paths.length);
        expect(paths).not.toContain("/404");
        expect(paths.some((path) => path.includes("?"))).toBe(false);
    });

    it("includes published articles and excludes drafts and unpublished work", () => {
        const paths = listPublicPaths();
        expect(paths).toContain("/insights/what-discovery-actually-decides");
        expect(paths).toContain("/insights/choosing-between-web-mobile-and-desktop");
        expect(paths).toContain("/insights/what-launch-support-should-include");
        expect(paths).not.toContain("/insights/draft-measuring-engineering-outcomes");
        expect(paths.some((path) => path.startsWith("/work/"))).toBe(false);
        expect(articles.some((article) => article.status === "draft")).toBe(true);
    });

    it("finds routes after normalizing the pathname", () => {
        expect(findPublicRoute("/services/")?.kind).toBe("services");
        expect(findPublicRoute("about")?.title).toBe("About");
        expect(findPublicRoute("/missing")).toBeUndefined();
    });

    it("attaches lastmod only when the record has a date", () => {
        const routes = buildPublicRoutes();
        expect(routes.find((route) => route.path === "/")?.lastmod).toBeUndefined();
        expect(routes.find((route) => route.path === "/insights/what-discovery-actually-decides")?.lastmod).toBe(
            "2026-02-10",
        );
    });
});
