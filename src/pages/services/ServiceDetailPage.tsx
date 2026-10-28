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

import webApplicationsPreview1 from "@/assets/services/web_applications_preview_1.jpg";
import webApplicationsPreview2 from "@/assets/services/web_applications_preview_2.jpg";
import mobileApplicationsPreview1 from "@/assets/services/mobile_applications_preview_1.jpg";
import mobileApplicationsPreview2 from "@/assets/services/mobile_applications_preview_2.jpg";
import desktopApplicationsPreview1 from "@/assets/services/desktop_applications_preview_1.jpg";
import desktopApplicationsPreview2 from "@/assets/services/desktop_applications_preview_2.jpg";
import crmErpPreview1 from "@/assets/services/crm_erp_preview_1.jpg";
import crmErpPreview2 from "@/assets/services/crm_erp_preview_2.jpg";
import customSoftwarePreview1 from "@/assets/services/custom_software_preview_1.jpg";
import customSoftwarePreview2 from "@/assets/services/custom_software_preview_2.jpg";

const serviceImages: Record<string, string> = {
    "web-applications": webApplicationsImg,
    "mobile-applications": mobileApplicationsImg,
    "desktop-applications": desktopApplicationsImg,
    "crm-cms-erp": crmErpImg,
    "custom-software": customSoftwareImg,
};

type ServiceVisualShowcase = {
    primary: {
        image: string;
        badge: string;
        title: string;
        caption: string;
    };
    secondary: {
        image: string;
        badge: string;
        title: string;
        caption: string;
    };
};

const serviceShowcases: Record<string, ServiceVisualShowcase> = {
    "web-applications": {
        primary: {
            image: webApplicationsPreview1,
            badge: "Interactive UI & Metrics",
            title: "High-Density Web Workspaces",
            caption:
                "Real-time portals and SaaS applications engineered for sub-second responsiveness, WCAG AA accessibility, and daily operational scale.",
        },
        secondary: {
            image: webApplicationsPreview2,
            badge: "System Maintainability",
            title: "Living Component Architecture",
            caption:
                "Strictly typed design systems and modular frontend architecture that keep feature development fast without codebase degradation.",
        },
    },
    "mobile-applications": {
        primary: {
            image: mobileApplicationsPreview1,
            badge: "Field Operations",
            title: "Offline-First Mobile Architecture",
            caption:
                "Native and cross-platform apps engineered to function seamlessly without connectivity, synchronizing state with zero conflict when back online.",
        },
        secondary: {
            image: mobileApplicationsPreview2,
            badge: "Native Experience",
            title: "Hardware & Platform Integration",
            caption:
                "Fluid 60fps gesture interactions, native background sync, secure device storage, and automated deployment to Apple App Store and Google Play.",
        },
    },
    "desktop-applications": {
        primary: {
            image: desktopApplicationsPreview1,
            badge: "Extreme Throughput",
            title: "Hardware-Accelerated Processing",
            caption:
                "Multi-window, low-latency desktop platforms built for engineers and power users handling heavy local datasets without browser sandbox limitations.",
        },
        secondary: {
            image: desktopApplicationsPreview2,
            badge: "System Level Access",
            title: "Native OS & Device Control",
            caption:
                "Direct hardware driver communication, background daemon services, automated installers, and offline-first encrypted storage for macOS and Windows.",
        },
    },
    "crm-cms-erp": {
        primary: {
            image: crmErpPreview1,
            badge: "Operations Pipeline",
            title: "Unified Business Operations Hub",
            caption:
                "Consolidated enterprise resource planning and CRM workflows that replace fragmented spreadsheets with automated, auditable business logic.",
        },
        secondary: {
            image: crmErpPreview2,
            badge: "Multi-Channel Sync",
            title: "Headless Content & Data Mesh",
            caption:
                "Structured, headless CMS models distributed across digital storefronts, portals, and internal tools with granular role-based permissions.",
        },
    },
    "custom-software": {
        primary: {
            image: customSoftwarePreview1,
            badge: "Resilient Infrastructure",
            title: "Distributed Microservices & APIs",
            caption:
                "High-availability backend clusters, secure event-driven pipelines, and load-balanced API gateways capable of sustained enterprise concurrency.",
        },
        secondary: {
            image: customSoftwarePreview2,
            badge: "Continuous Telemetry",
            title: "Automated Deployment & Health Monitoring",
            caption:
                "End-to-end observability, encrypted streaming channels, distributed tracing, and zero-downtime deployment pipelines.",
        },
    },
};

export function ServiceDetailPage() {
    const model = useServiceDetailPage();

    if (model.status === "missing") {
        return <NotFoundPage />;
    }

    const { service, relatedServices, relatedProjects, stages, breadcrumbs } = model;
    const imageSrc = serviceImages[service.slug];
    const showcase = serviceShowcases[service.slug];

    return (
        <div className="relative overflow-x-clip">
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
                                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
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

            {/* Architecture & Engineering in Action Showcase */}
            {showcase ? (
                <Section labelledBy="showcase-title" tone="white">
                    <SectionHeading
                        id="showcase-title"
                        eyebrow="Engineering in action"
                        title="Architecture & interface standards."
                        intro="Every engagement is executed with clear visual hierarchy, production-grade telemetry, and strict engineering discipline."
                        align="split"
                    />

                    <div className="mt-12 grid gap-8 lg:mt-16 lg:grid-cols-2">
                        <div className="group overflow-hidden rounded-md border border-rule bg-paper/50 p-6 shadow-xs transition-all duration-300 hover:border-ink-soft/40 hover:shadow-lg">
                            <div className="relative aspect-[16/10] overflow-hidden rounded border border-rule bg-paper">
                                <img
                                    src={showcase.primary.image}
                                    alt={showcase.primary.title}
                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    loading="lazy"
                                />
                                <span className="absolute left-3 top-3 rounded-full bg-ink/90 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-paper backdrop-blur-xs">
                                    {showcase.primary.badge}
                                </span>
                            </div>
                            <h3 className="mt-6 text-h3 font-medium text-ink transition-colors group-hover:text-accent">
                                {showcase.primary.title}
                            </h3>
                            <p className="mt-3 text-body leading-relaxed text-body">
                                {showcase.primary.caption}
                            </p>
                        </div>

                        <div className="group overflow-hidden rounded-md border border-rule bg-paper/50 p-6 shadow-xs transition-all duration-300 hover:border-ink-soft/40 hover:shadow-lg">
                            <div className="relative aspect-[16/10] overflow-hidden rounded border border-rule bg-paper">
                                <img
                                    src={showcase.secondary.image}
                                    alt={showcase.secondary.title}
                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    loading="lazy"
                                />
                                <span className="absolute left-3 top-3 rounded-full bg-ink/90 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-paper backdrop-blur-xs">
                                    {showcase.secondary.badge}
                                </span>
                            </div>
                            <h3 className="mt-6 text-h3 font-medium text-ink transition-colors group-hover:text-accent">
                                {showcase.secondary.title}
                            </h3>
                            <p className="mt-3 text-body leading-relaxed text-body">
                                {showcase.secondary.caption}
                            </p>
                        </div>
                    </div>
                </Section>
            ) : null}

            {/* Use Cases and Deliverables */}
            <Section labelledBy="use-cases-title" tone="paper">
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
            <Section labelledBy="service-process-title" tone="white">
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
            <Section labelledBy="related-work-title" tone="paper">
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
            <Section labelledBy="service-faq-title" tone="white">
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
                <Section labelledBy="related-services-title" tone="paper">
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
        </div>
    );
}
