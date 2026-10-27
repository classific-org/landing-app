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
        <article className="group flex flex-col overflow-hidden rounded-md border border-rule bg-white shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-ink-soft/40 hover:shadow-xl">
            <Link
                to={href}
                className="relative block aspect-[16/10] w-full overflow-hidden border-b border-rule bg-paper"
                tabIndex={-1}
                aria-hidden="true"
            >
                {project.image ? (
                    <img
                        src={project.image.src}
                        alt=""
                        width={project.image.width}
                        height={project.image.height}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    />
                ) : (
                    <div className="h-full w-full bg-paper" />
                )}
                <div
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/20 to-transparent"
                    aria-hidden="true"
                />
            </Link>

            <div className="flex flex-1 flex-col p-6">
                <span className="eyebrow text-[11px] text-accent font-medium uppercase tracking-wider">
                    {project.category}
                </span>

                <Heading className="mt-3 text-h3 font-medium transition-colors group-hover:text-accent">
                    <Link to={href} className="focus-visible:outline-offset-2">
                        {project.title}
                    </Link>
                </Heading>

                <p className="mt-3 flex-1 text-body text-body leading-relaxed">{project.summary}</p>

                {project.technologies.length > 0 ? (
                    <ul className="mt-5 flex flex-wrap gap-1.5">
                        {project.technologies.map((tech) => (
                            <li
                                key={tech}
                                className="rounded bg-paper px-2 py-0.5 font-mono text-[10px] text-muted border border-rule/70"
                            >
                                {tech}
                            </li>
                        ))}
                    </ul>
                ) : null}

                <Link
                    to={href}
                    className="arrow-link mt-6 text-small font-medium text-ink transition-colors group-hover:text-accent"
                    aria-label={`View case study: ${project.title}`}
                >
                    <span>View case study</span>
                    <Icon
                        name="arrow-right"
                        className="transition-transform duration-200 group-hover:translate-x-1"
                    />
                </Link>
            </div>
        </article>
    );
}
