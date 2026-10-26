import { services } from "@/data/services";
import { processStages } from "@/data/process";
import { generalFaqs } from "@/data/faqs";
import { findPublicRoute } from "@/content/routes";
import type { Breadcrumb } from "@/content/routes";
import type { Faq, ProcessStage, Service } from "@/types/content";

export type ServicesPageViewModel = {
    services: Service[];
    stages: ProcessStage[];
    faqs: Faq[];
    breadcrumbs: Breadcrumb[];
    problems: string[];
    deliverables: string[];
};

export function collectUnique(values: string[][], limit: number): string[] {
    const seen = new Set<string>();
    const result: string[] = [];
    for (const group of values) {
        for (const value of group) {
            if (!seen.has(value) && result.length < limit) {
                seen.add(value);
                result.push(value);
            }
        }
    }
    return result;
}

export function useServicesPage(): ServicesPageViewModel {
    return {
        services,
        stages: processStages,
        faqs: generalFaqs,
        breadcrumbs: findPublicRoute("/services")?.breadcrumbs ?? [],
        problems: collectUnique(
            services.map((service) => [service.problems[0] ?? ""].filter(Boolean)),
            5,
        ),
        deliverables: collectUnique(
            services.map((service) => service.deliverables),
            8,
        ),
    };
}
