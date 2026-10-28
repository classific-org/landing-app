import newLogo from "@/assets/logos/logo (9).png";
import logoDark from "@/assets/logos/logo-dark.png";

type WordmarkProps = {
    className?: string;
    /** Use "paper" on dark surfaces. */
    tone?: "ink" | "paper";
    variant?: "chrome" | "dark" | "auto";
};

/**
 * Classific brand mark using the official logo asset with chrome/faceted "C"
 * and precision typography.
 */
export function Wordmark({
    className = "h-8 w-auto",
    tone = "ink",
    variant = "chrome",
}: WordmarkProps) {
    const useDark = variant === "dark" || (variant === "auto" && tone === "paper");
    const src = useDark ? logoDark : newLogo;

    return <img src={src} alt="Classific" className={className} loading="eager" decoding="async" />;
}
