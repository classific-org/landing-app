import { spawn } from "node:child_process";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { normalizeBasePath, requireProductionOrigin } from "./lib/origin.mjs";
import { generateSeoFiles } from "./generate-seo.mjs";
import { renderOgImages } from "./render-og.mjs";
import { prerenderRoutes } from "./prerender.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function run(command, args) {
    return new Promise((resolve, reject) => {
        const child = spawn(command, args, {
            cwd: root,
            stdio: "inherit",
            shell: process.platform === "win32",
            env: process.env,
        });
        child.on("exit", (code) => {
            if (code === 0) {
                resolve();
            } else {
                reject(new Error(`${command} ${args.join(" ")} exited with code ${code}`));
            }
        });
        child.on("error", reject);
    });
}

async function assertDistSeo(siteUrl) {
    const files = ["robots.txt", "sitemap.xml", "llms.txt", "llms-full.txt"];
    for (const name of files) {
        const contents = await readFile(path.join(root, "dist", name), "utf8");
        if (/localhost|127\.0\.0\.1/i.test(contents)) {
            throw new Error(`dist/${name} contains a localhost host`);
        }
        if (name === "sitemap.xml" && !contents.includes(siteUrl)) {
            throw new Error("dist/sitemap.xml does not include the production origin");
        }
    }
}

const origin = requireProductionOrigin(process.env.SITE_ORIGIN);
const basePath = normalizeBasePath(process.env.SITE_BASE);
const siteUrl = `${origin}${basePath}`;

console.log(`Building Classific landing site for ${siteUrl}`);
await renderOgImages();
await generateSeoFiles({ origin, basePath, directories: [path.join(root, "public")] });
await run("bun", ["x", "vite", "build"]);
await prerenderRoutes({ origin, basePath });
await generateSeoFiles({ origin, basePath, directories: [path.join(root, "dist")] });
await assertDistSeo(siteUrl);
console.log("Build complete.");
