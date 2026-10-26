import { describe, expect, it } from "vitest";
import { resolveProjectPage } from "@/pages/work/ProjectPage.hooks";
import { draftProject, publishedWebProject } from "@/test/fixtures/projects";

describe("project page model", () => {
    it("renders published fixtures and treats drafts as missing", () => {
        const ready = resolveProjectPage(publishedWebProject.slug, () => publishedWebProject);
        expect(ready.status).toBe("ready");
        if (ready.status === "ready") {
            expect(ready.hasOutcomes).toBe(true);
            expect(ready.services.map((service) => service.slug)).toContain("web-applications");
        }
        expect(resolveProjectPage(undefined)).toEqual({ status: "missing" });
        expect(resolveProjectPage(draftProject.slug)).toEqual({ status: "missing" });
    });
});
