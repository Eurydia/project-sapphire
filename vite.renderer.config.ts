import { tanstackRouter } from "@tanstack/router-plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

// https://vitejs.dev/config
export default defineConfig({
  plugins: [
    tanstackRouter({
      autoCodeSplitting: true,
      routesDirectory: "./src/web/routes",
      generatedRouteTree: "./src/web/routeTree.gen.ts",
    }),
    viteReact(),
  ],
  resolve: {
    alias: [
      {
        find: "~",
        replacement: resolve(
          dirname(fileURLToPath(import.meta.url)),
          "./src/web"
        ),
      },
    ],
  },
});
