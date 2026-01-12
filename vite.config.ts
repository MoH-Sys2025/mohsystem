import path from "path"
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// @ts-expect-error process is a nodejs global
const host = process.env.TAURI_DEV_HOST;

// https://vite.dev/config/
export default defineConfig(async () => ({
  plugins: [react({
      jsxRuntime: 'automatic', // Use new JSX transform
      include: '**/*.{ts,tsx,js,jsx}', // ensure JSX in TSX/JSX files is processed
  }), tailwindcss()],
    optimizeDeps: {
        include: ["react-virtuoso"],
        exclude: ['src-tauri/target', '**/*.json'], // ignore JSON files
        force: true
    },
    build: {
        rollupOptions: {
            external: ['src-tauri/target', '**/*.json'], // prevent JSON from being parsed as JS
        },
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
        extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
    },
  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  //
  // 1. prevent Vite from obscuring rust errors
  clearScreen: false,
  // 2. tauri expects a fixed port, fail if that port is not available
  server: {
    port: 1420,
    strictPort: true,
    host: host || false,
    hmr: host
      ? {
          protocol: "ws",
          host,
          port: 1421,
        }
      : undefined,
    watch: {
      // 3. tell Vite to ignore watching `src-tauri`
      ignored: ["**/src-tauri/**"],
    },
  },
}));
