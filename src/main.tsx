import "@fontsource/inter/latin-400.css";
import "@fontsource/inter/latin-500.css";
import "@fontsource/inter/latin-600.css";
import "@/styles/global.css";

import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import { App } from "@/app/App";
import { routes } from "@/app/routes";
import { createSiteHeadController } from "@/app/head-controller";
import { applyClassificTheme } from "@/theme/classific";

async function waitForRouter(router: ReturnType<typeof createBrowserRouter>): Promise<void> {
    if (router.state.initialized) {
        return;
    }
    await new Promise<void>((resolve) => {
        const unsubscribe = router.subscribe((state) => {
            if (state.initialized) {
                unsubscribe();
                resolve();
            }
        });
    });
}

async function bootstrap(): Promise<void> {
    applyClassificTheme(document.documentElement);

    const container = document.getElementById("root");
    if (!container) {
        throw new Error("Missing #root element");
    }

    const router = createBrowserRouter(routes);
    await waitForRouter(router);

    const headController = createSiteHeadController();
    const tree = (
        <StrictMode>
            <App headController={headController}>
                <RouterProvider router={router} />
            </App>
        </StrictMode>
    );

    if (container.firstElementChild !== null) {
        hydrateRoot(container, tree);
    } else {
        createRoot(container).render(tree);
    }
}

void bootstrap();
