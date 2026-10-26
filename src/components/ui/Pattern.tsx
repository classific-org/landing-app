type PatternProps = {
    variant: "contour" | "planes" | "dots";
    className?: string;
};

/**
 * Decorative background patterns from docs/assets/patterns, rendered inline so they
 * inherit the design tokens. Always hidden from assistive technology.
 */
export function Pattern({ variant, className }: PatternProps) {
    if (variant === "contour") {
        return (
            <svg
                viewBox="0 0 360 180"
                preserveAspectRatio="none"
                fill="none"
                aria-hidden="true"
                focusable="false"
                className={className}
            >
                <g stroke="var(--color-muted)" strokeWidth="1" opacity=".38">
                    <path d="M-20 30C40 0 75 65 135 30S230 0 290 30 355 60 390 25" />
                    <path d="M-20 45C40 15 75 80 135 45S230 15 290 45 355 75 390 40" />
                    <path d="M-20 60C40 30 75 95 135 60S230 30 290 60 355 90 390 55" />
                    <path d="M-20 75C40 45 75 110 135 75S230 45 290 75 355 105 390 70" />
                    <path d="M-20 90C40 60 75 125 135 90S230 60 290 90 355 120 390 85" />
                </g>
            </svg>
        );
    }
    if (variant === "planes") {
        return (
            <svg
                viewBox="0 0 400 240"
                preserveAspectRatio="xMidYMid slice"
                aria-hidden="true"
                focusable="false"
                className={className}
            >
                <rect width="400" height="240" fill="var(--color-paper)" />
                <path d="M150 0H400L250 240H0Z" fill="var(--color-rule)" />
                <path d="M270 0H400L250 240H120Z" fill="#D6D9DE" />
                <path d="M330 0H400L250 240H180Z" fill="#C5CBD2" />
            </svg>
        );
    }
    return (
        <svg aria-hidden="true" focusable="false" className={className}>
            <defs>
                <pattern id="classific-dots" width="16" height="16" patternUnits="userSpaceOnUse">
                    <circle cx="2" cy="2" r="1" fill="var(--color-muted)" opacity=".48" />
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#classific-dots)" />
        </svg>
    );
}
