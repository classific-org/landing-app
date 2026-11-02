import { Meta, Paper, Place, Port, story, Swap, World } from "@/components/services/worlds/World";

const log = [
    { mark: "$", text: "classific deploy orders-api --env production", tone: "" },
    { mark: "✓", text: "tests        214 passed", tone: "" },
    { mark: "✓", text: "build        12.4s · 38 MB image", tone: "" },
    { mark: "✓", text: "migrate      3 migrations applied", tone: "" },
    { mark: "→", text: "rollout      canary 10% → 50% → 100%", tone: "accent" },
    { mark: " ", text: "orders-api is live at api.northwind.io", tone: "" },
];

/** When each log line starts typing, in ms: one after another, with a short pause between. */
const starts = log.reduce<number[]>(
    (times, line, index) => [
        ...times,
        index === 0 ? 300 : times[index - 1]! + log[index - 1]!.text.length * 15 + 180,
    ],
    [],
);
const done = starts[starts.length - 1]! + log[log.length - 1]!.text.length * 15;

/** A terminal with a production deploy, drawn flat under the thread; it runs as the line passes. */
function TerminalArt() {
    return (
        <svg className="world-art" viewBox="0 0 560 300" aria-hidden="true" focusable="false">
            <rect x="0.5" y="0.5" width="559" height="299" rx="10" />
            <path d="M0.5 32 H559.5" />
            <circle cx="18" cy="16" r="5" />
            <circle cx="34" cy="16" r="5" />
            <circle cx="50" cy="16" r="5" />
            <text x="280" y="20" fontSize="10" textAnchor="middle" className="faint">
                ~/northwind — zsh
            </text>
            {log.map((line, index) => (
                <g key={line.text} className={line.tone}>
                    <text
                        x="22"
                        y={66 + index * 34}
                        fontSize="12"
                        className="faint story-in"
                        style={story(starts[index]!, 200)}
                    >
                        {line.mark}
                    </text>
                    <text
                        x="44"
                        y={66 + index * 34}
                        fontSize="12"
                        className="story-type"
                        style={story(starts[index]!, undefined, { "--n": line.text.length })}
                    >
                        {line.text}
                    </text>
                </g>
            ))}
            <rect
                x="44"
                y="262"
                width="9"
                height="15"
                className="fill accent story-blink"
                style={story(done)}
            />
        </svg>
    );
}

function Service({ name, detail }: { name: string; detail: string }) {
    return (
        <Paper className="!px-3.5 !py-3">
            <Meta>Service</Meta>
            <p className="mt-0.5 font-mono text-[14px] font-semibold">{name}</p>
            <p className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.08em]">
                <Swap
                    before={<span className="text-muted">Idle</span>}
                    after={
                        <span className="text-[#2f855a]">
                            <i className="world-dot" />
                            {detail}
                        </span>
                    }
                />
            </p>
        </Paper>
    );
}

export function CustomWorld({ description, href }: { description: string; href: string }) {
    return (
        <World
            id="world-custom"
            index="06"
            label="Custom Software"
            description={description}
            title="Custom"
            href={href}
            tone="ink"
            titleY="48%"
            exit="left"
        >
            <Place
                id="custom-terminal"
                x="5%"
                y="16%"
                w="40%"
                depth="flat"
                className="text-paper/70"
            >
                <TerminalArt />
                <Port order={6} x="70%" y="70%" />
                <Port order={7} x="16%" y="30%" />
            </Place>

            <Place x="53%" y="15%" w="12%" rotate={-3} wideOnly>
                <Service name="auth" detail="Healthy · 18ms" />
                {/* The deploy in the terminal runs as the line reaches the first service. */}
                <Port order={1} x="50%" y="50%" alsoLight="custom-terminal" />
            </Place>
            <Place x="68%" y="29%" w="12%" rotate={2}>
                <Service name="orders" detail="Healthy · 42ms" />
                <Port order={2} x="50%" y="50%" />
            </Place>
            <Place x="83%" y="15%" w="12%" rotate={-2} wideOnly>
                <Service name="billing" detail="Healthy · 31ms" />
                <Port order={3} x="50%" y="50%" />
            </Place>

            <Place x="60%" y="69%" w="24%" rotate={2}>
                <Paper>
                    <div className="flex items-center justify-between">
                        <Meta>Webhook</Meta>
                        <span className="font-mono text-[10px] uppercase tracking-[0.1em]">
                            <Swap
                                before={<span className="text-muted">Queued</span>}
                                after={<span className="world-accent">Delivered · 200</span>}
                            />
                        </span>
                    </div>
                    <pre className="mt-3 overflow-hidden bg-ink/[0.04] p-3 font-mono text-[11px] leading-relaxed">
                        {`{
  "event": "order.created",
  "id": "ord_2481",
  "total": 18240
}`}
                    </pre>
                </Paper>
                <Port order={5} x="50%" y="50%" />
            </Place>

            <Port order={4} x="92%" y="50%" />
            <Port order={8} x="10%" y="72%" />
        </World>
    );
}
