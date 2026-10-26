import { describe, expect, it } from "vitest";
import { getRelatedServices, getServiceBySlug, services } from "@/data/services";

describe("service records", () => {
    it("exposes five services and resolves related records", () => {
        expect(services).toHaveLength(5);
        expect(getServiceBySlug("custom-software")?.title).toBe("Custom Software Solutions");
        expect(getServiceBySlug("missing")).toBeUndefined();
        const related = getRelatedServices(getServiceBySlug("web-applications")!);
        expect(related.every((service) => service.slug !== "web-applications")).toBe(true);
    });
});
