import { describe, expect, it } from "vitest";
import { resolvePagesTarget } from "./deploy-pages.mjs";
import { normalizeBasePath } from "./lib/origin.mjs";

describe("normalizeBasePath", () => {
    it("treats an empty or root path as no base", () => {
        expect(normalizeBasePath("")).toBe("");
        expect(normalizeBasePath("/")).toBe("");
        expect(normalizeBasePath(undefined)).toBe("");
    });

    it("keeps a leading slash and drops the trailing one", () => {
        expect(normalizeBasePath("landing-app")).toBe("/landing-app");
        expect(normalizeBasePath("/landing-app/")).toBe("/landing-app");
    });
});

describe("resolvePagesTarget", () => {
    it("serves a project site from /repository on the owner's github.io origin", () => {
        expect(resolvePagesTarget({ GITHUB_REPOSITORY: "Classific-Org/landing-app" }, "")).toEqual({
            origin: "https://classific-org.github.io",
            basePath: "/landing-app",
            siteUrl: "https://classific-org.github.io/landing-app",
        });
    });

    it("serves a user site from the domain root", () => {
        const target = resolvePagesTarget({ GITHUB_REPOSITORY: "acme/acme.github.io" }, "");
        expect(target.basePath).toBe("");
        expect(target.siteUrl).toBe("https://acme.github.io");
    });

    it("lets SITE_ORIGIN and SITE_BASE override the derived values", () => {
        const target = resolvePagesTarget(
            {
                GITHUB_REPOSITORY: "acme/site",
                SITE_ORIGIN: "https://www.example.com",
                SITE_BASE: "/",
            },
            "",
        );
        expect(target.siteUrl).toBe("https://www.example.com");
    });

    it("serves a custom domain from its root", () => {
        expect(
            resolvePagesTarget({ GITHUB_REPOSITORY: "classific-org/landing-app" }, "classific.org"),
        ).toEqual({
            origin: "https://classific.org",
            basePath: "",
            siteUrl: "https://classific.org",
        });
    });
});
