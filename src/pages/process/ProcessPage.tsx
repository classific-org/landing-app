import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { ClosingCta } from "@/components/layout/ClosingCta";
import { ProcessSteps } from "@/components/process/ProcessSteps";
import { FaqList } from "@/components/services/FaqList";
import { useProcessPage } from "@/pages/process/ProcessPage.hooks";

import processDiagramImg from "@/assets/process/process_discover_plan_design_develop_launch.jpg";

export function ProcessPage() {
    const { stages, expectations, faqs, breadcrumbs } = useProcessPage();

    return (
        <>
            <PageHero
                eyebrow="Process"
                title="How we work, from discovery to launch and beyond."
                copy="Five stages with clear activities, deliverables and expectations on both sides. Timelines and commitments are agreed per project once discovery has established the scope."
                breadcrumbs={breadcrumbs}
            />

            {/* Visual Process Sequence Hero Banner */}
            <section className="border-b border-rule bg-white py-12 lg:py-16">
                <div className="container-page">
                    <div className="overflow-hidden rounded-md border border-rule bg-paper p-4 shadow-xs sm:p-8">
                        <img
                            src={processDiagramImg}
                            alt="Classific 5-stage engineering sequence: Discover, Plan, Design, Develop, Launch"
                            className="mx-auto h-auto max-h-56 w-full object-contain"
                            loading="eager"
                        />
                    </div>
                </div>
            </section>

            <Section labelledBy="stages-title" tone="paper">
                <SectionHeading
                    id="stages-title"
                    eyebrow="Stages"
                    title="The five stages in detail."
                    intro="Each stage lists the activities we carry out, what you receive at the end of it and what we need from you to keep it moving."
                    align="split"
                />
                <div className="mt-12 lg:mt-16">
                    <ProcessSteps stages={stages} variant="detailed" />
                </div>
            </Section>

            <Section labelledBy="collaboration-title" tone="white">
                <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
                    <div className="lg:col-span-4">
                        <SectionHeading
                            id="collaboration-title"
                            eyebrow="Collaboration"
                            title="What we ask of you."
                            intro="Good software is built with the people who will use it. These expectations keep that collaboration productive."
                        />
                    </div>
                    <dl className="grid gap-6 sm:grid-cols-2 lg:col-span-8">
                        {expectations.map((expectation) => (
                            <div
                                key={expectation.title}
                                className="group rounded-md border border-rule bg-paper p-7 shadow-xs transition-all duration-300 hover:border-ink-soft/40 hover:bg-white hover:shadow-md"
                            >
                                <dt className="text-h3 font-medium text-ink transition-colors group-hover:text-accent">
                                    {expectation.title}
                                </dt>
                                <dd className="mt-3 text-body text-body leading-relaxed">
                                    {expectation.description}
                                </dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </Section>

            <Section labelledBy="support-title" tone="paper">
                <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
                    <div className="lg:col-span-5">
                        <SectionHeading
                            id="support-title"
                            eyebrow="After launch"
                            title="Support is part of the project."
                            intro="Launch is a change in who depends on the software. We agree monitoring, response and improvement arrangements before go-live, so the weeks after release are calm rather than reactive."
                        />
                    </div>
                    <div className="lg:col-span-7">
                        <FaqList faqs={faqs} idPrefix="process-faq" />
                    </div>
                </div>
            </Section>

            <ClosingCta
                headline="Ready to start with discovery?"
                copy="A first conversation is enough to decide whether discovery makes sense. Tell us what you are facing."
            />
        </>
    );
}
