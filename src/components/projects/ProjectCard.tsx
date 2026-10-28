import { Link } from "react-router";
import { Reveal } from "@/components/motion/Reveal";
import { Icon } from "@/components/ui/Icon";
import type { Project } from "@/types/content";

type ProjectCardProps = {
    project: Project;
    headingLevel?: "h2" | "h3";
    index?: number;
};

/** Borderless editorial project entry: image on top, meta rule, title and summary beneath. */
export function ProjectCard({ project, headingLevel = "h3", index = 0 }: ProjectCardProps) {
    const Heading = headingLevel;
    const href = `/work/${project.slug}`;

    return (
        <Reveal as="article" className="zoom-trigger group relative" delay={(index % 3) * 90}>
            <Link to={href} className="block" tabIndex={-1} aria-hidden="true">
                <div className="zoom-frame aspect-[16/10] w-full">
                    {project.image ? (
                        <img
                            src={project.image.src}
                            alt=""
                            width={project.image.width}
                            height={project.image.height}
                            loading="lazy"
                            decoding="async"
                            className="h-full w-full object-cover"
                        />
                    ) : null}
                </div>
            </Link>

            <div className="mt-5 flex items-center justify-between gap-4 border-t border-ink pt-4">
                <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-muted">
                    {project.category}
                </span>
                <span className="font-mono text-[11px] tabular-nums text-muted" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                </span>
            </div>

            <Heading className="mt-4 text-row">
                <Link
                    to={href}
                    className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-offset-4"
                >
                    {project.title}
                </Link>
            </Heading>

            <p className="mt-4 max-w-md text-body text-body">{project.summary}</p>

            {project.technologies.length > 0 ? (
                <ul className="mt-5 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[11px] uppercase tracking-[0.08em] text-muted">
                    {project.technologies.map((tech) => (
                        <li key={tech}>{tech}</li>
                    ))}
                </ul>
            ) : null}

            <span className="arrow-link mt-6 text-small">
                <span>View case study</span>
                <Icon name="arrow-right" />
            </span>
        </Reveal>
    );
}
