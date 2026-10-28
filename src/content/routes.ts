import { site } from "@/data/site";
import { services } from "@/data/services";
import { getPublishedProjects } from "@/data/projects";
import { getPublishedArticles } from "@/data/insights";
import { getPublishedBlogPosts } from "@/data/blog";
import { legalDocuments } from "@/data/legal";
import { normalizePath } from "@/lib/seo/urls";

export type RouteKind =
    | "home"
    | "services"
    | "service"
    | "work"
    | "project"
    | "process"
    | "about"
    | "blog"
    | "blog-post"
    | "insights"
    | "article"
    | "contact"
    | "legal";

export type Breadcrumb = {
    label: string;
    path: string;
};

export type PublicRoute = {
    path: string;
    kind: RouteKind;
    title: string;
    description: string;
    ogType: "website" | "article";
    /** ISO date (YYYY-MM-DD) when the underlying content records one. */
    lastmod?: string;
    /** Path of a route-specific Open Graph image. Falls back to the site default. */
    ogImagePath?: string;
    breadcrumbs: Breadcrumb[];
    /** Slug of the underlying content record for detail routes. */
    slug?: string;
};

const home: Breadcrumb = { label: "Home", path: "/" };

export function buildPublicRoutes(): PublicRoute[] {
    const routes: PublicRoute[] = [
        {
            path: "/",
            kind: "home",
            title: site.tagline,
            description: site.description,
            ogType: "website",
            breadcrumbs: [home],
        },
        {
            path: "/services",
            kind: "services",
            title: "Services",
            description:
                "Web, mobile, desktop, CRM/CMS/ERP and custom software development from Classific, a software engineering studio focused on real business challenges.",
            ogType: "website",
            breadcrumbs: [home, { label: "Services", path: "/services" }],
        },
        ...services.map<PublicRoute>((service) => ({
            path: `/services/${service.slug}`,
            kind: "service",
            slug: service.slug,
            title: service.seo.title,
            description: service.seo.description,
            ogType: "website",
            ogImagePath: `/og/services/${service.slug}.png`,
            breadcrumbs: [
                home,
                { label: "Services", path: "/services" },
                { label: service.title, path: `/services/${service.slug}` },
            ],
        })),
        {
            path: "/work",
            kind: "work",
            title: "Work",
            description:
                "Selected projects and case studies from Classific. Published work is shown with verified details only.",
            ogType: "website",
            breadcrumbs: [home, { label: "Work", path: "/work" }],
        },
        ...getPublishedProjects().map<PublicRoute>((project) => ({
            path: `/work/${project.slug}`,
            kind: "project",
            slug: project.slug,
            title: project.seo?.title ?? project.title,
            description: project.seo?.description ?? project.summary,
            ogType: "article",
            lastmod: project.publishedAt,
            ogImagePath: `/og/work/${project.slug}.png`,
            breadcrumbs: [
                home,
                { label: "Work", path: "/work" },
                { label: project.title, path: `/work/${project.slug}` },
            ],
        })),
        {
            path: "/process",
            kind: "process",
            title: "Process",
            description:
                "How Classific works from discovery to launch: stages, collaboration expectations and the deliverables produced at each step.",
            ogType: "website",
            breadcrumbs: [home, { label: "Process", path: "/process" }],
        },
        {
            path: "/about",
            kind: "about",
            title: "About",
            description:
                "Classific's positioning, engineering philosophy and approach to long-term partnership with the businesses it builds software for.",
            ogType: "website",
            breadcrumbs: [home, { label: "About", path: "/about" }],
        },
        {
            path: "/blog",
            kind: "blog",
            title: "Engineering Blog",
            description:
                "Notes and articles on building software that lasts, platform architecture and system maintainability.",
            ogType: "website",
            breadcrumbs: [home, { label: "Blog", path: "/blog" }],
        },
        ...getPublishedBlogPosts().map<PublicRoute>((post) => ({
            path: `/blog/${post.slug}`,
            kind: "blog-post",
            slug: post.slug,
            title: post.title,
            description: post.excerpt,
            ogType: "article",
            lastmod: post.publishedAt,
            breadcrumbs: [
                home,
                { label: "Blog", path: "/blog" },
                { label: post.title, path: `/blog/${post.slug}` },
            ],
        })),
        {
            path: "/insights",
            kind: "insights",
            title: "Insights",
            description:
                "Articles from Classific on software delivery, platform decisions and running products after launch.",
            ogType: "website",
            breadcrumbs: [home, { label: "Insights", path: "/insights" }],
        },
        ...getPublishedArticles().map<PublicRoute>((article) => ({
            path: `/insights/${article.slug}`,
            kind: "article",
            slug: article.slug,
            title: article.seo?.title ?? article.title,
            description: article.seo?.description ?? article.excerpt,
            ogType: "article",
            lastmod: article.updatedAt ?? article.publishedAt,
            ogImagePath: `/og/insights/${article.slug}.png`,
            breadcrumbs: [
                home,
                { label: "Insights", path: "/insights" },
                { label: article.title, path: `/insights/${article.slug}` },
            ],
        })),
        {
            path: "/contact",
            kind: "contact",
            title: "Start a Project",
            description:
                "Tell Classific about your project. Share the challenge, the service you need and how to reach you, and we will respond with next steps.",
            ogType: "website",
            breadcrumbs: [home, { label: "Contact", path: "/contact" }],
        },
        ...legalDocuments.map<PublicRoute>((document) => ({
            path: `/${document.slug}`,
            kind: "legal",
            slug: document.slug,
            title: document.seo.title,
            description: document.seo.description,
            ogType: "website",
            lastmod: document.lastUpdated,
            breadcrumbs: [home, { label: document.title, path: `/${document.slug}` }],
        })),
    ];

    assertUniquePaths(routes);
    return routes;
}

function assertUniquePaths(routes: PublicRoute[]): void {
    const seen = new Set<string>();
    for (const route of routes) {
        if (seen.has(route.path)) {
            throw new Error(`Duplicate public route path: ${route.path}`);
        }
        seen.add(route.path);
    }
}

export function findPublicRoute(pathname: string): PublicRoute | undefined {
    const target = normalizePath(pathname);
    return buildPublicRoutes().find((route) => route.path === target);
}

export function listPublicPaths(): string[] {
    return buildPublicRoutes().map((route) => route.path);
}
