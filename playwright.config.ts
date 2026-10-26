import { defineConfig, devices } from "@playwright/test";

const previewPort = 4173;
const contactPort = 4174;

export default defineConfig({
    testDir: "./e2e",
    fullyParallel: true,
    forbidOnly: Boolean(process.env.CI),
    retries: process.env.CI ? 2 : 0,
    reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : [["list"]],
    use: {
        trace: "on-first-retry",
        screenshot: "only-on-failure",
    },
    webServer: [
        {
            command: `bunx vite preview --host 127.0.0.1 --port ${previewPort} --strictPort`,
            url: `http://127.0.0.1:${previewPort}`,
            reuseExistingServer: !process.env.CI,
            timeout: 120_000,
        },
        {
            command: `bunx vite --host 127.0.0.1 --port ${contactPort} --strictPort`,
            url: `http://127.0.0.1:${contactPort}`,
            reuseExistingServer: !process.env.CI,
            timeout: 120_000,
            env: {
                SITE_ORIGIN: "https://www.classific.example",
                CONTACT_ENDPOINT: `http://127.0.0.1:${contactPort}/api/enquiry`,
            },
        },
    ],
    projects: [
        {
            name: "chromium",
            use: { ...devices["Desktop Chrome"], baseURL: `http://127.0.0.1:${previewPort}` },
            testIgnore: /contact-endpoint/,
        },
        {
            name: "contact-endpoint",
            use: { ...devices["Desktop Chrome"], baseURL: `http://127.0.0.1:${contactPort}` },
            testMatch: /contact-endpoint/,
        },
    ],
});
