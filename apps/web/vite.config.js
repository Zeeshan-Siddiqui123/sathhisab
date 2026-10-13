import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    server: {
        port: 5173,
        proxy: {
            "/image/upload": {
                target: "https://res.cloudinary.com/dqaqtqigh",
                changeOrigin: true,
            },
            "/api": {
                target: "http://localhost:5000",
                changeOrigin: true,
            },
        },
    },
});
