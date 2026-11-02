import type { Project } from "@/types/content";
import { cmsContent } from "@/data/cms";

/**
 * Portfolio records. Only entries with status "published" are rendered, routed,
 * listed in the sitemap or included in llms files. They come from the CMS: publish a project in
 * the admin panel and the next build of the site includes it (see scripts/fetch-cms.mjs).
 */
export const projects: Project[] = cmsContent ? cmsContent.projects : [];

export function getPublishedProjects(): Project[] {
    return projects.filter((project) => project.status === "published");
}

export function getPublishedProjectBySlug(slug: string): Project | undefined {
    return getPublishedProjects().find((project) => project.slug === slug);
}

export function getProjectCategories(list: Project[]): string[] {
    return Array.from(new Set(list.map((project) => project.category))).sort((a, b) =>
        a.localeCompare(b),
    );
}

export function getProjectsForService(
    serviceSlug: string,
    limit = 3,
    pool: Project[] = getPublishedProjects(),
): Project[] {
    return pool
        .filter((project) => project.status === "published")
        .filter((project) => project.services.some((slug) => slug === serviceSlug))
        .slice(0, limit);
}

export function getRelatedProjects(
    project: Project,
    limit = 3,
    pool: Project[] = getPublishedProjects(),
): Project[] {
    return pool
        .filter((candidate) => candidate.status === "published")
        .filter(
            (candidate) =>
                candidate.slug !== project.slug &&
                (candidate.category === project.category ||
                    candidate.services.some((slug) => project.services.includes(slug))),
        )
        .slice(0, limit);
}
