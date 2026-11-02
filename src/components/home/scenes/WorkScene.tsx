import type { CSSProperties } from "react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import {
    Meta,
    Paper,
    Place,
    Port,
    Scene,
    SceneHeadline,
    Swap,
} from "@/components/services/worlds/World";

/*
 * Selected work, before any case study is public: a confidential case file. The thread comes
 * down the right margin into the file and runs down its check column, ticking each section
 * (Challenge, Approach, Solution, Verified outcome) whose contents stay redacted; then the
 * approval seal stamps down on the file and the private-walkthrough envelope opens.
 */
const sections = ["Challenge", "Approach", "Solution", "Verified outcome"];
/** The redaction bars in each section, as widths in the 520 x 380 art box. */
const redactions = [
    [212, 150],
    [246, 118],
    [176, 204],
    [228, 96],
];
const ROW_TOP = 128;
const ROW_GAP = 56;
const TICK_X = 452;

/** The case file: a folder with the case study clipped inside, its contents redacted. */
function CaseFileArt() {
    return (
        <svg className="world-art" viewBox="0 0 520 380" aria-hidden="true" focusable="false">
            <path
                d="M12 44 Q12 36 20 36 H186 L204 58 H500 Q508 58 508 66 V360 Q508 368 500 368 H20 Q12 368 12 360 Z"
                className="case-folder"
            />
            <text x="34" y="52" fontSize="10" letterSpacing="1.5">
                CASE FILE
            </text>
            <rect x="40.5" y="70.5" width="440" height="288" rx="2" className="case-sheet" />
            {/* A paper clip over the top edge. */}
            <path d="M72 60 V96 A8 8 0 0 0 88 96 V66 A5 5 0 0 0 78 66 V92" strokeWidth="1.6" />
            <text x="104" y="100" fontSize="11" letterSpacing="1.6">
                CASE STUDY
            </text>
            <rect x="196" y="91" width="88" height="9" rx="1.5" className="fill" />
            <g transform="rotate(-5 392 94)" className="accent">
                <rect x="334.5" y="80.5" width="116" height="26" rx="2" strokeWidth="1.6" />
                <text x="392.5" y="98" fontSize="10" letterSpacing="1.6" textAnchor="middle">
                    CONFIDENTIAL
                </text>
            </g>
            <path d="M64 114 H458" />
            {sections.map((section, index) => {
                const y = ROW_TOP + index * ROW_GAP;
                const [first, second] = redactions[index]!;
                return (
                    <g key={section} id={`case-row-${index + 1}`} className="case-row">
                        <text
                            x="64"
                            y={y + 14}
                            fontSize="9.5"
                            letterSpacing="1.4"
                            className="case-label"
                        >
                            {section.toUpperCase()}
                        </text>
                        <rect
                            x="64"
                            y={y + 22}
                            width={first}
                            height="7"
                            rx="1.5"
                            className="fill"
                        />
                        <rect
                            x="64"
                            y={y + 34}
                            width={second}
                            height="7"
                            rx="1.5"
                            className="fill"
                        />
                        <circle cx={TICK_X} cy={y + 24} r="10" className="faint" />
                        <g
                            className="case-tick accent"
                            style={{ "--d": `${300 + index * 320}ms` } as CSSProperties}
                        >
                            <circle cx={TICK_X} cy={y + 24} r="10" className="tint" />
                            <path
                                d={`M${TICK_X - 4.5} ${y + 24} l3.2 3.4 l6 -7`}
                                strokeWidth="1.8"
                            />
                        </g>
                        {index < sections.length - 1 ? (
                            <path d={`M64 ${y + 50} H458`} className="faint" />
                        ) : null}
                    </g>
                );
            })}
            {/* Phones show the approval as a stamp on the sheet (desktop has the seal itself). */}
            <g transform="rotate(-10 400 322)">
                <g className="case-stamp accent">
                    <circle cx="400" cy="322" r="30" strokeWidth="1.6" />
                    <path d="M386 322 l9 9 l19 -21" strokeWidth="2" />
                </g>
            </g>
        </svg>
    );
}

