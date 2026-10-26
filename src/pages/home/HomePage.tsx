import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { Eyebrow } from "@/components/layout/Eyebrow";
import { ClosingCta } from "@/components/layout/ClosingCta";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { TextLink } from "@/components/ui/TextLink";
import { Icon } from "@/components/ui/Icon";
import { HeroComposition } from "@/components/home/HeroComposition";
import { ServiceIndex } from "@/components/services/ServiceIndex";
import { ProcessSteps } from "@/components/process/ProcessSteps";
import { ProjectGrid } from "@/components/projects/ProjectGrid";
import { useHomePage } from "@/pages/home/HomePage.hooks";

export function HomePage() {
    const { hero, capabilities, services, stages, principles, featuredProjects, hasFeaturedWork } =
        useHomePage();

    return (
        <>
            <section aria-labelledby="hero-title" className="border-b border-rule bg-paper">
                <Container className="grid gap-12 py-16 lg:grid-cols-12 lg:items-center lg:gap-8 lg:py-28">
                    <div className="lg:col-span-7">
                        <Eyebrow className="mb-6">Software engineering studio</Eyebrow>
                        <h1 id="hero-title" className="text-display">
                            Software for
                            <br />
                            what&rsquo;s next.
                        </h1>
                        <p className="mt-8 max-w-xl text-body-lg text-body">{hero.copy}</p>
                        <div className="mt-10 flex flex-wrap gap-4">
                            <ButtonLink to={hero.primary.to} variant="primary" withArrow>
                                {hero.primary.label}
                            </ButtonLink>
                            <ButtonLink to={hero.secondary.to} variant="secondary">
                                {hero.secondary.label}
                            </ButtonLink>
                        </div>
                    </div>
                    <div className="lg:col-span-5">
                        <HeroComposition />
                    </div>
                </Container>
            </section>

            <section aria-label="Capabilities" className="border-b border-rule bg-white">
                <Container>
                    <ul className="grid divide-y divide-rule sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-5">
                        {capabilities.map((capability, index) => (
                            <li
                                key={capability}
                                className="flex items-center gap-3 py-5 text-small text-body sm:border-r sm:border-rule sm:pr-6 sm:[&:nth-child(2n)]:border-r-0 lg:[&:nth-child(2n)]:border-r lg:[&:nth-child(5n)]:border-r-0 lg:[&:not(:first-child)]:pl-6"
                            >
                                <span className="tabular-nums text-body">0{index + 1}</span>
                                <span className="text-ink">{capability}</span>
                            </li>
                        ))}
                    </ul>
                </Container>
            </section>

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

            <Section labelledBy="why-title" tone="paper">
                <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
                    <div className="lg:col-span-4">
                        <Eyebrow className="mb-4">Why Classific</Eyebrow>
                        <h2 id="why-title" className="text-h2">
                            Engineering in service of the business.
                        </h2>
                        <p className="mt-6 text-body-lg text-body">
                            We measure our work by what changes for the people who use it. These
                            four principles shape every engagement.
                        </p>
                        <div className="mt-8">
                            <TextLink to="/about" variant="arrow">
                                About Classific
                            </TextLink>
                        </div>
                    </div>
                    <dl className="grid gap-x-8 border-t border-rule sm:grid-cols-2 lg:col-span-7 lg:col-start-6">
                        {principles.map((principle) => (
                            <div key={principle.title} className="border-b border-rule py-8">
                                <Icon name={principle.icon} className="h-5 w-5 text-ink" />
                                <dt className="mt-6 text-h3">{principle.title}</dt>
                                <dd className="mt-3 text-body text-body">{principle.description}</dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </Section>

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

            <ClosingCta secondaryLabel="Explore services" secondaryTo="/services" />
        </>
    );
}
