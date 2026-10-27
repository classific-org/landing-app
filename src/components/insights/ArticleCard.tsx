import { Link } from "react-router";
import { Icon } from "@/components/ui/Icon";
import { ArticleMeta } from "@/components/insights/ArticleMeta";
import type { Article } from "@/types/content";

type ArticleCardProps = {
    article: Article;
    headingLevel?: "h2" | "h3";
};

export function ArticleCard({ article, headingLevel = "h3" }: ArticleCardProps) {
    const Heading = headingLevel;
    const href = `/insights/${article.slug}`;
    return (
        <article className="grid gap-4 border-t border-rule py-8 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-3">
                <ArticleMeta article={article} />
            </div>
            <div className="lg:col-span-7">
                <Heading className="text-h3">
                    <Link to={href} className="transition-colors hover:text-body">
                        {article.title}
                    </Link>
                </Heading>
                <p className="mt-3 text-body text-body">{article.excerpt}</p>
            </div>
            <div className="lg:col-span-2 lg:text-right">
                <Link
                    to={href}
                    className="arrow-link text-small"
                    aria-label={`Read: ${article.title}`}
                >
                    <span>Read</span>
                    <Icon name="arrow-right" />
                </Link>
            </div>
        </article>
    );
}
