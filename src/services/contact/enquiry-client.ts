import { env } from "@/config/env";
import { createEnquiryClient, type EnquiryClient } from "@/services/contact/submit-enquiry";

let client: EnquiryClient | undefined;

/** Application-wide enquiry client built from the configured endpoint. */
export function getEnquiryClient(): EnquiryClient {
    if (!client) {
        client = createEnquiryClient({ endpoint: env.contactEndpoint });
    }
    return client;
}

/** Test helper. Discards the cached client so the next call reads current configuration. */
export function resetEnquiryClient(): void {
    client = undefined;
}
