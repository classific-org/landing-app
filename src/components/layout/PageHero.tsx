import type { CSSProperties } from "react";
import { Container } from "@/components/layout/Container";
import { useScrollProgress } from "@/components/motion/motion.hooks";
import { TextReveal } from "@/components/motion/Reveal";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import type { Breadcrumb } from "@/content/routes";

type PageHeroProps = {
    eyebrow: string;
    title: string;
    copy?: string;
    breadcrumbs?: Breadcrumb[];
    children?: React.ReactNode;
    aside?: React.ReactNode;
    /** The giant word. Defaults to the eyebrow. */
    word?: string;
    /** Marks the point where the page thread starts. Only for pages wrapped in ThreadedPage. */
    thread?: boolean;
};

const enterDelay = (ms: number) => ({ "--enter-delay": `${ms}ms` }) as CSSProperties;

/** Size of the giant word in vw, so a longer word still fits on one line. */
function wordSize(word: string): number {
    return Math.min(22, Math.max(7, 88 / (0.63 * word.length)));
}

/**
 * Inner-page opener: a dark fold with the page's name set as a giant word, the page title as a
 * heading under it and the supporting copy in mono. The word masks in on load, then the rest
 * follows. Plain CSS, so it plays before hydration and never blocks interaction.
 */
export function PageHero({
    eyebrow,
    title,
    copy,
    breadcrumbs,
    children,
    aside,
    word,
    thread = false,
}: PageHeroProps) {
    const giant = word ?? eyebrow;
    const heroRef = useScrollProgress<HTMLElement>();

    return (
        <section
            ref={heroRef}
            aria-labelledby="page-title"
            data-dark-hero
            data-hero-drift
            className="relative overflow-hidden bg-ink text-paper"
        >
            <Container className="relative flex min-h-[calc(82svh-4.5rem)] flex-col justify-between pb-8 pt-6 lg:pb-10 lg:pt-8">
                <div>
                    {breadcrumbs ? (
                        <div className="enter-fade mb-8 lg:mb-10" style={enterDelay(40)}>
                            <Breadcrumbs items={breadcrumbs} tone="inverse" />
                        </div>
                    ) : null}

                    <p
                        className="enter font-mono text-[11px] uppercase tracking-[0.14em] text-paper/60"
                        style={enterDelay(60)}
                    >
                        {eyebrow}
                    </p>

                    <div
                        className="fold-word mt-5 text-paper lg:mt-7"
                        style={{ "--fold-size": `${wordSize(giant)}vw` } as CSSProperties}
                        aria-hidden="true"
                    >
                        <TextReveal lines={[giant]} trigger="load" />
                    </div>

                    <h1
                        id="page-title"
                        className="enter mt-8 max-w-4xl text-h2 text-paper lg:mt-10"
                        style={enterDelay(520)}
                    >
                        {title}
                    </h1>
                </div>

                <div className="mt-12 grid items-end gap-10 lg:mt-14 lg:grid-cols-12">
                    <div className="enter lg:col-span-5" style={enterDelay(700)}>
                        {copy ? (
                            <p className="max-w-md font-mono text-[13px] leading-relaxed text-paper/80 lg:text-[14px]">
                                {copy}
                            </p>
                        ) : null}
                        {aside ? <div className="mt-8 lg:mt-10">{aside}</div> : null}
                        {children}
                    </div>

                    {thread ? (
                        <p
                            className="enter-fade flex items-center gap-3 justify-self-start font-mono text-[11px] uppercase tracking-[0.14em] text-paper/60 lg:col-span-4 lg:col-start-9 lg:justify-self-end"
                            style={enterDelay(1200)}
                        >
                            <span>Scroll to follow the thread</span>
                            <span
                                data-thread-start
                                className="block h-[18px] w-[18px] flex-none"
                                aria-hidden="true"
                            />
                        </p>
                    ) : null}
                </div>
            </Container>
        </section>
    );
}
