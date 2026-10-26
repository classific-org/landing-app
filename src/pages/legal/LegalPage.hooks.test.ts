import { describe, expect, it } from "vitest";
import { resolveLegalPage } from "@/pages/legal/LegalPage.hooks";

describe("legal page model", () => {
    it("loads privacy and terms drafts and rejects unknown slugs", () => {
        const privacy = resolveLegalPage("privacy");
        expect(privacy.status).toBe("ready");
        if (privacy.status === "ready") {
            expect(privacy.needsReviewCount).toBeGreaterThan(0);
            expect(privacy.reviewNotice).toMatch(/not been reviewed by legal counsel/i);
        }
        expect(resolveLegalPage("terms").status).toBe("ready");
        expect(resolveLegalPage("cookies")).toEqual({ status: "missing" });
        expect(resolveLegalPage(undefined)).toEqual({ status: "missing" });
    });
});
