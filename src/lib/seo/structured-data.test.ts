import { describe, expect, it } from "vitest";
import { findPublicRoute } from "@/content/routes";
import {
    buildArticleJsonLd,
    buildBreadcrumbJsonLd,
    buildJsonLdForRoute,
    buildOrganizationJsonLd,
    buildServiceJsonLd,
    buildWebSiteJsonLd,
} from "@/lib/seo/structured-data";

const ORIGIN = "https://www.classific.example";

describe("structured data", () => {
    it("omits empty contact and social fields from Organization", () => {
        const organization = buildOrganizationJsonLd(ORIGIN);
        expect(organization["@type"]).toBe("Organization");
        expect(organization).not.toHaveProperty("email");
        expect(organization).not.toHaveProperty("telephone");
        expect(organization).not.toHaveProperty("sameAs");
        expect(organization).not.toHaveProperty("address");
        expect(buildWebSiteJsonLd(ORIGIN)["@type"]).toBe("WebSite");
    });

    it("adds Service and BreadcrumbList on service pages", () => {
        const route = findPublicRoute("/services/web-applications")!;
        const payloads = buildJsonLdForRoute(ORIGIN, route).map((item) => item.data as Record<string, unknown>);
        expect(payloads.some((item) => item["@type"] === "Service")).toBe(true);
        expect(payloads.some((item) => item["@type"] === "BreadcrumbList")).toBe(true);
        expect(buildServiceJsonLd(ORIGIN, route)?.name).toBe("Web Applications");
        expect(buildBreadcrumbJsonLd(ORIGIN, route).itemListElement).toHaveLength(3);
    });

    it("adds Article metadata for published essays only", () => {
        const route = findPublicRoute("/insights/what-discovery-actually-decides")!;
        const article = buildArticleJsonLd(ORIGIN, route);
        expect(article?.headline).toBe("What discovery actually decides");
        expect(article?.author).toEqual({ "@type": "Organization", name: "Classific" });
        expect(buildArticleJsonLd(ORIGIN, { ...route, slug: "draft-measuring-engineering-outcomes" })).toBeUndefined();
        expect(buildServiceJsonLd(ORIGIN, { ...route, slug: "missing" })).toBeUndefined();
    });

    it("includes Organization and WebSite on the home page only", () => {
        const home = buildJsonLdForRoute(ORIGIN, findPublicRoute("/")!);
        const types = home.map((item) => (item.data as Record<string, unknown>)["@type"]);
        expect(types).toContain("Organization");
        expect(types).toContain("WebSite");
        expect(types).not.toContain("BreadcrumbList");
    });
});
