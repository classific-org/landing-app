import type { ArticleBlock } from "@/types/content";

type ArticleBodyProps = {
    blocks: ArticleBlock[];
};

/** Renders typed article blocks as semantic elements. No HTML strings are injected. */
export function ArticleBody({ blocks }: ArticleBodyProps) {
    return (
        <div className="prose-editorial">
            {blocks.map((block, index) => {
                const key = `${block.type}-${index}`;
                if (block.type === "heading") {
                    return block.level === 2 ? (
                        <h2 key={key}>{block.text}</h2>
                    ) : (
                        <h3 key={key}>{block.text}</h3>
                    );
                }
                if (block.type === "list") {
                    return (
                        <ul key={key}>
                            {block.items.map((item) => (
                                <li key={item}>{item}</li>
                            ))}
                        </ul>
                    );
                }
                return <p key={key}>{block.text}</p>;
            })}
        </div>
    );
}
