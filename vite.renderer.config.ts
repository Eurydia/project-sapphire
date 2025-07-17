import { tanstackRouter } from "@tanstack/router-plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { resolve } from "node:path";
import { defineConfig } from "vite";
import tsPath from "vite-tsconfig-paths";
// https://vitejs.dev/config
export default defineConfig({
  plugins: [
    tsPath(),
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
        replacement: resolve(__dirname, "./src/web"),
      },
    ],
  },
  build: {
    outDir: `.vite/renderer`,
    emptyOutDir: true,
  },
});
