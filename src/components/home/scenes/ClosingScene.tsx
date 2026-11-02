import { ButtonLink } from "@/components/ui/ButtonLink";
import {
    Meta,
    Paper,
    Place,
    Port,
    Scene,
    SceneHeadline,
    story,
    Swap,
} from "@/components/services/worlds/World";

const nextSteps = [
    "24-hour response time",
    "Principal engineer consultation",
    "Transparent scope & milestones",
];

/*
 * The socket and the plug on the end of the thread share one placed object, laid out in px so
 * the plug always lines up with the slots: the faceplate's slots sit SLOT_Y below the object's
 * top, and the plug waits PLUG_GAP to the left of the plate. When the thread arrives the socket
 * slides onto the plug far enough to cover its prongs, so the plug is visibly home and
 * the cord stays attached; the light comes on, it pulses once and reads Connected.
 */
const SLOT_Y = 96;
const PLUG_W = 118;
const PLUG_GAP = 30;
const SOCKET = { x: 70, y: 26 };

function SocketArt() {
    return (
        <svg className="world-art" viewBox="0 0 172 150" aria-hidden="true" focusable="false">
            <rect x="1" y="1" width="170" height="148" rx="14" />
            <rect x="34" y="26" width="104" height="104" rx="52" className="faint" />
            <rect x="74" y="56" width="8" height="30" rx="2" />
            <rect x="90" y="56" width="8" height="30" rx="2" />
            <circle cx="86" cy="108" r="5" className="faint" />
            <circle cx="150" cy="22" r="5" className="socket-led" />
        </svg>
    );
}

/**
 * Phones and tablets: the socket and plug in one small drawing. The page thread runs down the
 * right margin into the plug's cord (narrowWorldRoute ends the last section there); when it
 * arrives the plug slides home, the light comes on and it reads CONNECTED.
 */
function CompactSocketArt() {
    return (
        <svg className="world-art" viewBox="0 0 320 150" aria-hidden="true" focusable="false">
            <path d="M320 42 C282 42 300 76 262 76" className="accent" strokeWidth="1.6" />
            <g style={{ color: "var(--color-ink)" }}>
                <g className="story-move" style={story(250, 700, { "--from": "34px" })}>
                    <path
                        className="paper-fill"
                        d="M262 64 H200 a8 8 0 0 0 -8 8 V80 a8 8 0 0 0 8 8 H262 Z"
                    />
                    <path d="M262 60 V92 M254 64 V88" />
                    <rect x="158" y="67" width="34" height="5" rx="1.5" className="paper-fill" />
                    <rect x="158" y="80" width="34" height="5" rx="1.5" className="paper-fill" />
                </g>
                <rect x="26.5" y="8.5" width="160" height="134" rx="14" className="paper-fill" />
                <rect x="62" y="30" width="88" height="88" rx="44" className="faint" />
                <rect x="96" y="56" width="7" height="26" rx="2" />
                <rect x="110" y="56" width="7" height="26" rx="2" />
                <circle cx="106" cy="98" r="4" className="faint" />
                <circle cx="168" cy="26" r="5" className="faint" />
            </g>
            <g className="story-in" style={story(900)}>
                <circle cx="168" cy="26" r="5" className="socket-led" />
            </g>
            <g className="story-in" style={story(1000)}>
                <text x="106" y="136" fontSize="9" textAnchor="middle" className="socket-connected">
                    CONNECTED
                </text>
            </g>
        </svg>
    );
}

/** The plug on the end of the thread: the cord comes in from the left, the prongs face right. */
function PlugArt() {
    return (
        <svg className="world-art" viewBox="0 0 118 52" aria-hidden="true" focusable="false">
            <path className="paper-fill" d="M14 14 H70 a8 8 0 0 1 8 8 V30 a8 8 0 0 1 -8 8 H14 Z" />
            <path d="M14 10 V42 M22 14 V38" />
            <rect x="78" y="17" width="34" height="5" rx="1.5" className="paper-fill" />
            <rect x="78" y="30" width="34" height="5" rx="1.5" className="paper-fill" />
        </svg>
    );
}

export function ClosingScene() {
    const tail = `calc(${SOCKET.x}% - ${PLUG_W + PLUG_GAP}px)`;
    return (
        <Scene
            id="closing-title"
            tone="ink"
            exit="end"
            index="10"
            label="Start a conversation"
            description="Tell us about the challenge in front of your business."
        >
            <Place x="5%" y="18%" w="50%" still>
                <SceneHeadline
                    id="closing-title"
                    lines={["Let's build", "what's next."]}
                    size={6}
                />
            </Place>

            <Place x="5%" y="62%" w="34%" still>
                <p className="max-w-md text-body-lg text-paper/75">
                    We will respond with questions, a point of view and a clear next step.
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                    <ButtonLink to="/contact" variant="inverse" withArrow>
                        Start a Project
                    </ButtonLink>
                    <ButtonLink to="/services" variant="ghost-inverse">
                        Explore services
                    </ButtonLink>
                </div>
            </Place>

            <Place
                x={`${SOCKET.x}%`}
                y={`${SOCKET.y}%`}
                w="12rem"
                className="socket hidden lg:block"
            >
                <Paper className="!p-3">
                    {/* One soft pulse from the socket once the plug is home. */}
                    <span className="socket-pulse" aria-hidden="true" />
                    <SocketArt />
                    <div className="mt-2 flex items-center justify-between">
                        <Meta>Classific</Meta>
                        <span className="font-mono text-[10px] uppercase tracking-[0.12em]">
                            <Swap
                                before={<span className="text-muted">Ready</span>}
                                after={<span className="text-[#2f855a]">Connected</span>}
                            />
                        </span>
                    </div>
                </Paper>
                <span
                    className="plug absolute"
                    style={{
                        width: PLUG_W,
                        right: `calc(100% + ${PLUG_GAP}px)`,
                        top: SLOT_Y - 26,
                    }}
                >
                    <PlugArt />
                </span>
                <Port order={6} x={`-${PLUG_W + PLUG_GAP - 14}px`} y={`${SLOT_Y}px`} />
            </Place>

            <Place x="61%" y="66%" w="27%" rotate={2} still className="next-steps hidden lg:block">
                <Paper>
                    <Meta>What happens next</Meta>
                    <ol className="mt-3 divide-y divide-ink/10 font-mono text-[11px]">
                        {nextSteps.map((step, index) => (
                            <li key={step} className="flex justify-between py-2">
                                <span>{step}</span>
                                <span className="text-muted">0{index + 1}</span>
                            </li>
                        ))}
                    </ol>
                </Paper>
            </Place>

            {/* Cable slack: down the margin, a lazy swing below the socket, up into the plug. */}
            <Port order={1} x="90%" y="50%" />
            <Port order={2} x="76%" y="61%" />
            <Port order={3} x="60%" y="60%" />
            <Port order={4} x="52%" y="48%" />
            <Port order={5} x={`calc(${tail} - 46px)`} y={`calc(${SOCKET.y}% + ${SLOT_Y}px)`} />

            <Place x="0%" y="0%" w="100%" depth="flat" className="text-paper/80 lg:hidden">
                <CompactSocketArt />
            </Place>

            <ul className="grid w-full max-w-md gap-3 font-mono text-[12px] text-paper/75 lg:hidden">
                {nextSteps.map((step) => (
                    <li key={step} className="border-t border-paper/15 pt-3">
                        {step}
                    </li>
                ))}
            </ul>
        </Scene>
    );
}
