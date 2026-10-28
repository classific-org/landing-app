import { Link } from "react-router";
import { Container } from "@/components/layout/Container";
import { Fold } from "@/components/layout/Fold";
import { ClosingCta } from "@/components/layout/ClosingCta";
import { Reveal, TextReveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { TextLink } from "@/components/ui/TextLink";
import { Icon } from "@/components/ui/Icon";
import { HeroThread } from "@/components/home/HeroThread";
import { PageThread } from "@/components/home/PageThread";
import { useLineDrift, useScrollProgress } from "@/components/motion/motion.hooks";
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

const commitments = [
    { icon: "shield-check" as const, label: "100% Code & IP Ownership" },
    { icon: "workflow" as const, label: "WCAG 2.2 AA Accessibility" },
    { icon: "code" as const, label: "Automated CI/CD Testing" },
];

const standards = [
    "Direct contact with senior engineers throughout",
    "Zero third-party vendor lock-in",
    "Comprehensive architectural documentation",
];

/** Lowers the outer capabilities so the five nodes sit on a gentle arch. */
const arcOffsets = ["sm:mt-10", "sm:mt-4", "sm:mt-0", "sm:mt-4", "sm:mt-10"];

const delay = (ms: number) => ({ "--enter-delay": `${ms}ms` }) as React.CSSProperties;

export function HomePage() {
    const { hero, services, stages, principles, featuredProjects, hasFeaturedWork } = useHomePage();
    const heroRef = useScrollProgress<HTMLElement>();
    const statementRef = useLineDrift<HTMLHeadingElement>();

    return (
        <div className="relative overflow-x-clip">
            <PageThread />
            <section
                ref={heroRef}
                aria-labelledby="hero-title"
                className="hero relative overflow-hidden"
            >
                <Container className="relative flex min-h-[calc(100svh-4.5rem)] flex-col justify-between pb-8 pt-6 lg:pb-10 lg:pt-8">
                    <div>
                        <p
                            className="enter font-mono text-[11px] uppercase tracking-[0.14em] text-paper/60"
                            style={delay(60)}
                        >
                            Digital Product Engineering Studio
                        </p>

                        <div className="relative mt-5 lg:mt-7">
                            <h1 id="hero-title" className="hero-title">
                                <TextReveal
                                    lines={["Software", "for what’s", "next."]}
                                    trigger="load"
                                />
                            </h1>
                            <HeroThread />
                        </div>
                    </div>

                    <div className="mt-14 grid items-end gap-10 lg:mt-10 lg:grid-cols-12">
                        <div className="enter lg:col-span-5" style={delay(900)}>
                            <p className="max-w-md font-mono text-[13px] leading-relaxed text-paper/80 lg:text-[15px]">
                                {hero.copy}
                            </p>
                            <div className="mt-8 flex flex-wrap items-center gap-4">
                                <ButtonLink to={hero.primary.to} variant="inverse" withArrow>
                                    {hero.primary.label}
                                </ButtonLink>
                                <ButtonLink to={hero.secondary.to} variant="ghost-inverse">
                                    {hero.secondary.label}
                                </ButtonLink>
                            </div>
                        </div>

                        <p
                            className="enter-fade hidden items-center gap-3 justify-self-end font-mono text-[11px] uppercase tracking-[0.14em] text-paper/60 lg:col-span-4 lg:col-start-9 lg:flex"
                            style={delay(1400)}
                        >
                            <span>Scroll to follow the thread</span>
                            <Icon
                                name="arrow-right"
                                className="hero-scroll-arrow h-3.5 w-3.5 rotate-90 text-accent"
                            />
                        </p>
                    </div>
                </Container>

                <div className="relative border-t border-paper/15">
                    <Container>
                        <ul className="grid gap-x-8 gap-y-3 py-5 font-mono text-[12px] text-paper/70 sm:grid-cols-3">
                            {commitments.map((item) => (
                                <li key={item.label} className="flex items-center gap-2.5">
                                    <Icon
                                        name={item.icon}
                                        className="h-4 w-4 flex-none text-accent"
                                    />
                                    <span>{item.label}</span>
                                </li>
                            ))}
                        </ul>
                    </Container>
                </div>
            </section>

            <section aria-labelledby="statement-title" className="fold bg-paper text-ink">
                <Container className="section-y">
                    <Reveal className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.14em] text-body">
                        <span className="tabular-nums">01</span>
                        <span aria-hidden="true">/</span>
                        <span>Capabilities</span>
                    </Reveal>

                    <h2
                        ref={statementRef}
                        id="statement-title"
                        className="fold-word drift mt-8 lg:mt-12"
                        style={{ "--fold-size": "8.8vw" } as React.CSSProperties}
                    >
                        <TextReveal lines={["Five disciplines,", "one engineering", "standard."]} />
                    </h2>

                    <ul className="mt-14 flex flex-col gap-2 sm:grid sm:grid-cols-5 sm:gap-6 lg:mt-24">
                        {capabilityItems.map((item, index) => (
                            <Reveal
                                as="li"
                                key={item.name}
                                delay={index * 70}
                                className={arcOffsets[index]}
                            >
                                <Link to={item.href} className="row-link group block py-4 sm:py-0">
                                    <span
                                        data-thread-node
                                        className="absolute -left-[19px] top-6 block h-[18px] w-[18px] sm:static sm:mb-7"
                                        aria-hidden="true"
                                    />
                                    <span className="block">
                                        <span className="block font-mono text-[11px] tabular-nums text-muted">
                                            0{index + 1}
                                        </span>
                                        <span className="mt-1 block text-h3 transition-colors group-hover:text-accent">
                                            {item.name}
                                        </span>
                                        <span className="mt-1 block text-small text-muted">
                                            {item.detail}
                                        </span>
                                    </span>
                                </Link>
                            </Reveal>
                        ))}
                    </ul>
                </Container>
            </section>

            <Fold
                tone="ink"
                id="services-title"
                index="02"
                label="Services"
                word="Services"
                wordSize={17}
                intro="Each service is delivered by the same team with the same approach to discovery, design, testing and support."
            >
                <div className="mt-14 lg:mt-20">
                    <ServiceIndex services={services} layout="grid" tone="dark" thread />
                </div>
                <Reveal className="mt-10 text-paper">
                    <TextLink to="/services" variant="arrow">
                        See all services
                    </TextLink>
                </Reveal>
            </Fold>

            <Fold
                tone="paper"
                id="process-title"
                index="03"
                label="Process"
                word="Process"
                wordSize={19}
                lead="A sequence you can follow, from first conversation to launch."
                intro="Five stages, each with clear activities and deliverables. The sequence is the same for every project; the depth of each stage depends on the work."
            >
                <div className="mt-14 lg:mt-20">
                    <ProcessSteps stages={stages} variant="compact" thread />
                </div>
                <Reveal className="mt-12">
                    <TextLink to="/process" variant="arrow">
                        Read about how we work
                    </TextLink>
                </Reveal>
            </Fold>

            <Fold
                tone="ink"
                id="why-title"
                index="04"
                label="Why Classific"
                word={["Why", "Classific"]}
                wordSize={16}
                lead="Engineering in service of the business."
                intro="We measure our work by what changes for the people who use it. These four principles shape every engagement."
                node
            >
                <div className="mt-14 grid gap-14 lg:mt-20 lg:grid-cols-12 lg:gap-10">
                    <Reveal className="lg:col-span-4">
                        <p className="eyebrow text-paper">Engineering standards</p>
                        <ul className="mt-4 border-t border-paper/30">
                            {standards.map((item) => (
                                <li
                                    key={item}
                                    className="flex items-start gap-3 border-b border-paper/15 py-3.5 text-small text-paper/75"
                                >
                                    <span className="mt-0.5 text-accent" aria-hidden="true">
                                        ✓
                                    </span>
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                        <div className="mt-8 text-paper">
                            <TextLink to="/about" variant="arrow">
                                About Classific
                            </TextLink>
                        </div>
                    </Reveal>

                    <dl className="grid gap-x-10 sm:grid-cols-2 lg:col-span-8">
                        {principles.map((principle, index) => (
                            <Reveal
                                key={principle.title}
                                delay={(index % 2) * 90}
                                className="group border-t border-paper/40 py-8 lg:py-10"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <span className="font-mono text-[11px] tabular-nums text-paper/50">
                                        0{index + 1}
                                    </span>
                                    <Icon
                                        name={principle.icon}
                                        className="h-5 w-5 text-paper transition-colors duration-300 group-hover:text-accent"
                                    />
                                </div>
                                <dt className="mt-10 text-h3 font-medium text-paper lg:mt-16">
                                    {principle.title}
                                </dt>
                                <dd className="mt-3 max-w-sm text-body text-paper/75">
                                    {principle.description}
                                </dd>
                            </Reveal>
                        ))}
                    </dl>
                </div>
            </Fold>

            <Fold
                tone="paper"
                id="work-title"
                index="05"
                label="Selected work"
                word="Work"
                wordSize={26}
                lead="Real projects, published with verified details."
                intro={
                    hasFeaturedWork
                        ? "A selection of recent work across web, mobile, desktop and business systems."
                        : "We publish case studies only once outcomes are verified and clients have approved them."
                }
                node
            >
                <div className="mt-14 lg:mt-20">
                    <ProjectGrid projects={featuredProjects} />
                </div>
                <Reveal className="mt-12">
                    <TextLink to="/work" variant="arrow">
                        {hasFeaturedWork ? "View all work" : "Visit the work page"}
                    </TextLink>
                </Reveal>
            </Fold>

            <ClosingCta secondaryLabel="Explore services" secondaryTo="/services" tangle />
        </div>
    );
}
