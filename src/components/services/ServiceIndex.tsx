import { Link } from "react-router";
import { Reveal } from "@/components/motion/Reveal";
import { Icon } from "@/components/ui/Icon";
import { ButtonLink } from "@/components/ui/ButtonLink";
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

const serviceBadges: Record<string, string> = {
    "web-applications": "Flagship // Web Platforms",
    "mobile-applications": "Mobile // iOS & Android",
    "desktop-applications": "Native // macOS & Windows",
    "crm-cms-erp": "Operations // Headless Data",
    "custom-software": "Infrastructure // Cloud & APIs",
};

const serviceTags: Record<string, string[]> = {
    "web-applications": ["SaaS & Cloud", "Enterprise Portals", "WCAG Conformance"],
    "mobile-applications": ["Offline-First", "Cross-Platform", "Field Workflows"],
    "desktop-applications": ["High Throughput", "Hardware I/O", "Local Processing"],
    "crm-cms-erp": ["Operations Hub", "Headless CMS", "Data Sync"],
    "custom-software": ["Distributed Systems", "API Mesh", "Event Streaming"],
};

type ServiceIndexProps = {
    services: Service[];
    /** "grid" is the high-impact bento showcase; "list" is the detailed cinematic deck. */
    layout?: "grid" | "list";
    headingLevel?: "h2" | "h3";
    /** "dark" for ink folds; "light" for paper folds. */
    tone?: "light" | "dark";
    /** Adds a thread node to every card for the page thread to trace through. */
    thread?: boolean;
};

