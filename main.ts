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

Deno.serve(app.fetch);
