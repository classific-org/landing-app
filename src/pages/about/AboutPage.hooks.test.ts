import { describe, expect, it } from "vitest";
import { renderHook } from "@testing-library/react";
import { useAboutPage } from "@/pages/about/AboutPage.hooks";

describe("about page model", () => {
    it("exposes philosophy without invented company facts", () => {
        const { result } = renderHook(() => useAboutPage());
        expect(result.current.philosophy).toHaveLength(4);
        expect(result.current.services).toHaveLength(5);
        expect(JSON.stringify(result.current)).not.toMatch(/award|founded|employees|headcount/i);
    });
});
