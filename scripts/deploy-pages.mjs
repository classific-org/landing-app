/**
 * Builds the site for GitHub Pages and checks that the output will actually be served.
 *
 * A project site lives at https://<owner>.github.io/<repository>/, not at the domain root, so the
 * build needs the origin and the base path, and every asset, link and prerendered route has to
 * respect that path. This script derives both from the repository, builds, adds the files Pages
 * expects (.nojekyll, 404.html) and fails loudly if anything points at the wrong place.
 *
 * Usage:   node scripts/deploy-pages.mjs [--skip-build]
 * Env:     GITHUB_REPOSITORY (owner/name, set by Actions), or SITE_ORIGIN and SITE_BASE directly.
 * Output:  dist/, ready for actions/upload-pages-artifact.
 */
import { spawn } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { access, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { normalizeBasePath, requireProductionOrigin } from "./lib/origin.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const FALLBACK_REPOSITORY = "classific-org/landing-app";

/** The custom domain named in public/CNAME, or "" when the site uses the github.io address. */
export function readCustomDomain(file = path.join(root, "public", "CNAME")) {
    return existsSync(file) ? (readFileSync(file, "utf8").trim().split(/\s+/)[0] ?? "") : "";
}

/**
 * Resolves where the site will be served: the origin, the base path and the full URL. A custom
 * domain serves the site from its root, so it has no base path; the github.io project address
 * serves it from /<repository>.
 */
export function resolvePagesTarget(env = process.env, customDomain = readCustomDomain()) {
    if (customDomain) {
        const origin = requireProductionOrigin(env.SITE_ORIGIN || `https://${customDomain}`);
        const basePath = normalizeBasePath(env.SITE_BASE ?? "");
        return { origin, basePath, siteUrl: `${origin}${basePath}` };
    }
    const [owner, repository] = (env.GITHUB_REPOSITORY || FALLBACK_REPOSITORY).split("/");
    const origin = requireProductionOrigin(
        env.SITE_ORIGIN || `https://${owner.toLowerCase()}.github.io`,
    );
    // A repository named <owner>.github.io is served from the root of the domain.
    const isUserSite = repository.toLowerCase() === `${owner.toLowerCase()}.github.io`;
    const basePath = normalizeBasePath(env.SITE_BASE ?? (isUserSite ? "" : repository));
    return { origin, basePath, siteUrl: `${origin}${basePath}` };
}

function run(command, args, env) {
    return new Promise((resolve, reject) => {
        const child = spawn(command, args, {
            cwd: root,
            stdio: "inherit",
            shell: process.platform === "win32",
            env,
        });
        child.on("exit", (code) =>
            code === 0
                ? resolve()
                : reject(new Error(`${command} ${args.join(" ")} exited ${code}`)),
        );
        child.on("error", reject);
    });
}

async function exists(file) {
    try {
        await access(file);
        return true;
    } catch {
        return false;
    }
}

/** Local URLs that a page references through src, href or a preload. */
function localReferences(html) {
    const urls = [];
    for (const match of html.matchAll(/\b(?:src|href)="(\/[^"#?]*)(?:[?#][^"]*)?"/g)) {
        urls.push(match[1]);
    }
    return urls;
}

/** Throws with a list of everything wrong with the built site. */
export async function verifyPagesBuild({ basePath, siteUrl }) {
    const problems = [];
    const indexHtml = await readFile(path.join(dist, "index.html"), "utf8");

    // Every root-relative reference must sit under the base path, and must exist on disk.
    for (const url of localReferences(indexHtml)) {
        if (basePath && url !== basePath && !url.startsWith(`${basePath}/`)) {
            problems.push(`index.html references ${url}, which is outside ${basePath}/`);
            continue;
        }
        const relative = decodeURIComponent(url.slice(basePath.length)).replace(/^\//, "");
        const target = path.join(dist, relative);
        if (relative !== "" && !(await exists(target))) {
            problems.push(`index.html references ${url}, but dist/${relative} does not exist`);
        }
    }

    const scripts = [...indexHtml.matchAll(/<script[^>]+type="module"[^>]+src="([^"]+)"/g)];
    if (scripts.length === 0) {
        problems.push("index.html has no module script, so the app would never start");
    }

    // The 404 page is what Pages serves for any path it does not know.
    if (!(await exists(path.join(dist, "404.html")))) {
        problems.push("dist/404.html is missing");
    }

    // Every prerendered route must exist as a file so a deep link or a refresh works.
    const sitemap = await readFile(path.join(dist, "sitemap.xml"), "utf8");
    const locations = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
    if (locations.length === 0) {
        problems.push("dist/sitemap.xml lists no pages");
    }
    for (const location of locations) {
        if (!location.startsWith(siteUrl)) {
            problems.push(`sitemap entry ${location} is not under ${siteUrl}`);
            continue;
        }
        const route = location.slice(siteUrl.length).replace(/^\/+/, "");
        if (!(await exists(path.join(dist, route, "index.html")))) {
            problems.push(`route /${route} has no dist/${route}/index.html`);
        }
    }

    if (problems.length > 0) {
        throw new Error(`The Pages build is not servable:\n - ${problems.join("\n - ")}`);
    }
    return { routes: locations.length };
}

const isDirectRun =
    process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isDirectRun) {
    const target = resolvePagesTarget();
    console.log(`Deploying to ${target.siteUrl}/`);

    if (!process.argv.includes("--skip-build")) {
        await run("node", ["scripts/build.mjs"], {
            ...process.env,
            SITE_ORIGIN: target.origin,
            SITE_BASE: target.basePath,
        });
    }

    // Without this, Pages runs the output through Jekyll, which drops anything starting with "_".
    await writeFile(path.join(dist, ".nojekyll"), "", "utf8");

    const { routes } = await verifyPagesBuild(target);
    console.log(`Verified ${routes} routes, 404.html and assets under ${target.basePath || "/"}`);
    console.log(`Ready: upload dist/ and open ${target.siteUrl}/`);
}
