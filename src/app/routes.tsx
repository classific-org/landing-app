import { useEffect } from "react";
import { useParams, type RouteObject } from "react-router";
import { getServiceBySlug } from "@/data/services";
import { RouteError } from "@/components/errors/RouteError";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { HomePage } from "@/pages/home/HomePage";
import { NotFoundPage } from "@/pages/not-found/NotFoundPage";

/**
 * For now the home page is the whole site: the older pages send visitors to the matching
 * home section (`to`, empty for the top). A refresh tag does it without a script (and in the
 * prerendered page); the effect does it at once in the app.
 */
function RedirectHome({ to }: { to: string }) {
    const target = to ? `/#${to}` : "/";
    useEffect(() => {
        window.location.replace(target);
    }, [target]);
    return <meta httpEquiv="refresh" content={`0; url=${target}`} />;
}

/** A service page goes to that service's own section on the home page. */
function ServiceRedirect() {
    const { slug = "" } = useParams();
    return <RedirectHome to={getServiceBySlug(slug) ? slug : "services"} />;
}

/**
 * Route table shared by the browser router and the prerender script. Detail routes read
 * the older pages redirect to the home page's sections.
 */
export const routes: RouteObject[] = [
    {
        id: "root",
        path: "/",
        Component: SiteLayout,
        ErrorBoundary: RouteError,
        children: [
            { index: true, Component: HomePage },
            { path: "services", element: <RedirectHome to="services" /> },
            { path: "services/:slug", Component: ServiceRedirect },
            { path: "work", element: <RedirectHome to="work" /> },
            { path: "work/:slug", element: <RedirectHome to="work" /> },
            { path: "process", element: <RedirectHome to="process" /> },
            { path: "about", element: <RedirectHome to="about" /> },
            { path: "blog", element: <RedirectHome to="" /> },
            { path: "blog/:slug", element: <RedirectHome to="" /> },
            { path: "insights", element: <RedirectHome to="" /> },
            { path: "insights/:slug", element: <RedirectHome to="" /> },
            { path: "contact", element: <RedirectHome to="contact" /> },
            {
                path: ":legalSlug",
                lazy: async () => {
                    const module = await import("@/pages/legal/LegalPage");
                    return { Component: module.LegalPage };
                },
            },
            { path: "*", Component: NotFoundPage },
        ],
    },
];
