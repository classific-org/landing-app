import { useCallback, useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import { getProjectCategories, getPublishedProjects } from "@/data/projects";
import { findPublicRoute } from "@/content/routes";
import type { Breadcrumb } from "@/content/routes";
import type { Project } from "@/types/content";
import {
    ALL_CATEGORY,
    CATEGORY_PARAM,
    filterProjects,
    resolveCategory,
    shouldShowFilters,
} from "@/lib/projects/filter";

export type WorkPageViewModel = {
    projects: Project[];
    allProjects: Project[];
    categories: string[];
    activeCategory: string;
    showFilters: boolean;
    breadcrumbs: Breadcrumb[];
    setCategory: (category: string) => void;
    hasProjects: boolean;
};

export function useWorkPage(loadProjects: () => Project[] = getPublishedProjects): WorkPageViewModel {
    const [searchParams, setSearchParams] = useSearchParams();
    const [allProjects] = useState(loadProjects);
    const categories = useMemo(() => getProjectCategories(allProjects), [allProjects]);
    const activeCategory = resolveCategory(searchParams.get(CATEGORY_PARAM), categories);

    const setCategory = useCallback(
        (category: string) => {
            setSearchParams(
                (previous) => {
                    const next = new URLSearchParams(previous);
                    if (category === ALL_CATEGORY) {
                        next.delete(CATEGORY_PARAM);
                    } else {
                        next.set(CATEGORY_PARAM, category);
                    }
                    return next;
                },
                { replace: true, preventScrollReset: true },
            );
        },
        [setSearchParams],
    );

    const projects = useMemo(
        () => filterProjects(allProjects, activeCategory),
        [allProjects, activeCategory],
    );

    return {
        projects,
        allProjects,
        categories,
        activeCategory,
        showFilters: shouldShowFilters(categories),
        breadcrumbs: findPublicRoute("/work")?.breadcrumbs ?? [],
        setCategory,
        hasProjects: allProjects.length > 0,
    };
}
