import { findPublicRoute } from "@/content/routes";
import type { Breadcrumb } from "@/content/routes";
import { site } from "@/data/site";
import { processStages } from "@/data/process";

export type ContactPageViewModel = {
    breadcrumbs: Breadcrumb[];
    hasDirectContact: boolean;
    contact: { email: string; phone: string; address: string };
    nextSteps: string[];
};

export function useContactPage(): ContactPageViewModel {
    const contact = site.contact;
    const discovery = processStages[0];
    return {
        breadcrumbs: findPublicRoute("/contact")?.breadcrumbs ?? [],
        hasDirectContact: Boolean(contact.email || contact.phone || contact.address),
        contact,
        nextSteps: [
            "We read every enquiry and reply by email.",
            discovery
                ? `If there is a fit, we propose a short ${discovery.title.toLowerCase()} conversation.`
                : "If there is a fit, we propose a short first conversation.",
            "Scope, approach and estimates follow in writing.",
        ],
    };
}
