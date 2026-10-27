import { buildPublicRoutes, type PublicRoute } from "@/content/routes";
import { toAbsoluteUrl } from "@/lib/seo/urls";

export type SitemapEntry = {
    loc: string;
    lastmod?: string;
};

export function buildSitemapEntries(
    origin: string,
    routes: PublicRoute[] = buildPublicRoutes(),
): SitemapEntry[] {
    return routes.map((route) => ({
        loc: toAbsoluteUrl(origin, route.path),
        ...(route.lastmod ? { lastmod: route.lastmod } : {}),
    }));
}

function escapeXml(value: string): string {
    return value
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&apos;");
}

export function buildSitemapXml(
    origin: string,
    routes: PublicRoute[] = buildPublicRoutes(),
): string {
    const urls = buildSitemapEntries(origin, routes)
        .map((entry) => {
            const lastmod = entry.lastmod
                ? `\n        <lastmod>${escapeXml(entry.lastmod)}</lastmod>`
                : "";
            return `    <url>\n        <loc>${escapeXml(entry.loc)}</loc>${lastmod}\n    </url>`;
        })
        .join("\n");

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}
