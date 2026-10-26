import { describe, expect, it } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { isNavItemActive, useSiteHeader } from "@/components/layout/SiteHeader.hooks";

function renderHeader(path = "/") {
    return renderHook(() => useSiteHeader(), {
        wrapper: ({ children }) => <MemoryRouter initialEntries={[path]}>{children}</MemoryRouter>,
    });
}

describe("site header behaviour", () => {
    it("marks nested service routes as active", () => {
        expect(isNavItemActive("/", "/")).toBe(true);
        expect(isNavItemActive("/services", "/")).toBe(false);
        expect(isNavItemActive("/services/web-applications", "/services")).toBe(true);
        expect(isNavItemActive("/work", "/services")).toBe(false);
    });

    it("opens and closes the mobile menu", () => {
        const { result } = renderHeader("/about");
        expect(result.current.isMenuOpen).toBe(false);
        act(() => result.current.openMenu());
        expect(result.current.isMenuOpen).toBe(true);
        act(() => result.current.closeMenu());
        expect(result.current.isMenuOpen).toBe(false);
        expect(result.current.isActive("/about")).toBe(true);
        expect(result.current.cta.href).toBe("/contact");
    });

    it("closes the menu when Escape is pressed", () => {
        const { result } = renderHeader();
        act(() => result.current.openMenu());
        expect(result.current.isMenuOpen).toBe(true);
        act(() => {
            window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
        });
        expect(result.current.isMenuOpen).toBe(false);
    });

    it("closes the menu when the viewport becomes desktop", () => {
        const listeners = new Set<(event: MediaQueryListEvent) => void>();
        window.matchMedia = (query: string) =>
            ({
                matches: false,
                media: query,
                onchange: null,
                addEventListener: (_event: string, listener: (event: MediaQueryListEvent) => void) => {
                    listeners.add(listener);
                },
                removeEventListener: (_event: string, listener: (event: MediaQueryListEvent) => void) => {
                    listeners.delete(listener);
                },
                addListener: () => undefined,
                removeListener: () => undefined,
                dispatchEvent: () => false,
            }) as MediaQueryList;

        const { result } = renderHeader();
        act(() => result.current.openMenu());
        expect(result.current.isMenuOpen).toBe(true);
        act(() => {
            for (const listener of listeners) {
                listener({ matches: true } as MediaQueryListEvent);
            }
        });
        expect(result.current.isMenuOpen).toBe(false);
    });
});
