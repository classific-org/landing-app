import type { RouteObject } from "react-router";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { HomePage } from "@/pages/home/HomePage";
import { NotFoundPage } from "@/pages/not-found/NotFoundPage";

/**
 * Route table shared by the browser router and the prerender script. Detail routes read
 * their record by slug and render the not-found page for unknown or unpublished slugs.
 */
export const routes: RouteObject[] = [
    {
        id: "root",
        path: "/",
        Component: SiteLayout,
        children: [
            { index: true, Component: HomePage },
            {
                path: "services",
                lazy: async () => {
                    const module = await import("@/pages/services/ServicesPage");
                    return { Component: module.ServicesPage };
                },
            },
            {
                path: "services/:slug",
                lazy: async () => {
                    const module = await import("@/pages/services/ServiceDetailPage");
                    return { Component: module.ServiceDetailPage };
                },
            },
            {
                path: "work",
                lazy: async () => {
                    const module = await import("@/pages/work/WorkPage");
                    return { Component: module.WorkPage };
                },
            },
            {
                path: "work/:slug",
                lazy: async () => {
                    const module = await import("@/pages/work/ProjectPage");
                    return { Component: module.ProjectPage };
                },
            },
            {
                path: "process",
                lazy: async () => {
                    const module = await import("@/pages/process/ProcessPage");
                    return { Component: module.ProcessPage };
                },
            },
            {
                path: "about",
                lazy: async () => {
                    const module = await import("@/pages/about/AboutPage");
                    return { Component: module.AboutPage };
                },
            },
            {
                path: "insights",
                lazy: async () => {
                    const module = await import("@/pages/insights/InsightsPage");
                    return { Component: module.InsightsPage };
                },
            },
            {
                path: "insights/:slug",
                lazy: async () => {
                    const module = await import("@/pages/insights/ArticlePage");
                    return { Component: module.ArticlePage };
                },
            },
            {
                path: "contact",
                lazy: async () => {
                    const module = await import("@/pages/contact/ContactPage");
                    return { Component: module.ContactPage };
                },
            },
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
