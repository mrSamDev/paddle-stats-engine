import { Hono } from "hono";
import { cors } from "hono/cors";
import env from "../config/env.ts";
import { createDb } from "../db/client.ts";
import authRoutes from "./auth.ts";
import { AppContext } from "../types/hono.ts";
import leaderboard from "./leaderboard.ts";
import { createAuthMiddleware } from "../middleware/auth.ts";

function getRandomString(s: number) {
  if (s % 2 == 1) {
    throw new Deno.errors.InvalidData("Only even sizes are supported");
  }
  const buf = new Uint8Array(s / 2);
  crypto.getRandomValues(buf);
  let ret = "";
  for (let i = 0; i < buf.length; ++i) {
    ret += ("0" + buf[i].toString(16)).slice(-2);
  }
  return ret;
}

const id = getRandomString(10);

const db = createDb(env);

const app = new Hono<AppContext>();

app.use("*", async (c, next) => {
  c.set("db", db);
  await next();
});

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

app.get("/health", (c) => c.json({ status: "ok", id: id }));

app.onError((err, c) => {
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
