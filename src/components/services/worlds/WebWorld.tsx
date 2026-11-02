import {
    CountText,
    Meta,
    Paper,
    Place,
    Port,
    story,
    Swap,
    World,
} from "@/components/services/worlds/World";

/** A dashboard wireframe, drawn flat under the thread. */
function BrowserArt() {
    return (
        <svg className="world-art" viewBox="0 0 640 400" aria-hidden="true" focusable="false">
            <rect x="0.5" y="0.5" width="639" height="399" rx="10" />
            <path d="M0.5 36 H639.5" />
            <circle cx="20" cy="18" r="4" />
            <circle cx="34" cy="18" r="4" />
            <circle cx="48" cy="18" r="4" />
            <rect x="140" y="9" width="300" height="18" rx="9" className="faint" />
            <text x="154" y="22" fontSize="10" className="faint">
                app.northwind.io/overview
            </text>
            <path d="M130 36 V399.5" />
            <rect x="18" y="58" width="94" height="14" rx="3" className="faint" />
            <path
                d="M22 96 H96 M22 120 H88 M22 144 H100 M22 168 H80 M22 192 H92"
                className="faint"
            />
            <rect x="150" y="54" width="146" height="64" rx="6" />
            <rect x="312" y="54" width="146" height="64" rx="6" />
            <rect x="474" y="54" width="146" height="64" rx="6" />
            <text x="164" y="76" fontSize="9" className="faint">
                ACTIVE USERS
            </text>
            <CountText x="164" y="102" fontSize="20" value={12480} delay={300} />
            <text x="326" y="76" fontSize="9" className="faint">
                UPTIME
            </text>
            <CountText
                x="326"
                y="102"
                fontSize="20"
                value={99.98}
                decimals={2}
                suffix="%"
                delay={450}
            />
            <text x="488" y="76" fontSize="9" className="faint">
                P95 LATENCY
            </text>
            <CountText x="488" y="102" fontSize="20" value={41} suffix=" ms" delay={600} />
            <rect x="150" y="134" width="470" height="140" rx="6" />
            <path
                d="M166 166 H604 M166 196 H604 M166 226 H604"
                className="faint"
                strokeDasharray="3 5"
            />
            <path
                className="story-wipe"
                style={story(350, 1700)}
                d="M166 252 C196 244 214 228 244 230 S292 214 318 204 S366 212 392 190 S440 168 468 174 S520 150 548 146 S588 132 604 128"
            />
            <path
                d="M166 258 C196 252 214 246 244 244 S292 238 318 232 S366 236 392 222 S440 210 468 214 S520 198 548 196 S588 186 604 184"
                className="faint story-wipe"
                style={story(550, 1700)}
            />
            <rect x="150" y="290" width="470" height="96" rx="6" />
            <path d="M150 314 H620 M150 338 H620 M150 362 H620" className="faint" />
            <path d="M166 302 H230 M290 302 H350 M430 302 H470 M540 302 H600" className="faint" />
            <path
                d="M166 326 H250 M290 326 H330 M430 326 H480 M540 326 H590"
                className="story-in"
                style={story(1100)}
            />
            <path
                d="M166 350 H240 M290 350 H340 M430 350 H460 M540 350 H596"
                className="story-in"
                style={story(1250)}
            />
            <path
                d="M166 374 H220 M290 374 H350 M430 374 H476 M540 374 H584"
                className="story-in"
                style={story(1400)}
            />
        </svg>
    );
}

/** One round audit gauge; the arc fills when the card lights. */
function Gauge({ value, label }: { value: number; label: string }) {
    const r = 21;
    const length = 2 * Math.PI * r;
    return (
        <div className="flex flex-col items-center gap-1.5">
            <svg
                className="world-art w-14"
                viewBox="0 0 56 56"
                aria-hidden="true"
                focusable="false"
            >
                <circle cx="28" cy="28" r={r} className="faint" />
                <circle
                    cx="28"
                    cy="28"
                    r={r}
                    className="world-gauge accent"
                    strokeWidth="3"
                    strokeDasharray={length}
                    style={
                        {
                            "--gauge-off": `${length * (1 - value / 100)}px`,
                            "--gauge-len": `${length}px`,
                        } as React.CSSProperties
                    }
                    transform="rotate(-90 28 28)"
                />
                <text x="28" y="32" fontSize="12" textAnchor="middle">
                    {value}
                </text>
            </svg>
            <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-muted">
                {label}
            </span>
        </div>
    );
}

export function WebWorld({ description, href }: { description: string; href: string }) {
    return (
        <World
            id="world-web"
            index="02"
            label="Web Applications"
            description={description}
            title="Web"
            href={href}
            tone="ink"
            exit="right"
            titleAlign="right"
            titleY="44%"
        >
            <Place x="5%" y="17%" w="44%" depth="flat" className="text-paper/70">
                <BrowserArt />
                <Port order={3} x="38%" y="26%" />
                <Port order={4} x="12%" y="62%" />
            </Place>

            <Place x="54%" y="15%" w="17%" rotate={-4}>
                <Paper>
                    <Meta>Sign in · Northwind</Meta>
                    <div className="mt-4 space-y-2">
                        <div className="world-field">ana@northwind.io</div>
                        <div className="world-field tracking-[0.3em]">••••••••••</div>
                    </div>
                    <div className="mt-4 flex items-center justify-between bg-ink px-3 py-2 text-[12px] text-paper">
                        <Swap before="Continue" after="Signed in ✓" />
                        <span aria-hidden="true">→</span>
                    </div>
                </Paper>
                <Port order={2} x="50%" y="55%" />
            </Place>

            <Place x="74%" y="25%" w="21%" rotate={3}>
                <Paper>
                    <div className="flex items-center justify-between">
                        <Meta>Deploy · main</Meta>
                        <span className="font-mono text-[10px] uppercase tracking-[0.1em]">
                            <Swap
                                before={
                                    <span className="text-[#b7791f]">
                                        <i className="world-dot" />
                                        Building
                                    </span>
                                }
                                after={
                                    <span className="text-[#2f855a]">
                                        <i className="world-dot" />
                                        Live
                                    </span>
                                }
                            />
                        </span>
                    </div>
                    <p className="mt-3 font-mono text-[12px]">a41f9c2 · Ship billing v2</p>
                    <div className="world-progress mt-3">
                        <span />
                    </div>
                    <div className="mt-2 flex justify-between font-mono text-[10px] text-muted">
                        <span>eu-west · edge</span>
                        <Swap before="00:32" after="Ready in 48s" />
                    </div>
                </Paper>
                <Port order={1} x="50%" y="50%" />
            </Place>

            <Place x="8%" y="70%" w="23%" rotate={-2} wideOnly>
                <Paper>
                    <div className="flex items-center justify-between">
                        <Meta>Release audit</Meta>
                        <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted">
                            WCAG 2.2 AA
                        </span>
                    </div>
                    <div className="mt-3 flex justify-between">
                        <Gauge value={98} label="Perf" />
                        <Gauge value={100} label="A11y" />
                        <Gauge value={100} label="Best" />
                    </div>
                </Paper>
                <Port order={6} x="55%" y="50%" />
            </Place>

            <Port order={5} x="30%" y="58%" />
            <Port order={7} x="56%" y="80%" />
        </World>
    );
}
