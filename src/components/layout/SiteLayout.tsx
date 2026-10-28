import { Outlet, ScrollRestoration, useLocation } from "react-router";
import { SkipLink } from "@/components/layout/SkipLink";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { DocumentHead } from "@/components/seo/DocumentHead";

export function SiteLayout() {
    const { pathname } = useLocation();

    return (
        <div className="flex min-h-dvh flex-col bg-paper">
            <DocumentHead />
            <SkipLink />
            <SiteHeader />
            <main id="main-content" className="flex-1" tabIndex={-1}>
                {/* Keyed by path so each route change replays a short opacity and lift. */}
                <div key={pathname} className="page-enter">
                    <Outlet />
                </div>
            </main>
            <SiteFooter />
            <ScrollRestoration />
        </div>
    );
}
