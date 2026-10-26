import { getPublishedArticles } from "@/data/insights";
import { findPublicRoute } from "@/content/routes";
import type { Breadcrumb } from "@/content/routes";
import type { Article } from "@/types/content";

export type InsightsPageViewModel = {
    articles: Article[];
    breadcrumbs: Breadcrumb[];
    hasArticles: boolean;
};

export function useInsightsPage(loadArticles: () => Article[] = getPublishedArticles): InsightsPageViewModel {
    const articles = loadArticles();
    return {
        articles,
        breadcrumbs: findPublicRoute("/insights")?.breadcrumbs ?? [],
        hasArticles: articles.length > 0,
    };
}
