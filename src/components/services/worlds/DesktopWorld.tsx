import { Meta, Paper, Place, Port, story, Swap, World } from "@/components/services/worlds/World";

/** A professional editing app (layers, preview, inspector, timeline), drawn flat. */
function AppWindowArt() {
    const wave = Array.from({ length: 64 }, (_, index) => {
        const x = 182 + index * 6.4;
        const h = 4 + Math.abs(Math.sin(index * 0.7) * 10 + Math.sin(index * 0.23) * 6);
        return `M${x.toFixed(1)} ${(386 - h).toFixed(1)} V${(386 + h).toFixed(1)}`;
    }).join(" ");
    return (
        <svg className="world-art" viewBox="0 0 760 440" aria-hidden="true" focusable="false">
            <rect x="0.5" y="0.5" width="759" height="439" rx="10" />
            <path d="M0.5 32 H759.5" />
            <circle cx="18" cy="16" r="5" />
            <circle cx="34" cy="16" r="5" />
            <circle cx="50" cy="16" r="5" />
            <text x="380" y="20" fontSize="10" textAnchor="middle" className="faint">
                Northwind Studio — render_final.ncs
            </text>
            <path d="M160 32 V330 M600 32 V330 M0.5 330 H759.5" />
            <text x="16" y="56" fontSize="9" className="faint">
                LAYERS
            </text>
            {[0, 1, 2, 3, 4, 5].map((index) => (
                <g key={index}>
                    <rect
                        x="14"
                        y={70 + index * 30}
                        width="16"
                        height="16"
                        rx="3"
                        className="faint"
                    />
                    <path d={`M40 ${78 + index * 30} H${120 - (index % 3) * 18}`} />
                </g>
            ))}
            <rect x="184" y="56" width="392" height="250" rx="4" />
            {/* The preview renders top to bottom. */}
            <g className="story-drop" style={story(300, 1800)}>
                <circle cx="476" cy="118" r="26" />
                <path d="M184 270 L280 170 L340 228 L404 150 L500 250 L576 196 V306 H184 Z" />
            </g>
            <text x="616" y="56" fontSize="9" className="faint">
                INSPECTOR
            </text>
            {[0, 1, 2, 3].map((index) => (
                <g key={index}>
                    <path d={`M616 ${84 + index * 40} H744`} className="faint" />
                    <circle
                        cx={640 + index * 26}
                        cy={84 + index * 40}
                        r="5"
                        className="fill story-move"
                        style={story(500 + index * 160, 900, { "--from": "-24px" })}
                    />
                    <text x="616" y={74 + index * 40} fontSize="8" className="faint">
                        {["EXPOSURE", "CONTRAST", "GRAIN", "SPEED"][index]}
                    </text>
                </g>
            ))}
            <rect x="16" y="346" width="150" height="20" rx="3" className="faint" />
            <rect x="16" y="376" width="150" height="20" rx="3" className="faint" />
            <rect x="16" y="406" width="150" height="20" rx="3" className="faint" />
            <rect x="182" y="346" width="220" height="20" rx="3" />
            <rect x="410" y="346" width="160" height="20" rx="3" />
            <path d={wave} />
            <rect x="182" y="406" width="300" height="20" rx="3" />
            <rect x="490" y="406" width="250" height="20" rx="3" className="faint" />
            {/* The playhead runs across the timeline. */}
            <g className="story-sweep" style={story(200, 2000, { "--from": "-280px" })}>
                <path d="M462 338 V436" className="accent" strokeWidth="2" />
                <path d="M456 338 h12 l-6 8 z" className="accent fill" />
            </g>
        </svg>
    );
}

export function DesktopWorld({ description, href }: { description: string; href: string }) {
    return (
        <World
            id="world-desktop"
            index="04"
            label="Desktop Applications"
            description={description}
            title="Desktop"
            href={href}
            tone="ink"
            titleY="62%"
            exit="right"
        >
            <Place x="34%" y="14%" w="54%" depth="flat" className="text-paper/70">
                <AppWindowArt />
                <Port order={2} x="38%" y="34%" />
                <Port order={3} x="64%" y="84%" />
            </Place>

            <Place x="5%" y="19%" w="23%" rotate={-3}>
                <Paper>
                    <div className="world-field flex items-center justify-between">
                        <span>Export…</span>
                        <span className="text-muted">⌘K</span>
                    </div>
                    <ul className="mt-3 space-y-1 font-mono text-[11px]">
                        <li className="flex justify-between bg-ink px-2.5 py-1.5 text-paper">
                            <span>Export project…</span>
                            <span aria-hidden="true">↵</span>
                        </li>
                        <li className="px-2.5 py-1.5 text-body">Open recent</li>
                        <li className="px-2.5 py-1.5 text-body">Toggle inspector</li>
                    </ul>
                    <p className="mt-3 border-t border-ink/15 pt-2.5 font-mono text-[10px] uppercase tracking-[0.1em] text-muted">
                        <Swap
                            before="Press ↵ to run"
                            after={<span className="world-accent">Export started</span>}
                        />
                    </p>
                </Paper>
                <Port order={1} x="50%" y="50%" />
            </Place>

            <Place x="8%" y="71%" w="20%" rotate={-2} wideOnly>
                <Paper>
                    <Meta>Builds</Meta>
                    <ul className="mt-2 divide-y divide-ink/10 font-mono text-[11px]">
                        {["macOS · universal", "Windows · x64", "Linux · AppImage"].map((name) => (
                            <li key={name} className="flex items-center justify-between py-1.5">
                                <span>{name}</span>
                                <Swap
                                    before="—"
                                    after={<span className="world-accent">✓ signed</span>}
                                />
                            </li>
                        ))}
                    </ul>
                </Paper>
                <Port order={5} x="50%" y="50%" />
            </Place>

            <Place x="70%" y="69%" w="20%" rotate={4}>
                <Paper>
                    <div className="flex items-start gap-3">
                        <svg
                            className="world-art w-8 flex-none"
                            viewBox="0 0 28 34"
                            aria-hidden="true"
                            focusable="false"
                        >
                            <path d="M1 1 H19 L27 9 V33 H1 Z M19 1 V9 H27" />
                            <path d="M7 17 l12 6 l-12 6 z" />
                        </svg>
                        <div className="min-w-0">
                            <p className="truncate text-[14px] font-medium">render_final.mov</p>
                            <p className="font-mono text-[10px] text-muted">2.4 GB · PRORES 4444</p>
                        </div>
                    </div>
                    <div className="world-progress mt-3">
                        <span />
                    </div>
                    <p className="mt-2 font-mono text-[10px] text-muted">
                        <Swap before="Rendering 38%" after="Saved to /Exports" />
                    </p>
                </Paper>
                <Port order={7} x="50%" y="50%" />
            </Place>

            <Port order={4} x="34%" y="60%" />
            <Port order={6} x="46%" y="92%" />
        </World>
    );
}
