import { Reveal } from "@/components/motion/Reveal";

type BulletListProps = {
    items: string[];
    columns?: 1 | 2;
    numbered?: boolean;
    /** "dark" for ink folds. */
    tone?: "light" | "dark";
};

/** Open list separated by hairline rules, used for problems, use cases and deliverables. */
export function BulletList({
    items,
    columns = 1,
    numbered = false,
    tone = "light",
}: BulletListProps) {
    const Tag = numbered ? "ol" : "ul";
    const dark = tone === "dark";
    return (
        <Tag
            className={[
                dark ? "border-t border-paper/40" : "border-t border-ink",
                columns === 2 ? "sm:grid sm:grid-cols-2 sm:gap-x-8" : "",
            ]
                .filter(Boolean)
                .join(" ")}
        >
            {items.map((item, index) => (
                <Reveal
                    as="li"
                    key={item}
                    delay={Math.min(index, 5) * 60}
                    className={`flex gap-5 border-b py-5 text-body-lg ${
                        dark ? "border-paper/15 text-paper" : "border-rule text-ink"
                    }`}
                >
                    <span
                        className={`mt-[0.35em] w-6 flex-none font-mono text-[12px] tabular-nums ${
                            dark ? "text-paper/50" : "text-muted"
                        }`}
                        aria-hidden="true"
                    >
                        {numbered ? (index + 1).toString().padStart(2, "0") : "—"}
                    </span>
                    <span>{item}</span>
                </Reveal>
            ))}
        </Tag>
    );
}
