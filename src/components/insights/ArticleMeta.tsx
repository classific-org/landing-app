import { formatDate, formatReadingTime } from "@/lib/formatting/text";
import type { Article } from "@/types/content";

type ArticleMetaProps = {
    article: Article;
    showAuthor?: boolean;
};

export function ArticleMeta({ article, showAuthor = false }: ArticleMetaProps) {
    return (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-small text-body lg:flex-col lg:items-start">
            <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
            <span aria-hidden="true" className="lg:hidden">
                ·
            </span>
            <span>{formatReadingTime(article.body)}</span>
            {article.categories.length > 0 ? (
                <>
                    <span aria-hidden="true" className="lg:hidden">
                        ·
                    </span>
                    <ul className="flex flex-wrap gap-x-2">
                        {article.categories.map((category) => (
                            <li key={category}>{category}</li>
                        ))}
                    </ul>
                </>
            ) : null}
            {showAuthor ? <span>By {article.author.name}</span> : null}
        </div>
    );
}
