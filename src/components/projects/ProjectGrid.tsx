import { Link } from "react-router";
import { ProjectCard } from "@/components/projects/ProjectCard";
import type { Project } from "@/types/content";

import analyticsDashboard from "@/assets/work/analytics_dashboard.jpg";

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
                className="overflow-hidden rounded-md border border-rule bg-white shadow-xs"
                role="status"
                data-testid="projects-empty"
            >
                <div className="grid gap-8 p-8 lg:grid-cols-12 lg:items-center lg:gap-12 lg:p-12">
                    <div className="lg:col-span-6">
                        <div className="flex items-center gap-2">
                            <span className="relative flex h-2 w-2">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
                            </span>
                            <span className="text-eyebrow font-medium uppercase tracking-wider text-accent">
                                Case Study Verification Protocol
                            </span>
                        </div>

                        <h3 className="mt-4 text-h2 font-medium text-ink">{emptyTitle}</h3>
                        <p className="mt-4 text-body-lg text-body leading-relaxed">{emptyCopy}</p>

                        <div className="mt-8 grid grid-cols-2 gap-4 border-t border-rule/80 pt-6">
                            <div>
                                <span className="text-small font-medium text-ink">
                                    NDA Compliant
                                </span>
                                <p className="mt-1 text-small text-muted">
                                    Client confidentiality is strictly preserved until formal
                                    release.
                                </p>
                            </div>
                            <div>
                                <span className="text-small font-medium text-ink">
                                    Private Walkthroughs
                                </span>
                                <p className="mt-1 text-small text-muted">
                                    Direct code and architectural walkthroughs available during
                                    discovery.
                                </p>
                            </div>
                        </div>

                        <div className="mt-8">
                            <Link to="/contact" className="btn btn-primary">
                                Request Private Portfolio Walkthrough
                            </Link>
                        </div>
                    </div>

                    <div className="lg:col-span-6">
                        <div className="relative mx-auto max-w-md overflow-hidden rounded-md border border-rule bg-paper p-3 shadow-md lg:max-w-none">
                            <div className="relative aspect-[16/10] overflow-hidden rounded bg-ink">
                                <img
                                    src={analyticsDashboard}
                                    alt="Classific engineering case study preview"
                                    className="h-full w-full object-cover opacity-85"
                                    loading="lazy"
                                />
                                <div
                                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/30 to-transparent"
                                    aria-hidden="true"
                                />
                                <div className="absolute inset-x-4 bottom-4 flex items-center justify-between">
                                    <div>
                                        <span className="rounded bg-accent/90 px-2 py-0.5 text-[10px] font-mono font-medium text-white shadow-xs">
                                            ACTIVE VERIFICATION
                                        </span>
                                        <p className="mt-1.5 text-small font-medium text-white">
                                            Enterprise Logistics &amp; Data Pipeline
                                        </p>
                                    </div>
                                    <span className="hidden font-mono text-xs text-white/80 sm:block">
                                        Q2 Review
                                    </span>
                                </div>
                            </div>

                            <div className="mt-3 flex items-center justify-between px-2 text-[11px] font-mono text-muted">
                                <span>CLIENT DOMAIN: LOGISTICS &amp; FINTECH</span>
                                <span>STACK: TS • REACT • GO • POSTGRES</span>
                            </div>
                        </div>
                    </div>
                </div>
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
