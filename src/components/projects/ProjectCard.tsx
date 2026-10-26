import { Link } from "react-router";
import { Icon } from "@/components/ui/Icon";
import type { Project } from "@/types/content";

type ProjectCardProps = {
    project: Project;
    headingLevel?: "h2" | "h3";
};

export function ProjectCard({ project, headingLevel = "h3" }: ProjectCardProps) {
    const Heading = headingLevel;
    const href = `/work/${project.slug}`;
    return (
        <article className="flex flex-col border-t border-rule pt-6">
            <Link to={href} className="block overflow-hidden rounded-sm bg-rule" tabIndex={-1} aria-hidden="true">
                {project.image ? (
                    <img
                        src={project.image.src}
                        alt=""
                        width={project.image.width}
                        height={project.image.height}
                        loading="lazy"
                        decoding="async"
                        className="aspect-[4/3] w-full object-cover"
                    />
                ) : (
                    <div className="aspect-[4/3] w-full bg-rule" />
                )}
            </Link>
            <p className="eyebrow mt-6">{project.category}</p>
            <Heading className="mt-3 text-h3">
                <Link to={href} className="transition-colors hover:text-body">
                    {project.title}
                </Link>
            </Heading>
            <p className="mt-3 flex-1 text-body text-body">{project.summary}</p>
            {project.technologies.length > 0 ? (
                <ul className="mt-5 flex flex-wrap gap-x-4 gap-y-1 text-small text-body">
                    {project.technologies.map((tech) => (
                        <li key={tech}>{tech}</li>
                    ))}
                </ul>
            ) : null}
            <Link to={href} className="arrow-link mt-6 text-small" aria-label={`View case study: ${project.title}`}>
                <span>View case study</span>
                <Icon name="arrow-right" />
            </Link>
        </article>
    );
}
