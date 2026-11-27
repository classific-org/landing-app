import type { CSSProperties } from "react";
import type { Principle } from "@/types/content";
import { Icon } from "@/components/ui/Icon";
import { Place, Scene, SceneHeadline, story } from "@/components/services/worlds/World";

/*
 * A suspension bridge between TECHNOLOGY and BUSINESS, kept to a few clean lines in the manner
 * of a one-line drawing. The page thread is the whole cable (bridgeRoute): anchored at the
 * TECHNOLOGY end, up to the left tower top, the sag across, over the right tower top and down
 * to the BUSINESS end. The drawing only adds what the cable needs: two slim towers that end
 * exactly where it rests, the road and the hangers. A ring on the cable marks each principle,
 * labelled under the road; each lights as the line reaches it, and once the cable is anchored
 * the road lights and work starts flowing across it.
 *
 * Geometry is in % of the stage (the art is drawn in a 100 x 100 box stretched over it).
 */
const TOWER_TOP = 30;
const DECK = 64;
const SAG = 22;
const TOWERS = [18, 82];
const HALF_SPAN = (TOWERS[1]! - TOWERS[0]!) / 2;
const MID = (TOWERS[0]! + TOWERS[1]!) / 2;
const cable = (x: number) => TOWER_TOP + SAG * (1 - ((x - MID) / HALF_SPAN) ** 2);
/** Where the four principles sit on the cable. */
const NODES = [30, 43, 57, 70];

function BridgeArt() {
    const hangers = Array.from({ length: 15 }, (_, i) => 22 + i * 4).filter(
        (x) => !NODES.some((node) => Math.abs(node - x) < 1.5),
    );
    return (
        <svg
            className="world-art h-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
            focusable="false"
        >
            {/* Slim towers whose caps sit just under the cable's crest. */}
            {TOWERS.map((x) => (
                <path
                    key={x}
                    d={`M${x - 0.32} ${DECK + 7} V${TOWER_TOP + 0.6} H${x + 0.32} V${DECK + 7}`}
                />
            ))}
            {/* The road: its deck line, underside and bays. */}
            <path d={`M4 ${DECK} H96`} />
            <path
                d={`M4 ${DECK + 1.6} H96 ${Array.from(
                    { length: 47 },
                    (_, i) => `M${4 + i * 2} ${DECK} V${DECK + 1.6}`,
                ).join(" ")}`}
                className="faint"
            />
            <g id="why-deck" className="why-deck">
                <g className="deck-glow accent">
                    <rect
                        x="4"
                        y={DECK}
                        width="92"
                        height="1.6"
                        className="tint"
                        style={{ opacity: 0.12 }}
                    />
                    <rect x="4" y={DECK - 0.12} width="92" height="0.24" className="fill" />
                </g>
            </g>
            {hangers.map((x) => (
                <path key={x} d={`M${x} ${cable(x)} V${DECK}`} className="faint" />
            ))}
            {/* The principles' hangers run on under the road to their labels. */}
            {NODES.map((x) => (
                <path key={x} d={`M${x} ${cable(x)} V${DECK + 4.5}`} />
            ))}
        </svg>
    );
}

/**
 * Phones and tablets: the same bridge, small, under the headline. When the line reaches it the
 * cable draws across, the hangers drop, the road lights and work starts across it.
 */
function CompactBridgeArt() {
    // The main span is a quadratic from tower top to tower top, sagging to the middle.
    const at = (x: number) => {
        const t = (x - 60) / 180;
        return 18 * (1 - t) ** 2 + 2 * 116 * t * (1 - t) + 18 * t ** 2;
    };
    const hangerXs = [84, 108, 132, 156, 180, 204, 222];
    return (
        <svg className="world-art" viewBox="0 0 300 132" aria-hidden="true" focusable="false">
            <path d="M58.5 112 V20 H61.5 V112 M238.5 112 V20 H241.5 V112" />
            <path d="M4 100 H296" />
            <path d="M4 106 H296" className="faint" />
            <g className="accent story-wipe" style={story(200, 1400)}>
                <path d="M6 100 Q40 52 60 18 Q150 134 240 18 Q260 52 294 100" strokeWidth="2" />
            </g>
            {hangerXs.map((x, index) => (
                <g key={x} className="story-in" style={story(700 + index * 110)}>
                    <path d={`M${x} ${at(x).toFixed(1)} V100`} className="faint" />
                </g>
            ))}
            <g className="accent story-wipe" style={story(1500, 1200)}>
                <rect x="4" y="100" width="292" height="6" className="tint" />
            </g>
            <g className="story-in" style={story(2000, 200)}>
                {[0, 1, 2].map((index) => (
                    <circle
                        key={index}
                        cx="6"
                        cy="103"
                        r="2.5"
                        className="compact-car fill accent"
                        style={{ "--i": index } as CSSProperties}
                    />
                ))}
            </g>
            <text x="4" y="126" fontSize="9" className="faint">
                TECHNOLOGY
            </text>
            <text x="296" y="126" fontSize="9" textAnchor="end" className="faint">
                BUSINESS
            </text>
        </svg>
    );
}