export function ServiceIndex({
    services,
    layout = "grid",
    headingLevel = "h3",
    tone = "light",
    thread: _thread = false,
}: ServiceIndexProps) {
    const Heading = headingLevel;
    const isDetailed = layout === "list";
    const dark = tone === "dark";

    if (!isDetailed) {
        // High-impact, modern tech Bento Grid for Home Page & concise showcases
        return (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
                {services.map((service, index) => {
                    const imageSrc = serviceImages[service.slug];
                    const tags = serviceTags[service.slug] ?? [];
                    const badge = serviceBadges[service.slug] ?? "Specialized Engineering";
                    const href = `/services/${service.slug}`;

                    // Asymmetric Bento arrangement:
                    // First row: 7 cols (flagship web) + 5 cols (mobile)
                    // Second row: 4 cols (desktop) + 4 cols (crm/erp) + 4 cols (custom)
                    let colSpan = "lg:col-span-4";
                    if (index === 0) colSpan = "lg:col-span-7 sm:col-span-2";
                    else if (index === 1) colSpan = "lg:col-span-5 sm:col-span-2";

                    return (
                        <Reveal
                            key={service.slug}
                            delay={index * 70}
                            className={`${colSpan} group relative flex cursor-pointer flex-col justify-between overflow-hidden rounded-xl border transition-all duration-500 ${
                                dark
                                    ? "border-paper/15 bg-paper/[0.03] hover:border-accent hover:bg-paper/[0.06] hover:shadow-[0_0_35px_rgba(36,91,219,0.22)]"
                                    : "border-rule bg-white hover:border-accent hover:shadow-[0_18px_40px_-15px_rgba(17,19,21,0.12)]"
                            }`}
                        >
                            <div className="p-6 sm:p-8">
                                {/* Top metadata & icon bar */}
                                <div className="flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <span
                                            className={`font-mono text-small tabular-nums ${
                                                dark ? "text-accent" : "text-accent font-semibold"
                                            }`}
                                        >
                                            //{padStep(index + 1)}
                                        </span>
                                        <span
                                            className={`rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-wider ${
                                                dark
                                                    ? "bg-paper/10 text-paper/80 border border-paper/10"
                                                    : "bg-paper text-body border border-rule"
                                            }`}
                                        >
                                            {badge}
                                        </span>
                                    </div>

                                    <div
                                        className={`flex h-10 w-10 items-center justify-center rounded-lg border transition-all duration-300 ${
                                            dark
                                                ? "border-paper/20 bg-paper/10 text-paper group-hover:border-accent group-hover:bg-accent group-hover:text-white"
                                                : "border-rule bg-paper text-ink group-hover:border-accent group-hover:bg-accent group-hover:text-white"
                                        }`}
                                    >
                                        <Icon name={service.icon} className="h-5 w-5" />
                                    </div>
                                </div>

                                {/* Title & Summary */}
                                <Heading className="mt-6 text-h2 font-medium tracking-tight">
                                    <Link
                                        to={href}
                                        className={`transition-colors duration-200 after:absolute after:inset-0 after:content-[''] ${
                                            dark
                                                ? "text-paper group-hover:text-accent"
                                                : "text-ink group-hover:text-accent"
                                        }`}
                                    >
                                        {service.title}
                                    </Link>
                                </Heading>

                                <p
                                    className={`mt-3 text-body-lg leading-relaxed ${
                                        dark ? "text-paper/75" : "text-body"
                                    }`}
                                >
                                    {service.summary}
                                </p>

                                {/* Tags list */}
                                <ul className="mt-5 flex flex-wrap gap-2">
                                    {tags.map((tag) => (
                                        <li
                                            key={tag}
                                            className={`rounded-md px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider ${
                                                dark
                                                    ? "bg-paper/5 text-paper/60 border border-paper/10"
                                                    : "bg-paper/70 text-body border border-rule/70"
                                            }`}
                                        >
                                            {tag}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Visual Image Showcase Container */}
                            <div className="relative mt-2 px-6 pb-6 sm:px-8 sm:pb-8">
                                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg border border-paper/10 bg-black/20">
                                    {imageSrc ? (
                                        <img
                                            src={imageSrc}
                                            alt={service.title}
                                            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                            loading="lazy"
                                        />
                                    ) : null}

                                    {/* Gradient overlay for depth */}
                                    <div
                                        className={`absolute inset-0 bg-gradient-to-t transition-opacity duration-300 ${
                                            dark
                                                ? "from-ink/80 via-transparent to-transparent group-hover:from-ink/50"
                                                : "from-ink/60 via-transparent to-transparent group-hover:from-ink/40"
                                        }`}
                                    />

                                    {/* Interactive CTA overlay button */}
                                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                                        <span className="font-mono text-[11px] uppercase tracking-wider text-white/90 drop-shadow-sm font-medium">
                                            View specifications
                                        </span>
                                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-ink shadow-sm transition-transform duration-300 group-hover:translate-x-1 group-hover:bg-accent group-hover:text-white">
                                            <Icon name="arrow-right" className="h-4 w-4" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Reveal>
                    );
                })}
            </div>
        );
    }

    // Cinematic Showcase Deck for /services page
    return (
        <div className="space-y-12 lg:space-y-16">
            {services.map((service, index) => {
                const imageSrc = serviceImages[service.slug];
                const tags = serviceTags[service.slug] ?? [];
                const badge = serviceBadges[service.slug] ?? "Engineering Domain";
                const href = `/services/${service.slug}`;
                const isEven = index % 2 === 1;

                return (
                    <Reveal
                        key={service.slug}
                        delay={index * 60}
                        className={`group relative cursor-pointer overflow-hidden rounded-2xl border transition-all duration-500 ${
                            dark
                                ? "border-paper/15 bg-paper/[0.03] hover:border-accent hover:bg-paper/[0.06] hover:shadow-[0_0_35px_rgba(36,91,219,0.22)]"
                                : "border-rule bg-white hover:border-accent hover:shadow-[0_20px_45px_-15px_rgba(17,19,21,0.1)]"
                        }`}
                    >
                        <div className="grid items-center gap-8 p-8 sm:p-10 lg:grid-cols-12 lg:gap-12 lg:p-12">
                            {/* Image Showcase Column */}
                            <div
                                className={`lg:col-span-6 ${isEven ? "lg:order-2" : "lg:order-1"}`}
                            >
                                <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-rule/60 bg-paper shadow-sm">
                                    {imageSrc ? (
                                        <img
                                            src={imageSrc}
                                            alt={service.title}
                                            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                            loading="lazy"
                                        />
                                    ) : null}
                                    <div className="absolute left-4 top-4 flex items-center gap-2">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-rule/60 bg-white/95 text-ink shadow-xs backdrop-blur-xs">
                                            <Icon name={service.icon} className="h-5 w-5" />
                                        </div>
                                        <span className="rounded-full bg-ink/90 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-paper backdrop-blur-xs">
                                            {badge}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Content Column */}
                            <div
                                className={`lg:col-span-6 flex flex-col justify-between ${
                                    isEven ? "lg:order-1" : "lg:order-2"
                                }`}
                            >
                                <div>
                                    <div className="flex items-center gap-3 font-mono text-small text-accent font-semibold">
                                        <span>//{padStep(index + 1)}</span>
                                        <span className="text-muted">•</span>
                                        <span className="text-muted uppercase tracking-widest text-[11px]">
                                            Core Capability
                                        </span>
                                    </div>

                                    <Heading className="mt-4 text-h2 font-medium tracking-tight">
                                        <Link
                                            to={href}
                                            className="text-ink transition-colors group-hover:text-accent after:absolute after:inset-0 after:content-['']"
                                        >
                                            {service.title}
                                        </Link>
                                    </Heading>

                                    <p className="mt-4 text-body-lg leading-relaxed text-body">
                                        {service.description}
                                    </p>

                                    {/* Key Capabilities Preview */}
                                    <div className="mt-6 space-y-2 border-t border-rule/80 pt-6">
                                        {service.capabilities.slice(0, 3).map((cap) => (
                                            <div
                                                key={cap.title}
                                                className="flex items-baseline gap-3 text-small"
                                            >
                                                <span className="text-accent font-mono text-[11px]">
                                                    ✓
                                                </span>
                                                <span className="font-medium text-ink">
                                                    {cap.title}:
                                                </span>
                                                <span className="text-muted line-clamp-1">
                                                    {cap.description}
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Tags */}
                                    <ul className="mt-6 flex flex-wrap gap-2">
                                        {tags.map((tag) => (
                                            <li
                                                key={tag}
                                                className="rounded-md bg-paper px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-body border border-rule"
                                            >
                                                {tag}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="relative z-10 mt-8 pt-4">
                                    <ButtonLink to={href} variant="primary" withArrow>
                                        Explore {service.title}
                                    </ButtonLink>
                                </div>
                            </div>
                        </div>
                    </Reveal>
                );
            })}
        </div>
    );
}
