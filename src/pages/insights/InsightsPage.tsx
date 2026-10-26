import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/layout/Section";
import { ClosingCta } from "@/components/layout/ClosingCta";
import { ArticleCard } from "@/components/insights/ArticleCard";
import { useInsightsPage } from "@/pages/insights/InsightsPage.hooks";

export function InsightsPage() {
    const { articles, breadcrumbs, hasArticles } = useInsightsPage();

    return (
        <>
            <PageHero
                eyebrow="Insights"
                title="Notes on building software that lasts."
                copy="Short, practical articles on discovery, platform decisions, delivery and what happens after launch."
                breadcrumbs={breadcrumbs}
            />

            <Section labelledBy="articles-title" tone="white">
                <h2 id="articles-title" className="eyebrow mb-8">
                    {hasArticles ? "All articles" : "Articles"}
                </h2>
                {hasArticles ? (
                    <div className="border-b border-rule">
                        {articles.map((article) => (
                            <ArticleCard key={article.slug} article={article} headingLevel="h3" />
                        ))}
                    </div>
                ) : (
                    <div className="border-y border-rule py-12" role="status">
                        <p className="text-h3">No articles published yet.</p>
                        <p className="mt-4 max-w-xl text-body text-body">
                            New articles appear here as they are published.
                        </p>
                    </div>
                )}
            </Section>

            <ClosingCta
                headline="Want to talk through a decision?"
                copy="We are happy to discuss platform choices, process or an upcoming project."
                primaryLabel="Get in touch"
            />
        </>
    );
}
