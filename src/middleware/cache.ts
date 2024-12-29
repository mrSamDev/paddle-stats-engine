import { cache as hcache } from "hono/cache";

export const cache = (time = "120") => {
  console.log("time: ", time);
  return hcache({ cacheName: "paddle-server", cacheControl: "max-age=" + time, wait: true });
};
