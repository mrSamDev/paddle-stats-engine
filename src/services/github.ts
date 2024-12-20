import { Env } from "../config/env.ts";
import type { GitHubUserData } from "../types/githhub.ts";

export class GitHubService {
  constructor(private env: Env) {}

  async getAccessToken(code: string): Promise<string> {
    const response = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: this.env.GITHUB_CLIENT_ID,
        client_secret: this.env.GITHUB_CLIENT_SECRET,
        code,
      }),
    });

    const data = await response.json();
    if (!data.access_token) {
      throw new Error("Failed to get access token");
    }

    return data.access_token;
  }

  async getUserData(accessToken: string): Promise<GitHubUserData> {
    const response = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to get user data");
    }

    return response.json();
  }
}
