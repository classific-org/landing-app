/**
 * Pulls published blogs and projects from the CMS API into src/data/generated/cms.json, which the
 * site's data layer reads. Run it before a build (`bun run build` does this itself) or by hand
 * with `bun run cms:pull` to preview CMS content in development.
 *
 * CMS_API_URL   Base URL of the API, e.g. https://api.classific.org. When it is not set the
 *               bundled content is used instead and nothing is fetched.
 */
import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { pullCmsContent } from "./lib/cms.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
export const CMS_FILE = path.join(root, "src", "data", "generated", "cms.json");

export async function fetchCms({ baseUrl = process.env.CMS_API_URL, file = CMS_FILE } = {}) {
    if (!baseUrl) {
        // A stale file from an earlier pull must not silently override the bundled content.
        await rm(file, { force: true });
        console.log("CMS_API_URL is not set: using the bundled blog and project content.");
        return null;
    }
    console.log(`Reading published content from ${baseUrl}`);
    const content = await pullCmsContent(baseUrl);
    await mkdir(path.dirname(file), { recursive: true });
    await writeFile(file, `${JSON.stringify(content, null, 2)}\n`, "utf8");
    console.log(
        `CMS content: ${content.blogs.length} blog(s), ${content.projects.length} project(s).`,
    );
    return content;
}

const isDirectRun =
    process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isDirectRun) {
    try {
        await fetchCms();
    } catch (error) {
        // A build must not quietly ship a site with its content missing.
        console.error(error.message);
        process.exit(1);
    }
}
