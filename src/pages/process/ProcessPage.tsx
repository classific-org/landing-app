import { PageHero } from "@/components/layout/PageHero";
import { Fold } from "@/components/layout/Fold";
import { ClosingCta } from "@/components/layout/ClosingCta";
import { ThreadedPage } from "@/components/layout/ThreadedPage";
import { Reveal } from "@/components/motion/Reveal";
import { ProcessSteps } from "@/components/process/ProcessSteps";
import { FaqList } from "@/components/services/FaqList";
import { useProcessPage } from "@/pages/process/ProcessPage.hooks";

import processDiagramImg from "@/assets/process/process_discover_plan_design_develop_launch.jpg";

export function ProcessPage() {
    const { stages, expectations, faqs, breadcrumbs } = useProcessPage();

    return (
        <ThreadedPage>
            <PageHero
                eyebrow="Process"
                title="How we work, from discovery to launch and beyond."
                copy="Five stages with clear activities, deliverables and expectations on both sides. Timelines and commitments are agreed per project once discovery has established the scope."
                breadcrumbs={breadcrumbs}
                thread
            />

            <Fold
                tone="paper"
                id="stages-title"
                index="01"
                label="Stages"
                word={["The five stages", "in detail."]}
                wordSize={9.5}
                intro="Each stage lists the activities we carry out, what you receive at the end of it and what we need from you to keep it moving."
            >
                <Reveal variant="clip" className="mt-14 lg:mt-20">
                    <img
                        src={processDiagramImg}
                        alt="Classific 5-stage engineering sequence: Discover, Plan, Design, Develop, Launch"
                        className="mx-auto h-auto max-h-56 w-full object-contain"
                        loading="eager"
                    />
                </Reveal>
                <div className="mt-14 lg:mt-20">
                    <ProcessSteps stages={stages} variant="detailed" thread />
                </div>
            </Fold>

            <Fold
                tone="ink"
                id="collaboration-title"
                index="02"
                label="Collaboration"
                word={["What we ask", "of you."]}
                wordSize={12}
                intro="Good software is built with the people who will use it. These expectations keep that collaboration productive."
                node
            >
                <dl className="mt-14 grid gap-x-10 sm:grid-cols-2 lg:mt-20 lg:grid-cols-3">
                    {expectations.map((expectation, index) => (
                        <Reveal
                            key={expectation.title}
                            delay={(index % 3) * 90}
                            className="border-t border-paper/40 py-8 lg:py-10"
                        >
                            <span
                                className="font-mono text-[11px] tabular-nums text-paper/50"
                                aria-hidden="true"
                            >
                                0{index + 1}
                            </span>
                            <dt className="mt-8 text-h3 text-paper">{expectation.title}</dt>
                            <dd className="mt-3 max-w-sm text-body text-paper/75">
                                {expectation.description}
                            </dd>
                        </Reveal>
                    ))}
                </dl>
            </Fold>

            <Fold
                tone="paper"
                id="support-title"
                index="03"
                label="After launch"
                word={["Support is part", "of the project."]}
                wordSize={9.3}
                intro="Launch is a change in who depends on the software. We agree monitoring, response and improvement arrangements before go-live, so the weeks after release are calm rather than reactive."
                node
            >
                <div className="mt-14 lg:mt-20 lg:max-w-4xl">
                    <FaqList faqs={faqs} idPrefix="process-faq" />
                </div>
            </Fold>

            <ClosingCta
                headline="Ready to start with discovery?"
                copy="A first conversation is enough to decide whether discovery makes sense. Tell us what you are facing."
                tangle
            />
        </ThreadedPage>
    );
}
