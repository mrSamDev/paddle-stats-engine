import { Hono } from "hono";
import { cors } from "hono/cors";

const app = new Hono().basePath("/api/v1");

/* 

todo: update for origin for prod url
origin: ["https://mrsamdev-paddle-game.netlify.app/"], // Configure this for production
credentials: true,

*/

app.use("*", cors());

app.get("/", (c) => c.text("Hello Deno!"));

app.get("/health", (c) => c.json({ status: "ok" }));

Deno.serve(app.fetch);
