import { describe, expect, it } from "vitest";
import {
    isLocalOrigin,
    isValidProductionOrigin,
    normalizeOrigin,
    requireProductionOrigin,
    resolveSiteEnv,
} from "@/config/env";

describe("site environment", () => {
    it("classifies loopback and .local hosts as local", () => {
        expect(isLocalOrigin("http://localhost:5173")).toBe(true);
        expect(isLocalOrigin("https://127.0.0.1")).toBe(true);
        expect(isLocalOrigin("https://0.0.0.0")).toBe(true);
        expect(isLocalOrigin("https://studio.local")).toBe(true);
        expect(isLocalOrigin("https://www.classific.example")).toBe(false);
        expect(isLocalOrigin("not-a-url")).toBe(false);
    });

    it("accepts only absolute https origins without a path", () => {
        expect(isValidProductionOrigin("https://www.classific.example")).toBe(true);
        expect(isValidProductionOrigin("https://www.classific.example/")).toBe(true);
        expect(isValidProductionOrigin("http://www.classific.example")).toBe(false);
        expect(isValidProductionOrigin("https://localhost")).toBe(false);
        expect(isValidProductionOrigin("https://www.classific.example/app")).toBe(false);
        expect(isValidProductionOrigin("")).toBe(false);
    });

    it("normalizes trailing slashes and requires a production origin", () => {
        expect(normalizeOrigin("https://www.classific.example///")).toBe(
            "https://www.classific.example",
        );
        expect(requireProductionOrigin("https://www.classific.example/")).toBe(
            "https://www.classific.example",
        );
        expect(() => requireProductionOrigin("http://localhost:4173")).toThrow(/SITE_ORIGIN/);
        expect(() => requireProductionOrigin("")).toThrow(/\(empty\)/);
    });

    it("falls back to a local origin in development when none is configured", () => {
        const env = resolveSiteEnv({ siteOrigin: undefined, contactEndpoint: undefined });
        expect(env.siteOrigin).toBe("http://localhost:5173");
        expect(env.contactEndpoint).toBe("");
        expect(env.hasConfiguredOrigin).toBe(false);
    });

    it("keeps a configured origin and trims the contact endpoint", () => {
        const env = resolveSiteEnv({
            siteOrigin: " https://www.classific.example/ ",
            contactEndpoint: " https://forms.example/enquiry ",
        });
        expect(env.siteOrigin).toBe("https://www.classific.example");
        expect(env.contactEndpoint).toBe("https://forms.example/enquiry");
        expect(env.hasConfiguredOrigin).toBe(true);
    });
});
