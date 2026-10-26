import { processStages } from "@/data/process";
import { generalFaqs } from "@/data/faqs";
import { findPublicRoute } from "@/content/routes";
import type { Breadcrumb } from "@/content/routes";
import type { Faq, ProcessStage } from "@/types/content";

export type CollaborationExpectation = {
    title: string;
    description: string;
};

export const collaborationExpectations: CollaborationExpectation[] = [
    {
        title: "A named decision-maker",
        description:
            "Projects move at the speed of decisions. We ask for one person who can prioritise, approve and unblock on your side.",
    },
    {
        title: "Regular, short reviews",
        description:
            "Working software is demonstrated on a steady rhythm. Reviews are short, focused on what has changed and what comes next.",
    },
    {
        title: "Access to real users and systems",
        description:
            "Design and integration work depends on seeing how the work is done today and the systems it touches.",
    },
    {
        title: "Written decisions",
        description:
            "Scope, trade-offs and architecture choices are recorded so the reasoning is available to everyone, including people who join later.",
    },
];

export type ProcessPageViewModel = {
    stages: ProcessStage[];
    expectations: CollaborationExpectation[];
    faqs: Faq[];
    breadcrumbs: Breadcrumb[];
};

export function useProcessPage(): ProcessPageViewModel {
    return {
        stages: processStages,
        expectations: collaborationExpectations,
        faqs: generalFaqs,
        breadcrumbs: findPublicRoute("/process")?.breadcrumbs ?? [],
    };
}
