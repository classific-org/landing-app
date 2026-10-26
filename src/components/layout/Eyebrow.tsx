type EyebrowProps = {
    children: React.ReactNode;
    className?: string;
    tone?: "muted" | "paper";
};

export function Eyebrow({ children, className, tone = "muted" }: EyebrowProps) {
    return (
        <p
            className={["eyebrow", tone === "paper" ? "text-rule" : "", className]
                .filter(Boolean)
                .join(" ")}
        >
            {children}
        </p>
    );
}
