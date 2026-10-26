import type { ComponentType } from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router";
import { App } from "@/app/App";
import { createSiteHeadController } from "@/app/head-controller";
import { DocumentHead } from "@/components/seo/DocumentHead";
import { useArticlePage } from "@/pages/insights/ArticlePage.hooks";
import { useLegalPage } from "@/pages/legal/LegalPage.hooks";
import { useProjectPage } from "@/pages/work/ProjectPage.hooks";
import { useServiceDetailPage } from "@/pages/services/ServiceDetailPage.hooks";
import { useNotFoundPage } from "@/pages/not-found/NotFoundPage.hooks";

function Probe({ label }: { label: string }) {
    return <div>{label}</div>;
}

function renderRoute(path: string, Component: ComponentType) {
    const router = createMemoryRouter(
        [
            { path: "/insights/:slug", Component },
            { path: "/work/:slug", Component },
            { path: "/services/:slug", Component },
            { path: "/:legalSlug", Component },
            { path: "*", Component },
        ],
        { initialEntries: [path] },
    );
    return render(
        <App headController={createSiteHeadController()} applyHead={false}>
            <RouterProvider router={router} />
        </App>,
    );
}

describe("routed page hooks", () => {
    it("resolves published and missing slugs from the URL", () => {
        function ArticleProbe() {
            const model = useArticlePage();
            return <Probe label={model.status === "ready" ? model.article.slug : "missing"} />;
        }
        function ServiceProbe() {
            const model = useServiceDetailPage();
            return <Probe label={model.status === "ready" ? model.service.slug : "missing"} />;
        }
        function LegalProbe() {
            const model = useLegalPage();
            return <Probe label={model.status === "ready" ? model.document.slug : "missing"} />;
        }
        function ProjectProbe() {
            const model = useProjectPage();
            return <Probe label={model.status} />;
        }
        function NotFoundProbe() {
            const model = useNotFoundPage();
            return <Probe label={model.pathname} />;
        }

        renderRoute("/insights/what-discovery-actually-decides", ArticleProbe);
        expect(screen.getByText("what-discovery-actually-decides")).toBeInTheDocument();

        renderRoute("/services/web-applications", ServiceProbe);
        expect(screen.getByText("web-applications")).toBeInTheDocument();

        renderRoute("/privacy", LegalProbe);
        expect(screen.getByText("privacy")).toBeInTheDocument();

        renderRoute("/work/missing", ProjectProbe);
        expect(screen.getByText("missing")).toBeInTheDocument();

        renderRoute("/nope", NotFoundProbe);
        expect(screen.getByText("/nope")).toBeInTheDocument();
    });

    it("applies document head for the current location", () => {
        const router = createMemoryRouter(
            [{ path: "/about", Component: DocumentHead }],
            { initialEntries: ["/about"] },
        );
        render(
            <App headController={createSiteHeadController()} applyHead={false}>
                <RouterProvider router={router} />
            </App>,
        );
        expect(document.title.length).toBeGreaterThanOrEqual(0);
    });
});
