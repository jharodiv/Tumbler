import { fileURLToPath, URL } from "node:url";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), "");

    return {
        plugins: [react()],
        resolve: {
            alias: {
                "@": fileURLToPath(new URL("./src", import.meta.url)),
            },
        },
        server: {
            // Matches the backend's default CORS_ORIGIN
            port: 3000,
            // Proxying /api keeps the session cookie same-origin during development
            proxy: {
                "/api": {
                    target: env.VITE_API_PROXY_TARGET || "http://localhost:5001",
                    changeOrigin: true,
                },
            },
        },
    };
});
