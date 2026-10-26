import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { ClosingCta } from "@/components/layout/ClosingCta";
import { ServiceIndex } from "@/components/services/ServiceIndex";
import { FaqList } from "@/components/services/FaqList";
import { ProcessSteps } from "@/components/process/ProcessSteps";
import { BulletList } from "@/components/ui/BulletList";
import { TextLink } from "@/components/ui/TextLink";
import { useServicesPage } from "@/pages/services/ServicesPage.hooks";

export function ServicesPage() {
    const { services, stages, faqs, breadcrumbs, problems, deliverables } = useServicesPage();

    return (
        <>
            <PageHero
                eyebrow="Services"
                title="Software engineering across every surface your business runs on."
                copy="Web, mobile, desktop, business systems and custom software, delivered by one team with one standard for discovery, design, testing and support."
                breadcrumbs={breadcrumbs}
            />

            <Section labelledBy="service-list-title" tone="white">
                <SectionHeading
                    id="service-list-title"
                    eyebrow="What we build"
                    title="Five service areas."
                    intro="Most engagements combine more than one. Each area below links to a detailed page with problems solved, capabilities, use cases and frequently asked questions."
                    align="split"
                />
                <div className="mt-12 lg:mt-16">
                    <ServiceIndex services={services} layout="list" headingLevel="h3" />
                </div>
            </Section>

            <Section labelledBy="problems-title" tone="paper">
                <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
                    <div className="lg:col-span-5">
                        <SectionHeading
                            id="problems-title"
                            eyebrow="Business problems we address"
                            title="Projects start with a problem, not a technology."
                            intro="The requests we hear most often share a pattern: a process that has outgrown its tools, or a system that holds the business back."
                        />
                    </div>
                    <div className="lg:col-span-6 lg:col-start-7">
                        <BulletList items={problems} numbered />
                    </div>
                </div>
            </Section>

            <Section labelledBy="deliverables-title" tone="white">
                <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
                    <div className="lg:col-span-5">
                        <SectionHeading
                            id="deliverables-title"
                            eyebrow="Typical deliverables"
                            title="What you receive."
                            intro="Deliverables vary by project, but working software is always accompanied by the documentation and tooling needed to run it."
                        />
                    </div>
                    <div className="lg:col-span-6 lg:col-start-7">
                        <BulletList items={deliverables} columns={1} />
                    </div>
                </div>
            </Section>

            <Section labelledBy="approach-title" tone="paper">
                <SectionHeading
                    id="approach-title"
                    eyebrow="Development approach"
                    title="The same five stages, every time."
                    intro="Discovery before commitments, planning before design, and automated testing throughout development."
                    align="split"
                >
                    <div className="mt-6">
                        <TextLink to="/process" variant="arrow">
                            Full process
                        </TextLink>
                    </div>
                </SectionHeading>
                <div className="mt-12 lg:mt-16">
                    <ProcessSteps stages={stages} variant="compact" />
                </div>
            </Section>

            <Section labelledBy="faq-title" tone="white">
                <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
                    <div className="lg:col-span-4">
                        <SectionHeading
                            id="faq-title"
                            eyebrow="Questions"
                            title="Frequently asked."
                        />
                    </div>
                    <div className="lg:col-span-7 lg:col-start-6">
                        <FaqList faqs={faqs} idPrefix="services-faq" />
                    </div>
                </div>
            </Section>

            <ClosingCta />
        </>
    );
}
