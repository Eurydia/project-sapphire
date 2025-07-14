import { tanstackRouter } from "@tanstack/router-plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import viteTsPath from "vite-tsconfig-paths";

// https://vitejs.dev/config
export default defineConfig({
  plugins: [
    viteTsPath(),
    tanstackRouter({
      autoCodeSplitting: true,
      routesDirectory: "./src/web/routes",
      generatedRouteTree: "./src/web/routeTree.gen.ts",
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
