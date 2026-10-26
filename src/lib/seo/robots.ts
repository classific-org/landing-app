import { toAbsoluteUrl } from "@/lib/seo/urls";

export function buildRobotsTxt(origin: string): string {
    return `User-agent: *
Allow: /

Sitemap: ${toAbsoluteUrl(origin, "/sitemap.xml")}
`;
}
