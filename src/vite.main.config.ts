import { defineConfig } from "vite";

// https://vitejs.dev/config
export default defineConfig({
  build: {
    rollupOptions: {
      external: ["sqlite3"],
    },
    commonjsOptions: {
      // also make sure Rollup’s commonjs plugin ignores it
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
        // "@google-cloud/spanner",
        // "mongodb",
        // "@sap/hana-client",
        // "@sap/hana-client/extension/Stream",
        // "hdb-pool",
        // "mysql2",
        // "oracledb",
        // "pg",
        // "pg-native",
        // "pg-query-stream",
        // "typeorm-aurora-data-api-driver",
        // "redis",
        // "ioredis",
        // "better-sqlite3",
        // "sql.js",
        // "mssql",
      ],
    },
  },
});
