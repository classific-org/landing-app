import { describe, expect, it, vi } from "vitest";
import { defaultEnquiryValues, type EnquiryValues } from "@/lib/validation/enquiry";
import {
    GENERIC_SUBMIT_ERROR,
    createEnquiryClient,
    isValidEndpoint,
} from "@/services/contact/submit-enquiry";

function validValues(overrides: Partial<EnquiryValues> = {}): EnquiryValues {
    return {
        ...defaultEnquiryValues,
        name: "Alex Rivera",
        email: "alex@company.com",
        service: "custom-software",
        message: "We need a custom integration between billing and operations.",
        privacy: true,
        ...overrides,
    };
}

describe("enquiry client", () => {
    it("validates endpoints and reports unavailable when none is configured", async () => {
        expect(isValidEndpoint("https://forms.example/enquiry")).toBe(true);
        expect(isValidEndpoint("http://127.0.0.1:4173/api")).toBe(true);
        expect(isValidEndpoint("ftp://forms.example")).toBe(false);
        expect(isValidEndpoint("not-a-url")).toBe(false);

        const client = createEnquiryClient({ endpoint: "" });
        expect(client.isConfigured).toBe(false);
        await expect(client.submit(validValues())).resolves.toEqual({ status: "unavailable" });
    });

    it("returns invalid issues without calling the network", async () => {
        const fetcher = vi.fn();
        const client = createEnquiryClient({
            endpoint: "https://forms.example/enquiry",
            fetcher,
        });
        const result = await client.submit(defaultEnquiryValues);
        expect(result.status).toBe("invalid");
        expect(fetcher).not.toHaveBeenCalled();
    });

    it("does not report success when the honeypot is filled", async () => {
        const fetcher = vi.fn();
        const client = createEnquiryClient({
            endpoint: "https://forms.example/enquiry",
            fetcher,
        });
        await expect(client.submit(validValues({ website: "bot" }))).resolves.toEqual({
            status: "error",
            message: GENERIC_SUBMIT_ERROR,
        });
        expect(fetcher).not.toHaveBeenCalled();
    });

    it("reports sent only after a 2xx response", async () => {
        const fetcher = vi
            .fn()
            .mockResolvedValue(
                new Response("ok", { status: 202, headers: { "content-type": "text/plain" } }),
            );
        const client = createEnquiryClient({
            endpoint: "https://forms.example/enquiry",
            fetcher,
            now: () => new Date("2026-04-01T00:00:00.000Z"),
        });
        await expect(client.submit(validValues())).resolves.toEqual({ status: "sent" });
        expect(fetcher).toHaveBeenCalledOnce();
        const [, init] = fetcher.mock.calls[0] as [string, RequestInit];
        const body = JSON.parse(String(init.body));
        expect(body.privacyAccepted).toBe(true);
        expect(body.website).toBeUndefined();
    });

    it("reports a generic error for non-2xx and network failures", async () => {
        const failing = createEnquiryClient({
            endpoint: "https://forms.example/enquiry",
            fetcher: vi.fn().mockResolvedValue(new Response("no", { status: 500 })),
        });
        await expect(failing.submit(validValues())).resolves.toEqual({
            status: "error",
            message: GENERIC_SUBMIT_ERROR,
        });

        const exploding = createEnquiryClient({
            endpoint: "https://forms.example/enquiry",
            fetcher: vi.fn().mockRejectedValue(new Error("offline")),
        });
        await expect(exploding.submit(validValues())).resolves.toEqual({
            status: "error",
            message: GENERIC_SUBMIT_ERROR,
        });
    });
});
