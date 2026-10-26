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
        <header className="border-b border-rule bg-paper">
            <Container className="flex h-[72px] items-center justify-between gap-6">
                <Link to="/" className="inline-flex items-center" aria-label="Classific home">
                    <Wordmark className="h-7 w-auto" />
                </Link>

                <nav aria-label="Primary" className="hidden lg:block">
                    <ul className="flex items-center gap-8">
                        {navigation.map((item) => (
                            <li key={item.href}>
                                <NavLink
                                    to={item.href}
                                    className={({ isActive }) =>
                                        [
                                            "text-small font-medium transition-colors",
                                            isActive
                                                ? "text-ink underline decoration-ink underline-offset-8"
                                                : "text-body hover:text-ink",
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
                    <ButtonLink to={cta.href} variant="primary">
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
