import { PageHero } from "@/components/layout/PageHero";
import { Fold } from "@/components/layout/Fold";
import { ClosingCta } from "@/components/layout/ClosingCta";
import { ThreadedPage } from "@/components/layout/ThreadedPage";
import { ParallaxImage, Reveal } from "@/components/motion/Reveal";
import { ServiceIndex } from "@/components/services/ServiceIndex";
import { FaqList } from "@/components/services/FaqList";
import { ProcessSteps } from "@/components/process/ProcessSteps";
import { BulletList } from "@/components/ui/BulletList";
import { TextLink } from "@/components/ui/TextLink";
import { useServicesPage } from "@/pages/services/ServicesPage.hooks";

import layeredArchitectureImg from "@/assets/services/layered_architecture.jpg";
import connectedSystemsImg from "@/assets/services/connected_systems.jpg";

export function ServicesPage() {
    const { services, stages, faqs, breadcrumbs, problems, deliverables } = useServicesPage();

    return (
        <ThreadedPage>
            <PageHero
                eyebrow="Services"
                title="Software engineering across every surface your business runs on."
                copy="Web, mobile, desktop, business systems and custom software, delivered by one team with one standard for discovery, design, testing and support."
                breadcrumbs={breadcrumbs}
                thread
            />

            <Fold
                tone="paper"
                id="service-list-title"
                index="01"
                label="What we build"
                word={["Five service", "areas."]}
                wordSize={12}
                intro="Most engagements combine more than one. Each area below links to a detailed page with problems solved, capabilities, use cases and frequently asked questions."
            >
                <div className="mt-14 lg:mt-20">
                    <span data-thread-node className="block h-0 w-0" aria-hidden="true" />
                    <ServiceIndex services={services} layout="list" headingLevel="h3" />
                </div>
            </Fold>

            <Fold
                tone="ink"
                id="problems-title"
                index="02"
                label="Business problems we address"
                word={["Projects start", "with a problem,", "not a technology."]}
                wordSize={8.2}
                intro="The requests we hear most often share a pattern: a process that has outgrown its tools, or a system that holds the business back."
                node
            >
                <div className="mt-14 grid gap-12 lg:mt-20 lg:grid-cols-12 lg:gap-10">
                    <Reveal variant="clip" className="lg:col-span-5">
                        <ParallaxImage
                            src={connectedSystemsImg}
                            alt="Connected systems architecture"
                            className="aspect-[16/10] border border-paper/20"
                        />
                        <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.1em] text-paper/55">
                            Distributed architecture &amp; data flow
                        </p>
                    </Reveal>
                    <div className="lg:col-span-6 lg:col-start-7">
                        <BulletList items={problems} numbered tone="dark" />
                    </div>
                </div>
            </Fold>

            <Fold
                tone="paper"
                id="deliverables-title"
                index="03"
                label="Typical deliverables"
                word={["What you", "receive."]}
                wordSize={14}
                intro="Deliverables vary by project, but working software is always accompanied by the documentation and tooling needed to run it."
                node
            >
                <div className="mt-14 grid gap-12 lg:mt-20 lg:grid-cols-12 lg:gap-10">
                    <div className="order-2 lg:order-1 lg:col-span-6">
                        <BulletList items={deliverables} columns={1} />
                    </div>
                    <Reveal
                        variant="clip"
                        className="order-1 lg:order-2 lg:col-span-5 lg:col-start-8"
                    >
                        <ParallaxImage
                            src={layeredArchitectureImg}
                            alt="Layered software architecture on volcanic pedestal"
                            className="aspect-[16/10] border border-rule"
                        />
                        <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.1em] text-muted">
                            Full-stack deliverable stack
                        </p>
                    </Reveal>
                </div>
            </Fold>

            <Fold
                tone="ink"
                id="approach-title"
                index="04"
                label="Development approach"
                word={["The same five", "stages,", "every time."]}
                wordSize={10.5}
                intro="Discovery before commitments, planning before design, and automated testing throughout development."
            >
                <div className="mt-14 lg:mt-20">
                    <ProcessSteps stages={stages} variant="compact" tone="dark" thread />
                </div>
                <Reveal className="mt-12 text-paper">
                    <TextLink to="/process" variant="arrow">
                        Full process
                    </TextLink>
                </Reveal>
            </Fold>

            <Fold
                tone="paper"
                id="faq-title"
                index="05"
                label="Questions"
                word={["Frequently", "asked."]}
                wordSize={13}
                node
            >
                <div className="mt-14 lg:mt-20 lg:max-w-4xl">
                    <FaqList faqs={faqs} idPrefix="services-faq" />
                </div>
            </Fold>

            <ClosingCta tangle />
        </ThreadedPage>
    );
}
