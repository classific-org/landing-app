type EyebrowProps = {
    children: React.ReactNode;
    className?: string;
    tone?: "muted" | "paper";
    /** Optional section number, shown before the label ("01"). */
    index?: string;
};

/** Small uppercase section label with a hairline lead-in. */
export function Eyebrow({ children, className, tone = "muted", index }: EyebrowProps) {
    return (
        <p
            className={[
                "eyebrow flex items-center gap-3",
                tone === "paper" ? "text-rule" : "",
                className,
            ]
                .filter(Boolean)
                .join(" ")}
        >
            {index ? (
                <span className="font-mono tabular-nums tracking-normal" aria-hidden="true">
                    {index}
                </span>
            ) : null}
            <span
                className={[
                    "h-px w-6 flex-none",
                    tone === "paper" ? "bg-rule/50" : "bg-muted/60",
                ].join(" ")}
                aria-hidden="true"
            />
            <span>{children}</span>
        </p>
    );
}
