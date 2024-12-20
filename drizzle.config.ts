import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./migrations",
  dialect: "turso",
  dbCredentials: {
    url: Deno.env.get("DATABASE_URL")!,
    authToken: Deno.env.get("DATABASE_AUTH_TOKEN")!,
  },
});
