import "jsr:@std/dotenv/load";
import { assertEquals } from "@std/assert";
import app from "./src/routes/index.ts";

Deno.test("Base API", async () => {
  const res = await app.request("/");
  assertEquals(res.status, 200);
});

Deno.test("Status API", async () => {
  const res = await app.request("/health");
  const json = await res.json();
  assertEquals(json, { status: "ok" });
});
