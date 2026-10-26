import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { ClosingCta } from "@/components/layout/ClosingCta";
import { ProcessSteps } from "@/components/process/ProcessSteps";
import { FaqList } from "@/components/services/FaqList";
import { useProcessPage } from "@/pages/process/ProcessPage.hooks";

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

            <Section labelledBy="stages-title" tone="white">
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

            <Section labelledBy="collaboration-title" tone="paper">
                <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
                    <div className="lg:col-span-4">
                        <SectionHeading
                            id="collaboration-title"
                            eyebrow="Collaboration"
                            title="What we ask of you."
                            intro="Good software is built with the people who will use it. These expectations keep that collaboration productive."
                        />
                    </div>
                    <dl className="grid gap-x-8 border-t border-rule sm:grid-cols-2 lg:col-span-7 lg:col-start-6">
                        {expectations.map((expectation) => (
                            <div key={expectation.title} className="border-b border-rule py-8">
                                <dt className="text-h3">{expectation.title}</dt>
                                <dd className="mt-3 text-body text-body">{expectation.description}</dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </Section>

            <Section labelledBy="support-title" tone="white">
                <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
                    <div className="lg:col-span-5">
                        <SectionHeading
                            id="support-title"
                            eyebrow="After launch"
                            title="Support is part of the project."
                            intro="Launch is a change in who depends on the software. We agree monitoring, response and improvement arrangements before go-live, so the weeks after release are calm rather than reactive."
                        />
                    </div>
                    <div className="lg:col-span-6 lg:col-start-7">
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
