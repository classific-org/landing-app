import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { normalizeBasePath, requireProductionOrigin } from "./lib/origin.mjs";
import { withViteSsr } from "./vite-ssr.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function htmlAttributes(attrs) {
    const pairs = Object.entries(attrs)
        .filter(([, value]) => value !== undefined && value !== "")
        .map(([name, value]) => `${name}="${String(value).replaceAll('"', "&quot;")}"`);
    return pairs.length > 0 ? ` ${pairs.join(" ")}` : "";
}

/**
 * Server rendering runs on the dev pipeline, where an imported image resolves to its source path
 * (/src/assets/logos/logo.png). That file does not exist in the build, so each such URL is
 * swapped for the hashed file the build emitted, found through Vite's manifest.
 */
function builtAssetResolver(manifest, basePath) {
    const prefix = `${basePath}/src/assets/`;
    return (html) => {
        let out = "";
        let from = 0;
        for (let at = html.indexOf(prefix); at !== -1; at = html.indexOf(prefix, from)) {
            let end = at + prefix.length;
            // A ")" ends the URL only when it closes a "url(" around it, not one inside the name.
            let open = 0;
            while (end < html.length && !/["'\s,<>]/.test(html[end])) {
                if (html[end] === "(") {
                    open += 1;
                } else if (html[end] === ")" && (open -= 1) < 0) {
                    break;
                }
                end += 1;
            }
            const source = `src/assets/${decodeURIComponent(html.slice(at + prefix.length, end))}`;
            const entry = manifest[source];
            out += html.slice(from, at);
            out += entry ? `${basePath}/${encodeURI(entry.file)}` : html.slice(at, end);
            from = end;
        }
        return out + html.slice(from);
    };
}

function outputFileForPath(outDir, pathname) {
    if (pathname === "/") {
        return path.join(outDir, "index.html");
    }
    if (pathname === "/404") {
        return path.join(outDir, "404.html");
    }
    return path.join(outDir, pathname.replace(/^\//, ""), "index.html");
}

export async function prerenderRoutes({
    origin = requireProductionOrigin(process.env.SITE_ORIGIN),
    basePath = normalizeBasePath(process.env.SITE_BASE),
    outDir = path.join(root, "dist"),
} = {}) {
    const template = await readFile(path.join(outDir, "index.html"), "utf8");
    const manifestFile = path.join(outDir, ".vite", "manifest.json");
    const manifest = JSON.parse(await readFile(manifestFile, "utf8"));
    const resolveAssets = builtAssetResolver(manifest, basePath);

    return withViteSsr(root, async (vite) => {
        const { render, listPrerenderPaths } = await vite.ssrLoadModule("/src/entry-server.tsx");
        const paths = [...listPrerenderPaths(), "/404"];
        const written = [];

        for (const pathname of paths) {
            const requestPath = pathname === "/404" ? "/this-page-does-not-exist" : pathname;
            const result = await render(requestPath, origin, basePath);
            const html = resolveAssets(
                template
                    .replace(/<html\b[^>]*>/, `<html${htmlAttributes(result.htmlAttrs)}>`)
                    .replace("<!--app-head-->", result.head)
                    .replace("<!--app-html-->", result.html)
                    // The 404 shell is served for every unknown URL but names the path it was
                    // rendered for, so the client renders it afresh instead of hydrating it.
                    .replace(
                        '<div id="root">',
                        pathname === "/404"
                            ? '<div id="root" data-not-found="">'
                            : '<div id="root">',
                    ),
            );

            const file = outputFileForPath(outDir, pathname);
            await mkdir(path.dirname(file), { recursive: true });
            await writeFile(file, html, "utf8");
            written.push({ path: pathname, file, statusCode: result.statusCode });
        }

        return written;
    }).finally(() => rm(path.join(outDir, ".vite"), { recursive: true, force: true }));
}

const isDirectRun =
    process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isDirectRun) {
    const origin = requireProductionOrigin(process.env.SITE_ORIGIN);
    const written = await prerenderRoutes({ origin });
    console.log(`Prerendered ${written.length} routes for ${origin}`);
}
