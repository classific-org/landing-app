import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router";
import { Dialog } from "@sometic/react/overlay";
import { Container } from "@/components/layout/Container";
import { useScrolled } from "@/components/motion/motion.hooks";
import { Wordmark } from "@/components/ui/Wordmark";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { useSiteHeader } from "@/components/layout/SiteHeader.hooks";

/** Scroll distance after which the home hero no longer sits behind the header. */
const heroEdge = () => window.innerHeight * 0.7;

export function SiteHeader() {
    const { navigation, cta, isMenuOpen, menuId, menuTitleId, openMenu, closeMenu, setMenuOpen } =
        useSiteHeader();
    const [scrolled, setScrolled] = useState(false);
    const [pastHero, setPastHero] = useState(false);
    useScrolled(8, setScrolled);
    useScrolled(heroEdge, setPastHero);

    // Pages that open on a dark hero get a matching dark header until the hero scrolls away.
    // The initial guess keeps the server-rendered header right; the effect confirms it on the
    // client for every route change.
    const { pathname } = useLocation();
    const [overHero, setOverHero] = useState(!/^\/insights\/./.test(pathname));
    useEffect(() => {
        setOverHero(Boolean(document.querySelector("main .hero, main [data-dark-hero]")));
    }, [pathname]);
    const dark = overHero && !pastHero;

    return (
        <header
            className="site-header sticky top-0 z-50"
            data-scrolled={scrolled}
            data-tone={dark ? "dark" : "light"}
        >
            <Container className="flex h-[4.5rem] items-center justify-between gap-6">
                <Link
                    to="/"
                    className="inline-flex items-center transition-opacity duration-200 hover:opacity-75"
                    aria-label="Classific home"
                >
                    <Wordmark
                        className="h-8 w-auto object-contain sm:h-9"
                        variant={dark ? "chrome" : "dark"}
                    />
                </Link>

                <nav aria-label="Primary" className="hidden items-center gap-9 lg:flex">
                    {navigation.map((item) => (
                        <NavLink key={item.href} to={item.href} className="nav-link">
                            {item.label}
                        </NavLink>
                    ))}
                </nav>

                <div className="hidden items-center gap-6 lg:flex">
                    <ButtonLink to={cta.href} variant={dark ? "inverse" : "primary"} withArrow>
                        {cta.label}
                    </ButtonLink>
                </div>

                <button
                    type="button"
                    className={`inline-flex h-11 w-11 items-center justify-center border transition-colors lg:hidden ${
                        dark
                            ? "border-paper/30 text-paper hover:border-paper"
                            : "border-rule text-ink hover:border-ink"
                    }`}
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
                        <path d="M4 8h16M4 16h16" />
                    </svg>
                </button>
            </Container>

            <Dialog
                open={isMenuOpen}
                onOpenChange={setMenuOpen}
                titleId={menuTitleId}
                id={menuId}
                className="mobile-menu-panel text-ink"
                data-testid="mobile-menu"
            >
                <Container className="flex h-[4.5rem] flex-none items-center justify-between">
                    <h2 id={menuTitleId} className="sr-only">
                        Site navigation
                    </h2>
                    <Link
                        to="/"
                        className="inline-flex items-center"
                        aria-label="Classific home"
                        onClick={closeMenu}
                    >
                        <Wordmark className="h-8 w-auto object-contain" variant="dark" />
                    </Link>
                    <button
                        type="button"
                        className="inline-flex h-11 w-11 items-center justify-center border border-rule text-ink transition-colors hover:border-ink"
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
                <nav aria-label="Mobile" className="flex flex-1 flex-col border-t border-rule">
                    <Container className="flex flex-1 flex-col">
                        <ul className="divide-y divide-rule">
                            {navigation.map((item, index) => (
                                <li
                                    key={item.href}
                                    data-menu-item
                                    style={{ "--menu-i": index } as React.CSSProperties}
                                >
                                    <NavLink
                                        to={item.href}
                                        onClick={closeMenu}
                                        className={({ isActive }) =>
                                            [
                                                "flex items-baseline justify-between py-5 text-h1 tracking-tight transition-colors",
                                                isActive
                                                    ? "text-accent"
                                                    : "text-ink hover:text-accent",
                                            ].join(" ")
                                        }
                                    >
                                        {item.label}
                                        <span
                                            className="font-mono text-small tabular-nums text-muted"
                                            aria-hidden="true"
                                        >
                                            0{index + 1}
                                        </span>
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                        <div
                            className="mt-auto py-8"
                            data-menu-item
                            style={{ "--menu-i": navigation.length } as React.CSSProperties}
                        >
                            <ButtonLink
                                to={cta.href}
                                variant="primary"
                                withArrow
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
