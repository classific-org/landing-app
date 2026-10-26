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
