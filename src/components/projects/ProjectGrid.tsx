import { Eyebrow } from "@/components/layout/Eyebrow";
import { Reveal } from "@/components/motion/Reveal";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { ButtonLink } from "@/components/ui/ButtonLink";
import type { Project } from "@/types/content";

type ProjectGridProps = {
    projects: Project[];
    emptyTitle?: string;
    emptyCopy?: string;
    headingLevel?: "h2" | "h3";
};

/** What every published case study will contain, in the order it is written. */
const caseStudySections = ["Challenge", "Approach", "Solution", "Verified outcomes"];

export function ProjectGrid({
    projects,
    emptyTitle = "No published projects yet.",
    emptyCopy = "Case studies are published only with verified details and client permission. This section will show real work as it is approved for release.",
    headingLevel = "h3",
}: ProjectGridProps) {
    if (projects.length === 0) {
        return (
            <div
                className="grid gap-12 border-t border-ink pt-10 lg:grid-cols-12 lg:gap-10 lg:pt-14"
                role="status"
                data-testid="projects-empty"
            >
                <div className="lg:col-span-6">
                    <Reveal>
                        <Eyebrow className="text-accent">Case study verification</Eyebrow>
                        <h3 className="mt-6 text-h2">{emptyTitle}</h3>
                        <p className="mt-5 max-w-lg text-body-lg text-body">{emptyCopy}</p>
                    </Reveal>

                    <Reveal delay={120}>
                        <dl className="mt-10 grid gap-8 border-t border-rule pt-8 sm:grid-cols-2">
                            <div>
                                <dt className="text-small font-medium text-ink">NDA Compliant</dt>
                                <dd className="mt-1.5 text-small text-muted">
                                    Client confidentiality is strictly preserved until formal
                                    release.
                                </dd>
                            </div>
                            <div>
                                <dt className="text-small font-medium text-ink">
                                    Private Walkthroughs
                                </dt>
                                <dd className="mt-1.5 text-small text-muted">
                                    Direct code and architectural walkthroughs available during
                                    discovery.
                                </dd>
                            </div>
                        </dl>
                        <div className="mt-10">
                            <ButtonLink
                                to="/contact"
                                variant="primary"
                                withArrow
                                className="max-w-full whitespace-normal py-3 text-center"
                            >
                                Request Private Portfolio Walkthrough
                            </ButtonLink>
                        </div>
                    </Reveal>
                </div>

                <Reveal className="lg:col-span-5 lg:col-start-8" delay={160}>
                    <div className="grid-blueprint relative border border-rule bg-white p-6 sm:p-8">
                        <span
                            className="absolute left-2 top-2 font-mono text-[10px] text-muted"
                            aria-hidden="true"
                        >
                            +
                        </span>
                        <span
                            className="absolute right-2 top-2 font-mono text-[10px] text-muted"
                            aria-hidden="true"
                        >
                            +
                        </span>
                        <span
                            className="absolute bottom-2 left-2 font-mono text-[10px] text-muted"
                            aria-hidden="true"
                        >
                            +
                        </span>
                        <span
                            className="absolute bottom-2 right-2 font-mono text-[10px] text-muted"
                            aria-hidden="true"
                        >
                            +
                        </span>
                        <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-muted">
                            Case study template
                        </p>
                        <ol className="mt-6 border-t border-ink bg-white/80">
                            {caseStudySections.map((section, index) => (
                                <li
                                    key={section}
                                    className="flex items-baseline justify-between gap-4 border-b border-rule py-4"
                                >
                                    <span className="text-h3">{section}</span>
                                    <span
                                        className="font-mono text-[11px] tabular-nums text-muted"
                                        aria-hidden="true"
                                    >
                                        0{index + 1}
                                    </span>
                                </li>
                            ))}
                        </ol>
                        <p className="mt-6 font-mono text-[11px] text-muted">
                            Published only after client approval.
                        </p>
                    </div>
                </Reveal>
            </div>
        );
    }

    return (
        <ul className="grid gap-x-10 gap-y-16 md:grid-cols-2 lg:gap-x-14 lg:gap-y-24">
            {projects.map((project, index) => (
                <li key={project.slug} className={index % 2 === 1 ? "md:mt-20" : ""}>
                    <ProjectCard project={project} headingLevel={headingLevel} index={index} />
                </li>
            ))}
        </ul>
    );
}
