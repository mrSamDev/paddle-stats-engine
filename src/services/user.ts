import { createDb } from "../db/client.ts";
import { User, users } from "../db/schema.ts";
import { eq, sql, desc } from "drizzle-orm";
import { GitHubUserData } from "../types/githhub.ts";
import { UserReturnType } from "../types/returntypes.ts";

interface LeaderboardEntry {
  rank: number;
  githubUsername: string;
  avatarUrl: string;
  profileUrl: string;
  score: number;
}

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
      createdAt: new Date(),
      updatedAt: new Date(),
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
    console.log("user: ", user);

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }

  async getTopLeaderboard(): Promise<LeaderboardEntry[]> {
    const topUsers = await this.db
      .select({
        githubUsername: users.githubUsername,
        avatarUrl: users.avatarUrl,
        profileUrl: users.profileUrl,
        score: users.score,
      })
      .from(users)
      .orderBy(desc(users.score))
      .limit(10)
      .all();

    return topUsers.map((user, index) => ({
      ...user,
      rank: index + 1,
    }));
  }

  async getUser(userId: string): Promise<UserReturnType> {
    const user = await this.db
      .select({
        githubUsername: users.githubUsername,
        avatarUrl: users.avatarUrl,
        profileUrl: users.profileUrl,
        score: users.score,
      })
      .from(users)
      .where(eq(users.id, userId))
      .get();

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }

  async getUsersByScore(minScore: number): Promise<User[]> {
    return await this.db
      .select()
      .from(users)
      .where(sql`${users.score} >= ${minScore}`)
      .orderBy(desc(users.score))
      .all();
  }

  async getTopUsersByTimeframe(days: number): Promise<LeaderboardEntry[]> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const topUsers = await this.db
      .select({
        githubUsername: users.githubUsername,
        avatarUrl: users.avatarUrl,
        profileUrl: users.profileUrl,
        score: users.score,
      })
      .from(users)
      .where(sql`${users.updatedAt} >= ${cutoffDate}`)
      .orderBy(desc(users.score))
      .limit(10)
      .all();

    return topUsers.map((user, index) => ({
      ...user,
      rank: index + 1,
    }));
  }

  async getTotalUsers(): Promise<number> {
    const result = await this.db
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .get();

    return result?.count ?? 0;
  }

  async deleteUser(userId: string): Promise<void> {
    await this.db.delete(users).where(eq(users.id, userId));
  }

  async updateUserProfile(userId: string, updates: Partial<Pick<User, "name" | "avatarUrl" | "profileUrl">>): Promise<User> {
    await this.db
      .update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(users.id, userId));

    const user = await this.db.select().from(users).where(eq(users.id, userId)).get();

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }
}
