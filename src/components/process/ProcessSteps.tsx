import { Reveal, TextReveal } from "@/components/motion/Reveal";
import { padStep } from "@/lib/formatting/text";
import type { ProcessStage } from "@/types/content";

type ProcessStepsProps = {
    stages: ProcessStage[];
    /** "compact" lists summaries only; "detailed" adds activities and deliverables. */
    variant?: "compact" | "detailed";
    /** Adds a thread node to every stage, for a page thread to pass through. */
    thread?: boolean;
    /** "dark" for ink folds (compact variant). */
    tone?: "light" | "dark";
};

function StageList({
    title,
    items,
    muted = false,
}: {
    title: string;
    items: string[];
    muted?: boolean;
}) {
    return (
        <div>
            <dt className="eyebrow mb-4 text-ink">{title}</dt>
            <dd>
                <ul className="space-y-2.5 text-small text-body">
                    {items.map((item) => (
                        <li key={item} className="flex items-start gap-3">
                            <span
                                className={[
                                    "mt-[0.6em] h-px w-3 flex-none",
                                    muted ? "bg-muted" : "bg-accent",
                                ].join(" ")}
                                aria-hidden="true"
                            />
                            <span>{item}</span>
                        </li>
                    ))}
                </ul>
            </dd>
        </div>
    );
}

export function ProcessSteps({
    stages,
    variant = "compact",
    thread = false,
    tone = "light",
}: ProcessStepsProps) {
    const dark = tone === "dark";

    if (variant === "compact") {
        return (
            <div>
                {/* One rail runs the full width and draws itself as the section scrolls in. */}
                <div className="relative hidden lg:block" aria-hidden="true">
                    <div className={`h-px w-full ${dark ? "bg-paper/20" : "bg-rule"}`} />
                    <Reveal
                        variant="rule"
                        className={`absolute inset-x-0 top-0 h-px ${dark ? "bg-paper" : "bg-ink"}`}
                    />
                </div>

                <ol
                    className={
                        thread
                            ? "grid gap-0 lg:grid-cols-5 lg:gap-8"
                            : "grid gap-0 sm:grid-cols-2 lg:grid-cols-5 lg:gap-8"
                    }
                >
                    {stages.map((stage, index) => (
                        <Reveal
                            as="li"
                            key={stage.slug}
                            delay={index * 90}
                            className={`group relative border-t py-8 first:border-t-0 lg:border-t-0 lg:pt-8 ${
                                dark ? "border-paper/15" : "border-rule"
                            } ${thread ? "" : "sm:[&:nth-child(2)]:border-t-0"}`}
                        >
                            {thread ? (
                                <span
                                    data-thread-node
                                    className="absolute -left-[19px] top-9 h-[18px] w-[18px] lg:left-0 lg:top-0 lg:-translate-y-1/2"
                                    aria-hidden="true"
                                />
                            ) : null}
                            <span
                                className={`absolute -top-[3px] left-0 hidden h-[7px] w-[7px] transition-colors duration-300 group-hover:bg-accent lg:block ${
                                    dark ? "bg-paper" : "bg-ink"
                                }`}
                                aria-hidden="true"
                            />
                            <p
                                className={`font-mono text-[11px] tabular-nums uppercase tracking-[0.1em] ${
                                    dark ? "text-paper/55" : "text-muted"
                                }`}
                            >
                                Stage {padStep(stage.number)}
                            </p>
                            <h3 className={`mt-8 text-h3 lg:mt-14 ${dark ? "text-paper" : ""}`}>
                                {stage.title}
                            </h3>
                            <p
                                className={`mt-3 max-w-xs text-body ${
                                    dark ? "text-paper/75" : "text-body"
                                }`}
                            >
                                {stage.summary}
                            </p>
                            {stage.deliverables[0] ? (
                                <div className="mt-8">
                                    <p
                                        className={`font-mono text-[10px] uppercase tracking-[0.1em] ${
                                            dark ? "text-paper/55" : "text-muted"
                                        }`}
                                    >
                                        Key deliverable
                                    </p>
                                    <p
                                        className={`mt-1.5 text-small font-medium ${
                                            dark ? "text-paper" : "text-ink"
                                        }`}
                                    >
                                        {stage.deliverables[0]}
                                    </p>
                                </div>
                            ) : null}
                        </Reveal>
                    ))}
                </ol>
            </div>
        );
    }

    return (
        <ol className="border-t border-ink">
            {stages.map((stage) => (
                <li
                    key={stage.slug}
                    id={stage.slug}
                    className="relative scroll-mt-24 border-b border-rule py-12 lg:py-20"
                >
                    {thread ? (
                        <span
                            data-thread-node
                            className="absolute -left-[19px] top-12 h-[18px] w-[18px] lg:top-20"
                            aria-hidden="true"
                        />
                    ) : null}
                    <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
                        <div className="lg:col-span-5">
                            <div className="lg:sticky lg:top-28">
                                <Reveal>
                                    <span
                                        className="block font-mono text-[clamp(3.5rem,9vw,8rem)] font-medium leading-none tracking-[-0.06em] text-ink/15"
                                        aria-hidden="true"
                                    >
                                        {padStep(stage.number)}
                                    </span>
                                    <p className="eyebrow mt-6">Stage {padStep(stage.number)}</p>
                                </Reveal>
                                <h3 className="mt-4 text-h2">
                                    <TextReveal text={stage.title} />
                                </h3>
                                <Reveal delay={120}>
                                    <p className="mt-5 max-w-md text-body-lg text-body">
                                        {stage.description}
                                    </p>
                                </Reveal>
                            </div>
                        </div>

                        <Reveal className="lg:col-span-7" delay={140}>
                            <dl className="grid gap-10 border-t border-rule pt-8 sm:grid-cols-3 sm:gap-8 lg:mt-3">
                                <StageList title="Activities" items={stage.activities} />
                                <StageList title="Deliverables" items={stage.deliverables} />
                                <StageList title="You provide" items={stage.clientProvides} muted />
                            </dl>
                        </Reveal>
                    </div>
                </li>
            ))}
        </ol>
    );
}
