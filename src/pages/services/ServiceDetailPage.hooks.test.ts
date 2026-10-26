import { describe, expect, it } from "vitest";
import { resolveServiceDetail } from "@/pages/services/ServiceDetailPage.hooks";

describe("service detail model", () => {
    it("resolves known slugs and returns missing for anything else", () => {
        const ready = resolveServiceDetail("web-applications");
        expect(ready.status).toBe("ready");
        if (ready.status === "ready") {
            expect(ready.service.title).toBe("Web Applications");
            expect(ready.relatedProjects).toEqual([]);
            expect(ready.relatedServices.length).toBeGreaterThan(0);
        }
        expect(resolveServiceDetail("not-a-service")).toEqual({ status: "missing" });
        expect(resolveServiceDetail(undefined)).toEqual({ status: "missing" });
    });
});
