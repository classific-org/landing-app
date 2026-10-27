import { describe, expect, it } from "vitest";
import { auditThemeContrast } from "@sometic/theme";
import { meetsWcagContrast } from "@sometic/theme/contrast";
import {
    applyClassificTheme,
    classificTokens,
    createClassificThemeController,
} from "@/theme/classific";

describe("Classific theme", () => {
    it("passes the Sometic AA contrast audit for ink, body, accent and inverse pairs", () => {
        const audit = auditThemeContrast(classificTokens, "AA");
        expect(audit.ok).toBe(true);
        expect(audit.violations).toEqual([]);
        expect(meetsWcagContrast("#111315", "#F7F7F4", "AA")).toBe(true);
        expect(meetsWcagContrast("#62666B", "#F7F7F4", "AA")).toBe(true);
        expect(meetsWcagContrast("#FFFFFF", "#111315", "AA")).toBe(true);
        expect(meetsWcagContrast("#245BDB", "#F7F7F4", "AA")).toBe(true);
    });

    it("applies the light theme to an element", () => {
        const styles = new Map<string, string>();
        const attributes = new Map<string, string>();
        const element = {
            style: {
                setProperty: (name: string, value: string) => {
                    styles.set(name, value);
                },
                removeProperty: (name: string) => {
                    styles.delete(name);
                },
            },
            setAttribute: (name: string, value: string) => {
                attributes.set(name, value);
            },
            removeAttribute: (name: string) => {
                attributes.delete(name);
            },
        };

        const controller = applyClassificTheme(element);
        expect(createClassificThemeController().get().resolvedThemeId).toBe("classific");
        expect(controller.get().resolvedColorScheme).toBe("light");
        expect(styles.size).toBeGreaterThan(0);
    });
});
