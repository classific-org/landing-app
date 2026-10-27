import { padStep } from "@/lib/formatting/text";
import type { ProcessStage } from "@/types/content";

type ProcessStepsProps = {
    stages: ProcessStage[];
    /** "compact" lists summaries only; "detailed" adds activities and deliverables. */
    variant?: "compact" | "detailed";
};

export function ProcessSteps({ stages, variant = "compact" }: ProcessStepsProps) {
    if (variant === "compact") {
        return (
            <div className="space-y-8">
                {/* Visual Step Ribbon (Desktop) */}
                <div className="hidden lg:grid lg:grid-cols-5 gap-3 border-b border-rule pb-6">
                    {stages.map((stage) => (
                        <div key={stage.slug} className="flex items-center gap-3">
                            <span className="flex h-7 w-7 items-center justify-center rounded-full border border-rule bg-white font-mono text-[11px] font-medium text-ink shadow-xs">
                                {padStep(stage.number)}
                            </span>
                            <span className="text-small font-medium text-ink">{stage.title}</span>
                            <span className="h-px flex-1 bg-rule last:hidden" />
                        </div>
                    ))}
                </div>

                {/* Stage Cards Grid */}
                <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
                    {stages.map((stage) => (
                        <li
                            key={stage.slug}
                            className="group relative flex flex-col justify-between rounded-md border border-rule bg-white p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-ink-soft/40 hover:shadow-xl"
                        >
                            <div>
                                <div className="flex items-center justify-between">
                                    <span className="rounded bg-paper px-2 py-0.5 font-mono text-[11px] text-muted border border-rule/80">
                                        STAGE {padStep(stage.number)}
                                    </span>
                                    <span className="h-1.5 w-1.5 rounded-full bg-accent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                                </div>
                                <h3 className="mt-4 text-h3 font-medium transition-colors group-hover:text-accent">
                                    {stage.title}
                                </h3>
                                <p className="mt-3 text-body text-body leading-relaxed">
                                    {stage.summary}
                                </p>
                            </div>

                            {stage.deliverables[0] ? (
                                <div className="mt-6 border-t border-rule/80 pt-4">
                                    <p className="text-[10px] uppercase tracking-wider text-muted font-medium">
                                        Key Deliverable
                                    </p>
                                    <p className="mt-1 text-small font-medium text-ink line-clamp-1">
                                        {stage.deliverables[0]}
                                    </p>
                                </div>
                            ) : null}
                        </li>
                    ))}
                </ol>
            </div>
        );
    }

    return (
        <ol className="space-y-6">
            {stages.map((stage) => (
                <li
                    key={stage.slug}
                    id={stage.slug}
                    className="group rounded-md border border-rule bg-white p-8 shadow-xs transition-all duration-300 hover:border-ink-soft/40 hover:shadow-lg lg:p-10"
                >
                    <div className="grid gap-6 lg:grid-cols-12 lg:gap-8">
                        <div className="lg:col-span-4">
                            <span className="rounded bg-paper px-2.5 py-1 font-mono text-small text-muted border border-rule">
                                STAGE {padStep(stage.number)}
                            </span>
                            <h3 className="mt-4 text-h2 font-medium text-ink">{stage.title}</h3>
                            <p className="mt-4 text-body-lg text-body leading-relaxed">
                                {stage.description}
                            </p>
                        </div>

                        <div className="lg:col-span-8">
                            <dl className="grid gap-6 sm:grid-cols-3">
                                <div className="rounded-sm border border-rule/70 bg-paper/60 p-5">
                                    <dt className="eyebrow mb-3 text-ink">Activities</dt>
                                    <dd>
                                        <ul className="space-y-2 text-small text-body">
                                            {stage.activities.map((item) => (
                                                <li key={item} className="flex items-start gap-2">
                                                    <span className="text-accent mt-0.5">•</span>
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </dd>
                                </div>

                                <div className="rounded-sm border border-rule/70 bg-paper/60 p-5">
                                    <dt className="eyebrow mb-3 text-ink">Deliverables</dt>
                                    <dd>
                                        <ul className="space-y-2 text-small text-body">
                                            {stage.deliverables.map((item) => (
                                                <li key={item} className="flex items-start gap-2">
                                                    <span className="text-accent mt-0.5">•</span>
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </dd>
                                </div>

                                <div className="rounded-sm border border-rule/70 bg-paper/60 p-5">
                                    <dt className="eyebrow mb-3 text-ink">You provide</dt>
                                    <dd>
                                        <ul className="space-y-2 text-small text-body">
                                            {stage.clientProvides.map((item) => (
                                                <li key={item} className="flex items-start gap-2">
                                                    <span className="text-muted mt-0.5">•</span>
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </dd>
                                </div>
                            </dl>
                        </div>
                    </div>
                </li>
            ))}
        </ol>
    );
}
