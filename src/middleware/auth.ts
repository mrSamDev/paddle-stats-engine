import { jwt } from "hono/jwt";
import env from "../config/env.ts";
import { MiddlewareHandler } from "hono/types";

export const createAuthMiddleware = (): MiddlewareHandler => {
  return jwt({
    secret: env.JWT_SECRET,
  });
};
