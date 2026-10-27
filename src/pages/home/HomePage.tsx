import { Link } from "react-router";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { ClosingCta } from "@/components/layout/ClosingCta";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { TextLink } from "@/components/ui/TextLink";
import { Icon } from "@/components/ui/Icon";
import { HeroComposition } from "@/components/home/HeroComposition";
import { ServiceIndex } from "@/components/services/ServiceIndex";
import { ProcessSteps } from "@/components/process/ProcessSteps";
import { ProjectGrid } from "@/components/projects/ProjectGrid";
import { useHomePage } from "@/pages/home/HomePage.hooks";

const capabilityItems = [
    {
        name: "Web Applications",
        href: "/services/web-applications",
        icon: "monitor" as const,
        detail: "SaaS & Portals",
    },
    {
        name: "Mobile Applications",
        href: "/services/mobile-applications",
        icon: "smartphone" as const,
        detail: "iOS & Android",
    },
    {
        name: "Desktop Applications",
        href: "/services/desktop-applications",
        icon: "app-window" as const,
        detail: "macOS & Windows",
    },
    {
        name: "CRM, CMS & ERP",
        href: "/services/crm-cms-erp",
        icon: "layers" as const,
        detail: "Business Systems",
    },
    {
        name: "Custom Software",
        href: "/services/custom-software",
        icon: "code" as const,
        detail: "APIs & Pipelines",
    },
];

