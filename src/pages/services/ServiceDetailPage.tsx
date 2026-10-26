import { Link } from "react-router";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { ClosingCta } from "@/components/layout/ClosingCta";
import { Icon } from "@/components/ui/Icon";
import { BulletList } from "@/components/ui/BulletList";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { FaqList } from "@/components/services/FaqList";
import { ProcessSteps } from "@/components/process/ProcessSteps";
import { ProjectGrid } from "@/components/projects/ProjectGrid";
import { NotFoundPage } from "@/pages/not-found/NotFoundPage";
import { useServiceDetailPage } from "@/pages/services/ServiceDetailPage.hooks";

export function ServiceDetailPage() {
    const model = useServiceDetailPage();

    if (model.status === "missing") {
        return <NotFoundPage />;
    }

    const { service, relatedServices, relatedProjects, stages, breadcrumbs } = model;

    return (
        <>
            <PageHero
                eyebrow={service.hero.eyebrow}
                title={service.hero.headline}
                copy={service.hero.copy}
                breadcrumbs={breadcrumbs}
                aside={
                    <div className="flex flex-col gap-4">
                        <Icon name={service.icon} className="h-8 w-8 text-ink" />
                        <ButtonLink to="/contact" variant="primary" withArrow>
                            Discuss a project
                        </ButtonLink>
                    </div>
                }
            />

            <Section labelledBy="problems-title" tone="white">
                <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
                    <div className="lg:col-span-5">
                        <SectionHeading
                            id="problems-title"
                            eyebrow="Problems we solve"
                            title={`When ${service.navLabel.toLowerCase()} work becomes a priority.`}
                        />
                    </div>
                    <div className="lg:col-span-6 lg:col-start-7">
                        <BulletList items={service.problems} numbered />
                    </div>
                </div>
            </Section>

            <Section labelledBy="capabilities-title" tone="paper">
                <SectionHeading
                    id="capabilities-title"
                    eyebrow="Capabilities"
                    title="What this service covers."
                    align="split"
                />
                <dl className="mt-12 grid gap-x-8 border-t border-rule sm:grid-cols-2 lg:mt-16">
                    {service.capabilities.map((capability) => (
                        <div key={capability.title} className="border-b border-rule py-8">
                            <dt className="text-h3">{capability.title}</dt>
                            <dd className="mt-3 text-body text-body">{capability.description}</dd>
                        </div>
                    ))}
                </dl>
            </Section>

            <Section labelledBy="use-cases-title" tone="white">
                <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
                    <div className="lg:col-span-5">
                        <SectionHeading
                            id="use-cases-title"
                            eyebrow="Example use cases"
                            title="Typical systems in this area."
                            intro="Illustrative examples of the kind of software this service produces. Published case studies appear below once verified."
                        />
                    </div>
                    <div className="lg:col-span-6 lg:col-start-7">
                        <BulletList items={service.useCases} />
                        <h3 className="eyebrow mt-12 mb-4">Deliverables</h3>
                        <BulletList items={service.deliverables} />
                    </div>
                </div>
            </Section>

            <Section labelledBy="service-process-title" tone="paper">
                <SectionHeading
                    id="service-process-title"
                    eyebrow="Development process"
                    title="How the work proceeds."
                    intro="Every service follows the same five stages. The time spent in each depends on the complexity and risk of the project."
                    align="split"
                />
                <div className="mt-12 lg:mt-16">
                    <ProcessSteps stages={stages} variant="compact" />
                </div>
            </Section>

            <Section labelledBy="related-work-title" tone="white">
                <SectionHeading
                    id="related-work-title"
                    eyebrow="Related work"
                    title={`${service.title} projects.`}
                    align="split"
                />
                <div className="mt-12 lg:mt-16">
                    <ProjectGrid
                        projects={relatedProjects}
                        emptyTitle="No published case studies for this service yet."
                        emptyCopy="Projects are listed here once outcomes are verified and clients have approved publication."
                    />
                </div>
            </Section>

            <Section labelledBy="service-faq-title" tone="paper">
                <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
                    <div className="lg:col-span-4">
                        <SectionHeading id="service-faq-title" eyebrow="Questions" title="Frequently asked." />
                        {relatedServices.length > 0 ? (
                            <div className="mt-10">
                                <h3 className="eyebrow mb-4">Related services</h3>
                                <ul className="space-y-3">
                                    {relatedServices.map((related) => (
                                        <li key={related.slug}>
                                            <Link
                                                to={`/services/${related.slug}`}
                                                className="arrow-link text-small"
                                            >
                                                <span>{related.title}</span>
                                                <Icon name="arrow-right" />
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ) : null}
                    </div>
                    <div className="lg:col-span-7 lg:col-start-6">
                        <FaqList faqs={service.faqs} idPrefix={`${service.slug}-faq`} />
                    </div>
                </div>
            </Section>

            <ClosingCta
                headline={`Let's talk about ${service.navLabel.toLowerCase()}.`}
                copy="Share the challenge and the systems involved. We will respond with questions and a proposed way forward."
            />
        </>
    );
}
