import { mergePatches, type HeadPatch, type HeadSnapshot } from "@sometic/head";
import {
    createCanonicalLink,
    createOpenGraphPatch,
    createPageSeoPatch,
    createTwitterPatch,
} from "@sometic/head/seo";
import { site } from "@/data/site";
import { toAbsoluteUrl } from "@/lib/seo/urls";
import { buildJsonLdForRoute } from "@/lib/seo/structured-data";
import type { PublicRoute } from "@/content/routes";

export const TITLE_TEMPLATE = `%s | ${site.name}`;

export function buildBaseHeadPatch(): HeadPatch {
    return {
        titleTemplate: TITLE_TEMPLATE,
        htmlAttrs: { lang: site.language },
        meta: [
            { name: "theme-color", content: "#f7f7f4" },
            { name: "color-scheme", content: "light" },
        ],
    };
}

export function buildRouteHeadPatch(origin: string, route: PublicRoute): HeadPatch {
    const canonical = toAbsoluteUrl(origin, route.path);
    const image = toAbsoluteUrl(origin, route.ogImagePath ?? site.defaultOgImagePath);
    const title = route.kind === "home" ? `${site.name}: ${route.title}` : route.title;

    const patches: HeadPatch[] = [
        createPageSeoPatch({
            title,
            description: route.description,
            robots: "index, follow",
            ...(route.kind === "home" ? { titleTemplate: "%s" } : {}),
        }),
        { link: [createCanonicalLink(canonical)] },
        createOpenGraphPatch({
            title,
            description: route.description,
            url: canonical,
            type: route.ogType,
            image,
            siteName: site.name,
            locale: site.locale,
        }),
        createTwitterPatch({
            card: "summary_large_image",
            title,
            description: route.description,
            image,
            ...(site.twitterHandle ? { site: site.twitterHandle } : {}),
        }),
        { jsonLd: buildJsonLdForRoute(origin, route) },
    ];

    return flattenPatches(patches);
}

export function buildNotFoundHeadPatch(): HeadPatch {
    return createPageSeoPatch({
        title: "Page not found",
        description: "The page you requested does not exist.",
        robots: "noindex, nofollow",
    });
}

export function buildHeadSnapshot(origin: string, route: PublicRoute): HeadSnapshot {
    return mergePatches([buildBaseHeadPatch(), buildRouteHeadPatch(origin, route)]);
}

function flattenPatches(patches: HeadPatch[]): HeadPatch {
    const merged: HeadPatch = { meta: [], link: [], jsonLd: [] };
    for (const patch of patches) {
        if (patch.title !== undefined) {
            merged.title = patch.title;
        }
        if (patch.titleTemplate !== undefined) {
            merged.titleTemplate = patch.titleTemplate;
        }
        merged.meta = [...(merged.meta ?? []), ...(patch.meta ?? [])];
        merged.link = [...(merged.link ?? []), ...(patch.link ?? [])];
        merged.jsonLd = [...(merged.jsonLd ?? []), ...(patch.jsonLd ?? [])];
        if (patch.htmlAttrs) {
            merged.htmlAttrs = { ...merged.htmlAttrs, ...patch.htmlAttrs };
        }
        if (patch.bodyAttrs) {
            merged.bodyAttrs = { ...merged.bodyAttrs, ...patch.bodyAttrs };
        }
    }
    return merged;
}
