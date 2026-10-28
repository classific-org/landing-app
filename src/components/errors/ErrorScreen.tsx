import { useEffect, useRef, type CSSProperties } from "react";
import { Container } from "@/components/layout/Container";
import { TextReveal } from "@/components/motion/Reveal";
import { Icon } from "@/components/ui/Icon";
import { Wordmark } from "@/components/ui/Wordmark";
import { describeError } from "@/lib/errors/describe";

type ErrorScreenProps = {
    /** Whatever was thrown: an Error, a route error response, a string. */
    error: unknown;
};

const delay = (ms: number) => ({ "--enter-delay": `${ms}ms` }) as CSSProperties;

/**
 * A thread that comes down from above, loses its way in a knot and ends loose. It reuses the
 * hero thread's draw-on-load styles, so it draws itself the same way.
 */
function FrayedThread() {
    return (
        <svg
            className="pointer-events-none absolute right-0 top-0 hidden h-full w-[46%] max-w-[34rem] overflow-visible opacity-90 lg:block"
            viewBox="0 0 400 640"
            preserveAspectRatio="xMaxYMid meet"
            aria-hidden="true"
            focusable="false"
        >
            <path
                className="hero-thread-line"
                pathLength={1}
                d="M300 -20 C300 90 170 120 196 214 C222 308 350 286 338 380 C326 474 176 440 188 350 C196 292 270 296 262 352 C256 394 214 392 218 356"
            />
            <circle className="hero-thread-ring" cx="218" cy="356" r="22" />
            <circle className="hero-thread-node" cx="218" cy="356" r="6" />
        </svg>
    );
}

/**
 * Full-page error screen in the site's own language: a dark fold, a giant word, a calm message
 * and a way back. It stands alone (no router, layout or data), because it renders when those
 * are exactly what failed.
 */
export function ErrorScreen({ error }: ErrorScreenProps) {
    const description = describeError(error, import.meta.env.DEV);
    const headingRef = useRef<HTMLHeadingElement>(null);
    const word = description.status ? String(description.status) : "Oops";

    useEffect(() => {
        // Set after the failed tree has finished unmounting: its head cleanup would otherwise
        // overwrite the title with an empty one.
        const timer = window.setTimeout(() => {
            document.title = `${description.title} | Classific`;
        }, 0);
        headingRef.current?.focus({ preventScroll: true });
        return () => window.clearTimeout(timer);
    }, [description.title]);

    return (
        <main
            id="main-content"
            className="relative flex min-h-dvh flex-col overflow-hidden bg-ink text-paper"
        >
            <header>
                <Container className="flex h-[4.5rem] items-center justify-between">
                    <a href="/" className="inline-flex items-center" aria-label="Classific home">
                        <Wordmark className="h-8 w-auto object-contain sm:h-9" variant="chrome" />
                    </a>
                    <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-paper/60">
                        {description.status ? `Error ${description.status}` : "Error"}
                    </span>
                </Container>
            </header>

            <Container className="relative flex flex-1 flex-col justify-center py-12 lg:py-16">
                <FrayedThread />

                <p
                    className="enter font-mono text-[11px] uppercase tracking-[0.14em] text-paper/60"
                    style={delay(40)}
                >
                    Something broke on our side
                </p>

                <div
                    className="fold-word mt-5 text-paper lg:mt-7"
                    style={{ "--fold-size": "22vw" } as CSSProperties}
                    aria-hidden="true"
                >
                    <TextReveal lines={[word]} trigger="load" />
                </div>

                <h1
                    ref={headingRef}
                    tabIndex={-1}
                    className="enter mt-8 max-w-3xl text-h2 text-paper outline-none lg:mt-10"
                    style={delay(420)}
                >
                    {description.title}
                </h1>

                <p
                    className="enter mt-5 max-w-xl font-mono text-[13px] leading-relaxed text-paper/80 lg:text-[14px]"
                    style={delay(540)}
                >
                    {description.summary}
                </p>

                {description.hint ? (
                    <p
                        className="enter mt-6 max-w-xl border-l-2 border-accent pl-4 font-mono text-[12px] leading-relaxed text-paper/75"
                        style={delay(620)}
                    >
                        {description.hint}
                    </p>
                ) : null}

                <div className="enter mt-10 flex flex-wrap items-center gap-4" style={delay(700)}>
                    {description.reloadHelps ? (
                        <button
                            type="button"
                            className="btn btn-inverse"
                            onClick={() => window.location.reload()}
                        >
                            Try again
                            <Icon name="arrow-right" />
                        </button>
                    ) : null}
                    <a
                        href="/"
                        className={`btn ${description.reloadHelps ? "btn-ghost-inverse" : "btn-inverse"}`}
                    >
                        Back to home
                    </a>
                    <a href="/contact" className="btn btn-ghost-inverse">
                        Contact Classific
                    </a>
                </div>

                <details
                    className="enter mt-12 max-w-3xl border-t border-paper/15 pt-4"
                    style={delay(800)}
                >
                    <summary className="cursor-pointer select-none font-mono text-[11px] uppercase tracking-[0.14em] text-paper/60 transition-colors hover:text-paper">
                        Technical details
                    </summary>
                    <pre className="mt-4 max-h-72 overflow-auto whitespace-pre-wrap break-words border border-paper/15 bg-paper/5 p-4 font-mono text-[12px] leading-relaxed text-paper/80">
                        {description.message}
                        {import.meta.env.DEV && description.stack ? `\n\n${description.stack}` : ""}
                    </pre>
                </details>
            </Container>
        </main>
    );
}
