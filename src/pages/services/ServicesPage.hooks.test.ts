import { describe, expect, it } from "vitest";
import { renderHook } from "@testing-library/react";
import { collectUnique, useServicesPage } from "@/pages/services/ServicesPage.hooks";

describe("services page helpers", () => {
    it("collects unique values up to a limit", () => {
        expect(collectUnique([["a", "b"], ["b", "c"]], 2)).toEqual(["a", "b"]);
        expect(collectUnique([[], ["x"]], 5)).toEqual(["x"]);
    });

    it("surfaces one problem per service and shared deliverables", () => {
        const { result } = renderHook(() => useServicesPage());
        expect(result.current.services).toHaveLength(5);
        expect(result.current.problems).toHaveLength(5);
        expect(result.current.deliverables.length).toBeGreaterThan(0);
        expect(result.current.deliverables.length).toBeLessThanOrEqual(8);
    });
});
