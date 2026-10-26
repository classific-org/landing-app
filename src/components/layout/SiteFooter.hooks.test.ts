import { describe, expect, it } from "vitest";
import { renderHook } from "@testing-library/react";
import { buildCopyright, useSiteFooter } from "@/components/layout/SiteFooter.hooks";

describe("site footer", () => {
    it("builds a copyright line and hides empty contact details", () => {
        expect(buildCopyright(2026, "Classific")).toBe("© 2026 Classific. All rights reserved.");
        const { result } = renderHook(() => useSiteFooter(() => new Date("2026-10-26T00:00:00Z")));
        expect(result.current.hasContact).toBe(false);
        expect(result.current.social).toEqual([]);
        expect(result.current.copyright).toContain("2026");
        expect(result.current.serviceLinks).toHaveLength(5);
        expect(result.current.legalLinks.map((item) => item.href)).toEqual(["/privacy", "/terms"]);
    });
});
