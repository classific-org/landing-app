import { describe, expect, it } from "vitest";
import { resolveArticlePage } from "@/pages/insights/ArticlePage.hooks";

describe("article page model", () => {
    it("resolves published essays and hides the draft", () => {
        const ready = resolveArticlePage("what-discovery-actually-decides");
        expect(ready.status).toBe("ready");
        if (ready.status === "ready") {
            expect(ready.article.author.name).toBe("Classific");
            expect(ready.relatedArticles.length).toBeGreaterThan(0);
        }
        expect(resolveArticlePage("draft-measuring-engineering-outcomes")).toEqual({ status: "missing" });
        expect(resolveArticlePage(undefined)).toEqual({ status: "missing" });
    });
});
