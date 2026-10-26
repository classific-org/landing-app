import { describe, expect, it } from "vitest";
import { findPublicRoute } from "@/content/routes";
import {
    TITLE_TEMPLATE,
    buildBaseHeadPatch,
    buildHeadSnapshot,
    buildNotFoundHeadPatch,
    buildRouteHeadPatch,
} from "@/lib/seo/head";

const ORIGIN = "https://www.classific.example";

describe("document head patches", () => {
    it("applies the site title template and language", () => {
        expect(TITLE_TEMPLATE).toBe("%s | Classific");
        expect(buildBaseHeadPatch().htmlAttrs).toEqual({ lang: "en" });
    });

    it("builds unique metadata for an indexable route", () => {
        const route = findPublicRoute("/services/web-applications");
        expect(route).toBeDefined();
        const snapshot = buildHeadSnapshot(ORIGIN, route!);
        expect(snapshot.title).toContain("Web Application Development");
        const names = snapshot.meta.map((item) => item.name ?? item.property);
        expect(names).toContain("description");
        expect(names).toContain("og:title");
        expect(names).toContain("og:description");
        expect(names).toContain("og:image");
        expect(names).toContain("og:url");
        expect(names).toContain("og:type");
        expect(names).toContain("twitter:card");
        expect(snapshot.link.some((link) => link.rel === "canonical")).toBe(true);
        expect(JSON.stringify(snapshot)).not.toContain("localhost");
    });

    it("uses the site name as the home title without a suffix", () => {
        const route = findPublicRoute("/");
        const patch = buildRouteHeadPatch(ORIGIN, route!);
        expect(patch.title).toBe("Classific: Software for what's next.");
        expect(patch.titleTemplate).toBe("%s");
    });

    it("marks unknown pages as noindex", () => {
        const patch = buildNotFoundHeadPatch();
        expect(patch.title).toBe("Page not found");
        expect(patch.meta?.some((item) => item.name === "robots" && item.content?.includes("noindex"))).toBe(
            true,
        );
    });
});
