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
        primary: { label: string; to: string };
        secondary: { label: string; to: string };
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
            copy: "We design and build web, mobile, desktop, and enterprise software that helps businesses move faster, work smarter, and grow with confidence.",
            primary: { label: "Start a Project", to: "/contact" },
            secondary: { label: "See Our Work", to: "/work" },
        },
        capabilities,
        services,
        stages: processStages,
        principles,
        featuredProjects,
        hasFeaturedWork: featuredProjects.length > 0,
    };
}
