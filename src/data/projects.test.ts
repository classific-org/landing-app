import { describe, expect, it } from "vitest";
import {
    getProjectCategories,
    getProjectsForService,
    getPublishedProjectBySlug,
    getPublishedProjects,
    getRelatedProjects,
    projects,
} from "@/data/projects";
import { draftProject, publishedProjectFixtures, publishedWebProject } from "@/test/fixtures/projects";

describe("project records", () => {
    it("starts with no published work", () => {
        expect(projects).toEqual([]);
        expect(getPublishedProjects()).toEqual([]);
        expect(getPublishedProjectBySlug("operations-portal")).toBeUndefined();
    });

    it("derives categories and related work from a published pool", () => {
        expect(getProjectCategories(publishedProjectFixtures)).toEqual(["Mobile", "Web"]);
        expect(
            getProjectsForService("web-applications", 3, [...publishedProjectFixtures, draftProject]).map(
                (project) => project.slug,
            ),
        ).toEqual(["operations-portal", "field-companion"]);
        expect(
            getRelatedProjects(publishedWebProject, 3, publishedProjectFixtures).map((project) => project.slug),
        ).toEqual(["field-companion"]);
        expect(getRelatedProjects(publishedWebProject, 3, [publishedWebProject, draftProject])).toEqual([]);
    });
});
