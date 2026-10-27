import { describe, expect, it } from "vitest";
import {
    isLocalOrigin,
    isValidProductionOrigin,
    normalizeOrigin,
    requireProductionOrigin,
} from "./origin.mjs";

describe("origin helpers", () => {
    it("treats loopback and .local hosts as local", () => {
        expect(isLocalOrigin("http://localhost:5173")).toBe(true);
        expect(isLocalOrigin("https://127.0.0.1")).toBe(true);
        expect(isLocalOrigin("https://0.0.0.0")).toBe(true);
        expect(isLocalOrigin("https://site.local")).toBe(true);
        expect(isLocalOrigin("https://www.classific.example")).toBe(false);
        expect(isLocalOrigin("not a url")).toBe(false);
    });

    it("accepts only absolute https production origins", () => {
        expect(isValidProductionOrigin("https://www.classific.example")).toBe(true);
        expect(isValidProductionOrigin("https://www.classific.example/")).toBe(true);
        expect(isValidProductionOrigin("http://www.classific.example")).toBe(false);
        expect(isValidProductionOrigin("https://localhost")).toBe(false);
        expect(isValidProductionOrigin("https://www.classific.example/path")).toBe(false);
        expect(isValidProductionOrigin("")).toBe(false);
    });

    it("strips trailing slashes and throws when the origin is not production-safe", () => {
        expect(normalizeOrigin("https://www.classific.example/")).toBe(
            "https://www.classific.example",
        );
        expect(requireProductionOrigin("https://www.classific.example/")).toBe(
            "https://www.classific.example",
        );
        expect(() => requireProductionOrigin("http://localhost:5173")).toThrow(/SITE_ORIGIN/);
        expect(() => requireProductionOrigin("")).toThrow(/\(empty\)/);
    });
});
