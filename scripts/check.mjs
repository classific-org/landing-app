import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { requireProductionOrigin } from "./lib/origin.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function run(command, args) {
    return new Promise((resolve, reject) => {
        const child = spawn(command, args, {
            cwd: root,
            stdio: "inherit",
            shell: process.platform === "win32",
            env: process.env,
        });
        child.on("exit", (code) => {
            if (code === 0) {
                resolve();
            } else {
                reject(new Error(`${command} ${args.join(" ")} exited with code ${code}`));
            }
        });
        child.on("error", reject);
    });
}

requireProductionOrigin(process.env.SITE_ORIGIN);

const steps = [
    ["bun", ["run", "typecheck"]],
    ["bun", ["run", "lint"]],
    ["bun", ["run", "test:coverage"]],
    ["bun", ["run", "build"]],
    ["bun", ["run", "test:e2e"]],
];

for (const [command, args] of steps) {
    console.log(`\n==> ${command} ${args.join(" ")}\n`);
    await run(command, args);
}

console.log("\nAll checks passed.");
