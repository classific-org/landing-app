import { useParams } from "react-router";
import { getRelatedServices, getServiceBySlug } from "@/data/services";
import { getProjectsForService } from "@/data/projects";
import { processStages } from "@/data/process";
import { findPublicRoute } from "@/content/routes";
import type { Breadcrumb } from "@/content/routes";
import type { ProcessStage, Project, Service } from "@/types/content";

export type ServiceDetailViewModel =
    | { status: "missing" }
    | {
          status: "ready";
          service: Service;
          relatedServices: Service[];
          relatedProjects: Project[];
          stages: ProcessStage[];
          breadcrumbs: Breadcrumb[];
      };

export function resolveServiceDetail(slug: string | undefined): ServiceDetailViewModel {
    const service = slug ? getServiceBySlug(slug) : undefined;
    if (!service) {
        return { status: "missing" };
    }
    return {
        status: "ready",
        service,
        relatedServices: getRelatedServices(service),
        relatedProjects: getProjectsForService(service.slug),
        stages: processStages,
        breadcrumbs: findPublicRoute(`/services/${service.slug}`)?.breadcrumbs ?? [],
    };
}

export function useServiceDetailPage(): ServiceDetailViewModel {
    const { slug } = useParams<{ slug: string }>();
    return resolveServiceDetail(slug);
}
