import { RichText } from "@/components/blog/RichText";
import type { ArticleBlock } from "@/types/content";

/** Renders an article's blocks in the site's editorial style. */
export function ArticleBody({ blocks }: { blocks: ArticleBlock[] }) {
    return (
        <div className="prose-editorial max-w-none space-y-6">
            {blocks.map((block, index) => {
                if (block.type === "paragraph") {
                    return (
                        <p key={index} className="text-body-lg leading-relaxed text-body">
                            <RichText runs={block.inline} fallback={block.text} />
                        </p>
                    );
                }
                if (block.type === "heading") {
                    const Heading = block.level === 3 ? "h3" : "h2";
                    return (
                        <Heading
                            key={index}
                            className={
                                block.level === 3
                                    ? "mt-8 text-h3 font-medium text-ink first:mt-0"
                                    : "mt-10 text-h2 font-medium text-ink first:mt-0"
                            }
                        >
                            {block.text}
                        </Heading>
                    );
                }
                if (block.type === "list") {
                    const List = block.ordered ? "ol" : "ul";
                    return (
                        <List
                            key={index}
                            className="my-6 space-y-3 rounded-md border border-rule bg-paper/60 p-6"
                        >
                            {block.items.map((item, itemIdx) => (
                                <li
                                    key={itemIdx}
                                    className="flex items-start gap-3 text-body-lg text-ink"
                                >
                                    <span
                                        className="mt-1 font-mono text-[12px] text-accent"
                                        aria-hidden="true"
                                    >
                                        {block.ordered
                                            ? `${String(itemIdx + 1).padStart(2, "0")}`
                                            : "→"}
                                    </span>
                                    <span>
                                        <RichText
                                            runs={block.itemsInline?.[itemIdx]}
                                            fallback={item}
                                        />
                                    </span>
                                </li>
                            ))}
                        </List>
                    );
                }
                if (block.type === "image") {
                    return (
                        <figure key={index} className="my-8">
                            <img
                                src={block.src}
                                alt={block.alt}
                                width={block.width}
                                height={block.height}
                                loading="lazy"
                                decoding="async"
                                className="w-full rounded-md border border-rule"
                            />
                            {block.caption ? (
                                <figcaption className="mt-3 text-small text-muted">
                                    {block.caption}
                                </figcaption>
                            ) : null}
                        </figure>
                    );
                }
                return null;
            })}
        </div>
    );
}
