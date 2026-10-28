import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { normalizeBasePath, requireProductionOrigin } from "./lib/origin.mjs";
import { withViteSsr } from "./vite-ssr.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

export async function generateSeoFiles({
    origin = requireProductionOrigin(process.env.SITE_ORIGIN),
    basePath = normalizeBasePath(process.env.SITE_BASE),
    directories = [path.join(root, "public")],
} = {}) {
    // Every absolute URL in these files carries the path the site is served from.
    const siteUrl = `${origin}${basePath}`;
    const files = await withViteSsr(root, async (vite) => {
        const [{ buildRobotsTxt }, { buildSitemapXml }, { buildLlmsTxt, buildLlmsFullTxt }] =
            await Promise.all([
                vite.ssrLoadModule("/src/lib/seo/robots.ts"),
                vite.ssrLoadModule("/src/lib/seo/sitemap.ts"),
                vite.ssrLoadModule("/src/lib/seo/llms.ts"),
            ]);

        return {
            "robots.txt": buildRobotsTxt(siteUrl),
            "sitemap.xml": buildSitemapXml(siteUrl),
            "llms.txt": buildLlmsTxt(siteUrl),
            "llms-full.txt": buildLlmsFullTxt(siteUrl),
        };
    });

    for (const directory of directories) {
        await mkdir(directory, { recursive: true });
        for (const [name, contents] of Object.entries(files)) {
            await writeFile(path.join(directory, name), contents, "utf8");
        }
    }

    return files;
}

const isDirectRun =
    process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isDirectRun) {
    const origin = requireProductionOrigin(process.env.SITE_ORIGIN);
    await generateSeoFiles({ origin });
    console.log(`SEO files written for ${origin}`);
}
