import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { Env } from "../config/env.ts";

export const createDb = (env: Env) => {
  const client = createClient({
    url: env.DATABASE_URL,
    authToken: env.DATABASE_AUTH_TOKEN,
  });

  return drizzle(client);
};
