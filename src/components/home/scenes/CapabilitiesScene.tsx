import type { CSSProperties, MouseEvent } from "react";
import { scrollToSection } from "@/lib/smooth-scroll";
import { Paper, Place, Scene, SceneHeadline } from "@/components/services/worlds/World";

type Discipline = { name: string; detail: string; href: string };

/*
 * The dial sits on the right of the stage. Its geometry is in stage units: x in % of the
 * stage width, y as a % of the stage height plus `cqw` (stage width), so the circle stays
 * round whatever the stage's height.
 */
const DIAL = { left: 55, top: 23, size: 26 };
const CX = DIAL.left + DIAL.size / 2;
const R = DIAL.size * 0.42;
const at = (degrees: number, radius = R) => {
    const angle = (degrees * Math.PI) / 180;
    return {
        x: `${(CX + radius * Math.cos(angle)).toFixed(2)}%`,
        y: `calc(${DIAL.top}% + ${(DIAL.size / 2 + radius * Math.sin(angle)).toFixed(2)}cqw)`,
    };
};

/**
 * The disciplines' angles on the dial, in the order the line reaches them (0 is 3 o'clock;
 * negative is anticlockwise). The line itself is drawn by `dialRoute` in thread-routes.ts:
 * it joins the ring at -150 degrees and goes round anticlockwise.
 */
const NODE_ANGLES = [-162, -234, -306, -378, -450];
const normal = (degrees: number) => ((degrees % 360) + 360) % 360;
/** How far beyond the ring a discipline's label sits, in stage-width units: clear of the bezel. */
const LABEL_OUT = 2.7;
/** The bezel is left open this many degrees either side of a discipline, around its label. */
const GAP = 13;

/**
 * Where a discipline's label sits relative to its dot, and which way it reads: right-aligned
 * on the left of the dial, left-aligned on the right, and above-right of the top dot (clear of
 * the line falling onto the ring from the upper left).
 */
const labelFor = (degrees: number) => {
    const angle = (degrees * Math.PI) / 180;
    const cos = Math.cos(angle);
    const side = normal(degrees) === 270 ? "top" : cos < 0 ? "left" : "right";
    return {
        side,
        left: `${(LABEL_OUT * cos).toFixed(2)}cqw`,
        top: `${(LABEL_OUT * Math.sin(angle)).toFixed(2)}cqw`,
    };
};

/** Where the line joins the ring (degrees, 0 at 3 o'clock), see dialRoute. */
const ORBIT_START = -150;

/**
 * A fine bezel: a tick every 6 degrees, a longer one pointing to each discipline, and none
 * just beside it, so the labels have open ground. Each tick lights in the thread's blue as
 * the line sweeps past it, so the bezel fills round in step with the scroll (and empties
 * again scrolling up).
 */
function DialArt() {
    const ticks = Array.from({ length: 60 }, (_, index) => {
        const degrees = index * 6;
        const angle = (degrees * Math.PI) / 180;
        const major = NODE_ANGLES.some((node) => normal(node) === degrees);
        const near = NODE_ANGLES.some((node) => {
            const apart = Math.abs(normal(node) - degrees);
            return Math.min(apart, 360 - apart) <= GAP;
        });
        if (near && !major) {
            return null;
        }
        const inner = major ? 45 : 46.5;
        const d = `M${50 + inner * Math.cos(angle)} ${50 + inner * Math.sin(angle)} L${50 + 48 * Math.cos(angle)} ${50 + 48 * Math.sin(angle)}`;
        // How far round the line has to go (0-1 of one turn) to pass this tick: it starts at
        // ORBIT_START and runs anticlockwise.
        const reached = normal(ORBIT_START - degrees) / 360;
        return (
            <g key={index}>
                <path d={d} className={major ? "" : "faint"} />
                <path
                    d={d}
                    className="dial-tick-lit accent"
                    style={{ "--f": reached.toFixed(4) } as CSSProperties}
                />
            </g>
        );
    });
    return (
        <svg
            className="world-art aspect-square"
            viewBox="0 0 100 100"
            aria-hidden="true"
            focusable="false"
        >
            <circle cx="50" cy="50" r="42" className="faint" strokeDasharray="0.6 1.4" />
            <circle cx="50" cy="50" r="30" className="faint" />
            {ticks}
        </svg>
    );
}

/** A discipline's section on this page: the last part of its service link. */
const slugOf = (href: string) => href.split("/").pop() ?? "";

/** Jump to the discipline's own section, gliding. */
const jump = (event: MouseEvent<HTMLAnchorElement>) => {
    const id = event.currentTarget.hash.slice(1);
    if (scrollToSection(id)) {
        event.preventDefault();
    }
};

