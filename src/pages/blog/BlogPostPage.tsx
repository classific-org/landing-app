import { useParams, Link } from "react-router";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { Section } from "@/components/layout/Section";
import { ClosingCta } from "@/components/layout/ClosingCta";
import { NotFoundPage } from "@/pages/not-found/NotFoundPage";
import { findBlogPostBySlug, getPublishedBlogPosts } from "@/data/blog";

export function BlogPostPage() {
    const { slug } = useParams<{ slug: string }>();
    const post = slug ? findBlogPostBySlug(slug) : undefined;

    if (!post) {
        return <NotFoundPage />;
    }

    const allPosts = getPublishedBlogPosts();
    const relatedPosts = allPosts.filter((p) => p.slug !== post.slug).slice(0, 2);

    const breadcrumbs = [
        { label: "Home", path: "/" },
        { label: "Blog", path: "/blog" },
        { label: post.title, path: `/blog/${post.slug}` },
    ];

    return (
        <div className="relative overflow-x-clip">
            <header className="border-b border-rule bg-paper">
                <div className="container-page py-12 lg:py-16">
                    <div className="mb-8">
                        <Breadcrumbs items={breadcrumbs} />
                    </div>

                    <div className="max-w-4xl">
                        <div className="flex flex-wrap items-center gap-3 font-mono text-[11px] uppercase tracking-[0.1em] text-muted">
                            <span className="rounded-full bg-accent/10 px-3 py-1 font-medium text-accent">
                                {post.category}
                            </span>
                            <span>•</span>
                            <span>{post.publishedAt}</span>
                            <span>•</span>
                            <span>{post.readingTime}</span>
                            <span>•</span>
                            <span>By {post.author.name}</span>
                        </div>

                        <h1 className="mt-6 text-display font-medium tracking-tight text-ink">
                            {post.title}
                        </h1>

                        <p className="mt-6 text-h3 font-normal leading-relaxed text-body">
                            {post.excerpt}
                        </p>
                    </div>

                    <div className="mt-10 overflow-hidden rounded-md border border-rule bg-white shadow-sm">
                        <img
                            src={post.coverImage}
                            alt={post.title}
                            className="aspect-[21/9] w-full object-cover"
                            loading="eager"
                        />
                    </div>
                </div>
            </header>

            <Section tone="white" labelledBy="article-content-title">
                <h2 id="article-content-title" className="sr-only">
                    Article content
                </h2>
                <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
                    <div className="lg:col-span-8 lg:col-start-3">
                        <div className="prose-editorial max-w-none space-y-6">
                            {post.body.map((block, index) => {
                                if (block.type === "paragraph") {
                                    return (
                                        <p key={index} className="text-body-lg leading-relaxed text-body">
                                            {block.text}
                                        </p>
                                    );
                                }
                                if (block.type === "heading") {
                                    return (
                                        <h2
                                            key={index}
                                            className="mt-10 text-h2 font-medium text-ink first:mt-0"
                                        >
                                            {block.text}
                                        </h2>
                                    );
                                }
                                if (block.type === "list") {
                                    return (
                                        <ul
                                            key={index}
                                            className="my-6 space-y-3 rounded-md border border-rule bg-paper/60 p-6"
                                        >
                                            {block.items.map((item, itemIdx) => (
                                                <li
                                                    key={itemIdx}
                                                    className="flex items-start gap-3 text-body-lg text-ink"
                                                >
                                                    <span className="mt-1 text-accent font-mono text-[12px]">
                                                        →
                                                    </span>
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    );
                                }
                                return null;
                            })}
                        </div>

                        {/* Author info box */}
                        <div className="mt-14 rounded-md border border-rule bg-paper p-6 sm:p-8">
                            <div className="flex items-center gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-ink text-paper font-mono text-small font-medium">
                                    CL
                                </div>
                                <div>
                                    <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-muted">
                                        Written by
                                    </p>
                                    <p className="text-h3 font-medium text-ink">
                                        {post.author.name}
                                    </p>
                                </div>
                            </div>
                            <p className="mt-4 text-small text-body leading-relaxed">
                                Classific is a software engineering studio that designs and builds web, mobile, desktop and enterprise systems for businesses with complex workflows.
                            </p>
                        </div>
                    </div>
                </div>
            </Section>

            {/* Related articles */}
            {relatedPosts.length > 0 ? (
                <Section tone="paper" labelledBy="related-posts-title">
                    <div className="flex items-center justify-between border-b border-rule pb-6 mb-8">
                        <h2 id="related-posts-title" className="eyebrow text-ink">
                            More from the blog
                        </h2>
                        <Link
                            to="/blog"
                            className="font-mono text-[11px] uppercase tracking-[0.1em] text-ink hover:text-accent"
                        >
                            All articles →
                        </Link>
                    </div>

                    <div className="grid gap-8 sm:grid-cols-2">
                        {relatedPosts.map((related) => (
                            <article
                                key={related.slug}
                                className="group overflow-hidden rounded-md border border-rule bg-white p-6 shadow-xs transition-all duration-300 hover:border-ink-soft/40 hover:shadow-lg"
                            >
                                <div className="relative aspect-[16/10] overflow-hidden rounded border border-rule bg-paper">
                                    <img
                                        src={related.coverImage}
                                        alt={related.title}
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        loading="lazy"
                                    />
                                    <span className="absolute left-3 top-3 rounded-full bg-paper/90 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-ink backdrop-blur-xs">
                                        {related.category}
                                    </span>
                                </div>

                                <div className="mt-4 font-mono text-[11px] uppercase tracking-[0.08em] text-muted">
                                    <span>{related.publishedAt}</span> • <span>{related.readingTime}</span>
                                </div>

                                <h3 className="mt-2 text-h3 font-medium text-ink transition-colors group-hover:text-accent">
                                    <Link to={`/blog/${related.slug}`}>
                                        {related.title}
                                    </Link>
                                </h3>

                                <p className="mt-3 text-body-lg text-body line-clamp-2">
                                    {related.excerpt}
                                </p>
                            </article>
                        ))}
                    </div>
                </Section>
            ) : null}

            <ClosingCta />
        </div>
    );
}
