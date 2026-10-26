import { Link } from "react-router";
import { Breadcrumb, BreadcrumbItem } from "@sometic/react/structure";
import type { Breadcrumb as Crumb } from "@/content/routes";

type BreadcrumbsProps = {
    items: Crumb[];
    tone?: "default" | "inverse";
};

export function Breadcrumbs({ items, tone = "default" }: BreadcrumbsProps) {
    if (items.length < 2) {
        return null;
    }
    return (
        <Breadcrumb
            aria-label="Breadcrumb"
            className={["breadcrumb", tone === "inverse" ? "breadcrumb-inverse" : ""]
                .filter(Boolean)
                .join(" ")}
        >
            {items.map((item, index) => {
                const current = index === items.length - 1;
                return (
                    <BreadcrumbItem key={item.path} current={current}>
                        {current ? (
                            <span>{item.label}</span>
                        ) : (
                            <Link to={item.path}>{item.label}</Link>
                        )}
                    </BreadcrumbItem>
                );
            })}
        </Breadcrumb>
    );
}
