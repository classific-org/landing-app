import { createServer } from "vite";

export async function withViteSsr(root, callback) {
    const vite = await createServer({
        root,
        server: { middlewareMode: true },
        appType: "custom",
        logLevel: "error",
    });
    try {
        return await callback(vite);
    } finally {
        await vite.close();
    }
}
