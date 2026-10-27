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

import webApplicationsImg from "@/assets/services/web_applications.jpg";
import mobileApplicationsImg from "@/assets/services/mobile_applications.jpg";
import desktopApplicationsImg from "@/assets/services/desktop_applications.jpg";
import crmErpImg from "@/assets/services/crm_erp_systems.jpg";
import customSoftwareImg from "@/assets/services/custom_software.jpg";

const serviceImages: Record<string, string> = {
    "web-applications": webApplicationsImg,
    "mobile-applications": mobileApplicationsImg,
    "desktop-applications": desktopApplicationsImg,
    "crm-cms-erp": crmErpImg,
    "custom-software": customSoftwareImg,
};

export function ServiceDetailPage() {
    const model = useServiceDetailPage();

    if (model.status === "missing") {
        return <NotFoundPage />;
    }

    const { service, relatedServices, relatedProjects, stages, breadcrumbs } = model;
    const imageSrc = serviceImages[service.slug];

    return (
        <>
            <PageHero
                eyebrow={service.hero.eyebrow}
                title={service.hero.headline}
                copy={service.hero.copy}
                breadcrumbs={breadcrumbs}
                aside={
                    <div className="flex flex-col gap-5 rounded-md border border-rule bg-white p-5 shadow-sm">
                        {imageSrc ? (
                            <div className="relative aspect-[4/3] w-full overflow-hidden rounded border border-rule bg-paper">
                                <img
                                    src={imageSrc}
                                    alt={service.title}
                                    className="h-full w-full object-cover"
                                    loading="eager"
                                />
                                <div className="absolute left-3 top-3 rounded-full border border-rule/80 bg-white/90 p-1.5 shadow-xs backdrop-blur-xs">
                                    <Icon name={service.icon} className="h-4 w-4 text-ink" />
                                </div>
                            </div>
                        ) : null}
                        <ButtonLink to="/contact" variant="primary" withArrow className="w-full">
                            Discuss a project
                        </ButtonLink>
                    </div>
                }
            />

            {/* Problems We Solve */}
            <Section labelledBy="problems-title" tone="white">
                <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
                    <div className="lg:col-span-5">
                        <SectionHeading
                            id="problems-title"
                            eyebrow="Problems we solve"
                            title={`When ${service.navLabel.toLowerCase()} work becomes a priority.`}
                        />
                    </div>
                    <div className="lg:col-span-7">
                        <div className="rounded-md border border-rule bg-paper/60 p-8 shadow-xs">
                            <BulletList items={service.problems} numbered />
                        </div>
                    </div>
                </div>
            </Section>

            {/* Capabilities Cards */}
            <Section labelledBy="capabilities-title" tone="paper">
                <SectionHeading
                    id="capabilities-title"
                    eyebrow="Capabilities"
                    title="What this service covers."
                    align="split"
                />
                <dl className="mt-12 grid gap-6 sm:grid-cols-2 lg:mt-16">
                    {service.capabilities.map((capability) => (
                        <div
                            key={capability.title}
                            className="group rounded-md border border-rule bg-white p-7 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-ink-soft/40 hover:shadow-lg"
                        >
                            <dt className="text-h3 font-medium text-ink transition-colors group-hover:text-accent">
                                {capability.title}
                            </dt>
                            <dd className="mt-3 text-body text-body leading-relaxed">
                                {capability.description}
                            </dd>
                        </div>
                    ))}
                </dl>
            </Section>

            {/* Use Cases and Deliverables */}
            <Section labelledBy="use-cases-title" tone="white">
                <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
                    <div className="lg:col-span-5">
                        <SectionHeading
                            id="use-cases-title"
                            eyebrow="Example use cases"
                            title="Typical systems in this area."
                            intro="Illustrative examples of the kind of software this service produces. Published case studies appear below once verified."
                        />
                    </div>
                    <div className="lg:col-span-7 space-y-8">
                        <div className="rounded-md border border-rule bg-white p-8 shadow-xs">
                            <h3 className="eyebrow mb-4 text-ink">Typical Implementations</h3>
                            <BulletList items={service.useCases} />
                        </div>
                        <div className="rounded-md border border-rule bg-paper/60 p-8 shadow-xs">
                            <h3 className="eyebrow mb-4 text-ink">Deliverables</h3>
                            <BulletList items={service.deliverables} />
                        </div>
                    </div>
                </div>
            </Section>

            {/* Process */}
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

            {/* Related Work */}
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

            {/* FAQ */}
            <Section labelledBy="service-faq-title" tone="paper">
                <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
                    <div className="lg:col-span-4">
                        <SectionHeading
                            id="service-faq-title"
                            eyebrow="Questions"
                            title="Frequently asked."
                        />
                    </div>
                    <div className="lg:col-span-8">
                        <FaqList faqs={service.faqs} idPrefix="service-faq" />
                    </div>
                </div>
            </Section>

            {/* Related Services */}
            {relatedServices.length > 0 ? (
                <Section labelledBy="related-services-title" tone="white">
                    <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
                        <div className="lg:col-span-4">
                            <SectionHeading
                                id="related-services-title"
                                eyebrow="Connected disciplines"
                                title="Frequently combined with."
                            />
                        </div>
                        <ul className="divide-y divide-rule border-y border-rule lg:col-span-8">
                            {relatedServices.map((related) => (
                                <li key={related.slug} className="group">
                                    <Link
                                        to={`/services/${related.slug}`}
                                        className="flex items-center justify-between gap-6 py-6 transition-colors hover:text-accent"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="flex h-9 w-9 items-center justify-center rounded border border-rule bg-paper text-ink transition-colors group-hover:border-accent group-hover:text-accent">
                                                <Icon name={related.icon} className="h-4 w-4" />
                                            </div>
                                            <span className="text-h3 font-medium">
                                                {related.title}
                                            </span>
                                        </div>
                                        <Icon
                                            name="arrow-right"
                                            className="h-5 w-5 flex-none transition-transform duration-200 group-hover:translate-x-1"
                                        />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </Section>
            ) : null}

            <ClosingCta />
        </>
    );
}
