import { describe, expect, it } from "vitest";
import { renderHook } from "@testing-library/react";
import { useInsightsPage } from "@/pages/insights/InsightsPage.hooks";

describe("insights listing", () => {
    it("lists published articles and can render an empty list", () => {
        const published = renderHook(() => useInsightsPage());
        expect(published.result.current.hasArticles).toBe(true);
        expect(published.result.current.articles).toHaveLength(3);
        const empty = renderHook(() => useInsightsPage(() => []));
        expect(empty.result.current.hasArticles).toBe(false);
    });
});
