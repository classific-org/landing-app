import {
    applyThemeToElement,
    createThemeController,
    defineSemanticTokens,
    type ThemeController,
    type ThemeDefinition,
} from "@sometic/theme";
import type { ThemeTokens } from "@sometic/theme/tokens";

/**
 * Classific token map for @sometic/theme. Semantic paths required by the contrast
 * auditor (fg, bg, brand, danger) sit alongside the named palette from tokens.css.
 */
export const classificTokens: ThemeTokens = defineSemanticTokens(
    {
        color: {
            bg: "#F7F7F4",
            fg: "#111315",
            brand: "#245BDB",
            danger: "#B3261E",
            ink: "#111315",
            "ink-soft": "#25282B",
            body: "#62666B",
            muted: "#85898D",
            rule: "#E5E5E2",
            paper: "#F7F7F4",
            white: "#FFFFFF",
            accent: "#245BDB",
            "accent-tint": "#EAF0FF",
        },
    },
    { strict: true },
);

export const classificTheme: ThemeDefinition = {
    id: "classific",
    tokens: classificTokens,
    colorScheme: "light",
};

export function createClassificThemeController(): ThemeController {
    return createThemeController({
        themes: [classificTheme],
        defaultThemeId: "classific",
        lightThemeId: "classific",
        mode: "light",
        persist: false,
        prefix: "classific",
    });
}

export function applyClassificTheme(
    element: {
        style: {
            setProperty(name: string, value: string): void;
            removeProperty(name: string): void;
        };
        setAttribute(name: string, value: string): void;
        removeAttribute(name: string): void;
    } = document.documentElement,
): ThemeController {
    const controller = createClassificThemeController();
    applyThemeToElement(element, controller.get());
    return controller;
}
