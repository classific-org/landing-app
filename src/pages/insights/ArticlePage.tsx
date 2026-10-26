import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { ClosingCta } from "@/components/layout/ClosingCta";
import { Eyebrow } from "@/components/layout/Eyebrow";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { ArticleMeta } from "@/components/insights/ArticleMeta";
import { ArticleBody } from "@/components/insights/ArticleBody";
import { ArticleCard } from "@/components/insights/ArticleCard";
import { NotFoundPage } from "@/pages/not-found/NotFoundPage";
import { useArticlePage } from "@/pages/insights/ArticlePage.hooks";

export function ArticlePage() {
    const model = useArticlePage();

    if (model.status === "missing") {
        return <NotFoundPage />;
    }

    const { article, relatedArticles, breadcrumbs } = model;

    return (
        <>
            <article>
                <header className="border-b border-rule bg-paper">
                    <Container className="py-14 lg:py-24">
                        <div className="mb-8">
                            <Breadcrumbs items={breadcrumbs} />
                        </div>
                        <div className="max-w-3xl">
                            <Eyebrow className="mb-5">{article.categories.join(" · ")}</Eyebrow>
                            <h1 className="text-h1">{article.title}</h1>
                            <p className="mt-8 text-body-lg text-body">{article.excerpt}</p>
                            <div className="mt-8">
                                <ArticleMeta article={article} showAuthor />
                            </div>
                        </div>
                    </Container>
                </header>

                {article.coverImage ? (
                    <div className="border-b border-rule bg-white">
                        <Container className="py-10 lg:py-16">
                            <img
                                src={article.coverImage.src}
                                alt={article.coverImage.alt}
                                width={article.coverImage.width}
                                height={article.coverImage.height}
                                className="aspect-[3/2] w-full rounded-sm object-cover"
                            />
                        </Container>
                    </div>
                ) : null}

                <div className="border-b border-rule bg-white">
                    <Container className="section-y">
                        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
                            <div className="lg:col-span-7 lg:col-start-3">
                                <ArticleBody blocks={article.body} />
                                {article.updatedAt ? (
                                    <p className="mt-12 border-t border-rule pt-4 text-small text-body">
                                        Updated <time dateTime={article.updatedAt}>{article.updatedAt}</time>
                                    </p>
                                ) : null}
                            </div>
                        </div>
                    </Container>
                </div>
            </article>

            {relatedArticles.length > 0 ? (
                <Section labelledBy="related-articles-title" tone="paper">
                    <SectionHeading id="related-articles-title" eyebrow="Related" title="More insights." />
                    <div className="mt-10 border-b border-rule">
                        {relatedArticles.map((related) => (
                            <ArticleCard key={related.slug} article={related} headingLevel="h3" />
                        ))}
                    </div>
                </Section>
            ) : null}

            <ClosingCta />
        </>
    );
}
