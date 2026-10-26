import { Outlet, ScrollRestoration } from "react-router";
import { SkipLink } from "@/components/layout/SkipLink";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { DocumentHead } from "@/components/seo/DocumentHead";

export function SiteLayout() {
    return (
        <div className="flex min-h-dvh flex-col bg-paper">
            <DocumentHead />
            <SkipLink />
            <SiteHeader />
            <main id="main-content" className="flex-1" tabIndex={-1}>
                <Outlet />
            </main>
            <SiteFooter />
            <ScrollRestoration />
        </div>
    );
}
