import { describe, expect, it } from "vitest";
import { normalizePath, toAbsoluteUrl } from "@/lib/seo/urls";

describe("URL helpers", () => {
    it("normalizes empty, root, query and trailing-slash paths", () => {
        expect(normalizePath("")).toBe("/");
        expect(normalizePath("/")).toBe("/");
        expect(normalizePath("services")).toBe("/services");
        expect(normalizePath("/services/")).toBe("/services");
        expect(normalizePath("/services?x=1#top")).toBe("/services");
        expect(normalizePath("///")).toBe("/");
    });

    it("builds absolute URLs from an origin and path", () => {
        expect(toAbsoluteUrl("https://www.classific.example/", "/")).toBe(
            "https://www.classific.example/",
        );
        expect(toAbsoluteUrl("https://www.classific.example/", "services")).toBe(
            "https://www.classific.example/services",
        );
        expect(toAbsoluteUrl("https://www.classific.example", "/insights/a/")).toBe(
            "https://www.classific.example/insights/a",
        );
    });
});
