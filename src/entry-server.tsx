import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import { createStaticHandler, createStaticRouter, StaticRouterProvider } from "react-router";
import { serializeHead, mergePatches } from "@sometic/head";
import { App } from "@/app/App";
import { routes } from "@/app/routes";
import { createSiteHeadController } from "@/app/head-controller";
import { buildBaseHeadPatch } from "@/lib/seo/head";
import { resolveHeadPatchForPath } from "@/components/seo/DocumentHead.hooks";
import { buildPublicRoutes } from "@/content/routes";

export type RenderResult = {
    html: string;
    head: string;
    htmlAttrs: Record<string, string>;
    statusCode: number;
};

/**
 * Renders a single pathname to static HTML with the serialized document head.
 * Used by scripts/prerender.mjs after the client build.
 */
export async function render(
    pathname: string,
    origin: string,
    basePath = "",
): Promise<RenderResult> {
    const handler = createStaticHandler(routes, { basename: basePath || undefined });
    const request = new Request(new URL(`${basePath}${pathname}`, origin));
    const context = await handler.query(request);

    if (context instanceof Response) {
        throw new Error(`Unexpected redirect while prerendering ${pathname}`);
    }

    const router = createStaticRouter(handler.dataRoutes, context);
    const headController = createSiteHeadController();

    const html = renderToString(
        <StrictMode>
            <App headController={headController} applyHead={false}>
                <StaticRouterProvider router={router} context={context} hydrate={false} />
            </App>
        </StrictMode>,
    );

    const snapshot = mergePatches([
        buildBaseHeadPatch(),
        resolveHeadPatchForPath(pathname, `${origin}${basePath}`),
    ]);
    const statusCode =
        context.statusCode === 200 && !isKnownPath(pathname) ? 404 : context.statusCode;

    return {
        html,
        head: serializeHead(snapshot),
        htmlAttrs: snapshot.htmlAttrs,
        statusCode,
    };
}

export function listPrerenderPaths(): string[] {
    return buildPublicRoutes().map((route) => route.path);
}

function isKnownPath(pathname: string): boolean {
    return buildPublicRoutes().some((route) => route.path === pathname);
}
