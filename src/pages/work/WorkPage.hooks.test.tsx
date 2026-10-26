import { describe, expect, it } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { useWorkPage } from "@/pages/work/WorkPage.hooks";
import { publishedProjectFixtures } from "@/test/fixtures/projects";

describe("work page model", () => {
    it("shows an empty published list by default", () => {
        const { result } = renderHook(() => useWorkPage(), {
            wrapper: ({ children }) => <MemoryRouter>{children}</MemoryRouter>,
        });
        expect(result.current.hasProjects).toBe(false);
        expect(result.current.showFilters).toBe(false);
        expect(result.current.projects).toEqual([]);
    });

    it("filters published fixtures and writes the category to the query string", () => {
        const { result } = renderHook(() => useWorkPage(() => publishedProjectFixtures), {
            wrapper: ({ children }) => (
                <MemoryRouter initialEntries={["/work"]}>{children}</MemoryRouter>
            ),
        });
        expect(result.current.hasProjects).toBe(true);
        expect(result.current.showFilters).toBe(true);
        act(() => result.current.setCategory("Web"));
        expect(result.current.activeCategory).toBe("Web");
        expect(result.current.projects).toHaveLength(1);
        act(() => result.current.setCategory("all"));
        expect(result.current.projects).toHaveLength(2);
    });
});
