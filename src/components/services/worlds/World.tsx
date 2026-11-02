import { useEffect, useRef, type CSSProperties, type ReactNode, type SVGProps } from "react";
import { Link } from "react-router";
import { TextReveal } from "@/components/motion/Reveal";
import { Icon } from "@/components/ui/Icon";

/**
 * A service "world": one full-screen scene in the manner of a poster, with a giant title, a few
 * drawn objects placed around it and the page thread weaving between them. Depth comes from
 * stacking around the thread (which sits at z-10): `flat` objects lie under the line, `card`
 * objects and the title sit over it, so the line passes behind them and comes back out. On
 * phones the copy and stage keep clear of the right margin, where the thread runs down.
 */
export function World({
    id,
    index,
    label,
    description,
    title,
    href,
    tone,
    exit,
    titleY,
    titleAlign = "center",
    children,
}: {
    id: string;
    index: string;
    label: string;
    description: string;
    title: string;
    href: string;
    tone: "ink" | "paper";
    /** Where the giant title sits from the large breakpoint, as a share of the stage height. */
    titleY?: string;
    /** Which side the giant title sits on from the large breakpoint, to keep it in open space. */
    titleAlign?: "left" | "center" | "right";
    /** The side margin the thread leaves by, into the next section. */
    exit: "left" | "right";
    children: ReactNode;
}) {
    const dark = tone === "ink";
    return (
        <section
            aria-labelledby={id}
            data-thread-route="world"
            data-thread-exit={exit}
            className={`world service-world world-stitch relative overflow-hidden ${dark ? "world-ink bg-ink text-paper" : "world-paper bg-paper text-ink"}`}
            style={titleY ? ({ "--title-y": titleY } as CSSProperties) : undefined}
        >
            <div className="container-page relative z-30 flex flex-col gap-4 pr-6 pt-12 sm:flex-row sm:items-start sm:justify-between sm:pr-0 lg:pt-14">
                <p
                    className={`font-mono text-[11px] uppercase tracking-[0.14em] ${dark ? "text-paper/60" : "text-body"}`}
                >
                    <span className="tabular-nums">{index}</span>
                    <span aria-hidden="true"> / </span>
                    {label}
                </p>
                <p
                    className={`max-w-xs font-mono text-[13px] leading-relaxed sm:text-right ${dark ? "text-paper/75" : "text-body"}`}
                >
                    {description}
                </p>
            </div>

            <h3
                id={id}
                data-thread-anchor="world-title"
                className={`world-title world-title-${titleAlign}`}
            >
                {title}
            </h3>

            <div className="world-stage relative mt-10 flex flex-col items-center gap-10 pb-10 pl-5 pr-11 sm:pr-5 lg:absolute lg:inset-x-[max(0px,calc((100%_-_108rem)/2))] lg:inset-y-0 lg:mt-0 lg:block lg:p-0">
                {children}
            </div>

            <div className="container-page relative z-30 flex justify-end pb-12 pr-6 sm:pr-0 lg:absolute lg:inset-x-0 lg:bottom-10 lg:pb-0">
                <Link
                    to={href}
                    className={`group inline-flex items-center gap-3 border-b pb-1.5 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors hover:text-accent ${
                        dark ? "border-paper/40 text-paper/80" : "border-ink/40 text-ink/80"
                    }`}
                >
                    Explore service
                    <Icon
                        name="arrow-right"
                        className="h-3.5 w-3.5 -rotate-45 transition-transform group-hover:translate-x-0.5"
                    />
                </Link>
            </div>
        </section>
    );
}

/**
 * Places a drawn object on the stage. From the large breakpoint it is positioned absolutely in
 * percentages of the stage; below it the objects simply stack. `depth` decides whether the
 * thread passes over it ("flat") or behind it ("card").
 */
