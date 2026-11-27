import { story } from "@/components/services/worlds/World";

/*
 * The deliverable each process stage ends in, drawn small inside its card. Every drawing plays
 * a short story once the thread reaches its card (the `story-*` steps in global.css), so the
 * stages read as work being done in order, not just labels. All share a 260 x 120 box.
 */

/** 01 Discover: notes from the first conversations, and the line that states the problem. */
export function DiscoverArt() {
    return (
        <svg className="world-art" viewBox="0 0 260 120" aria-hidden="true" focusable="false">
            <rect x="0.5" y="0.5" width="150" height="119" rx="4" />
            <path d="M14 20 H84" strokeWidth="2" />
            <path d="M14 40 H134 M14 54 H118 M14 82 H102 M14 96 H124" className="faint" />
            {/* The highlighter finds the problem statement. */}
            <g className="accent story-wipe" style={story(350, 700)}>
                <rect x="10" y="61" width="128" height="14" rx="2" className="tint" />
            </g>
            <path d="M14 68 H130" />
            {[
                { x: 166, y: 8, r: -4 },
                { x: 178, y: 44, r: 3 },
                { x: 164, y: 80, r: -2 },
            ].map((note, index) => (
                // The tilt sits on an outer group: the story's own transform would replace it.
                <g key={note.y} transform={`rotate(${note.r} ${note.x + 38} ${note.y + 15})`}>
                    <g className="story-in" style={story(800 + index * 220)}>
                        <rect x={note.x} y={note.y} width="78" height="30" rx="2" />
                        <path
                            d={`M${note.x + 8} ${note.y + 11} H${note.x + 60} M${note.x + 8} ${note.y + 20} H${note.x + 44}`}
                            className="faint"
                        />
                    </g>
                </g>
            ))}
        </svg>
    );
}

/** 02 Plan: a schedule whose bars fill in, the critical path in blue, and a milestone. */
export function PlanArt() {
    const rows = [
        { start: 52, length: 70 },
        { start: 96, length: 64 },
        { start: 132, length: 82, accent: true },
        { start: 188, length: 46 },
    ];
    return (
        <svg className="world-art" viewBox="0 0 260 120" aria-hidden="true" focusable="false">
            <path d="M52 6 V114 M98 6 V114 M144 6 V114 M190 6 V114 M236 6 V114" className="faint" />
            {rows.map((row, index) => {
                const y = 14 + index * 26;
                return (
                    <g key={y}>
                        <path d={`M4 ${y + 6} H${36 - index * 4}`} className="faint" />
                        <g
                            className={`story-wipe ${row.accent ? "accent" : ""}`}
                            style={story(300 + index * 260, 600)}
                        >
                            <rect
                                x={row.start}
                                y={y}
                                width={row.length}
                                height="12"
                                rx="3"
                                className={row.accent ? "tint" : ""}
                            />
                            <rect x={row.start} y={y} width={row.length} height="12" rx="3" />
                        </g>
                    </g>
                );
            })}
            <g className="accent story-in" style={story(1400)}>
                <path d="M244 92 l7 7 l-7 7 l-7 -7 z" className="fill" />
            </g>
        </svg>
    );
}

