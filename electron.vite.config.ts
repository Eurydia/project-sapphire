import { tanstackRouter } from "@tanstack/router-plugin/vite"
import viteReact from "@vitejs/plugin-react"
import {
  defineConfig,
  externalizeDepsPlugin,
} from "electron-vite"
import { resolve } from "path"

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    build: {
      rollupOptions: {
        external: ["call-bind-apply-helpers", "typeorm"],
      },
    },
    resolve: {
      alias: {
        "#": resolve("src/shared"),
        "@": resolve("src/main"),
      },
    },
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
  },
  renderer: {
    resolve: {
      alias: {
        "@": resolve("src/renderer"),
        "#": resolve("src/shared"),
      },
    },

    plugins: [
      tanstackRouter({
        target: "react",
        autoCodeSplitting: true,
        routesDirectory: "./src/renderer/routes",
        generatedRouteTree: "./src/renderer/routeTree.gen.ts",
      }),
      viteReact(),
    ],
  },
})
