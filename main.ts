import "jsr:@std/dotenv/load";
import app from "./src/routes/index.ts";

Deno.serve(app.fetch);
