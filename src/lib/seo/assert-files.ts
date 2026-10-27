const LOCAL_HOST_PATTERN = /localhost|127\.0\.0\.1|0\.0\.0\.0|\.local/i;

export const REQUIRED_SEO_FILES = [
    "robots.txt",
    "sitemap.xml",
    "llms.txt",
    "llms-full.txt",
    "og/classific-og.png",
] as const;

export function assertNoLocalhost(content: string, label: string): void {
    if (LOCAL_HOST_PATTERN.test(content)) {
        throw new Error(
            `${label} contains a localhost or loopback host, which is not allowed in production metadata.`,
        );
    }
}

export function assertSitemapShape(xml: string, origin: string): void {
    if (!xml.includes("<urlset")) {
        throw new Error("sitemap.xml is missing a urlset root.");
    }
    if (!xml.includes(`${origin}/`)) {
        throw new Error("sitemap.xml does not include the production origin.");
    }
    if (xml.includes("/404") || xml.includes("this-page-does-not-exist")) {
        throw new Error("sitemap.xml must not include the not-found page.");
    }
}

export function assertRobotsShape(text: string, origin: string): void {
    if (!text.includes("User-agent: *")) {
        throw new Error("robots.txt must allow a wildcard user-agent.");
    }
    if (!text.includes("Allow: /")) {
        throw new Error("robots.txt must allow public pages.");
    }
    if (!text.includes(`${origin}/sitemap.xml`)) {
        throw new Error("robots.txt must point at the production sitemap.");
    }
    if (/disallow:\s*\/assets/i.test(text)) {
        throw new Error("robots.txt must not block assets.");
    }
}
