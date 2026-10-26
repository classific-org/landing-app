import { describe, expect, it } from "vitest";
import { selectFeaturedProjects, useHomePage } from "@/pages/home/HomePage.hooks";
import { publishedProjectFixtures } from "@/test/fixtures/projects";
import { renderHook } from "@testing-library/react";

describe("home page model", () => {
    it("limits featured projects and reports when none are published", () => {
        expect(selectFeaturedProjects(publishedProjectFixtures, 1)).toHaveLength(1);
        expect(selectFeaturedProjects([])).toEqual([]);
        const { result } = renderHook(() => useHomePage());
        expect(result.current.hasFeaturedWork).toBe(false);
        expect(result.current.featuredProjects).toEqual([]);
        expect(result.current.hero.primary.to).toBe("/contact");
        expect(result.current.services).toHaveLength(5);
        expect(result.current.capabilities).toHaveLength(5);
    });
});
