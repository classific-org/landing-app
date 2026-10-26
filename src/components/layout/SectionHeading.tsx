import { Eyebrow } from "@/components/layout/Eyebrow";

type SectionHeadingProps = {
    id: string;
    eyebrow: string;
    title: string;
    intro?: string;
    level?: "h1" | "h2";
    align?: "start" | "split";
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
    children,
}: SectionHeadingProps) {
    const Heading = level;
    const headingClass = level === "h1" ? "text-h1" : "text-h2";

    if (align === "split") {
        return (
            <div className="grid gap-6 lg:grid-cols-12 lg:gap-8">
                <div className="lg:col-span-7">
                    <Eyebrow className="mb-4">{eyebrow}</Eyebrow>
                    <Heading id={id} className={headingClass}>
                        {title}
                    </Heading>
                </div>
                {intro || children ? (
                    <div className="lg:col-span-4 lg:col-start-9 lg:self-end">
                        {intro ? <p className="text-body-lg text-body">{intro}</p> : null}
                        {children}
                    </div>
                ) : null}
            </div>
        );
    }

    return (
        <div className="max-w-3xl">
            <Eyebrow className="mb-4">{eyebrow}</Eyebrow>
            <Heading id={id} className={headingClass}>
                {title}
            </Heading>
            {intro ? <p className="mt-6 text-body-lg text-body">{intro}</p> : null}
            {children}
        </div>
    );
}
