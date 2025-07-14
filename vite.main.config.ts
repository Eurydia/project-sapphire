import viteReact from "@vitejs/plugin-react";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import { defineConfig } from "vite";

// https://vitejs.dev/config
export default defineConfig({
  plugins: [
    tanstackRouter({
      autoCodeSplitting: true,
      routesDirectory: "./src/renderer/routes",
      generatedRouteTree: "./src/renderer/routeTree.gen.ts",
    }),
    viteReact(),
  ],
  build: {
    rollupOptions: {
      external: ["sqlite3"],
    },
    commonjsOptions: {
      ignore: [
        "@google-cloud/spanner",
        "@sap/hana-client",
        "better-sqlite3",
        "hdb-pool",
        "ioredis",
        "mongodb",
        "mssql",
        "mysql2",
        "oracledb",
        "pg",
        "pg-native",
        "pg-query-stream",
        "redis",
        "sql.js",
        "ts-node",
        "typeorm-aurora-data-api-driver",
        "@sap/hana-client/extension/Stream",
        "sqlite3",
      ],
    },
  },
});
