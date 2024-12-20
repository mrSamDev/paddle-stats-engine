import "jsr:@std/dotenv/load";
import { cors } from "hono/cors";
import app from "./src/routes/index.ts";

/* 
todo: update for origin for prod url
origin: ["https://mrsamdev-paddle-game.netlify.app/"], // Configure this for production
credentials: true,
*/

app.use("*", cors());

app.get("/", (c) => c.text("Hello Deno!"));

app.get("/health", (c) => c.json({ status: "ok" }));

Deno.serve(app.fetch);