export function WhyScene({ principles }: { principles: Principle[] }) {
    const shown = principles.slice(0, NODES.length);
    return (
        <Scene
            id="why-title"
            anchor="about"
            tone="ink"
            exit="right"
            route="bridge"
            index="08"
            label="Why Classific"
            description="We measure our work by what changes for the people who use it."
            height="max(56rem, 108svh)"
        >
            <Place x="5%" y="11%" w="56%" still>
                <SceneHeadline
                    id="why-title"
                    lines={["Engineering in service", "of the business."]}
                    size={4.6}
                />
            </Place>

            <Place x="0%" y="0%" w="100%" depth="flat" className="text-paper/70 lg:hidden">
                <CompactBridgeArt />
            </Place>

            <Place
                x="0%"
                y="0%"
                w="100%"
                depth="flat"
                className="hidden text-paper/70 lg:block lg:h-full"
            >
                <BridgeArt />
                {/* The bridge's geometry, for the page thread's cable (bridgeRoute). */}
                <span
                    data-thread-anchor="bridge"
                    data-towers={TOWERS.join(",")}
                    data-tower-top={TOWER_TOP}
                    data-sag={SAG}
                    data-deck={DECK}
                    data-nodes={NODES.join(",")}
                    className="absolute inset-0"
                    aria-hidden="true"
                />
                {/* Work flowing from TECHNOLOGY to BUSINESS once the road is lit. */}
                <div
                    id="why-traffic"
                    className="why-traffic"
                    style={{ top: `${DECK + 0.8}%` }}
                    aria-hidden="true"
                >
                    {[0, 1, 2, 3].map((index) => (
                        <span
                            key={index}
                            className="why-car"
                            style={{ "--i": index } as CSSProperties}
                        />
                    ))}
                </div>
            </Place>

            <Place x="8%" y={`${DECK + 4}%`} w="12%" still className="hidden lg:block">
                <p className="why-bank font-mono text-[11px] uppercase tracking-[0.18em] text-paper/70">
                    Technology
                </p>
            </Place>
            <Place x="80%" y={`${DECK + 4}%`} w="12%" still className="hidden lg:block">
                <p className="why-bank text-right font-mono text-[11px] uppercase tracking-[0.18em] text-paper/70">
                    Business
                </p>
            </Place>

            {/* Desktop: each principle is a short label under its hanger, lit as the cable reaches it. */}
            {shown.map((principle, index) => (
                <Place
                    key={principle.title}
                    id={`principle-label-${index + 1}`}
                    x={`${NODES[index]! - 6.5}%`}
                    y={`${DECK + 5.5}%`}
                    w="13%"
                    still
                    className="why-label hidden text-center lg:block"
                >
                    <Icon
                        name={principle.icon}
                        className="principle-icon mx-auto h-5 w-5 text-paper/80"
                    />
                    <p className="mt-3 text-[15px] font-medium leading-snug text-paper">
                        {principle.title}
                    </p>
                    <p className="mt-1.5 text-[12px] leading-snug text-paper/60">
                        {principle.summary}
                    </p>
                    <p className="sr-only">{principle.description}</p>
                </Place>
            ))}

            {/* Phones and tablets: the principles as compact plaques the thread stitches through. */}
            {shown.map((principle, index) => (
                <Place
                    key={principle.title}
                    id={`principle-${index + 1}`}
                    x="0%"
                    y="0%"
                    w="100%"
                    rotate={index % 2 === 0 ? -1.5 : 1.5}
                    className="lg:hidden"
                >
                    <div className="world-paper-card !p-4">
                        <div className="flex items-start justify-between">
                            <span className="principle-badge grid h-11 w-11 place-items-center rounded-full border border-ink/20">
                                <Icon name={principle.icon} className="principle-icon h-5 w-5" />
                            </span>
                            <span className="font-mono text-[10px] tabular-nums text-muted">
                                0{index + 1}
                            </span>
                        </div>
                        <p className="mt-4 text-[15px] font-medium leading-snug">
                            {principle.title}
                        </p>
                        <p className="mt-1 text-[13px] leading-snug text-body">
                            {principle.summary}
                        </p>
                    </div>
                </Place>
            ))}
        </Scene>
    );
}
