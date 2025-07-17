import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import viteTsPath from "vite-tsconfig-paths";

// https://vitejs.dev/config
export default defineConfig({
  plugins: [viteTsPath(), viteReact()],
  build: {
    rollupOptions: {
      external: ["better-sqlite3"],
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
