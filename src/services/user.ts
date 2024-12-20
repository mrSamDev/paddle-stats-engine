import { createDb } from "../db/client.ts";
import { User, users } from "../db/schema.ts";
import { eq } from "drizzle-orm";
import { GitHubUserData } from "../types/githhub.ts";

export class UserService {
  constructor(private db: ReturnType<typeof createDb>) {}

  async findByGithubUsername(githubUsername: string): Promise<User | undefined> {
    return await this.db.select().from(users).where(eq(users.githubUsername, githubUsername)).get();
  }

  async createUser(userDetails: GitHubUserData): Promise<User> {
    const id = crypto.randomUUID();
    await this.db.insert(users).values({
      id,
      githubUsername: userDetails.login,
      avatarUrl: userDetails.avatar_url,
      url: userDetails.url,
      profileUrl: userDetails.html_url,
      name: userDetails.name,
      score: 0,
    });

    const user = await this.db.select().from(users).where(eq(users.id, id)).get();

    if (!user) {
      throw new Error("Failed to create user");
    }

    return user;
  }

  async updateScore(userId: string, score: number): Promise<User> {
    await this.db.update(users).set({ score, updatedAt: new Date() }).where(eq(users.id, userId));

    const user = await this.db.select().from(users).where(eq(users.id, userId)).get();

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }

  async getLeaderboard(): Promise<Pick<User, "githubUsername" | "score">[]> {
    return await this.db
      .select({
        githubUsername: users.githubUsername,
        score: users.score,
      })
      .from(users)
      .orderBy(users.score)
      .all();
  }
}
