export function normalizePath(path: string): string {
    if (path.length === 0 || path === "/") {
        return "/";
    }
    const withLeading = path.startsWith("/") ? path : `/${path}`;
    const withoutQuery = withLeading.split(/[?#]/)[0] ?? "/";
    const stripped = withoutQuery.replace(/\/+$/, "");
    return stripped.length > 0 ? stripped : "/";
}

export function toAbsoluteUrl(origin: string, path: string): string {
    const base = origin.replace(/\/+$/, "");
    return `${base}${normalizePath(path)}`;
}
