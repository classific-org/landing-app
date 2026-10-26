type BulletListProps = {
    items: string[];
    columns?: 1 | 2;
    numbered?: boolean;
};

/** Open list separated by hairline rules, used for problems, use cases and deliverables. */
export function BulletList({ items, columns = 1, numbered = false }: BulletListProps) {
    const Tag = numbered ? "ol" : "ul";
    return (
        <Tag
            className={[
                "border-t border-rule",
                columns === 2 ? "sm:grid sm:grid-cols-2 sm:gap-x-8" : "",
            ]
                .filter(Boolean)
                .join(" ")}
        >
            {items.map((item, index) => (
                <li key={item} className="flex gap-4 border-b border-rule py-4 text-body text-body">
                    <span className="mt-[0.2em] text-small tabular-nums text-body" aria-hidden="true">
                        {numbered ? (index + 1).toString().padStart(2, "0") : "—"}
                    </span>
                    <span>{item}</span>
                </li>
            ))}
        </Tag>
    );
}
