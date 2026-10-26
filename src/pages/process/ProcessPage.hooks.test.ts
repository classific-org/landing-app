import { describe, expect, it } from "vitest";
import { renderHook } from "@testing-library/react";
import { useProcessPage } from "@/pages/process/ProcessPage.hooks";

describe("process page model", () => {
    it("lists five stages without guaranteed timelines", () => {
        const { result } = renderHook(() => useProcessPage());
        expect(result.current.stages).toHaveLength(5);
        expect(result.current.expectations.length).toBeGreaterThan(0);
        expect(JSON.stringify(result.current.stages)).not.toMatch(/guarantee|always delivered in/i);
    });
});
