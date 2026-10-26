import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Resvg } from "@resvg/resvg-js";
import { buildOgSvg } from "./lib/og-svg.mjs";
import { withViteSsr } from "./vite-ssr.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OG_WIDTH = 1200;

export function rasterizeOgSvg(svg) {
    const renderer = new Resvg(svg, {
        fitTo: { mode: "width", value: OG_WIDTH },
    });
    return renderer.render().asPng();
}

export async function renderOgImages({
    directory = path.join(root, "public", "og"),
} = {}) {
    const { titles } = await withViteSsr(root, async (vite) => {
        const [{ site }, { services }, { getPublishedProjects }, { getPublishedArticles }] =
            await Promise.all([
                vite.ssrLoadModule("/src/data/site.ts"),
                vite.ssrLoadModule("/src/data/services.ts"),
                vite.ssrLoadModule("/src/data/projects.ts"),
                vite.ssrLoadModule("/src/data/insights.ts"),
            ]);
        return {
            titles: {
                default: site.tagline,
                services: services.map((service) => ({ slug: service.slug, title: service.title })),
                projects: getPublishedProjects().map((project) => ({
                    slug: project.slug,
                    title: project.title,
                })),
                articles: getPublishedArticles().map((article) => ({
                    slug: article.slug,
                    title: article.title,
                })),
            },
        };
    });

    await mkdir(directory, { recursive: true });
    await mkdir(path.join(directory, "services"), { recursive: true });
    await mkdir(path.join(directory, "insights"), { recursive: true });
    await mkdir(path.join(directory, "work"), { recursive: true });

    const written = [];
    const defaultPng = rasterizeOgSvg(buildOgSvg({ title: titles.default, eyebrow: "CLASSIFIC" }));
    const defaultPath = path.join(directory, "classific-og.png");
    await writeFile(defaultPath, defaultPng);
    written.push(defaultPath);

    for (const service of titles.services) {
        const file = path.join(directory, "services", `${service.slug}.png`);
        await writeFile(file, rasterizeOgSvg(buildOgSvg({ title: service.title, eyebrow: "SERVICE" })));
        written.push(file);
    }
    for (const article of titles.articles) {
        const file = path.join(directory, "insights", `${article.slug}.png`);
        await writeFile(file, rasterizeOgSvg(buildOgSvg({ title: article.title, eyebrow: "INSIGHTS" })));
        written.push(file);
    }
    for (const project of titles.projects) {
        const file = path.join(directory, "work", `${project.slug}.png`);
        await writeFile(file, rasterizeOgSvg(buildOgSvg({ title: project.title, eyebrow: "WORK" })));
        written.push(file);
    }

    return written;
}

const isDirectRun = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isDirectRun) {
    const written = await renderOgImages();
    console.log(`Rendered ${written.length} Open Graph images`);
}
