import { Link } from "react-router";
import { Icon } from "@/components/ui/Icon";

type ButtonLinkProps = {
    to: string;
    children: React.ReactNode;
    variant?: "primary" | "secondary" | "inverse" | "ghost-inverse";
    withArrow?: boolean;
    className?: string;
    onClick?: React.MouseEventHandler<HTMLAnchorElement>;
};

const variantClass: Record<NonNullable<ButtonLinkProps["variant"]>, string> = {
    primary: "btn-primary",
    secondary: "btn-secondary",
    inverse: "btn-inverse",
    "ghost-inverse": "btn-ghost-inverse",
};

export function ButtonLink({
    to,
    children,
    variant = "primary",
    withArrow = false,
    className,
    onClick,
}: ButtonLinkProps) {
    const classes = ["btn", variantClass[variant], className].filter(Boolean).join(" ");
    const external = /^https?:\/\//.test(to);
    if (external) {
        return (
            <a
                href={to}
                className={classes}
                rel="noopener noreferrer"
                target="_blank"
                onClick={onClick}
            >
                {children}
                {withArrow ? <Icon name="arrow-right" className="h-4 w-4" /> : null}
            </a>
        );
    }
    return (
        <Link to={to} className={classes} onClick={onClick}>
            {children}
            {withArrow ? <Icon name="arrow-right" className="h-4 w-4" /> : null}
        </Link>
    );
}
