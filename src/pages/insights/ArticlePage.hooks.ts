import { useParams } from "react-router";
import { getPublishedArticleBySlug, getRelatedArticles } from "@/data/insights";
import { findPublicRoute } from "@/content/routes";
import type { Breadcrumb } from "@/content/routes";
import type { Article } from "@/types/content";

export type ArticlePageViewModel =
    | { status: "missing" }
    | {
          status: "ready";
          article: Article;
          relatedArticles: Article[];
          breadcrumbs: Breadcrumb[];
      };

export function resolveArticlePage(
    slug: string | undefined,
    lookup: (slug: string) => Article | undefined = getPublishedArticleBySlug,
): ArticlePageViewModel {
    const article = slug ? lookup(slug) : undefined;
    if (!article) {
        return { status: "missing" };
    }
    return {
        status: "ready",
        article,
        relatedArticles: getRelatedArticles(article),
        breadcrumbs: findPublicRoute(`/insights/${article.slug}`)?.breadcrumbs ?? [],
    };
}

export function useArticlePage(): ArticlePageViewModel {
    const { slug } = useParams<{ slug: string }>();
    return resolveArticlePage(slug);
}