/** A round approval seal, filled so the thread passes under it; it lands like a stamp. */
function SealArt() {
    return (
        <svg
            className="world-art seal-art"
            viewBox="0 0 120 120"
            aria-hidden="true"
            focusable="false"
        >
            <defs>
                <path id="work-seal-path" d="M60 60 m-47 0 a47 47 0 1 1 94 0 a47 47 0 1 1 -94 0" />
            </defs>
            <circle cx="60" cy="60" r="55" className="paper-fill" />
            <circle cx="60" cy="60" r="38" />
            <text fontSize="8.6" letterSpacing="1.4">
                <textPath href="#work-seal-path">CLIENT APPROVED · VERIFIED · PUBLISHED ·</textPath>
            </text>
            <path d="M42 61 L55 74 L82 44" strokeWidth="2.2" />
        </svg>
    );
}

/** An envelope sealed under NDA; it opens when the thread reaches it. */
function EnvelopeArt() {
    return (
        <svg className="world-art" viewBox="0 0 160 104" aria-hidden="true" focusable="false">
            <g className="when-on">
                <rect x="20" y="-18" width="120" height="70" rx="2" className="envelope-letter" />
                <path d="M34 -4 H110 M34 8 H126 M34 20 H96" className="faint" />
            </g>
            <rect x="1" y="30" width="158" height="73" rx="3" className="envelope-body" />
            <path d="M1 103 L64 62 M159 103 L96 62" className="faint" />
            <path className="when-off" d="M1 30 L80 76 L159 30" />
            <path className="when-on" d="M1 30 L80 2 L159 30" />
            <circle className="when-off accent fill" cx="80" cy="74" r="7" />
        </svg>
    );
}

export function WorkScene() {
    // The check column's points, in % of the case file's box.
    const ticks = sections.map((_, index) => ({
        x: `${(TICK_X / 520) * 100}%`,
        y: `${((ROW_TOP + index * ROW_GAP + 24) / 380) * 100}%`,
    }));
    return (
        <Scene
            id="work-title"
            tone="paper"
            exit="right"
            index="09"
            label="Selected work"
            description="We publish case studies only once outcomes are verified and clients have approved them."
            height="max(58rem, 106svh)"
        >
            <Place x="5%" y="16%" w="42%" still>
                <SceneHeadline
                    id="work-title"
                    lines={["Real projects,", "verified details."]}
                    size={5.4}
                />
            </Place>

            <Place x="5%" y="47%" w="32%" still>
                <p className="max-w-sm text-body-lg text-body">
                    Case studies go live once the client signs off. Until then, we walk you through
                    real work privately.
                </p>
                <div className="mt-8">
                    <ButtonLink to="/contact" withArrow>
                        Request a private walkthrough
                    </ButtonLink>
                </div>
            </Place>

            <Place x="50%" y="12%" w="40%" depth="flat" className="case-file text-ink">
                <CaseFileArt />
                {ticks.map((tick, index) => (
                    <Port
                        key={index}
                        order={index + 1}
                        x={tick.x}
                        y={tick.y}
                        light={`case-row-${index + 1}`}
                    />
                ))}
            </Place>

            <Place x="80%" y="51%" w="10%" rotate={-9} className="seal hidden text-accent lg:block">
                <SealArt />
                <Port order={5} x="50%" y="50%" />
            </Place>

            <Place x="72%" y="71%" w="17%" rotate={-3} className="max-w-[16rem] lg:max-w-none">
                <Paper className="!p-4">
                    <EnvelopeArt />
                    <div className="mt-3 flex items-center justify-between">
                        <Meta>Private walkthrough</Meta>
                        <span className="font-mono text-[10px] uppercase tracking-[0.1em]">
                            <Swap
                                before={<span className="text-muted">Under NDA</span>}
                                after={<span className="world-accent">Opened for you</span>}
                            />
                        </span>
                    </div>
                </Paper>
                <Port order={6} x="50%" y="45%" />
            </Place>
        </Scene>
    );
}