export function HomePage() {
    const { hero, services, stages, principles, featuredProjects, hasFeaturedWork } = useHomePage();

    return (
        <>
            {/* Hero Section */}
            <section
                aria-labelledby="hero-title"
                className="relative overflow-hidden border-b border-rule bg-paper"
            >
                {/* Subtle blueprint grid overlay */}
                <div
                    className="pointer-events-none absolute inset-0 grid-blueprint opacity-60"
                    aria-hidden="true"
                />

                <Container className="relative grid gap-12 py-16 lg:grid-cols-12 lg:items-center lg:gap-10 lg:py-28">
                    <div className="lg:col-span-7">
                        {/* Live Studio Status Badge */}
                        <div className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-rule/90 bg-white/90 px-3.5 py-1.5 shadow-xs backdrop-blur-sm">
                            <span className="relative flex h-2 w-2">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
                            </span>
                            <span className="text-eyebrow font-medium uppercase tracking-wider text-ink">
                                Digital Product Engineering Studio
                            </span>
                            <span className="h-2.5 w-px bg-rule" />
                            <span className="font-mono text-[11px] text-muted">Classific v2.0</span>
                        </div>

                        <h1 id="hero-title" className="text-display leading-[0.98] tracking-tight">
                            Software for
                            <br />
                            what&rsquo;s next.
                        </h1>

                        <p className="mt-8 max-w-xl text-body-lg text-body leading-relaxed">
                            {hero.copy}
                        </p>

                        <div className="mt-10 flex flex-wrap items-center gap-4">
                            <ButtonLink to={hero.primary.to} variant="primary" withArrow>
                                {hero.primary.label}
                            </ButtonLink>
                            <ButtonLink to={hero.secondary.to} variant="secondary">
                                {hero.secondary.label}
                            </ButtonLink>
                        </div>

                        {/* Engineering Commitments Bar */}
                        <div className="mt-12 flex flex-wrap items-center gap-6 border-t border-rule/80 pt-8 text-[12px] font-mono text-muted">
                            <div className="flex items-center gap-2">
                                <Icon name="shield-check" className="h-4 w-4 text-accent" />
                                <span>100% Code &amp; IP Ownership</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Icon name="workflow" className="h-4 w-4 text-accent" />
                                <span>WCAG 2.2 AA Accessibility</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Icon name="code" className="h-4 w-4 text-accent" />
                                <span>Automated CI/CD Testing</span>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-5">
                        <HeroComposition />
                    </div>
                </Container>
            </section>

            {/* Interactive Capabilities Ribbon */}
            <section aria-label="Capabilities" className="border-b border-rule bg-white">
                <Container>
                    <ul className="grid divide-y divide-rule sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-5">
                        {capabilityItems.map((item, index) => (
                            <li
                                key={item.name}
                                className="group sm:border-r sm:border-rule sm:pr-6 sm:[&:nth-child(2n)]:border-r-0 lg:[&:nth-child(2n)]:border-r lg:[&:nth-child(5n)]:border-r-0 lg:[&:not(:first-child)]:pl-6"
                            >
                                <Link
                                    to={item.href}
                                    className="flex items-center justify-between py-5 text-small text-body transition-colors group-hover:text-ink"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="font-mono tabular-nums text-muted group-hover:text-accent">
                                            0{index + 1}
                                        </span>
                                        <div>
                                            <p className="font-medium text-ink transition-colors group-hover:text-accent">
                                                {item.name}
                                            </p>
                                            <p className="text-[11px] text-muted">{item.detail}</p>
                                        </div>
                                    </div>
                                    <Icon
                                        name={item.icon}
                                        className="h-4 w-4 text-muted transition-transform duration-200 group-hover:scale-110 group-hover:text-ink"
                                    />
                                </Link>
                            </li>
                        ))}
                    </ul>
                </Container>
            </section>

            {/* Services Section */}
            <Section labelledBy="services-title" tone="paper">
                <SectionHeading
                    id="services-title"
                    eyebrow="Services"
                    title="Five disciplines, one engineering standard."
                    intro="Each service is delivered by the same team with the same approach to discovery, design, testing and support."
                    align="split"
                />
                <div className="mt-12 lg:mt-16">
                    <ServiceIndex services={services} layout="grid" />
                </div>
                <div className="mt-10">
                    <TextLink to="/services" variant="arrow">
                        See all services
                    </TextLink>
                </div>
            </Section>

            {/* Process Section */}
            <Section labelledBy="process-title" tone="white">
                <SectionHeading
                    id="process-title"
                    eyebrow="Process"
                    title="A sequence you can follow, from first conversation to launch."
                    intro="Five stages, each with clear activities and deliverables. The sequence is the same for every project; the depth of each stage depends on the work."
                    align="split"
                />
                <div className="mt-12 lg:mt-16">
                    <ProcessSteps stages={stages} variant="compact" />
                </div>
                <div className="mt-10">
                    <TextLink to="/process" variant="arrow">
                        Read about how we work
                    </TextLink>
                </div>
            </Section>

            {/* Why Classific Section */}
            <Section labelledBy="why-title" tone="paper">
                <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
                    <div className="lg:col-span-4">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                            <span className="eyebrow text-ink">Why Classific</span>
                        </div>
                        <h2 id="why-title" className="text-h2 leading-tight">
                            Engineering in service of the business.
                        </h2>
                        <p className="mt-6 text-body-lg text-body leading-relaxed">
                            We measure our work by what changes for the people who use it. These
                            four principles shape every engagement.
                        </p>

                        {/* Engineering Standards Matrix Box */}
                        <div className="mt-8 rounded-md border border-rule bg-white p-6 shadow-xs">
                            <p className="eyebrow text-[10px] text-accent">Engineering Standards</p>
                            <ul className="mt-4 space-y-3 text-small text-body">
                                <li className="flex items-start gap-2.5">
                                    <span className="text-accent mt-0.5 font-bold">✓</span>
                                    <span>Direct contact with senior engineers throughout</span>
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <span className="text-accent mt-0.5 font-bold">✓</span>
                                    <span>Zero third-party vendor lock-in</span>
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <span className="text-accent mt-0.5 font-bold">✓</span>
                                    <span>Comprehensive architectural documentation</span>
                                </li>
                            </ul>
                        </div>

                        <div className="mt-8">
                            <TextLink to="/about" variant="arrow">
                                About Classific
                            </TextLink>
                        </div>
                    </div>

                    <dl className="grid gap-6 sm:grid-cols-2 lg:col-span-8">
                        {principles.map((principle) => (
                            <div
                                key={principle.title}
                                className="group flex flex-col justify-between rounded-md border border-rule bg-white p-8 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-ink-soft/40 hover:shadow-lg"
                            >
                                <div>
                                    <div className="flex h-11 w-11 items-center justify-center rounded border border-rule bg-paper text-ink transition-colors duration-200 group-hover:border-accent group-hover:bg-accent group-hover:text-white">
                                        <Icon name={principle.icon} className="h-5 w-5" />
                                    </div>
                                    <dt className="mt-6 text-h3 font-medium transition-colors group-hover:text-accent">
                                        {principle.title}
                                    </dt>
                                    <dd className="mt-3 text-body text-body leading-relaxed">
                                        {principle.description}
                                    </dd>
                                </div>
                                <div className="mt-6 border-t border-rule/60 pt-4">
                                    <span className="font-mono text-[10px] uppercase tracking-wider text-muted">
                                        Verified Standard
                                    </span>
                                </div>
                            </div>
                        ))}
                    </dl>
                </div>
            </Section>

            {/* Selected Work Section */}
            <Section labelledBy="work-title" tone="white">
                <SectionHeading
                    id="work-title"
                    eyebrow="Selected work"
                    title="Real projects, published with verified details."
                    intro={
                        hasFeaturedWork
                            ? "A selection of recent work across web, mobile, desktop and business systems."
                            : "We publish case studies only once outcomes are verified and clients have approved them."
                    }
                    align="split"
                />
                <div className="mt-12 lg:mt-16">
                    <ProjectGrid projects={featuredProjects} />
                </div>
                <div className="mt-10">
                    <TextLink to="/work" variant="arrow">
                        {hasFeaturedWork ? "View all work" : "Visit the work page"}
                    </TextLink>
                </div>
            </Section>

            {/* Closing CTA */}
            <ClosingCta secondaryLabel="Explore services" secondaryTo="/services" />
        </>
    );
}
