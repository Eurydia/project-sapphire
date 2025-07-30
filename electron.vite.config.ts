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
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
  },
  renderer: {
    resolve: {
      alias: {
        "~": resolve("src/renderer/src"),
      },
    },

    plugins: [
      tanstackRouter({
        target: "react",
        autoCodeSplitting: true,
        routesDirectory: "./src/renderer/src/routes",
        generatedRouteTree:
          "./src/renderer/src/routeTree.gen.ts",
      }),
      viteReact(),
    ],
  },
})
