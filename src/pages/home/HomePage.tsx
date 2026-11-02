import { Container } from "@/components/layout/Container";
import { Fold } from "@/components/layout/Fold";
import { Reveal, TextReveal } from "@/components/motion/Reveal";
import { TextLink } from "@/components/ui/TextLink";
import { Icon } from "@/components/ui/Icon";
import { HeroThread } from "@/components/home/HeroThread";
import { CapabilitiesScene } from "@/components/home/scenes/CapabilitiesScene";
import { ClosingScene } from "@/components/home/scenes/ClosingScene";
import { ProcessScene } from "@/components/home/scenes/ProcessScene";
import { WhyScene } from "@/components/home/scenes/WhyScene";
import { WorkScene } from "@/components/home/scenes/WorkScene";
import { PageThread } from "@/components/home/PageThread";
import { ServiceWorlds } from "@/components/services/worlds/ServiceWorlds";
import { ProjectGrid } from "@/components/projects/ProjectGrid";
import { useHomePage } from "@/pages/home/HomePage.hooks";

const capabilityItems = [
    {
        name: "Web Applications",
        href: "/services/web-applications",
        detail: "SaaS & Portals",
    },
    {
        name: "Mobile Applications",
        href: "/services/mobile-applications",
        detail: "iOS & Android",
    },
    {
        name: "Desktop Applications",
        href: "/services/desktop-applications",
        detail: "macOS & Windows",
    },
    {
        name: "CRM, CMS & ERP",
        href: "/services/crm-cms-erp",
        detail: "Business Systems",
    },
    {
        name: "Custom Software",
        href: "/services/custom-software",
        detail: "APIs & Pipelines",
    },
];

const delay = (ms: number) => ({ "--enter-delay": `${ms}ms` }) as React.CSSProperties;

export function HomePage() {
    const { hero, services, stages, principles, featuredProjects, hasFeaturedWork } = useHomePage();

    return (
        <div className="relative overflow-x-clip">
            <PageThread />
            <section
                aria-labelledby="hero-title"
                data-thread-route="hero"
                className="hero relative overflow-hidden"
            >
                <HeroThread />
                <Container className="relative flex min-h-[calc(100svh-4.5rem)] flex-col pb-7 pt-7 lg:pb-10 lg:pt-8">
                    {/* Where the thread begins: a single dot under the logo. */}
                    <span data-hero-origin className="hero-origin" aria-hidden="true" />

                    {/* The headline is centred in the space between the dot and the copy. */}
                    <div className="relative my-auto pb-[max(min(2.5rem,5svh),3.5rem)] pt-[min(2.5rem,5svh)] lg:pb-[max(min(2rem,4svh),3.5rem)] lg:pt-[min(2rem,4svh)]">
                        <h1 id="hero-title" className="hero-title">
                            <TextReveal
                                lines={["We build", "software", "that ships."]}
                                trigger="load"
                            />
                        </h1>
                    </div>

                    <div className="grid items-end gap-6 lg:grid-cols-12 lg:gap-10">
                        <p
                            data-hero-copy
                            className="enter max-w-md font-mono text-lede-mono text-paper/80 lg:col-span-5 lg:max-w-[26rem]"
                            style={delay(900)}
                        >
                            {hero.copy}
                        </p>

                        <p
                            data-thread-anchor="scroll-hint"
                            className="enter-fade flex items-center gap-3 justify-self-start font-mono text-[11px] uppercase tracking-[0.14em] text-paper/60 lg:col-span-4 lg:col-start-9 lg:justify-self-end"
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
            </section>

            <CapabilitiesScene items={capabilityItems} />

            <ServiceWorlds services={services} />

            <ProcessScene stages={stages} />

            <WhyScene principles={principles} />

            {hasFeaturedWork ? (
                <Fold
                    tone="paper"
                    id="work-title"
                    index="09"
                    label="Selected work"
                    word="Work"
                    wordSize={26}
                    lead="Real projects, published with verified details."
                    intro="A selection of recent work across web, mobile, desktop and business systems."
                >
                    <div className="mt-14 lg:mt-20">
                        <ProjectGrid projects={featuredProjects} />
                    </div>
                    <Reveal className="mt-12">
                        <TextLink to="/work" variant="arrow">
                            View all work
                        </TextLink>
                    </Reveal>
                </Fold>
            ) : (
                <WorkScene />
            )}

            <ClosingScene />
        </div>
    );
}
