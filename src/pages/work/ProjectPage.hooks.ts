import { useParams } from "react-router";
import { getPublishedProjectBySlug, getRelatedProjects } from "@/data/projects";
import { services as allServices } from "@/data/services";
import { findPublicRoute } from "@/content/routes";
import type { Breadcrumb } from "@/content/routes";
import type { Project, Service } from "@/types/content";

export type ProjectPageViewModel =
    | { status: "missing" }
    | {
          status: "ready";
          project: Project;
          relatedProjects: Project[];
          services: Service[];
          breadcrumbs: Breadcrumb[];
          hasOutcomes: boolean;
      };

export function resolveProjectPage(
    slug: string | undefined,
    lookup: (slug: string) => Project | undefined = getPublishedProjectBySlug,
): ProjectPageViewModel {
    const project = slug ? lookup(slug) : undefined;
    if (!project) {
        return { status: "missing" };
    }
    return {
        status: "ready",
        project,
        relatedProjects: getRelatedProjects(project),
        services: allServices.filter((service) => project.services.includes(service.slug)),
        breadcrumbs: findPublicRoute(`/work/${project.slug}`)?.breadcrumbs ?? [],
        hasOutcomes: (project.outcomes?.length ?? 0) > 0,
    };
}

export function useProjectPage(): ProjectPageViewModel {
    const { slug } = useParams<{ slug: string }>();
    return resolveProjectPage(slug);
}
