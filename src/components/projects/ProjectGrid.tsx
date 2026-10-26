import { ProjectCard } from "@/components/projects/ProjectCard";
import type { Project } from "@/types/content";

type ProjectGridProps = {
    projects: Project[];
    emptyTitle?: string;
    emptyCopy?: string;
    headingLevel?: "h2" | "h3";
};

export function ProjectGrid({
    projects,
    emptyTitle = "No published projects yet.",
    emptyCopy = "Case studies are published only with verified details and client permission. This section will show real work as it is approved for release.",
    headingLevel = "h3",
}: ProjectGridProps) {
    if (projects.length === 0) {
        return (
            <div
                className="border-y border-rule py-12 md:py-16"
                role="status"
                data-testid="projects-empty"
            >
                <p className="text-h3">{emptyTitle}</p>
                <p className="mt-4 max-w-xl text-body text-body">{emptyCopy}</p>
            </div>
        );
    }

    return (
        <ul className="grid gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
                <li key={project.slug}>
                    <ProjectCard project={project} headingLevel={headingLevel} />
                </li>
            ))}
        </ul>
    );
}
