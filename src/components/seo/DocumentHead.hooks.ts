import { useMemo } from "react";
import { useLocation } from "react-router";
import { useHead } from "@sometic/react/head";
import type { HeadPatch } from "@sometic/head";
import { findPublicRoute } from "@/content/routes";
import { buildNotFoundHeadPatch, buildRouteHeadPatch } from "@/lib/seo/head";
import { env } from "@/config/env";

export function resolveHeadPatchForPath(pathname: string, origin: string): HeadPatch {
    const route = findPublicRoute(pathname);
    return route ? buildRouteHeadPatch(origin, route) : buildNotFoundHeadPatch();
}

/**
 * Applies route metadata to the document head on the client. Prerendering serializes the
 * same patch from the route table so crawlers receive identical metadata.
 */
export function useDocumentHead(): void {
    const { pathname } = useLocation();
    const patch = useMemo(
        () => resolveHeadPatchForPath(pathname, `${env.siteOrigin}${env.basePath}`),
        [pathname],
    );
    useHead(patch);
}
