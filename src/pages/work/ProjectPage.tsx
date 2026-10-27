import { Link } from "react-router";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { ClosingCta } from "@/components/layout/ClosingCta";
import { ProjectGrid } from "@/components/projects/ProjectGrid";
import { TextLink } from "@/components/ui/TextLink";
import { NotFoundPage } from "@/pages/not-found/NotFoundPage";
import { useProjectPage } from "@/pages/work/ProjectPage.hooks";

export function ProjectPage() {
    const model = useProjectPage();

    if (model.status === "missing") {
        return <NotFoundPage />;
    }

    const { project, relatedProjects, services, breadcrumbs, hasOutcomes } = model;

    return (
        <>
            <PageHero
                eyebrow={project.category}
                title={project.title}
                copy={project.summary}
                breadcrumbs={breadcrumbs}
                aside={
                    <dl className="space-y-4 text-small">
                        {services.length > 0 ? (
                            <div>
                                <dt className="eyebrow mb-2">Services</dt>
                                <dd>
                                    <ul className="space-y-1">
                                        {services.map((service) => (
                                            <li key={service.slug}>
                                                <Link
                                                    to={`/services/${service.slug}`}
                                                    className="text-link"
                                                >
                                                    {service.title}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </dd>
                            </div>
                        ) : null}
                        {project.projectUrl ? (
                            <div>
                                <dt className="eyebrow mb-2">Live product</dt>
                                <dd>
                                    <TextLink to={project.projectUrl}>Visit site</TextLink>
                                </dd>
                            </div>
                        ) : null}
                    </dl>
                }
            />

            {project.image ? (
                <div className="border-b border-rule bg-white">
                    <div className="container-page py-10 lg:py-16">
                        <img
                            src={project.image.src}
                            alt={project.image.alt}
                            width={project.image.width}
                            height={project.image.height}
                            className="aspect-[3/2] w-full rounded-sm object-cover"
                        />
                    </div>
                </div>
            ) : null}

            <Section labelledBy="overview-title" tone="white">
                <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
                    <div className="lg:col-span-4">
                        <SectionHeading
                            id="overview-title"
                            eyebrow="Overview"
                            title="The project."
                        />
                    </div>
                    <div className="prose-editorial lg:col-span-7 lg:col-start-6">
                        <p>{project.description}</p>
                        <h2>Business challenge</h2>
                        <p>{project.challenge}</p>
                        <h2>Approach</h2>
                        <p>{project.approach}</p>
                        <h2>Solution</h2>
                        <p>{project.solution}</p>
                    </div>
                </div>
            </Section>

            {project.gallery && project.gallery.length > 0 ? (
                <Section tone="paper" labelledBy="gallery-title">
                    <h2 id="gallery-title" className="eyebrow mb-8">
                        Screens
                    </h2>
                    <ul className="grid gap-8 md:grid-cols-2">
                        {project.gallery.map((image) => (
                            <li key={image.src}>
                                <img
                                    src={image.src}
                                    alt={image.alt}
                                    width={image.width}
                                    height={image.height}
                                    loading="lazy"
                                    decoding="async"
                                    className="aspect-[4/3] w-full rounded-sm object-cover"
                                />
                            </li>
                        ))}
                    </ul>
                </Section>
            ) : null}

            <Section labelledBy="details-title" tone="paper">
                <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
                    <div className="lg:col-span-4">
                        <SectionHeading
                            id="details-title"
                            eyebrow="Details"
                            title="Technology and outcomes."
                        />
                    </div>
                    <div className="grid gap-12 sm:grid-cols-2 lg:col-span-7 lg:col-start-6">
                        <div>
                            <h3 className="eyebrow mb-4">Technologies</h3>
                            <ul className="divide-y divide-rule border-y border-rule text-body text-body">
                                {project.technologies.map((tech) => (
                                    <li key={tech} className="py-3">
                                        {tech}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h3 className="eyebrow mb-4">Verified outcomes</h3>
                            {hasOutcomes ? (
                                <dl className="divide-y divide-rule border-y border-rule">
                                    {project.outcomes?.map((outcome) => (
                                        <div key={outcome.label} className="py-3">
                                            <dt className="text-small text-body">
                                                {outcome.label}
                                            </dt>
                                            <dd className="text-h3">{outcome.value}</dd>
                                        </div>
                                    ))}
                                </dl>
                            ) : (
                                <p className="text-body text-body">
                                    Outcomes are published once they have been verified with the
                                    client.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </Section>

            <Section labelledBy="related-title" tone="white">
                <SectionHeading
                    id="related-title"
                    eyebrow="Related work"
                    title="More projects."
                    align="split"
                />
                <div className="mt-12">
                    <ProjectGrid
                        projects={relatedProjects}
                        emptyTitle="No related projects yet."
                        emptyCopy="More case studies will appear here as they are approved for publication."
                    />
                </div>
            </Section>

            <ClosingCta
                headline="Working on something similar?"
                copy="Tell us about the challenge and we will share how we would approach it."
            />
        </>
    );
}
