import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "sqlite",
  schema: "./src/database/schema",
  out: "./src-tauri/database/migrations",
  // driver: "pglite",
  // dbCredentials: {
  //   url: "./database/",
  // },

  // extensionsFilters: ["postgis"],
  // schemaFilter: "public",
  // tablesFilter: "*",

  // introspect: {
  //   casing: "camel",
  // },

  // migrations: {
  //   prefix: "timestamp",
  //   table: "__drizzle_migrations__",
  //   schema: "public",
  // },

  // breakpoints: true,
  // strict: true,
  // verbose: true,
});
