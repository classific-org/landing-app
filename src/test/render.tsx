import { render, type RenderOptions, type RenderResult } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router";
import { App } from "@/app/App";
import { createSiteHeadController } from "@/app/head-controller";

type RenderRouteOptions = {
    path?: string;
    routes?: Array<{ path: string; element: React.ReactNode }>;
} & Omit<RenderOptions, "wrapper">;

export function renderWithRouter(
    ui: React.ReactNode,
    { path = "/", routes, ...options }: RenderRouteOptions = {},
): RenderResult {
    const router = createMemoryRouter(
        routes ?? [{ path: "*", element: ui }],
        { initialEntries: [path] },
    );
    const headController = createSiteHeadController();
    return render(
        <App headController={headController} applyHead={false}>
            <RouterProvider router={router} />
        </App>,
        options,
    );
}
