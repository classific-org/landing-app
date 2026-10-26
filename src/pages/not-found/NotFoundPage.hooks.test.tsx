import { describe, expect, it } from "vitest";
import { renderHook } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { useNotFoundPage } from "@/pages/not-found/NotFoundPage.hooks";

describe("not-found model", () => {
    it("exposes the requested path and crawlable suggestions", () => {
        const { result } = renderHook(() => useNotFoundPage(), {
            wrapper: ({ children }) => (
                <MemoryRouter initialEntries={["/missing-page"]}>{children}</MemoryRouter>
            ),
        });
        expect(result.current.pathname).toBe("/missing-page");
        expect(result.current.suggestions.some((item) => item.href === "/")).toBe(false);
        expect(result.current.suggestions.some((item) => item.href === "/services")).toBe(true);
    });
});
