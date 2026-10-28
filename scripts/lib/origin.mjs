export function isLocalOrigin(origin) {
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

export function isValidProductionOrigin(origin) {
    try {
        const url = new URL(origin);
        return url.protocol === "https:" && url.pathname === "/" && !isLocalOrigin(origin);
    } catch {
        return false;
    }
}

export function normalizeOrigin(origin) {
    return origin.replace(/\/+$/, "");
}

/**
 * Normalises the path the site is served from: "" for a domain root, otherwise "/segment" with a
 * leading and no trailing slash (a GitHub Pages project site lives at "/repository").
 */
export function normalizeBasePath(raw) {
    const trimmed = (raw ?? "").trim().replace(/^\/+|\/+$/g, "");
    return trimmed.length > 0 ? `/${trimmed}` : "";
}

export function requireProductionOrigin(raw) {
    const origin = normalizeOrigin((raw ?? "").trim());
    if (!isValidProductionOrigin(origin)) {
        throw new Error(
            `SITE_ORIGIN must be an absolute https origin that is not localhost. Received: ${raw || "(empty)"}`,
        );
    }
    return origin;
}
