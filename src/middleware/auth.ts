import { jwt } from "hono/jwt";
import env from "../config/env.ts";
import { MiddlewareHandler } from "hono/types";

export const createAuthMiddleware = (): MiddlewareHandler => {
  return jwt({
    secret: env.JWT_SECRET,
  });
};

// export const createAuthMiddleware = (): MiddlewareHandler => {
//   return async (c, next) => {
//     const jwtToken = await jwt({
//       secret: env.JWT_SECRET,
//     })(c, next);

//     const payload = c.get("jwtPayload");

//     const userId = payload.sub;

//     c.set("userId", userId);

//     return jwtToken;
//   };
// };
