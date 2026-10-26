import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { requireProductionOrigin } from "./lib/origin.mjs";
import { withViteSsr } from "./vite-ssr.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function htmlAttributes(attrs) {
    const pairs = Object.entries(attrs)
        .filter(([, value]) => value !== undefined && value !== "")
        .map(([name, value]) => `${name}="${String(value).replaceAll('"', "&quot;")}"`);
    return pairs.length > 0 ? ` ${pairs.join(" ")}` : "";
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
    outDir = path.join(root, "dist"),
} = {}) {
    const template = await readFile(path.join(outDir, "index.html"), "utf8");

    return withViteSsr(root, async (vite) => {
        const { render, listPrerenderPaths } = await vite.ssrLoadModule("/src/entry-server.tsx");
        const paths = [...listPrerenderPaths(), "/404"];
        const written = [];

        for (const pathname of paths) {
            const requestPath = pathname === "/404" ? "/this-page-does-not-exist" : pathname;
            const result = await render(requestPath, origin);
            const html = template
                .replace(/<html\b[^>]*>/, `<html${htmlAttributes(result.htmlAttrs)}>`)
                .replace("<!--app-head-->", result.head)
                .replace("<!--app-html-->", result.html);

            const file = outputFileForPath(outDir, pathname);
            await mkdir(path.dirname(file), { recursive: true });
            await writeFile(file, html, "utf8");
            written.push({ path: pathname, file, statusCode: result.statusCode });
        }

        return written;
    });
}

const isDirectRun = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isDirectRun) {
    const origin = requireProductionOrigin(process.env.SITE_ORIGIN);
    const written = await prerenderRoutes({ origin });
    console.log(`Prerendered ${written.length} routes for ${origin}`);
}
