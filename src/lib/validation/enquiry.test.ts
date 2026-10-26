import { describe, expect, it } from "vitest";
import {
    BUDGET_OPTIONS,
    MESSAGE_MAX_LENGTH,
    defaultEnquiryValues,
    isHoneypotTriggered,
    toEnquiryPayload,
    validateEnquiry,
    type EnquiryValues,
} from "@/lib/validation/enquiry";

function validValues(overrides: Partial<EnquiryValues> = {}): EnquiryValues {
    return {
        ...defaultEnquiryValues,
        name: "Alex Rivera",
        email: "alex@company.com",
        service: "web-applications",
        message: "We need a customer portal that replaces a set of shared spreadsheets.",
        privacy: true,
        ...overrides,
    };
}

describe("enquiry validation", () => {
    it("accepts a complete enquiry and strips the honeypot from the payload", async () => {
        const values = validValues({ company: "Northwind", budget: "25k-50k", website: "" });
        expect(await validateEnquiry(values)).toEqual([]);
        const payload = toEnquiryPayload(values, () => new Date("2026-04-01T12:00:00.000Z"));
        expect(payload).toEqual({
            name: "Alex Rivera",
            email: "alex@company.com",
            company: "Northwind",
            service: "web-applications",
            budget: "25k-50k",
            message: values.message,
            privacyAccepted: true,
            submittedAt: "2026-04-01T12:00:00.000Z",
        });
        expect(payload).not.toHaveProperty("website");
    });

    it("requires name, email, service, message and privacy", async () => {
        const issues = await validateEnquiry(defaultEnquiryValues);
        const paths = issues.map((issue) => issue.path);
        expect(paths).toContain("name");
        expect(paths).toContain("email");
        expect(paths).toContain("service");
        expect(paths).toContain("message");
        expect(paths).toContain("privacy");
    });

    it("rejects an invalid email and a short message", async () => {
        const issues = await validateEnquiry(
            validValues({ email: "not-an-email", message: "Too short" }),
        );
        expect(issues.some((issue) => issue.path === "email")).toBe(true);
        expect(issues.some((issue) => issue.path === "message")).toBe(true);
    });

    it("rejects unknown services and budgets and overly long fields", async () => {
        const issues = await validateEnquiry(
            validValues({
                name: "n".repeat(121),
                company: "c".repeat(161),
                service: "not-a-service",
                budget: "unlimited",
                message: "m".repeat(MESSAGE_MAX_LENGTH + 1),
            }),
        );
        expect(issues.some((issue) => issue.path === "name")).toBe(true);
        expect(issues.some((issue) => issue.path === "company")).toBe(true);
        expect(issues.some((issue) => issue.path === "service")).toBe(true);
        expect(issues.some((issue) => issue.path === "budget")).toBe(true);
        expect(issues.some((issue) => issue.path === "message")).toBe(true);
    });

    it("allows an empty optional budget and treats a filled honeypot as triggered", () => {
        expect(BUDGET_OPTIONS.some((option) => option.value === "")).toBe(true);
        expect(isHoneypotTriggered({ website: "" })).toBe(false);
        expect(isHoneypotTriggered({ website: "http://spam.test" })).toBe(true);
    });
});
