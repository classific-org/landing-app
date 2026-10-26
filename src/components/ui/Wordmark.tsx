type WordmarkProps = {
    className?: string;
    /** Use "paper" on dark surfaces. */
    tone?: "ink" | "paper";
};

/** Classific wordmark from docs/assets/logos/classific-wordmark.svg, rendered inline. */
export function Wordmark({ className, tone = "ink" }: WordmarkProps) {
    const text = tone === "ink" ? "var(--color-ink)" : "var(--color-paper)";
    const markFill = tone === "ink" ? "var(--color-ink)" : "var(--color-paper)";
    const markInner = tone === "ink" ? "var(--color-white)" : "var(--color-ink)";
    return (
        <svg
            viewBox="0 0 280 60"
            role="img"
            aria-label="Classific"
            className={className}
            focusable="false"
        >
            <path d="M8 12 30 1 51 13v25L30 50 8 38Z" fill={markFill} />
            <path d="M18 18 30 12 42 18 30 24Z" fill={markInner} />
            <path d="M18 31 30 25 42 31 30 37Z" fill={markInner} />
            <path d="M30 12 42 18v13l-12-6Z" fill="var(--color-accent)" />
            <text
                x="64"
                y="38"
                fill={text}
                fontFamily="Inter, Arial, sans-serif"
                fontSize="34"
                fontWeight="600"
                letterSpacing="-1.5"
            >
                Classific
            </text>
            <circle cx="218" cy="41" r="2.4" fill="var(--color-accent)" />
        </svg>
    );
}
