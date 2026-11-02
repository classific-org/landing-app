import { Meta, Paper, Place, Port, story, Swap, World } from "@/components/services/worlds/World";

const columns = [
    { name: "LEAD", count: 12, cards: 3 },
    { name: "PROPOSAL", count: 5, cards: 2 },
    { name: "WON", count: 8, cards: 2 },
];

/** A sales pipeline board; one deal moves to WON when the thread passes. */
function PipelineArt() {
    return (
        <svg className="world-art" viewBox="0 0 680 380" aria-hidden="true" focusable="false">
            <rect x="0.5" y="0.5" width="679" height="379" rx="8" />
            <text x="20" y="30" fontSize="11">
                Pipeline · Q3
            </text>
            <text x="660" y="30" fontSize="9" textAnchor="end" className="faint">
                £1.24M WEIGHTED
            </text>
            <path d="M0.5 46 H679.5" />
            {columns.map((column, c) => {
                const x = 20 + c * 220;
                return (
                    <g key={column.name}>
                        <text x={x} y="72" fontSize="9" className="faint">
                            {column.name} · {column.count}
                        </text>
                        {Array.from({ length: column.cards }, (_, i) => {
                            const y = 86 + i * 82;
                            return (
                                <g key={i}>
                                    <rect x={x} y={y} width="200" height="70" rx="5" />
                                    <path d={`M${x + 14} ${y + 22} H${x + 120 - i * 16}`} />
                                    <path d={`M${x + 14} ${y + 40} H${x + 90}`} className="faint" />
                                    <circle cx={x + 180} cy={y + 52} r="7" className="faint" />
                                </g>
                            );
                        })}
                    </g>
                );
            })}
            {/* The deal that closes: it moves from PROPOSAL to WON as the thread passes,
                leaving its slot behind. */}
            <rect
                x="240"
                y="250"
                width="200"
                height="70"
                rx="5"
                strokeDasharray="4 4"
                className="faint"
            />
            <g className="story-move accent" style={story(350, 1300, { "--from": "-220px" })}>
                <rect x="460" y="250" width="200" height="70" rx="5" strokeWidth="2" />
                <text x="474" y="276" fontSize="10">
                    Harbour Works · £86k
                </text>
                <text x="474" y="300" fontSize="9" className="story-in" style={story(1650)}>
                    CLOSED WON ✓
                </text>
            </g>
        </svg>
    );
}

export function SystemsWorld({ description, href }: { description: string; href: string }) {
    return (
        <World
            id="world-systems"
            index="05"
            label="CRM, CMS & ERP"
            description={description}
            title="Systems"
            href={href}
            tone="paper"
            titleY="60%"
            exit="right"
        >
            <Place x="5%" y="14%" w="48%" depth="flat" className="text-ink">
                <PipelineArt />
                <Port order={3} x="80%" y="74%" />
                <Port order={4} x="18%" y="40%" />
            </Place>

            <Place x="58%" y="12%" w="19%" rotate={3}>
                <Paper className="relative">
                    <Meta>Purchase order</Meta>
                    <p className="mt-1 text-[18px] font-medium">PO-1042</p>
                    <div className="mt-3 divide-y divide-ink/10 font-mono text-[11px]">
                        <p className="flex justify-between py-1.5">
                            <span>Steel brackets ×400</span>
                            <span>£14,800</span>
                        </p>
                        <p className="flex justify-between py-1.5">
                            <span>Freight</span>
                            <span>£3,440</span>
                        </p>
                        <p className="flex justify-between py-1.5 font-semibold">
                            <span>Total</span>
                            <span>£18,240</span>
                        </p>
                    </div>
                    <span className="when-on world-accent absolute -right-3 top-6 rotate-[-12deg] border-2 border-current px-2 py-0.5 font-mono text-[12px] font-bold tracking-[0.14em]">
                        APPROVED
                    </span>
                </Paper>
                <Port order={2} x="50%" y="50%" />
            </Place>

            <Place x="80%" y="40%" w="16%" rotate={-2}>
                <Paper>
                    <Meta>Inventory · WH-2</Meta>
                    <div className="mt-2 divide-y divide-ink/10 font-mono text-[11px]">
                        <p className="flex justify-between py-1.5">
                            <span>SKU-118</span>
                            <Swap
                                before="248"
                                after={<span className="world-accent">+400 → 648</span>}
                            />
                        </p>
                        <p className="flex justify-between py-1.5">
                            <span>SKU-204</span>
                            <span>96</span>
                        </p>
                        <p className="flex justify-between py-1.5">
                            <span>SKU-377</span>
                            <span>1,210</span>
                        </p>
                    </div>
                </Paper>
                <Port order={1} x="50%" y="50%" />
            </Place>

            <Place x="9%" y="69%" w="25%" rotate={2} wideOnly>
                <Paper>
                    <div className="flex items-center justify-between">
                        <Meta>Pages / Pricing</Meta>
                        <span className="font-mono text-[10px] uppercase tracking-[0.1em]">
                            <Swap
                                before={<span className="text-muted">Draft</span>}
                                after={<span className="world-accent">Published</span>}
                            />
                        </span>
                    </div>
                    <p className="mt-2 text-[15px] font-medium">Plans that grow with you</p>
                    <div className="mt-2 space-y-1.5">
                        <div className="h-1.5 w-11/12 bg-ink/15" />
                        <div className="h-1.5 w-3/4 bg-ink/15" />
                    </div>
                </Paper>
                <Port order={6} x="50%" y="50%" />
            </Place>

            <Port order={5} x="30%" y="60%" />
            <Port order={7} x="56%" y="80%" />
        </World>
    );
}
