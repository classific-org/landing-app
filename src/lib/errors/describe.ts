/** What the error screen needs to know about a thrown value. */
export type ErrorDescription = {
    /** HTTP-style status when the router produced one (404, 500, ...). */
    status?: number;
    /** Short heading. */
    title: string;
    /** One or two sentences a visitor can read. */
    summary: string;
    /** The raw message, for the technical details. */
    message: string;
    stack?: string;
    /** A likely cause and what to do about it, when the error is a known kind. */
    hint?: string;
    /** True when a plain reload is the right first thing to try. */
    reloadHelps: boolean;
};

type RouteErrorLike = { status: number; statusText?: string; data?: unknown };

function isRouteErrorLike(value: unknown): value is RouteErrorLike {
    return (
        typeof value === "object" &&
        value !== null &&
        typeof (value as RouteErrorLike).status === "number" &&
        "statusText" in value
    );
}

/** Two copies of React loaded at once: a stale Vite cache in development, a bad bundle otherwise. */
const DUPLICATE_REACT = /reading 'use[A-Z]\w*'|Invalid hook call|more than one copy of React/i;

/** A route chunk that no longer exists or could not be fetched, typically after a new deploy. */
const STALE_CHUNK =
    /dynamically imported module|Importing a module script failed|Loading chunk|error loading dynamically|Failed to fetch/i;

function messageOf(error: unknown): string {
    if (error instanceof Error) {
        return error.message;
    }
    if (typeof error === "string") {
        return error;
    }
    return "An unknown error was thrown.";
}

/**
 * Turns anything a route or component can throw into a description the error screen can show.
 * `isDevelopment` decides which hint a duplicate-React error gets, since the fix differs.
 */
export function describeError(error: unknown, isDevelopment = false): ErrorDescription {
    if (isRouteErrorLike(error)) {
        const notFound = error.status === 404;
        return {
            status: error.status,
            title: notFound ? "This page does not exist." : "Something went wrong.",
            summary: notFound
                ? "The link may be out of date, or the address may have been typed incorrectly."
                : "The page could not be loaded. Trying again often fixes it.",
            message: `${error.status} ${error.statusText ?? ""}`.trim(),
            reloadHelps: !notFound && error.status >= 500,
        };
    }

    const message = messageOf(error);
    const stack = error instanceof Error ? error.stack : undefined;

    if (DUPLICATE_REACT.test(message)) {
        return {
            title: "Something went wrong.",
            summary: "The page hit an error while it was drawing itself.",
            message,
            stack,
            hint: isDevelopment
                ? "Two copies of React were loaded, usually from a stale Vite cache. Stop the dev server, delete node_modules/.vite, start it again with --force, then hard-reload the page."
                : "Reloading usually clears this. If it keeps happening, please let us know.",
            reloadHelps: true,
        };
    }

    if (STALE_CHUNK.test(message)) {
        return {
            title: "This page could not be loaded.",
            summary:
                "A part of the site failed to download. This can happen on a poor connection or just after an update.",
            message,
            stack,
            hint: "Reload the page to fetch the latest version.",
            reloadHelps: true,
        };
    }

    return {
        title: "Something went wrong.",
        summary: "An unexpected error stopped this page from showing. Nothing you did caused it.",
        message,
        stack,
        reloadHelps: true,
    };
}
