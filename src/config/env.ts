const FALLBACK_DEV_ORIGIN = "http://localhost:5173";

export type SiteEnv = {
    /** Absolute production origin, e.g. https://www.classific.example. */
    siteOrigin: string;
    /** Absolute URL of the enquiry endpoint. Empty when no integration is configured. */
    contactEndpoint: string;
    /** True when siteOrigin came from configuration rather than the dev fallback. */
    hasConfiguredOrigin: boolean;
};

export function isLocalOrigin(origin: string): boolean {
    try {
        const url = new URL(origin);
        return (
            url.hostname === "localhost" ||
            url.hostname === "127.0.0.1" ||
            url.hostname === "0.0.0.0" ||
            url.hostname.endsWith(".local")
        );
    } catch {
        return false;
    }
}

export function isValidProductionOrigin(origin: string): boolean {
    try {
        const url = new URL(origin);
        return url.protocol === "https:" && url.pathname === "/" && !isLocalOrigin(origin);
    } catch {
        return false;
    }
}

export function normalizeOrigin(origin: string): string {
    return origin.replace(/\/+$/, "");
}

export function requireProductionOrigin(origin: string): string {
    const normalized = normalizeOrigin(origin.trim());
    if (!isValidProductionOrigin(normalized)) {
        throw new Error(
            `SITE_ORIGIN must be an absolute https origin that is not localhost. Received: ${origin || "(empty)"}`,
        );
    }
    return normalized;
}

export function resolveSiteEnv(raw: {
    siteOrigin: string | undefined;
    contactEndpoint: string | undefined;
}): SiteEnv {
    const configured = (raw.siteOrigin ?? "").trim();
    const siteOrigin = normalizeOrigin(configured.length > 0 ? configured : FALLBACK_DEV_ORIGIN);
    return {
        siteOrigin,
        contactEndpoint: (raw.contactEndpoint ?? "").trim(),
        hasConfiguredOrigin: configured.length > 0,
    };
}

export const env: SiteEnv = resolveSiteEnv({
    siteOrigin: typeof __SITE_ORIGIN__ === "string" ? __SITE_ORIGIN__ : undefined,
    contactEndpoint: typeof __CONTACT_ENDPOINT__ === "string" ? __CONTACT_ENDPOINT__ : undefined,
});
