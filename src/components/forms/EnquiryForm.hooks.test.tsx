import { describe, expect, it, vi } from "vitest";
import { act, renderHook, waitFor } from "@testing-library/react";
import { mapResultToSubmission, useEnquiryForm } from "@/components/forms/EnquiryForm.hooks";
import { defaultEnquiryValues } from "@/lib/validation/enquiry";
import type { EnquiryClient } from "@/services/contact/submit-enquiry";

const validValues = {
    ...defaultEnquiryValues,
    name: "Alex Rivera",
    email: "alex@company.com",
    service: "web-applications",
    message: "We need a customer portal that replaces a set of shared spreadsheets.",
    privacy: true,
};

describe("enquiry form hook", () => {
    it("maps every client result to a UI state and never invents success", () => {
        expect(mapResultToSubmission({ status: "sent" })).toEqual({ status: "sent" });
        expect(mapResultToSubmission({ status: "unavailable" })).toEqual({ status: "unavailable" });
        expect(mapResultToSubmission({ status: "error", message: "down" })).toEqual({
            status: "error",
            message: "down",
        });
        expect(mapResultToSubmission({ status: "invalid", issues: [] })).toEqual({
            status: "error",
            message: "Please correct the highlighted fields and try again.",
        });
    });

    it("submits valid values and resets after a confirmed delivery", async () => {
        const client: EnquiryClient = {
            isConfigured: true,
            submit: vi.fn().mockResolvedValue({ status: "sent" }),
        };
        const { result } = renderHook(() => useEnquiryForm(client));
        expect(result.current.isConfigured).toBe(true);

        act(() => {
            result.current.fields.name.setValue(validValues.name);
            result.current.fields.email.setValue(validValues.email);
            result.current.fields.service.setValue(validValues.service);
            result.current.fields.message.setValue(validValues.message);
            result.current.fields.privacy.setValue(true);
        });

        await act(async () => {
            result.current.handleSubmit({
                preventDefault() {
                    /* form event */
                },
            } as React.FormEvent<HTMLFormElement>);
        });

        await waitFor(() => {
            expect(result.current.submission.status).toBe("sent");
        });
        expect(client.submit).toHaveBeenCalledOnce();

        act(() => result.current.reset());
        expect(result.current.submission.status).toBe("idle");
        expect(result.current.fields.name.value).toBe("");
    });

    it("keeps the honeypot out of the visible field model", () => {
        const { result } = renderHook(() =>
            useEnquiryForm({ isConfigured: false, submit: vi.fn().mockResolvedValue({ status: "unavailable" }) }),
        );
        expect(result.current.honeypot.name).toBe("website");
        act(() => result.current.honeypot.setValue("spam"));
        expect(result.current.honeypot.value).toBe("spam");
        expect(result.current.fields).not.toHaveProperty("website");
    });
});
