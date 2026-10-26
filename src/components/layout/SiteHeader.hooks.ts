import { useCallback, useEffect, useId, useState } from "react";
import { useLocation } from "react-router";
import { primaryCta, primaryNavigation } from "@/data/navigation";
import type { NavItem } from "@/types/content";

const DESKTOP_QUERY = "(min-width: 64rem)";

export function isNavItemActive(pathname: string, href: string): boolean {
    if (href === "/") {
        return pathname === "/";
    }
    return pathname === href || pathname.startsWith(`${href}/`);
}

export type SiteHeaderViewModel = {
    navigation: NavItem[];
    cta: NavItem;
    pathname: string;
    isMenuOpen: boolean;
    menuId: string;
    menuTitleId: string;
    openMenu: () => void;
    closeMenu: () => void;
    setMenuOpen: (open: boolean) => void;
    isActive: (href: string) => boolean;
};

export function useSiteHeader(): SiteHeaderViewModel {
    const { pathname } = useLocation();
    const [isMenuOpen, setMenuOpen] = useState(false);
    const menuId = useId();
    const menuTitleId = useId();

    useEffect(() => {
        setMenuOpen(false);
    }, [pathname]);

    useEffect(() => {
        if (!isMenuOpen || typeof window === "undefined") {
            return;
        }
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setMenuOpen(false);
            }
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [isMenuOpen]);

    useEffect(() => {
        if (!isMenuOpen || typeof window === "undefined" || typeof window.matchMedia !== "function") {
            return;
        }
        const media = window.matchMedia(DESKTOP_QUERY);
        const handleChange = (event: MediaQueryListEvent) => {
            if (event.matches) {
                setMenuOpen(false);
            }
        };
        media.addEventListener("change", handleChange);
        return () => media.removeEventListener("change", handleChange);
    }, [isMenuOpen]);

    const openMenu = useCallback(() => setMenuOpen(true), []);
    const closeMenu = useCallback(() => setMenuOpen(false), []);
    const isActive = useCallback((href: string) => isNavItemActive(pathname, href), [pathname]);

    return {
        navigation: primaryNavigation,
        cta: primaryCta,
        pathname,
        isMenuOpen,
        menuId,
        menuTitleId,
        openMenu,
        closeMenu,
        setMenuOpen,
        isActive,
    };
}
