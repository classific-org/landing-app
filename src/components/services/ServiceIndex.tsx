import { Link } from "react-router";
import { Reveal } from "@/components/motion/Reveal";
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
    /** "grid" is the compact homepage index; "list" adds descriptions and tags. */
    layout?: "grid" | "list";
    headingLevel?: "h2" | "h3";
    /** "dark" for ink folds. */
    tone?: "light" | "dark";
    /** Adds a thread node to every row, for the home page's thread to pass through. */
    thread?: boolean;
};

/**
 * Editorial service index: one ruled row per service with a large title, the summary, a
 * preview image and an arrow. Hover draws the rule, nudges the title and fills the arrow.
 */
export function ServiceIndex({
    services,
    layout = "grid",
    headingLevel = "h3",
    tone = "light",
    thread = false,
}: ServiceIndexProps) {
    const Heading = headingLevel;
    const detailed = layout === "list";
    const dark = tone === "dark";

    return (
        <ul
            className={dark ? "border-t border-paper/40" : "border-t border-ink"}
            style={
                dark
                    ? ({
                          "--row-ink": "var(--color-paper)",
                          "--row-paper": "var(--color-ink)",
                      } as React.CSSProperties)
                    : undefined
            }
        >
            {services.map((service, index) => {
                const imageSrc = serviceImages[service.slug];
                const tags = serviceTags[service.slug] ?? [];
                const href = `/services/${service.slug}`;

                return (
                    <Reveal
                        as="li"
                        key={service.slug}
                        delay={index * 40}
                        className={dark ? "border-b border-paper/15" : "border-b border-rule"}
                    >
                        <div
                            className={`row-link zoom-trigger group relative grid items-center gap-x-8 gap-y-5 py-8 lg:grid-cols-12 lg:py-10 ${
                                dark ? "hover:bg-paper/5" : "hover:bg-white/60"
                            } ${thread ? "lg:pl-9" : ""}`}
                        >
                            {thread ? (
                                <span
                                    data-thread-node
                                    className="absolute -left-[19px] top-1/2 h-[18px] w-[18px] -translate-y-1/2 lg:left-0"
                                    aria-hidden="true"
                                />
                            ) : null}
                            <span
                                className={`font-mono text-small tabular-nums lg:col-span-1 ${dark ? "text-paper/50" : "text-muted"}`}
                                aria-hidden="true"
                            >
                                {padStep(index + 1)}
                            </span>

                            <div className="lg:col-span-5">
                                <Heading
                                    className={`row-shift text-row ${dark ? "text-paper" : ""}`}
                                >
                                    <Link
                                        to={href}
                                        className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-offset-4"
                                    >
                                        {service.title}
                                    </Link>
                                </Heading>
                                {detailed ? (
                                    <ul
                                        className={`row-shift mt-4 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[11px] uppercase tracking-[0.08em] ${dark ? "text-paper/55" : "text-muted"}`}
                                    >
                                        {tags.map((tag) => (
                                            <li key={tag}>{tag}</li>
                                        ))}
                                    </ul>
                                ) : null}
                            </div>

                            <p
                                className={`max-w-md text-body lg:col-span-3 ${dark ? "text-paper/75" : "text-body"}`}
                            >
                                {detailed ? service.description : service.summary}
                            </p>

                            <div className="flex items-center justify-between gap-5 lg:col-span-3 lg:justify-end">
                                {imageSrc ? (
                                    <div className="zoom-frame hidden aspect-[4/3] w-28 sm:block lg:w-32">
                                        <img
                                            src={imageSrc}
                                            alt=""
                                            width={128}
                                            height={96}
                                            className="h-full w-full object-cover"
                                            loading="lazy"
                                            decoding="async"
                                        />
                                    </div>
                                ) : null}
                                <span
                                    className="row-arrow ml-auto flex h-11 w-11 flex-none items-center justify-center border lg:ml-0"
                                    aria-hidden="true"
                                >
                                    <Icon name="arrow-right" className="h-4 w-4" />
                                </span>
                            </div>
                        </div>
                    </Reveal>
                );
            })}
        </ul>
    );
}
