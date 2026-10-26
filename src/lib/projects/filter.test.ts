import { describe, expect, it } from "vitest";
import { ALL_CATEGORY, filterProjects, resolveCategory, shouldShowFilters } from "@/lib/projects/filter";
import { publishedProjectFixtures } from "@/test/fixtures/projects";

describe("project filters", () => {
    it("returns every project for the all category and filters otherwise", () => {
        expect(filterProjects(publishedProjectFixtures, ALL_CATEGORY)).toHaveLength(2);
        expect(filterProjects(publishedProjectFixtures, "Web").map((project) => project.slug)).toEqual([
            "operations-portal",
        ]);
        expect(filterProjects(publishedProjectFixtures, "Desktop")).toEqual([]);
    });

    it("shows filters only when two published categories exist", () => {
        expect(shouldShowFilters([])).toBe(false);
        expect(shouldShowFilters(["Web"])).toBe(false);
        expect(shouldShowFilters(["Web", "Mobile"])).toBe(true);
    });

    it("falls back to all when the requested category is missing", () => {
        expect(resolveCategory("Web", ["Web", "Mobile"])).toBe("Web");
        expect(resolveCategory("Desktop", ["Web", "Mobile"])).toBe(ALL_CATEGORY);
        expect(resolveCategory(null, ["Web"])).toBe(ALL_CATEGORY);
    });
});
