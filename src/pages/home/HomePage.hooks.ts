import { services } from "@/data/services";
import { processStages } from "@/data/process";
import { capabilities, principles } from "@/data/principles";
import { getPublishedProjects } from "@/data/projects";
import { site } from "@/data/site";
import type { Principle, ProcessStage, Project, Service } from "@/types/content";

export type HomePageViewModel = {
    hero: {
        headline: string;
        copy: string;
    };
    capabilities: string[];
    services: Service[];
    stages: ProcessStage[];
    principles: Principle[];
    featuredProjects: Project[];
    hasFeaturedWork: boolean;
};

export const FEATURED_PROJECT_LIMIT = 3;

export function selectFeaturedProjects(
    projects: Project[],
    limit = FEATURED_PROJECT_LIMIT,
): Project[] {
    return projects.slice(0, limit);
}

export function useHomePage(): HomePageViewModel {
    const featuredProjects = selectFeaturedProjects(getPublishedProjects());
    return {
        hero: {
            headline: site.tagline,
            copy: "A digital product studio building web, mobile, desktop and enterprise software.",
        },
        capabilities,
        services,
        stages: processStages,
        principles,
        featuredProjects,
        hasFeaturedWork: featuredProjects.length > 0,
    };
}
