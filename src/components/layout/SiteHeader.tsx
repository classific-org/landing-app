import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import { openEnquiry, scrollToSection } from "@/lib/smooth-scroll";
import { Dialog } from "@sometic/react/overlay";
import { Container } from "@/components/layout/Container";
import { useScrolled } from "@/components/motion/motion.hooks";
import { Wordmark } from "@/components/ui/Wordmark";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { useSiteHeader } from "@/components/layout/SiteHeader.hooks";

/** Sections the header turns dark over: the dark heroes and any section on the ink ground. */
const DARK_GROUND = ".hero, [data-dark-hero], section.bg-ink";

/**
 * Navigation jumps to the home page's sections: on the home page it glides there; elsewhere
 * (the legal pages) it is a plain link to the section on the home page.
 */
function jumpTo(event: React.MouseEvent<HTMLAnchorElement>, href: string) {
    const id = href.split("#")[1];
    if (id && scrollToSection(id)) {
        event.preventDefault();
    }
}

/** Start a Project opens the enquiry form on the home page; elsewhere it links there. */
function enquire(event: React.MouseEvent<HTMLAnchorElement>) {
    if (document.getElementById("contact")) {
        event.preventDefault();
        openEnquiry();
    }
}

export function SiteHeader() {
    const { navigation, cta, isMenuOpen, menuId, menuTitleId, openMenu, closeMenu, setMenuOpen } =
        useSiteHeader();
    const [scrolled, setScrolled] = useState(false);
    useScrolled(8, setScrolled);

    // The header takes the tone of whatever section is passing under it, so it stays dark over
    // the hero and every dark section after it. An observer watches a one-pixel line just under
    // the header and reports only when a dark section starts or stops crossing it (no work on
    // every scroll frame); its first report also sets the right tone as the page loads. The
    // initial guess keeps the server-rendered header right until then.
    const { pathname } = useLocation();
    const [dark, setDark] = useState(!/^\/insights\/./.test(pathname));
    useEffect(() => {
        if (typeof IntersectionObserver === "undefined") {
            return;
        }
        let observer: IntersectionObserver | null = null;
        const crossing = new Set<Element>();
        const watch = () => {
            observer?.disconnect();
            crossing.clear();
            const header = document.querySelector<HTMLElement>(".site-header");
            const line = Math.round(header?.getBoundingClientRect().bottom ?? 72);
            const below = Math.max(0, window.innerHeight - line - 1);
            observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            crossing.add(entry.target);
                        } else {
                            crossing.delete(entry.target);
                        }
                    });
                    setDark(crossing.size > 0);
                },
                { rootMargin: `-${line}px 0px -${below}px 0px` },
            );
            document
                .querySelectorAll(`main :is(${DARK_GROUND})`)
                .forEach((section) => observer?.observe(section));
        };
        watch();
        window.addEventListener("resize", watch, { passive: true });
        return () => {
            observer?.disconnect();
            window.removeEventListener("resize", watch);
        };
    }, [pathname]);

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
                    {/* Both logos stay loaded; the tone only shows one or the other, so a
                        switch never swaps an image. */}
                    <Wordmark
                        className={`h-8 w-auto object-contain sm:h-9 ${dark ? "" : "hidden"}`}
                        variant="chrome"
                    />
                    <Wordmark
                        className={`h-8 w-auto object-contain sm:h-9 ${dark ? "hidden" : ""}`}
                        variant="dark"
                    />
                </Link>

                <nav aria-label="Primary" className="hidden items-center gap-9 lg:flex">
                    {navigation.map((item) => (
                        <Link
                            key={item.href}
                            to={item.href}
                            className="nav-link"
                            onClick={(event) => jumpTo(event, item.href)}
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="hidden items-center gap-6 lg:flex">
                    <ButtonLink
                        to={cta.href}
                        variant={dark ? "ghost-inverse" : "secondary"}
                        withArrow
                        onClick={enquire}
                        className="btn-sm"
                        cursor="TALK"
                    >
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
                                    <Link
                                        to={item.href}
                                        onClick={(event) => {
                                            closeMenu();
                                            jumpTo(event, item.href);
                                        }}
                                        className="flex items-baseline justify-between py-5 text-h1 tracking-tight text-ink transition-colors hover:text-accent"
                                    >
                                        {item.label}
                                        <span
                                            className="font-mono text-small tabular-nums text-muted"
                                            aria-hidden="true"
                                        >
                                            0{index + 1}
                                        </span>
                                    </Link>
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
                                onClick={(event) => {
                                    closeMenu();
                                    enquire(event);
                                }}
                                className="w-full"
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
