import { Link } from "react-router";
import { Icon } from "@/components/ui/Icon";

type TextLinkProps = {
    to: string;
    children: React.ReactNode;
    variant?: "underline" | "arrow";
    className?: string;
};

export function TextLink({ to, children, variant = "underline", className }: TextLinkProps) {
    const classes = [variant === "arrow" ? "arrow-link" : "text-link", className]
        .filter(Boolean)
        .join(" ");
    const external = /^https?:\/\//.test(to);
    const content = (
        <>
            <span>{children}</span>
            {variant === "arrow" ? <Icon name="arrow-right" /> : null}
        </>
    );
    if (external) {
        return (
            <a href={to} className={classes} rel="noopener noreferrer" target="_blank">
                {content}
            </a>
        );
    }
    return (
        <Link to={to} className={classes}>
            {content}
        </Link>
    );
}
