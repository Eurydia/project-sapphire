import { swcPlugin } from "electron-vite";
import { defineConfig } from "vite";

// https://vitejs.dev/config
export default defineConfig({
  plugins: [swcPlugin()],
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
