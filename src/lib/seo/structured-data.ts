import type { HeadJsonLd } from "@sometic/head";
import { site } from "@/data/site";
import { getServiceBySlug } from "@/data/services";
import { getPublishedArticleBySlug } from "@/data/insights";
import { toAbsoluteUrl } from "@/lib/seo/urls";
import type { PublicRoute } from "@/content/routes";

type JsonLdObject = Record<string, unknown>;

function compact(object: JsonLdObject): JsonLdObject {
    return Object.fromEntries(
        Object.entries(object).filter(([, value]) => {
            if (value === undefined || value === null || value === "") {
                return false;
            }
            if (Array.isArray(value)) {
                return value.length > 0;
            }
            return true;
        }),
    );
}

export function buildOrganizationJsonLd(origin: string): JsonLdObject {
    return compact({
        "@context": "https://schema.org",
        "@type": "Organization",
        name: site.name,
        url: toAbsoluteUrl(origin, "/"),
        logo: toAbsoluteUrl(origin, "/favicon.svg"),
        description: site.description,
        email: site.contact.email,
        telephone: site.contact.phone,
        sameAs: site.social.map((entry) => entry.href),
    });
}

export function buildWebSiteJsonLd(origin: string): JsonLdObject {
    return {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: site.name,
        url: toAbsoluteUrl(origin, "/"),
        inLanguage: site.language,
    };
}

export function buildBreadcrumbJsonLd(origin: string, route: PublicRoute): JsonLdObject {
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: route.breadcrumbs.map((crumb, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: crumb.label,
            item: toAbsoluteUrl(origin, crumb.path),
        })),
    };
}

export function buildServiceJsonLd(origin: string, route: PublicRoute): JsonLdObject | undefined {
    const service = route.slug ? getServiceBySlug(route.slug) : undefined;
    if (!service) {
        return undefined;
    }
    return {
        "@context": "https://schema.org",
        "@type": "Service",
        name: service.title,
        description: service.seo.description,
        url: toAbsoluteUrl(origin, route.path),
        serviceType: service.title,
        provider: {
            "@type": "Organization",
            name: site.name,
            url: toAbsoluteUrl(origin, "/"),
        },
    };
}

export function buildArticleJsonLd(origin: string, route: PublicRoute): JsonLdObject | undefined {
    const article = route.slug ? getPublishedArticleBySlug(route.slug) : undefined;
    if (!article) {
        return undefined;
    }
    return compact({
        "@context": "https://schema.org",
        "@type": "Article",
        headline: article.title,
        description: article.excerpt,
        url: toAbsoluteUrl(origin, route.path),
        mainEntityOfPage: toAbsoluteUrl(origin, route.path),
        datePublished: article.publishedAt,
        dateModified: article.updatedAt ?? article.publishedAt,
        image: toAbsoluteUrl(origin, article.coverImage?.src ?? site.defaultOgImagePath),
        author: { "@type": "Organization", name: article.author.name },
        publisher: {
            "@type": "Organization",
            name: site.name,
            url: toAbsoluteUrl(origin, "/"),
        },
        keywords: article.categories,
        inLanguage: site.language,
    });
}

export function buildJsonLdForRoute(origin: string, route: PublicRoute): HeadJsonLd[] {
    const payloads: JsonLdObject[] = [];
    if (route.kind === "home") {
        payloads.push(buildOrganizationJsonLd(origin), buildWebSiteJsonLd(origin));
    }
    if (route.breadcrumbs.length > 1) {
        payloads.push(buildBreadcrumbJsonLd(origin, route));
    }
    const service = buildServiceJsonLd(origin, route);
    if (service) {
        payloads.push(service);
    }
    const article = buildArticleJsonLd(origin, route);
    if (article) {
        payloads.push(article);
    }
    return payloads.map((data) => ({ data }));
}
