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

export function requireProductionOrigin(raw) {
    const origin = normalizeOrigin((raw ?? "").trim());
    if (!isValidProductionOrigin(origin)) {
        throw new Error(
            `SITE_ORIGIN must be an absolute https origin that is not localhost. Received: ${raw || "(empty)"}`,
        );
    }
    return origin;
}
