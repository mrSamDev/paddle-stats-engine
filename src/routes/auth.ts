import env from "../config/env.ts";
import { Hono } from "hono";
import { GitHubService } from "../services/github.ts";
import { AppContext } from "../types/hono.ts";
import { sign } from "hono/jwt";
import { UserService } from "../services/user.ts";

const authRoutes = new Hono<AppContext>();

authRoutes.get("/github", (c) => {
  const redirectUrl = `https://github.com/login/oauth/authorize?client_id=${env.GITHUB_CLIENT_ID}&scope=user`;
  return c.redirect(redirectUrl);
});

authRoutes.get("/github/callback", async (c) => {
  const code = c.req.query("code");

  if (!code) {
    return c.json({ error: "No code provided" }, 400);
  }

  try {
    const db = c.get("db");
    const githubService = new GitHubService(env);
    const userService = new UserService(db);
    const accessToken = await githubService.getAccessToken(code);

    const userData = await githubService.getUserData(accessToken);

    let user = await userService.findByGithubUsername(userData.login);

    if (!user) {
      user = await userService.createUser(userData);
    }

    const token = await sign({ userId: user.id }, env.JWT_SECRET);

    return c.json({ token });
  } catch (error) {
    return c.json({ error: "Authentication failed" }, 401);
  }
});

export default authRoutes;
