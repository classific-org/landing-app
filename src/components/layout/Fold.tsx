import type { CSSProperties, ReactNode } from "react";
import { Container } from "@/components/layout/Container";
import { useLineDrift } from "@/components/motion/motion.hooks";
import { Reveal, TextReveal } from "@/components/motion/Reveal";

type FoldProps = {
    /** "paper" and "ink" folds alternate down the page. */
    tone: "paper" | "ink";
    id: string;
    /** Section number, shown before the label ("01"). */
    index: string;
    label: string;
    /** The giant word (or lines) that names the fold. It is the section's h2. */
    word: string | string[];
    /** Font size of the giant word in vw. Longer words need a smaller number. */
    wordSize: number;
    /** Supporting sentence set under the giant word. */
    lead?: string;
    /** Short paragraph set in mono at the top right of the fold. */
    intro?: string;
    /** Puts a thread node in front of the label. */
    node?: boolean;
    children?: ReactNode;
};

/**
 * One full-width "fold" of the home page, in the manner of a poster: a mono label row, a giant
 * heavy word and then the fold's content. Folds alternate between paper and ink.
 */
export function Fold({
    tone,
    id,
    index,
    label,
    word,
    wordSize,
    lead,
    intro,
    node = false,
    children,
}: FoldProps) {
    const dark = tone === "ink";
    const lines = Array.isArray(word) ? word : [word];
    const headingRef = useLineDrift<HTMLHeadingElement>();

    return (
        <section
            aria-labelledby={id}
            className={`fold ${dark ? "bg-ink text-paper" : "bg-paper text-ink"}`}
        >
            <Container className="section-y">
                <div className="grid gap-6 lg:grid-cols-12 lg:gap-8">
                    <Reveal
                        className={`relative flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.14em] lg:col-span-6 ${
                            dark ? "text-paper/60" : "text-body"
                        }`}
                    >
                        {node ? (
                            <span
                                data-thread-node
                                className="absolute -left-[19px] top-1/2 block h-[18px] w-[18px] flex-none -translate-y-1/2 lg:-left-[28px]"
                                aria-hidden="true"
                            />
                        ) : null}
                        <span className="tabular-nums">{index}</span>
                        <span aria-hidden="true">/</span>
                        <span>{label}</span>
                    </Reveal>
                    {intro ? (
                        <Reveal className="lg:col-span-4 lg:col-start-9" delay={140}>
                            <p
                                className={`max-w-sm font-mono text-[13px] leading-relaxed lg:text-[14px] ${
                                    dark ? "text-paper/75" : "text-body"
                                }`}
                            >
                                {intro}
                            </p>
                        </Reveal>
                    ) : null}
                </div>

                <h2
                    ref={headingRef}
                    id={id}
                    className={`fold-word drift mt-8 lg:mt-12 ${dark ? "text-paper" : "text-ink"}`}
                    style={{ "--fold-size": `${wordSize}vw` } as CSSProperties}
                >
                    <TextReveal lines={lines} />
                </h2>

                {lead ? (
                    <Reveal delay={120}>
                        <p
                            className={`mt-10 max-w-3xl text-h2 lg:mt-14 ${
                                dark ? "text-paper" : "text-ink"
                            }`}
                        >
                            {lead}
                        </p>
                    </Reveal>
                ) : null}

                {children}
            </Container>
        </section>
    );
}
