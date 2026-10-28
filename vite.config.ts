/// <reference types="vitest/config" />
import { fileURLToPath, URL } from "node:url";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), "");
    const siteOrigin = env.SITE_ORIGIN ?? process.env.SITE_ORIGIN ?? "";
    const contactEndpoint = env.CONTACT_ENDPOINT ?? process.env.CONTACT_ENDPOINT ?? "";

    return {
        plugins: [react(), tailwindcss()],
        resolve: {
            alias: {
                "@": fileURLToPath(new URL("./src", import.meta.url)),
            },
            // One React for the app and for every @sometic package that renders with it.
            dedupe: ["react", "react-dom"],
        },
        optimizeDeps: {
            /*
             * Pre-bundle every dependency up front. Vite otherwise discovers some of these
             * lazily (for example @sometic/react/structure, first used by a page with
             * breadcrumbs), re-optimizes mid-session and leaves the open page with modules from
             * two cache generations, each carrying its own copy of React. That crashes with
             * "Cannot read properties of null (reading 'useMemo')". Declaring them here makes
             * the first optimization pass complete.
             */
            include: [
                "react",
                "react-dom",
                "react-dom/client",
                "react/jsx-runtime",
                "react/jsx-dev-runtime",
                "react-router",
                "@sometic/dom/field",
                "@sometic/forms",
                "@sometic/head",
                "@sometic/head/seo",
                "@sometic/http",
                "@sometic/theme",
                "@sometic/theme/contrast",
                "@sometic/theme/tokens",
                "@sometic/validation",
                "@sometic/react/button",
                "@sometic/react/field",
                "@sometic/react/form",
                "@sometic/react/head",
                "@sometic/react/input",
                "@sometic/react/overlay",
                "@sometic/react/selection",
                "@sometic/react/structure",
            ],
        },
        define: {
            __SITE_ORIGIN__: JSON.stringify(siteOrigin),
            __CONTACT_ENDPOINT__: JSON.stringify(contactEndpoint),
        },
        build: {
            target: "es2022",
            sourcemap: false,
        },
        test: {
            environment: "jsdom",
            globals: false,
            setupFiles: ["./src/test/setup.ts"],
            include: ["src/**/*.test.{ts,tsx}", "scripts/**/*.test.mjs"],
            coverage: {
                provider: "v8",
                reporter: ["text", "html", "lcov"],
                include: [
                    "src/lib/**",
                    "src/content/**",
                    "src/data/**",
                    "src/services/**",
                    "src/config/**",
                    "src/theme/**",
                    "src/components/**/*.hooks.ts",
                    "src/pages/**/*.hooks.ts",
                    "scripts/lib/**",
                ],
                thresholds: {
                    lines: 80,
                    functions: 80,
                    branches: 80,
                    statements: 80,
                },
            },
        },
    };
});
