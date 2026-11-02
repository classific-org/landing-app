import { Fragment, type ReactNode } from "react";
import { Link } from "react-router";
import type { InlineRun } from "@/types/content";

const isExternal = (href: string) => /^(https?:)?\/\//i.test(href);

/** Text with the formatting an author applied: bold, italic and links. */
export function RichText({ runs, fallback }: { runs?: InlineRun[]; fallback: string }) {
    if (!runs || runs.length === 0) {
        return <>{fallback}</>;
    }
    return (
        <>
            {runs.map((run, index) => {
                let node: ReactNode = run.text;
                if (run.bold) node = <strong className="font-semibold text-ink">{node}</strong>;
                if (run.italic) node = <em>{node}</em>;
                if (run.href) {
                    node = isExternal(run.href) ? (
                        <a
                            href={run.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-link"
                        >
                            {node}
                        </a>
                    ) : run.href.startsWith("/") ? (
                        <Link to={run.href} className="text-link">
                            {node}
                        </Link>
                    ) : (
                        <a href={run.href} className="text-link">
                            {node}
                        </a>
                    );
                }
                return <Fragment key={index}>{node}</Fragment>;
            })}
        </>
    );
}
