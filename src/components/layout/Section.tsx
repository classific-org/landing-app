import { Container } from "@/components/layout/Container";

type SectionProps = {
    children: React.ReactNode;
    id?: string;
    tone?: "paper" | "white" | "ink";
    /** Draw a hairline rule beneath the section. */
    rule?: boolean;
    className?: string;
    labelledBy?: string;
};

const toneClass: Record<NonNullable<SectionProps["tone"]>, string> = {
    paper: "bg-paper text-ink",
    white: "bg-white text-ink",
    ink: "bg-ink text-paper",
};

export function Section({
    children,
    id,
    tone = "paper",
    rule = true,
    className,
    labelledBy,
}: SectionProps) {
    return (
        <section
            id={id}
            aria-labelledby={labelledBy}
            className={[
                "section-y",
                toneClass[tone],
                rule ? "border-b border-rule" : "",
                className,
            ]
                .filter(Boolean)
                .join(" ")}
        >
            <Container>{children}</Container>
        </section>
    );
}
