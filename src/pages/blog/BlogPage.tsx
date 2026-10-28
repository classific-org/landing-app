import { useState } from "react";
import { Link } from "react-router";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/layout/Section";
import { ClosingCta } from "@/components/layout/ClosingCta";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/motion/Reveal";
import { getPublishedBlogPosts } from "@/data/blog";

const categories = ["All", "Architecture", "Engineering", "Process", "Strategy"] as const;

export function BlogPage() {
    const posts = getPublishedBlogPosts();
    const [selectedCategory, setSelectedCategory] = useState<string>("All");

    const filteredPosts =
        selectedCategory === "All"
            ? posts
            : posts.filter(
                  (post) =>
                      post.category === selectedCategory ||
                      post.categories?.includes(selectedCategory),
              );

    const featuredPost = posts.find((p) => p.featured) ?? posts[0];
    const regularPosts = filteredPosts.filter((p) => p.slug !== featuredPost.slug);

    const breadcrumbs = [
        { label: "Home", path: "/" },
        { label: "Blog", path: "/blog" },
    ];

    return (
        <div className="relative overflow-x-clip">
            <PageHero
                eyebrow="Engineering Blog"
                title="Notes on building software that lasts."
                copy="Practical perspectives on software architecture, platform decisions, and maintaining high-scale systems."
                breadcrumbs={breadcrumbs}
            />

            {/* Category Filter Bar */}
            <Section tone="white" labelledBy="blog-filter-heading">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between border-b border-rule pb-8">
                    <div>
                        <h2 id="blog-filter-heading" className="eyebrow text-ink">
                            Filter by topic
                        </h2>
                        <p className="mt-1 text-small text-body">
                            Showing {filteredPosts.length} {filteredPosts.length === 1 ? "article" : "articles"}
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {categories.map((category) => {
                            const isSelected = selectedCategory === category;
                            return (
                                <button
                                    key={category}
                                    type="button"
                                    onClick={() => setSelectedCategory(category)}
                                    className={`rounded-full px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.1em] transition-all duration-200 ${
                                        isSelected
                                            ? "bg-ink text-paper shadow-sm"
                                            : "border border-rule bg-paper text-body hover:border-ink hover:text-ink"
                                    }`}
                                >
                                    {category}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Featured Post (shown if All or matches category) */}
                {selectedCategory === "All" || featuredPost.category === selectedCategory ? (
                    <Reveal className="mt-12">
                        <article className="group relative grid gap-8 overflow-hidden rounded-md border border-rule bg-paper/50 p-6 transition-all duration-300 hover:border-ink-soft/40 hover:shadow-lg lg:grid-cols-12 lg:p-8">
                            <div className="relative aspect-[16/10] overflow-hidden rounded border border-rule bg-paper lg:col-span-6">
                                <img
                                    src={featuredPost.coverImage}
                                    alt={featuredPost.title}
                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    loading="eager"
                                />
                                <span className="absolute left-3 top-3 rounded-full bg-accent px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-white">
                                    Featured Article
                                </span>
                            </div>

                            <div className="flex flex-col justify-between lg:col-span-6">
                                <div>
                                    <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.1em] text-muted">
                                        <span className="text-accent font-medium">
                                            {featuredPost.category}
                                        </span>
                                        <span>•</span>
                                        <span>{featuredPost.readingTime}</span>
                                        <span>•</span>
                                        <span>{featuredPost.publishedAt}</span>
                                    </div>

                                    <h3 className="mt-4 text-h2 font-medium text-ink transition-colors group-hover:text-accent">
                                        <Link to={`/blog/${featuredPost.slug}`} className="after:absolute after:inset-0">
                                            {featuredPost.title}
                                        </Link>
                                    </h3>

                                    <p className="mt-4 text-body leading-relaxed text-body">
                                        {featuredPost.excerpt}
                                    </p>
                                </div>

                                <div className="mt-8 flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.1em] text-ink font-medium">
                                    <span>Read article</span>
                                    <Icon
                                        name="arrow-right"
                                        className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                                    />
                                </div>
                            </div>
                        </article>
                    </Reveal>
                ) : null}

                {/* Grid of regular articles */}
                <div className="mt-16">
                    <h3 className="eyebrow mb-8 text-ink">Recent publications</h3>
                    {regularPosts.length > 0 ? (
                        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                            {regularPosts.map((post, index) => (
                                <Reveal
                                    key={post.slug}
                                    delay={index * 60}
                                    className="group flex flex-col justify-between overflow-hidden rounded-md border border-rule bg-white p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-ink-soft/40 hover:shadow-lg"
                                >
                                    <div>
                                        <div className="relative aspect-[16/10] overflow-hidden rounded border border-rule bg-paper">
                                            <img
                                                src={post.coverImage}
                                                alt={post.title}
                                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                loading="lazy"
                                            />
                                            <span className="absolute left-3 top-3 rounded-full bg-paper/90 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-ink backdrop-blur-xs">
                                                {post.category}
                                            </span>
                                        </div>

                                        <div className="mt-5 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.08em] text-muted">
                                            <span>{post.publishedAt}</span>
                                            <span>•</span>
                                            <span>{post.readingTime}</span>
                                        </div>

                                        <h4 className="mt-3 text-h3 font-medium text-ink transition-colors group-hover:text-accent">
                                            <Link to={`/blog/${post.slug}`}>
                                                {post.title}
                                            </Link>
                                        </h4>

                                        <p className="mt-3 text-body-lg text-body line-clamp-3">
                                            {post.excerpt}
                                        </p>
                                    </div>

                                    <div className="mt-6 flex items-center gap-2 border-t border-rule pt-4 font-mono text-[11px] uppercase tracking-[0.1em] text-ink">
                                        <span>Read article</span>
                                        <Icon
                                            name="arrow-right"
                                            className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1"
                                        />
                                    </div>
                                </Reveal>
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-md border border-rule bg-paper/60 p-12 text-center">
                            <p className="text-h3 font-medium text-ink">
                                No articles in this category yet.
                            </p>
                            <p className="mt-2 text-body">
                                Try selecting "All" to view all recent engineering posts.
                            </p>
                        </div>
                    )}
                </div>
            </Section>

            <ClosingCta
                headline="Want to talk through an architecture challenge?"
                copy="We are happy to review platform decisions, technical trade-offs, or an upcoming build."
                primaryLabel="Start a Project"
                secondaryLabel="Explore services"
                secondaryTo="/services"
            />
        </div>
    );
}
