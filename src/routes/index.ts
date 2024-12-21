import { Hono } from "hono";
import { cache } from "hono/cache";
import { cors } from "hono/cors";
import env from "../config/env.ts";
import { createDb } from "../db/client.ts";
import authRoutes from "./auth.ts";
import { AppContext } from "../types/hono.ts";
import leaderboard from "./leaderboard.ts";
import { createAuthMiddleware } from "../middleware/auth.ts";

const db = createDb(env);

const app = new Hono<AppContext>();

app.use("*", async (c, next) => {
  c.set("db", db);
  await next();
});

// app.get("*", cache({ cacheName: "paddle-server", cacheControl: "max-age=3600", wait: true }));

app.use(
  "*",
  cors({
    origin: ["https://mrsamdev-paddle-game.netlify.app", "http://localhost:3000"],
  })
);

app.route("/auth", authRoutes);

app.use("/leaderboard/*", createAuthMiddleware());

app.route("/leaderboard", leaderboard);

app.get("/", (c) => c.text("Hello Deno!"));

app.get("/health", (c) => c.json({ status: "ok" }));

app.onError((err, c) => {
  console.error(`[${new Date().toISOString()}] Error:`, err);
  return c.json(
    {
      error: "Internal server error",
      message: err.message,
    },
    500
  );
});

app.notFound((c) => {
  return c.json({ error: "Not found" }, 404);
});

export default app;
