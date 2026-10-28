import { Eyebrow } from "@/components/layout/Eyebrow";
import { Reveal, TextReveal } from "@/components/motion/Reveal";

type SectionHeadingProps = {
    id: string;
    eyebrow: string;
    title: string;
    intro?: string;
    level?: "h1" | "h2";
    align?: "start" | "split";
    /** Optional section number shown in the eyebrow. */
    index?: string;
    tone?: "ink" | "paper";
    children?: React.ReactNode;
};

/**
 * Standard section opener: eyebrow, heading and optional intro. In "split" alignment the
 * intro sits in the right column of a 12-column grid on large screens.
 */
export function SectionHeading({
    id,
    eyebrow,
    title,
    intro,
    level = "h2",
    align = "start",
    index,
    tone = "ink",
    children,
}: SectionHeadingProps) {
    const Heading = level;
    const headingClass = level === "h1" ? "text-h1" : "text-h2";
    const onDark = tone === "paper";
    const headingTone = onDark ? "text-paper" : "";
    const introTone = onDark ? "text-rule" : "text-body";

    if (align === "split") {
        return (
            <div className="grid gap-8 lg:grid-cols-12 lg:gap-8">
                <div className="lg:col-span-7">
                    <Reveal>
                        <Eyebrow className="mb-6" index={index} tone={onDark ? "paper" : "muted"}>
                            {eyebrow}
                        </Eyebrow>
                    </Reveal>
                    <Heading id={id} className={`${headingClass} ${headingTone}`}>
                        <TextReveal text={title} />
                    </Heading>
                </div>
                {intro || children ? (
                    <Reveal className="lg:col-span-4 lg:col-start-9 lg:self-end" delay={160}>
                        {intro ? (
                            <p className={`text-body-lg ${introTone} max-w-md`}>{intro}</p>
                        ) : null}
                        {children}
                    </Reveal>
                ) : null}
            </div>
        );
    }

    return (
        <div className="max-w-3xl">
            <Reveal>
                <Eyebrow className="mb-6" index={index} tone={onDark ? "paper" : "muted"}>
                    {eyebrow}
                </Eyebrow>
            </Reveal>
            <Heading id={id} className={`${headingClass} ${headingTone}`}>
                <TextReveal text={title} />
            </Heading>
            {intro ? (
                <Reveal delay={160}>
                    <p className={`mt-6 text-body-lg ${introTone} max-w-xl`}>{intro}</p>
                </Reveal>
            ) : null}
            {children}
        </div>
    );
}
