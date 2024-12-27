import { cache as hcache } from "hono/cache";

export const cache = () => {
  return hcache({ cacheName: "paddle-server", cacheControl: "max-age=120", wait: true });
};
