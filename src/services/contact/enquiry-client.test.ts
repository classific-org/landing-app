import { describe, expect, it } from "vitest";
import { getEnquiryClient, resetEnquiryClient } from "@/services/contact/enquiry-client";

describe("enquiry client singleton", () => {
    it("reuses the same instance until reset", () => {
        resetEnquiryClient();
        const first = getEnquiryClient();
        const second = getEnquiryClient();
        expect(first).toBe(second);
        resetEnquiryClient();
        expect(getEnquiryClient()).not.toBe(first);
    });
});