export function Place({
    x,
    y,
    w,
    rotate = 0,
    depth = "card",
    still = false,
    wideOnly = false,
    id,
    className = "",
    children,
}: {
    x: string;
    y: string;
    w: string;
    rotate?: number;
    depth?: "flat" | "card";
    /** Sits in the composition without reacting to the thread (headlines, copy, buttons). */
    still?: boolean;
    /** Left out below the large breakpoint, so phones show only the main drawing and a card or two. */
    wideOnly?: boolean;
    /** Lets a `Port` elsewhere on the stage light this object (`<Port light={id} />`). */
    id?: string;
    className?: string;
    children: ReactNode;
}) {
    return (
        <div
            id={id}
            data-thread-object={still ? undefined : true}
            className={`world-object world-${depth} ${still ? "world-still" : ""} ${wideOnly ? "hidden lg:block" : ""} ${className}`}
            style={
                {
                    "--x": x,
                    "--y": y,
                    "--w": w,
                    "--r": `${rotate}deg`,
                } as CSSProperties
            }
        >
            {children}
        </div>
    );
}

/**
 * A point the thread passes through, in order. Inside a placed object it lights that object
 * when the line reaches it; `light` names another element (by id) to light instead. On the
 * stage itself, without `light`, it only shapes the curve.
 */
export function Port({
    order,
    x,
    y,
    light,
    alsoLight,
}: {
    order: number;
    x: string;
    y: string;
    light?: string;
    /** Another element (by id) to light at the same moment, e.g. a drawing whose story should play now. */
    alsoLight?: string;
}) {
    return (
        <span
            data-thread-anchor="port"
            data-order={order}
            data-thread-light={light}
            data-thread-light-also={alsoLight}
            className="world-port hidden lg:block"
            style={{ left: x, top: y }}
            aria-hidden="true"
        />
    );
}

/** A sheet of paper for a card object: ivory, ruled in ink, lifted off the stage. */
export function Paper({ children, className = "" }: { children: ReactNode; className?: string }) {
    return <div className={`world-paper-card ${className}`}>{children}</div>;
}

/** Mono caption used on the cards. */
export function Meta({ children, className = "" }: { children: ReactNode; className?: string }) {
    return (
        <p className={`font-mono text-[10px] uppercase tracking-[0.12em] text-muted ${className}`}>
            {children}
        </p>
    );
}

/** Two states in one place: `before` until the thread arrives, then `after`. */
export function Swap({
    before,
    after,
    className = "",
}: {
    before: ReactNode;
    after: ReactNode;
    className?: string;
}) {
    return (
        <span className={`world-swap ${className}`}>
            <span className="when-off">{before}</span>
            <span className="when-on">{after}</span>
        </span>
    );
}

/**
 * A full-width scene for sections other than the service worlds: the same stage, depth and
 * thread route, with its own height, a kicker row and an optional link at the bottom.
 */
export function Scene({
    id,
    tone,
    exit,
    index,
    label,
    description,
    link,
    height,
    route = "world",
    children,
}: {
    id: string;
    tone: "ink" | "paper";
    /** The side margin the thread leaves by; "end" when the thread finishes in this scene. */
    exit: "left" | "right" | "end";
    index: string;
    label: string;
    description?: string;
    link?: { to: string; label: string };
    /** Stage height from the large breakpoint, as a CSS length. */
    height?: string;
    /** The page thread route for this scene (see thread-routes.ts); "world" by default. */
    route?: string;
    children: ReactNode;
}) {
    const dark = tone === "ink";
    // Scenes on the world route stack their cards on phones and have the thread stitch through
    // them down a clear right margin, as the service worlds do.
    const stitch = route === "world" || route === "bridge";
    return (
        <section
            aria-labelledby={id}
            data-thread-route={route}
            data-thread-exit={exit}
            data-thread-end={exit === "end" ? "true" : undefined}
            className={`world ${stitch ? "world-stitch" : ""} relative overflow-hidden ${dark ? "world-ink bg-ink text-paper" : "world-paper bg-paper text-ink"}`}
            style={height ? ({ "--world-h": height } as CSSProperties) : undefined}
        >
            <div
                className={`container-page relative z-30 flex flex-col gap-4 pt-12 sm:flex-row sm:items-start sm:justify-between sm:pr-0 lg:pt-14 ${stitch ? "pr-6" : ""}`}
            >
                <p
                    className={`font-mono text-[11px] uppercase tracking-[0.14em] ${dark ? "text-paper/60" : "text-body"}`}
                >
                    <span className="tabular-nums">{index}</span>
                    <span aria-hidden="true"> / </span>
                    {label}
                </p>
                {description ? (
                    <p
                        className={`max-w-xs font-mono text-[13px] leading-relaxed sm:text-right lg:max-w-[16rem] xl:max-w-xs ${dark ? "text-paper/75" : "text-body"}`}
                    >
                        {description}
                    </p>
                ) : null}
            </div>

            <div
                className={`world-stage relative mt-10 flex flex-col items-center gap-10 pb-10 pl-5 sm:pr-5 lg:absolute lg:inset-x-[max(0px,calc((100%_-_108rem)/2))] lg:inset-y-0 lg:mt-0 lg:block lg:p-0 ${stitch ? "pr-11" : "pr-5"}`}
            >
                {children}
            </div>

            {link ? (
                <div
                    className={`container-page relative z-30 flex justify-end pb-12 sm:pr-0 lg:absolute lg:inset-x-0 lg:bottom-10 lg:pb-0 ${stitch ? "pr-6" : ""}`}
                >
                    <Link
                        to={link.to}
                        className={`group inline-flex items-center gap-3 border-b pb-1.5 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors hover:text-accent ${
                            dark ? "border-paper/40 text-paper/80" : "border-ink/40 text-ink/80"
                        }`}
                    >
                        {link.label}
                        <Icon
                            name="arrow-right"
                            className="h-3.5 w-3.5 -rotate-45 transition-transform group-hover:translate-x-0.5"
                        />
                    </Link>
                </div>
            ) : null}
        </section>
    );
}