/** 03 Design: a screen that assembles itself, then the cursor finds the main button. */
export function DesignArt() {
    return (
        <svg className="world-art" viewBox="0 0 260 120" aria-hidden="true" focusable="false">
            <rect x="20.5" y="0.5" width="219" height="119" rx="6" />
            <path d="M20.5 18 H239.5" />
            <circle cx="34" cy="9.5" r="3.5" />
            <path d="M178 9.5 H194 M202 9.5 H214 M220 9.5 H230" className="faint" />
            <g className="story-in" style={story(300)}>
                <path d="M34 34 H128" strokeWidth="2.5" />
                <path d="M34 46 H118 M34 55 H104" className="faint" />
            </g>
            <g className="story-in" style={story(550)}>
                <rect x="146" y="28" width="80" height="44" rx="3" />
                <path d="M146 28 L226 72 M226 28 L146 72" className="faint" />
            </g>
            {[0, 1, 2].map((index) => (
                <g key={index} className="story-in" style={story(800 + index * 160)}>
                    <rect x={34 + index * 66} y="84" width="58" height="26" rx="3" />
                </g>
            ))}
            {/* The call to action fills as the cursor arrives on it. */}
            <rect x="34" y="62" width="42" height="12" rx="6" />
            <g className="accent story-in" style={story(1700)}>
                <rect x="34" y="62" width="42" height="12" rx="6" className="fill" />
            </g>
            <g className="story-move" style={story(1100, 700, { "--from": "60px" })}>
                <path
                    d="M66 70 l0 15 l4 -4 l3 7 l3 -1.5 l-3 -7 l5.5 -0.5 z"
                    className="paper-fill"
                />
            </g>
        </svg>
    );
}

/** 04 Develop: code written line by line, then the test run comes back green. */
export function DevelopArt() {
    const lines = [
        { indent: 0, parts: [18, 40, 26] },
        { indent: 1, parts: [30, 52] },
        { indent: 2, parts: [22, 34, 18] },
        { indent: 1, parts: [44] },
        { indent: 0, parts: [12] },
    ];
    return (
        <svg className="world-art" viewBox="0 0 260 120" aria-hidden="true" focusable="false">
            <rect x="0.5" y="0.5" width="259" height="119" rx="5" />
            <path d="M28 0.5 V96" className="faint" />
            <path d="M0.5 96 H259.5" />
            {lines.map((line, index) => {
                const y = 14 + index * 16;
                let x = 38 + line.indent * 14;
                const segments = line.parts.map((width, part) => {
                    const d = `M${x} ${y} H${x + width}`;
                    x += width + 7;
                    return <path key={part} d={d} className={part === 0 ? "accent" : ""} />;
                });
                return (
                    <g key={y}>
                        <text x="10" y={y + 3} fontSize="8" className="faint">
                            {index + 1}
                        </text>
                        <g className="story-wipe" style={story(250 + index * 260, 320)}>
                            {segments}
                        </g>
                    </g>
                );
            })}
            <g className="accent story-in" style={story(1700)}>
                <text x="12" y="111" fontSize="9">
                    ✓ 128 tests passed
                </text>
            </g>
        </svg>
    );
}

/** 05 Launch: the release pipeline runs through build, test and deploy, then goes live. */
export function LaunchArt() {
    const steps = ["Build", "Test", "Deploy"];
    return (
        <svg className="world-art" viewBox="0 0 260 120" aria-hidden="true" focusable="false">
            <path d="M54 40 H116 M144 40 H206" className="faint" />
            {steps.map((label, index) => {
                const cx = 40 + index * 90;
                return (
                    <g key={label}>
                        {index > 0 ? (
                            <g className="accent story-wipe" style={story(300 + index * 450, 400)}>
                                <path d={`M${cx - 76} 40 H${cx - 14}`} strokeWidth="2" />
                            </g>
                        ) : null}
                        <circle cx={cx} cy="40" r="14" />
                        <g className="accent story-in" style={story(300 + index * 450 + 380)}>
                            <circle cx={cx} cy="40" r="14" className="tint" />
                            <path d={`M${cx - 5} 40 l3.5 3.5 l6.5 -7`} strokeWidth="2" />
                        </g>
                        <text x={cx} y="70" fontSize="8.5" textAnchor="middle" className="faint">
                            {label.toUpperCase()}
                        </text>
                    </g>
                );
            })}
            <g className="accent story-in" style={story(1900)}>
                <rect x="96" y="88" width="68" height="22" rx="11" />
                <circle cx="111" cy="99" r="3" className="fill" />
                <text x="120" y="102" fontSize="9">
                    LIVE
                </text>
            </g>
        </svg>
    );
}

export const stageArt = [DiscoverArt, PlanArt, DesignArt, DevelopArt, LaunchArt];
