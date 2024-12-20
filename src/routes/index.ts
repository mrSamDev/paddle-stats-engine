import { Hono } from "hono";
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

app.route("/auth", authRoutes);

//registering auth middleware
app.use("/leaderboard/*", createAuthMiddleware());

app.route("/leaderboard", leaderboard);

export default app;
