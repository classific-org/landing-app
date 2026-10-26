import { describe, expect, it } from "vitest";
import { renderHook } from "@testing-library/react";
import { useContactPage } from "@/pages/contact/ContactPage.hooks";

describe("contact page model", () => {
    it("does not invent direct contact details", () => {
        const { result } = renderHook(() => useContactPage());
        expect(result.current.hasDirectContact).toBe(false);
        expect(result.current.contact.email).toBe("");
        expect(result.current.nextSteps.length).toBeGreaterThan(0);
    });
});
