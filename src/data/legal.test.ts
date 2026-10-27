import { describe, expect, it } from "vitest";
import { getLegalDocument, legalDocuments, legalReviewNotice } from "@/data/legal";

describe("legal documents", () => {
    it("exposes privacy and terms drafts that still need review", () => {
        expect(legalDocuments.map((document) => document.slug)).toEqual(["privacy", "terms"]);
        expect(legalReviewNotice).toMatch(/not been reviewed by legal counsel/i);
        expect(getLegalDocument("privacy")?.sections.some((section) => section.needsReview)).toBe(
            true,
        );
        expect(getLegalDocument("unknown")).toBeUndefined();
    });
});
