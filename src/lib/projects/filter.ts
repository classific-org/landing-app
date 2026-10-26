import type { Project } from "@/types/content";

export const ALL_CATEGORY = "all";
export const CATEGORY_PARAM = "category";

export function filterProjects(projects: Project[], category: string): Project[] {
    if (category === ALL_CATEGORY) {
        return projects;
    }
    return projects.filter((project) => project.category === category);
}

export function shouldShowFilters(categories: string[]): boolean {
    return categories.length >= 2;
}

export function resolveCategory(requested: string | null, categories: string[]): string {
    if (requested && categories.includes(requested)) {
        return requested;
    }
    return ALL_CATEGORY;
}