/** The big heavy headline of a scene, set above the thread. */
export function SceneHeadline({
    id,
    lines,
    size,
}: {
    id: string;
    lines: string[];
    /** Font size as a share of the stage's width (cqw), so it scales with the composition. */
    size: number;
}) {
    return (
        <h2 id={id} className="fold-word" style={{ "--fold-size": `${size}cqw` } as CSSProperties}>
            <TextReveal lines={lines} />
        </h2>
    );
}

/**
 * A number in a drawing that counts up from zero when the thread reaches its object (after
 * `delay` ms). Without a running thread it simply shows its value.
 */
export function CountText({
    value,
    decimals = 0,
    suffix = "",
    delay = 300,
    ...props
}: SVGProps<SVGTextElement> & {
    value: number;
    decimals?: number;
    suffix?: string;
    delay?: number;
}) {
    const ref = useRef<SVGTextElement>(null);
    const format = (n: number) =>
        n.toLocaleString("en-GB", {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
        }) + suffix;

    useEffect(() => {
        const text = ref.current;
        const object = text?.closest<HTMLElement>("[data-thread-object]");
        if (!text || !object || typeof MutationObserver === "undefined") {
            return;
        }
        const show = (n: number) => {
            text.textContent = format(n);
        };
        let frame = 0;
        let state = "";
        const update = () => {
            const next = !object.closest(".thread-live")
                ? "final"
                : object.dataset.played === "true"
                  ? "count"
                  : "zero";
            if (next === state) {
                return;
            }
            state = next;
            cancelAnimationFrame(frame);
            if (next !== "count") {
                show(next === "final" ? value : 0);
                return;
            }
            const start = performance.now() + delay;
            const step = (now: number) => {
                const t = Math.min(1, Math.max(0, (now - start) / 1300));
                show(value * (1 - (1 - t) ** 3));
                if (t < 1) {
                    frame = requestAnimationFrame(step);
                }
            };
            frame = requestAnimationFrame(step);
        };
        const observer = new MutationObserver(update);
        observer.observe(object, { attributes: true, attributeFilter: ["data-played"] });
        // The page wrapper gains .thread-live once the thread is running.
        for (let node = object.parentElement; node; node = node.parentElement) {
            observer.observe(node, { attributes: true, attributeFilter: ["class"] });
        }
        update();
        return () => {
            observer.disconnect();
            cancelAnimationFrame(frame);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value, decimals, suffix, delay]);

    return (
        <text ref={ref} {...props}>
            {format(value)}
        </text>
    );
}

/** Timing for a `story-*` step in a drawing (see global.css): its delay and length in ms. */
export function story(delay: number, length?: number, extra?: Record<string, string | number>) {
    return {
        "--d": `${delay}ms`,
        ...(length ? { "--t": `${length}ms` } : {}),
        ...extra,
    } as CSSProperties;
}
