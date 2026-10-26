import { describe, expect, it } from "vitest";
import {
    articles,
    getPublishedArticleBySlug,
    getPublishedArticles,
    getRelatedArticles,
} from "@/data/insights";

describe("insight records", () => {
    it("exposes three published essays and keeps the draft unpublished", () => {
        expect(articles.some((article) => article.slug === "draft-measuring-engineering-outcomes")).toBe(true);
        const published = getPublishedArticles();
        expect(published).toHaveLength(3);
        expect(published.every((article) => article.status === "published")).toBe(true);
        expect(published.every((article) => article.author.name === "Classific")).toBe(true);
        expect(getPublishedArticleBySlug("draft-measuring-engineering-outcomes")).toBeUndefined();
        expect(getPublishedArticleBySlug("what-discovery-actually-decides")?.title).toBe(
            "What discovery actually decides",
        );
    });

    it("prefers related articles that share a category", () => {
        const article = getPublishedArticleBySlug("what-discovery-actually-decides");
        expect(article).toBeDefined();
        const related = getRelatedArticles(article!, 2);
        expect(related).toHaveLength(2);
        expect(related.some((item) => item.categories.includes("Process"))).toBe(true);
        expect(related.every((item) => item.slug !== article!.slug)).toBe(true);
    });
});
