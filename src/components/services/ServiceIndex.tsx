import { Link } from "react-router";
import { Icon } from "@/components/ui/Icon";
import { padStep } from "@/lib/formatting/text";
import type { Service } from "@/types/content";

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

const serviceTags: Record<string, string[]> = {
    "web-applications": ["SaaS & Cloud", "Portals", "Accessibility"],
    "mobile-applications": ["iOS & Android", "Offline Sync", "Field Apps"],
    "desktop-applications": ["macOS & Windows", "Hardware", "Local Data"],
    "crm-cms-erp": ["Operations", "Headless CMS", "Data Sync"],
    "custom-software": ["APIs & Pipelines", "Integrations", "Automation"],
};

type ServiceIndexProps = {
    services: Service[];
    /** "grid" for the homepage, "list" for the services overview. */
    layout?: "grid" | "list";
    headingLevel?: "h2" | "h3";
};

export function ServiceIndex({
    services,
    layout = "grid",
    headingLevel = "h3",
}: ServiceIndexProps) {
    const Heading = headingLevel;

    if (layout === "list") {
        return (
            <ul className="divide-y divide-rule border-y border-rule">
                {services.map((service, index) => {
                    const imageSrc = serviceImages[service.slug];
                    const tags = serviceTags[service.slug] ?? [];

                    return (
                        <li
                            key={service.slug}
                            className="group grid gap-6 py-10 transition-colors duration-200 hover:bg-white/40 lg:grid-cols-12 lg:items-center lg:gap-8"
                        >
                            <div className="flex items-start gap-5 lg:col-span-4">
                                <span className="font-mono text-small tabular-nums text-muted">
                                    {padStep(index + 1)}
                                </span>
                                <div>
                                    <Heading className="text-h3 font-medium">
                                        <Link
                                            to={`/services/${service.slug}`}
                                            className="transition-colors hover:text-accent"
                                        >
                                            {service.title}
                                        </Link>
                                    </Heading>
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {tags.map((tag) => (
                                            <span
                                                key={tag}
                                                className="rounded bg-paper px-2 py-0.5 font-mono text-[11px] text-muted border border-rule/80"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <p className="text-body text-body leading-relaxed lg:col-span-5">
                                {service.description}
                            </p>

                            <div className="flex items-center justify-between gap-4 lg:col-span-3 lg:justify-end">
                                {imageSrc ? (
                                    <div className="h-16 w-16 overflow-hidden rounded border border-rule bg-paper shadow-xs sm:h-20 sm:w-20">
                                        <img
                                            src={imageSrc}
                                            alt=""
                                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                            loading="lazy"
                                        />
                                    </div>
                                ) : null}
                                <Link
                                    to={`/services/${service.slug}`}
                                    className="arrow-link text-small font-medium text-ink group-hover:text-accent"
                                >
                                    <span>Explore {service.navLabel}</span>
                                    <Icon
                                        name="arrow-right"
                                        className="transition-transform duration-200 group-hover:translate-x-1"
                                    />
                                </Link>
                            </div>
                        </li>
                    );
                })}
            </ul>
        );
    }

    return (
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {services.map((service, index) => {
                const imageSrc = serviceImages[service.slug];
                const tags = serviceTags[service.slug] ?? [];

                return (
                    <li
                        key={service.slug}
                        className="group relative flex flex-col overflow-hidden rounded-md border border-rule bg-white shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-ink-soft/40 hover:shadow-xl"
                    >
                        {/* Image Header with Badge */}
                        <div className="relative aspect-[16/11] w-full overflow-hidden border-b border-rule bg-paper">
                            {imageSrc ? (
                                <img
                                    src={imageSrc}
                                    alt={service.title}
                                    className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                                    loading="lazy"
                                />
                            ) : (
                                <div className="h-full w-full bg-paper" />
                            )}
                            <div
                                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/30 via-transparent to-transparent opacity-80"
                                aria-hidden="true"
                            />
                            {/* Floating Step Badge & Icon */}
                            <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full border border-rule/80 bg-white/90 px-2.5 py-1 text-[11px] font-mono shadow-xs backdrop-blur-sm">
                                <span className="text-muted">{padStep(index + 1)}</span>
                                <span className="h-2 w-px bg-rule" />
                                <Icon name={service.icon} className="h-3.5 w-3.5 text-ink" />
                            </div>
                        </div>

                        {/* Card Content */}
                        <div className="flex flex-1 flex-col p-6">
                            <Heading className="text-h3 font-medium transition-colors group-hover:text-accent">
                                <Link
                                    to={`/services/${service.slug}`}
                                    className="focus-visible:outline-offset-2"
                                >
                                    {service.title}
                                </Link>
                            </Heading>
                            <p className="mt-3 flex-1 text-body text-body leading-relaxed">
                                {service.summary}
                            </p>

                            {/* Tags */}
                            <div className="mt-5 flex flex-wrap gap-1.5">
                                {tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="rounded bg-paper px-2 py-0.5 font-mono text-[10px] text-muted border border-rule/60"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            {/* Action Link */}
                            <Link
                                to={`/services/${service.slug}`}
                                className="arrow-link mt-6 text-small font-medium text-ink transition-colors group-hover:text-accent"
                                aria-label={`Learn more about ${service.title}`}
                            >
                                <span>Learn more</span>
                                <Icon
                                    name="arrow-right"
                                    className="transition-transform duration-200 group-hover:translate-x-1"
                                />
                            </Link>
                        </div>
                    </li>
                );
            })}
        </ul>
    );
}
