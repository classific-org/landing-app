import { Meta, Paper, Place, Port, story, Swap, World } from "@/components/services/worlds/World";

const jobs = [
    { title: "Boiler service", place: "14 Mill Lane" },
    { title: "Meter reading", place: "Unit 6, Dock Rd" },
    { title: "Fault inspection", place: "Harbour Works" },
    { title: "Valve replacement", place: "2 Kings Yard" },
];

/** A phone running a field-service app, drawn flat under the thread. */
function PhoneArt() {
    return (
        <svg className="world-art" viewBox="0 0 220 460" aria-hidden="true" focusable="false">
            <rect x="0.5" y="0.5" width="219" height="459" rx="36" />
            <rect x="9" y="9" width="202" height="442" rx="28" className="faint" />
            <rect x="80" y="20" width="60" height="16" rx="8" className="fill" />
            <text x="26" y="33" fontSize="10">
                9:41
            </text>
            <path d="M176 28 h4 M182 26 v4 M186 24 v6 M190 22 v8" />
            <text x="24" y="74" fontSize="21" fontFamily="inherit">
                Today
            </text>
            <text x="24" y="92" fontSize="9" className="faint">
                4 JOBS · 2 TECHNICIANS
            </text>
            {jobs.map((job, index) => {
                const y = 112 + index * 64;
                return (
                    <g key={job.title}>
                        <rect x="18" y={y} width="184" height="52" rx="10" />
                        <circle cx="40" cy={y + 26} r="9" />
                        {/* The day's jobs tick off one by one. */}
                        <path
                            className="story-in"
                            style={story(450 + index * 420)}
                            d={`M35 ${y + 26} l4 4 l7 -8`}
                        />
                        <text x="58" y={y + 23} fontSize="11">
                            {job.title}
                        </text>
                        <text x="58" y={y + 38} fontSize="8.5" className="faint">
                            {job.place}
                        </text>
                    </g>
                );
            })}
            <path d="M18 392 H202" className="faint" />
            <circle cx="46" cy="420" r="7" />
            <rect x="94" y="413" width="14" height="14" rx="3" />
            <path d="M146 427 l8 -14 l8 14 z" />
            <circle cx="182" cy="420" r="3" className="fill" />
            <rect x="80" y="440" width="60" height="4" rx="2" className="fill" />
        </svg>
    );
}

function Cloud({ synced }: { synced: boolean }) {
    return (
        <svg className="world-art w-10" viewBox="0 0 40 28" aria-hidden="true" focusable="false">
            <path d="M10 24 H31 a7 7 0 0 0 0 -14 a10 10 0 0 0 -19 2 a6 6 0 0 0 -2 12 z" />
            {synced ? (
                <path d="M15 16 l4 4 l7 -8" className="accent" strokeWidth="1.8" />
            ) : (
                <path d="M6 4 L34 27" />
            )}
        </svg>
    );
}

export function MobileWorld({ description, href }: { description: string; href: string }) {
    return (
        <World
            id="world-mobile"
            index="03"
            label="Mobile Applications"
            description={description}
            title="Mobile"
            href={href}
            tone="paper"
            exit="left"
        >
            <Place
                x="41%"
                y="13%"
                w="16%"
                depth="flat"
                className="max-w-[15rem] text-ink lg:max-w-none"
            >
                <PhoneArt />
                <Port order={2} x="50%" y="22%" />
                <Port order={3} x="30%" y="58%" />
            </Place>

            <Place x="61%" y="17%" w="22%" rotate={2}>
                <Paper>
                    <div className="flex items-center gap-3">
                        <span className="grid h-9 w-9 flex-none place-items-center bg-ink font-mono text-[11px] text-paper">
                            FO
                        </span>
                        <div className="min-w-0">
                            <Meta>FieldOps · now</Meta>
                            <p className="mt-1 text-[14px] font-medium">Job #2481 assigned</p>
                        </div>
                    </div>
                    <p className="mt-3 border-t border-ink/15 pt-3 font-mono text-[11px] text-body">
                        <Swap before="Tap to accept" after="Synced to dispatch ✓" />
                    </p>
                </Paper>
                <Port order={1} x="50%" y="50%" />
            </Place>

            <Place x="9%" y="21%" w="21%" rotate={-3} wideOnly>
                <Paper>
                    <Meta>Offline mode</Meta>
                    <div className="mt-3 flex items-center gap-3">
                        <Swap before={<Cloud synced={false} />} after={<Cloud synced />} />
                        <p className="text-[14px] font-medium">
                            <Swap before="3 changes queued" after="All changes synced" />
                        </p>
                    </div>
                    <p className="mt-3 font-mono text-[10px] text-muted">
                        LAST SIGNAL · 12 MIN AGO
                    </p>
                </Paper>
                <Port order={4} x="50%" y="50%" />
            </Place>

            <Place x="66%" y="70%" w="23%" rotate={2}>
                <Paper>
                    <Meta>Release 2.4.0</Meta>
                    <div className="mt-3 divide-y divide-ink/10 font-mono text-[11px]">
                        <p className="flex justify-between py-2">
                            <span>iOS · App Store</span>
                            <Swap
                                before="In review"
                                after={<span className="world-accent">Live</span>}
                            />
                        </p>
                        <p className="flex justify-between py-2">
                            <span>Android · Play</span>
                            <Swap
                                before="Rolling 20%"
                                after={<span className="world-accent">Live</span>}
                            />
                        </p>
                    </div>
                </Paper>
                <Port order={7} x="50%" y="50%" />
            </Place>

            <Port order={5} x="14%" y="58%" />
            <Port order={6} x="40%" y="66%" />
            <Port order={8} x="50%" y="90%" />
        </World>
    );
}
