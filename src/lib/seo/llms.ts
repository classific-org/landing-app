import { site } from "@/data/site";
import { services } from "@/data/services";
import { processStages } from "@/data/process";
import { getPublishedProjects } from "@/data/projects";
import { getPublishedArticles } from "@/data/insights";
import { generalFaqs } from "@/data/faqs";
import { buildPublicRoutes } from "@/content/routes";
import { articleBlocksToText } from "@/lib/formatting/text";
import { toAbsoluteUrl } from "@/lib/seo/urls";

function heading(title: string): string {
    return `# ${title}`;
}

function section(title: string): string {
    return `## ${title}`;
}

export function buildLlmsTxt(origin: string): string {
    const routes = buildPublicRoutes();
    const lines = [
        heading(site.name),
        "",
        site.description,
        "",
        section("Site"),
        "",
        ...routes.map((route) => `- [${route.title}](${toAbsoluteUrl(origin, route.path)}): ${route.description}`),
        "",
    ];
    return `${lines.join("\n")}\n`;
}

export function buildLlmsFullTxt(origin: string): string {
    const parts: string[] = [
        heading(`${site.name} — full information`),
        "",
        site.description,
        "",
        section("Services"),
        "",
    ];

    for (const service of services) {
        parts.push(`### ${service.title}`);
        parts.push("");
        parts.push(service.description);
        parts.push("");
        parts.push(`URL: ${toAbsoluteUrl(origin, `/services/${service.slug}`)}`);
        parts.push("");
        parts.push("Problems addressed:");
        parts.push(...service.problems.map((item) => `- ${item}`));
        parts.push("");
        parts.push("Capabilities:");
        parts.push(...service.capabilities.map((item) => `- ${item.title}: ${item.description}`));
        parts.push("");
    }

    parts.push(section("Process"));
    parts.push("");
    for (const stage of processStages) {
        parts.push(`### ${stage.number}. ${stage.title}`);
        parts.push("");
        parts.push(stage.description);
        parts.push("");
        parts.push("Activities:");
        parts.push(...stage.activities.map((item) => `- ${item}`));
        parts.push("");
        parts.push("Deliverables:");
        parts.push(...stage.deliverables.map((item) => `- ${item}`));
        parts.push("");
        parts.push("The client provides:");
        parts.push(...stage.clientProvides.map((item) => `- ${item}`));
        parts.push("");
    }

    const projects = getPublishedProjects();
    parts.push(section("Published work"));
    parts.push("");
    if (projects.length === 0) {
        parts.push("No published case studies are available yet.");
        parts.push("");
    } else {
        for (const project of projects) {
            parts.push(`### ${project.title}`);
            parts.push("");
            parts.push(project.description);
            parts.push("");
            parts.push(`URL: ${toAbsoluteUrl(origin, `/work/${project.slug}`)}`);
            parts.push("");
        }
    }

    parts.push(section("Published articles"));
    parts.push("");
    for (const article of getPublishedArticles()) {
        parts.push(`### ${article.title}`);
        parts.push("");
        parts.push(article.excerpt);
        parts.push("");
        parts.push(articleBlocksToText(article.body));
        parts.push("");
        parts.push(`URL: ${toAbsoluteUrl(origin, `/insights/${article.slug}`)}`);
        parts.push("");
    }

    parts.push(section("Frequently asked questions"));
    parts.push("");
    for (const faq of generalFaqs) {
        parts.push(`### ${faq.question}`);
        parts.push("");
        parts.push(faq.answer);
        parts.push("");
    }

    return `${parts.join("\n")}\n`;
}