export function CapabilitiesScene({ items }: { items: Discipline[] }) {
    return (
        <Scene
            id="capabilities-title"
            anchor="services"
            tone="paper"
            exit="right"
            route="dial"
            index="01"
            label="Capabilities"
            description="One team, one way of working, from the first conversation to long after launch."
            height="max(46rem, 84svh)"
        >
            <Place x="5%" y="20%" w="42%" still>
                <SceneHeadline
                    id="capabilities-title"
                    lines={["Five", "disciplines,", "one", "standard."]}
                    size={5.2}
                />
                <p className="mt-8 max-w-md text-body-lg text-body lg:max-w-[min(28rem,33vw)]">
                    Web, mobile, desktop, business systems and custom software, built by the same
                    senior team to the same standard of discovery, design, testing and support.
                </p>
            </Place>

            <Place
                x={`${DIAL.left}%`}
                y={`${DIAL.top}%`}
                w={`${DIAL.size}%`}
                depth="flat"
                className="hidden text-ink lg:block"
            >
                <span data-thread-anchor="dial" className="block">
                    <DialArt />
                </span>
            </Place>

            {items.map((item, index) => {
                const degrees = NODE_ANGLES[index]!;
                const point = at(degrees);
                const label = labelFor(degrees);
                return (
                    <Place
                        key={item.name}
                        x={point.x}
                        y={point.y}
                        w="0px"
                        className="dial-node hidden lg:block"
                    >
                        <span className="dial-dot" aria-hidden="true" />
                        <a
                            href={`#${slugOf(item.href)}`}
                            onClick={jump}
                            className={`dial-label dial-label-${label.side} group`}
                            data-cursor="VIEW"
                            style={{ left: label.left, top: label.top }}
                        >
                            <span className="font-mono text-[10px] tabular-nums text-muted">
                                0{index + 1}
                            </span>
                            <span className="dial-name block whitespace-nowrap transition-colors group-hover:text-accent">
                                {item.name}
                            </span>
                            <span className="block whitespace-nowrap text-small text-muted">
                                {item.detail}
                            </span>
                        </a>
                        <span
                            data-thread-anchor="dial-node"
                            data-angle={degrees}
                            className="absolute"
                            aria-hidden="true"
                        />
                    </Place>
                );
            })}

            <Place
                id="dial-seal"
                x={`calc(${CX}% - 6.5cqw)`}
                y={`calc(${DIAL.top}% + ${DIAL.size / 2 - 6.5}cqw)`}
                w="13cqw"
                className="hidden lg:block"
            >
                <Paper className="dial-seal grid aspect-square place-items-center rounded-full !p-0 text-center">
                    <span>
                        <span className="block font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                            One
                        </span>
                        <span className="mt-1 block text-[1.05rem] font-semibold uppercase leading-none tracking-[-0.02em]">
                            Standard
                        </span>
                        <span className="dial-seal-check mt-2 block font-mono text-[10px] uppercase tracking-[0.12em] text-accent">
                            ✓ Every project
                        </span>
                    </span>
                </Paper>
            </Place>

            {/*
             * Phones and tablets: the same dial, centred under the headline with numbered dots,
             * and the disciplines listed beneath it, each lighting with its dot.
             */}
            <div className="dial-small relative aspect-square w-[min(70vw,22rem)] lg:hidden">
                <span data-thread-anchor="dial" className="block text-ink">
                    <DialArt />
                </span>
                {NODE_ANGLES.map((degrees, index) => {
                    const angle = (degrees * Math.PI) / 180;
                    // Out past the bezel, in units of the dial's width.
                    const number = {
                        left: `${(18 * Math.cos(angle)).toFixed(2)}cqw`,
                        top: `${(18 * Math.sin(angle)).toFixed(2)}cqw`,
                    };
                    return (
                        <span
                            key={degrees}
                            data-thread-object=""
                            className="dial-node absolute"
                            style={{
                                left: `${50 + 42 * Math.cos(angle)}%`,
                                top: `${50 + 42 * Math.sin(angle)}%`,
                            }}
                        >
                            <span className="dial-dot" aria-hidden="true" />
                            <span
                                data-thread-anchor="dial-node"
                                data-angle={degrees}
                                data-light-also={`capability-${index}`}
                                className="absolute"
                                aria-hidden="true"
                            />
                            <span
                                className="dial-number"
                                style={{ left: number.left, top: number.top }}
                                aria-hidden="true"
                            >
                                0{index + 1}
                            </span>
                        </span>
                    );
                })}
                <div
                    id="dial-seal-small"
                    data-thread-object=""
                    className="absolute left-1/2 top-1/2 w-[44%] -translate-x-1/2 -translate-y-1/2"
                >
                    <Paper className="dial-seal grid aspect-square place-items-center rounded-full !p-0 text-center">
                        <span>
                            <span className="block font-mono text-[9px] uppercase tracking-[0.14em] text-muted">
                                One
                            </span>
                            <span className="mt-1 block text-[0.9rem] font-semibold uppercase leading-none tracking-[-0.02em]">
                                Standard
                            </span>
                            <span className="dial-seal-check mt-1.5 block font-mono text-[9px] uppercase tracking-[0.12em] text-accent">
                                ✓ Every project
                            </span>
                        </span>
                    </Paper>
                </div>
            </div>

            <ul className="grid w-full max-w-md gap-4 pr-6 lg:hidden">
                {items.map((item, index) => (
                    <li
                        key={item.name}
                        id={`capability-${index}`}
                        className="dial-item border-t border-rule pt-4"
                    >
                        <a href={`#${slugOf(item.href)}`} onClick={jump} className="group block">
                            <span className="font-mono text-[10px] tabular-nums text-muted">
                                0{index + 1}
                            </span>
                            <span className="dial-name block group-hover:text-accent">
                                {item.name}
                            </span>
                            <span className="block text-small text-muted">{item.detail}</span>
                        </a>
                    </li>
                ))}
            </ul>
        </Scene>
    );
}
