import { describe, expect, it } from "vitest";
import { describeError } from "@/lib/errors/describe";

describe("describeError", () => {
    it("explains a 404 route response without suggesting a reload", () => {
        const result = describeError({ status: 404, statusText: "Not Found", data: "" });
        expect(result.status).toBe(404);
        expect(result.title).toMatch(/does not exist/i);
        expect(result.reloadHelps).toBe(false);
    });

    it("treats a 5xx route response as retryable", () => {
        const result = describeError({ status: 503, statusText: "Service Unavailable" });
        expect(result.status).toBe(503);
        expect(result.reloadHelps).toBe(true);
        expect(result.message).toBe("503 Service Unavailable");
    });

    it("recognises the duplicate-React crash and gives the dev-server fix in development", () => {
        const error = new TypeError("Cannot read properties of null (reading 'useMemo')");
        const dev = describeError(error, true);
        expect(dev.hint).toMatch(/node_modules\/\.vite/);
        expect(dev.hint).toMatch(/--force/);
        expect(dev.stack).toContain("TypeError");

        const production = describeError(error, false);
        expect(production.hint).not.toMatch(/node_modules/);
        expect(production.hint).toMatch(/reload/i);
    });

    it("recognises a chunk that failed to load", () => {
        const result = describeError(
            new TypeError("Failed to fetch dynamically imported module: /assets/AboutPage.js"),
        );
        expect(result.title).toMatch(/could not be loaded/i);
        expect(result.hint).toMatch(/reload/i);
    });

    it("falls back to a calm generic message for any other error", () => {
        const result = describeError(new Error("boom"));
        expect(result.title).toBe("Something went wrong.");
        expect(result.message).toBe("boom");
        expect(result.hint).toBeUndefined();
    });

    it("copes with thrown strings and unknown values", () => {
        expect(describeError("plain text").message).toBe("plain text");
        expect(describeError(undefined).message).toMatch(/unknown/i);
    });
});
