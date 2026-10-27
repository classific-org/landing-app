import { Link, NavLink } from "react-router";
import { Dialog } from "@sometic/react/overlay";
import { Container } from "@/components/layout/Container";
import { Wordmark } from "@/components/ui/Wordmark";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { useSiteHeader } from "@/components/layout/SiteHeader.hooks";

export function SiteHeader() {
    const { navigation, cta, isMenuOpen, menuId, menuTitleId, openMenu, closeMenu, setMenuOpen } =
        useSiteHeader();

    return (
        <header className="sticky top-0 z-50 border-b border-rule/80 glass-header shadow-xs transition-all duration-300">
            <Container className="flex h-[72px] items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <Link to="/" className="inline-flex items-center" aria-label="Classific home">
                        <Wordmark className="h-7 w-auto" />
                    </Link>
                    <span className="hidden items-center gap-2 rounded-full border border-rule bg-white/80 px-2.5 py-0.5 text-[11px] font-medium text-body shadow-xs xl:inline-flex">
                        <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-600" />
                        </span>
                        <span>Available for Q2/Q3 projects</span>
                    </span>
                </div>

                <nav aria-label="Primary" className="hidden lg:block">
                    <ul className="flex items-center gap-1 xl:gap-2">
                        {navigation.map((item) => (
                            <li key={item.href}>
                                <NavLink
                                    to={item.href}
                                    className={({ isActive }) =>
                                        [
                                            "rounded-md px-3.5 py-1.5 text-small font-medium transition-all duration-150",
                                            isActive
                                                ? "bg-white text-ink shadow-xs border border-rule/80"
                                                : "text-body hover:bg-white/60 hover:text-ink",
                                        ].join(" ")
                                    }
                                >
                                    {item.label}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className="hidden lg:block">
                    <ButtonLink to={cta.href} variant="primary" withArrow>
                        {cta.label}
                    </ButtonLink>
                </div>

                <button
                    type="button"
                    className="inline-flex h-11 w-11 items-center justify-center rounded-sm border border-rule text-ink lg:hidden"
                    aria-expanded={isMenuOpen}
                    aria-controls={menuId}
                    aria-label="Open menu"
                    onClick={openMenu}
                >
                    <svg
                        viewBox="0 0 24 24"
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={1.6}
                        strokeLinecap="round"
                        aria-hidden="true"
                        focusable="false"
                    >
                        <path d="M4 7h16M4 12h16M4 17h16" />
                    </svg>
                </button>
            </Container>

            <Dialog
                open={isMenuOpen}
                onOpenChange={setMenuOpen}
                titleId={menuTitleId}
                id={menuId}
                className="mobile-menu-panel"
                data-testid="mobile-menu"
            >
                <Container className="flex h-[72px] items-center justify-between">
                    <h2 id={menuTitleId} className="sr-only">
                        Site navigation
                    </h2>
                    <Link to="/" className="inline-flex items-center" aria-label="Classific home">
                        <Wordmark className="h-7 w-auto" />
                    </Link>
                    <button
                        type="button"
                        className="inline-flex h-11 w-11 items-center justify-center rounded-sm border border-rule text-ink"
                        aria-label="Close menu"
                        onClick={closeMenu}
                    >
                        <svg
                            viewBox="0 0 24 24"
                            className="h-5 w-5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={1.6}
                            strokeLinecap="round"
                            aria-hidden="true"
                            focusable="false"
                        >
                            <path d="M6 6l12 12M18 6 6 18" />
                        </svg>
                    </button>
                </Container>
                <nav aria-label="Mobile" className="border-t border-rule">
                    <Container>
                        <ul className="divide-y divide-rule">
                            {navigation.map((item) => (
                                <li key={item.href}>
                                    <NavLink
                                        to={item.href}
                                        onClick={closeMenu}
                                        className={({ isActive }) =>
                                            [
                                                "block py-5 text-h3",
                                                isActive ? "text-ink" : "text-body",
                                            ].join(" ")
                                        }
                                    >
                                        {item.label}
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                        <div className="py-8">
                            <ButtonLink
                                to={cta.href}
                                variant="primary"
                                className="w-full"
                                onClick={closeMenu}
                            >
                                {cta.label}
                            </ButtonLink>
                        </div>
                    </Container>
                </nav>
            </Dialog>
        </header>
    );
}
