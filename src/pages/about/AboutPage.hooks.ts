import { principles } from "@/data/principles";
import { services } from "@/data/services";
import { site } from "@/data/site";
import { findPublicRoute } from "@/content/routes";
import type { Breadcrumb } from "@/content/routes";
import type { Principle, Service } from "@/types/content";

export type PhilosophyPoint = {
    title: string;
    description: string;
};

export const philosophy: PhilosophyPoint[] = [
    {
        title: "Start with the problem",
        description:
            "We spend time understanding the business challenge before proposing a solution. The best technical decision is often to build less, and we say so.",
    },
    {
        title: "Build for maintenance",
        description:
            "Software spends most of its life being changed. Clear structure, automated tests and documentation are how we keep that affordable.",
    },
    {
        title: "Show working software early",
        description:
            "Progress is demonstrated with running software rather than status reports. Feedback arrives while it is still cheap to act on.",
    },
    {
        title: "Say what we know and what we do not",
        description:
            "Estimates carry their assumptions. Risks are named early. We would rather raise a concern now than explain it later.",
    },
];

export type AboutPageViewModel = {
    description: string;
    philosophy: PhilosophyPoint[];
    principles: Principle[];
    services: Service[];
    breadcrumbs: Breadcrumb[];
};

export function useAboutPage(): AboutPageViewModel {
    return {
        description: site.description,
        philosophy,
        principles,
        services,
        breadcrumbs: findPublicRoute("/about")?.breadcrumbs ?? [],
    };
}
