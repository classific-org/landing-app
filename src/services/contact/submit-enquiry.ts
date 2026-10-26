import { createHttp, type HttpClient } from "@sometic/http";
import {
    isHoneypotTriggered,
    toEnquiryPayload,
    validateEnquiry,
    type EnquiryValues,
} from "@/lib/validation/enquiry";

export type SubmitEnquiryResult =
    | { status: "sent" }
    | { status: "unavailable" }
    | { status: "invalid"; issues: Array<{ path?: string; message: string }> }
    | { status: "error"; message: string };

export type EnquiryClient = {
    /** True when an endpoint is configured and submissions can be attempted. */
    readonly isConfigured: boolean;
    submit: (values: EnquiryValues, signal?: AbortSignal) => Promise<SubmitEnquiryResult>;
};

export type CreateEnquiryClientOptions = {
    endpoint: string;
    fetcher?: typeof fetch;
    timeoutMs?: number;
    now?: () => Date;
};

export const GENERIC_SUBMIT_ERROR =
    "Your enquiry could not be sent. Please try again in a moment. Nothing has been submitted.";

export function isValidEndpoint(endpoint: string): boolean {
    try {
        const url = new URL(endpoint);
        return url.protocol === "https:" || url.protocol === "http:";
    } catch {
        return false;
    }
}

/**
 * Integration boundary for enquiry submission. The UI only ever reports "sent" when the
 * configured endpoint returns a 2xx response. Without an endpoint the client reports
 * "unavailable" so the form can explain that the channel is not connected.
 */
export function createEnquiryClient(options: CreateEnquiryClientOptions): EnquiryClient {
    const endpoint = options.endpoint.trim();
    const isConfigured = isValidEndpoint(endpoint);
    let http: HttpClient | undefined;

    const getHttp = (): HttpClient => {
        if (!http) {
            http = createHttp({
                allowAbsoluteUrl: true,
                retry: false,
                dedupe: false,
                timeoutMs: options.timeoutMs ?? 15000,
                ...(options.fetcher ? { fetcher: options.fetcher } : {}),
            });
        }
        return http;
    };

    return {
        isConfigured,
        async submit(values, signal) {
            const issues = await validateEnquiry(values);
            if (issues.length > 0) {
                return {
                    status: "invalid",
                    issues: issues.map((issue) => ({ path: issue.path, message: issue.message })),
                };
            }
            if (isHoneypotTriggered(values)) {
                return { status: "error", message: GENERIC_SUBMIT_ERROR };
            }
            if (!isConfigured) {
                return { status: "unavailable" };
            }

            try {
                const response = await getHttp().post(
                    endpoint,
                    JSON.stringify(toEnquiryPayload(values, options.now)),
                    {
                        headers: { "content-type": "application/json", accept: "application/json" },
                        responseType: "text",
                        ...(signal ? { signal } : {}),
                    },
                );
                if (response.status >= 200 && response.status < 300) {
                    return { status: "sent" };
                }
                return { status: "error", message: GENERIC_SUBMIT_ERROR };
            } catch {
                return { status: "error", message: GENERIC_SUBMIT_ERROR };
            }
        },
    };
}
