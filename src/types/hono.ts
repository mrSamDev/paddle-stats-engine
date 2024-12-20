import { Env } from "hono";
import { User } from "../db/schema.ts";
import { createDb } from "../db/client.ts";

type Variables = {
  user: User | null;
  db: ReturnType<typeof createDb>;
  userId?: string;
};
export type AppContext = {
  Bindings: Env;
  Variables: Variables;
};
