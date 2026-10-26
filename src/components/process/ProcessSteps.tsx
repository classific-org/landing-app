import { padStep } from "@/lib/formatting/text";
import type { ProcessStage } from "@/types/content";

type ProcessStepsProps = {
    stages: ProcessStage[];
    /** "compact" lists summaries only; "detailed" adds activities and deliverables. */
    variant?: "compact" | "detailed";
};

export function ProcessSteps({ stages, variant = "compact" }: ProcessStepsProps) {
    return (
        <ol className="border-t border-rule">
            {stages.map((stage) => (
                <li
                    key={stage.slug}
                    id={variant === "detailed" ? stage.slug : undefined}
                    className="grid gap-4 border-b border-rule py-8 md:grid-cols-12 md:gap-8"
                >
                    <div className="md:col-span-2">
                        <span className="text-h2 tabular-nums text-body">
                            {padStep(stage.number)}
                        </span>
                    </div>
                    <div className="md:col-span-3">
                        <h3 className="text-h3">{stage.title}</h3>
                    </div>
                    <div className="md:col-span-7 lg:col-span-6">
                        <p className="text-body-lg text-body">
                            {variant === "compact" ? stage.summary : stage.description}
                        </p>
                        {variant === "detailed" ? (
                            <dl className="mt-8 grid gap-8 sm:grid-cols-3">
                                <div>
                                    <dt className="eyebrow mb-3">Activities</dt>
                                    <dd>
                                        <ul className="space-y-2 text-small text-body">
                                            {stage.activities.map((item) => (
                                                <li key={item}>{item}</li>
                                            ))}
                                        </ul>
                                    </dd>
                                </div>
                                <div>
                                    <dt className="eyebrow mb-3">Deliverables</dt>
                                    <dd>
                                        <ul className="space-y-2 text-small text-body">
                                            {stage.deliverables.map((item) => (
                                                <li key={item}>{item}</li>
                                            ))}
                                        </ul>
                                    </dd>
                                </div>
                                <div>
                                    <dt className="eyebrow mb-3">You provide</dt>
                                    <dd>
                                        <ul className="space-y-2 text-small text-body">
                                            {stage.clientProvides.map((item) => (
                                                <li key={item}>{item}</li>
                                            ))}
                                        </ul>
                                    </dd>
                                </div>
                            </dl>
                        ) : null}
                    </div>
                </li>
            ))}
        </ol>
    );
}
