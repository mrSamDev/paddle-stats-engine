import { Hono } from "hono";
import { UserService } from "../services/user.ts";
import { AppContext } from "../types/hono.ts";

const leaderboard = new Hono<AppContext>();

leaderboard.get("/", async (c) => {
  try {
    const db = c.get("db");
    const userService = new UserService(db);
    const leaderboard = await userService.getLeaderboard();
    return c.json(leaderboard);
  } catch (error) {
    console.error("Leaderboard error:", error);
    return c.json({ error: "Failed to fetch leaderboard" }, 500);
  }
});

leaderboard.put("/score", async (c) => {
  const { score } = await c.req.json<{ score: number }>();
  const userId = c.get("userId");

  if (!userId) throw new Error("userId is required");

  try {
    const db = c.get("db");
    const userService = new UserService(db);
    const updatedUser = await userService.updateScore(userId, score);
    return c.json(updatedUser);
  } catch (error) {
    console.error("Score update error:", error);
    return c.json({ error: "Failed to update score" }, 500);
  }
});

export default leaderboard;
