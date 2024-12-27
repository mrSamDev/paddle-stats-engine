import { Hono } from "hono";
import { UserService } from "../services/user.ts";
import { AppContext } from "../types/hono.ts";

const leaderboard = new Hono<AppContext>();

leaderboard.get("/", async (c) => {
  try {
    const db = c.get("db");
    const userService = new UserService(db);
    const leaderboard = await userService.getTopLeaderboard();

    return c.json({
      leaderboard,
      totalPlayers: await userService.getTotalUsers(),
    });
  } catch (error) {
    console.error("Leaderboard error:", error);
    return c.json({ error: "Failed to fetch leaderboard" }, 500);
  }
});

leaderboard.put("/score", async (c) => {
  try {
    const { score } = await c.req.json<{ score: number }>();
    const userId = c.get("userId");

    if (!userId) {
      return c.json({ error: "Authentication required" }, 401);
    }

    if (typeof score !== "number" || score < 0) {
      return c.json({ error: "Invalid score value" }, 400);
    }

    const db = c.get("db");
    const userService = new UserService(db);

    const [updatedUser, rankInfo] = await Promise.all([userService.updateScore(userId, score), userService.getUserRank(userId)]);

    return c.json({
      user: updatedUser,
      rank: rankInfo,
    });
  } catch (error) {
    console.error("Score update error:", error);
    return c.json({ error: "Failed to update score" }, 500);
  }
});

leaderboard.get("/timeframe/:days", async (c) => {
  try {
    const days = parseInt(c.req.param("days"));

    if (isNaN(days) || days <= 0) {
      return c.json({ error: "Invalid days parameter" }, 400);
    }

    const db = c.get("db");
    const userService = new UserService(db);
    const leaders = await userService.getTopUsersByTimeframe(days);

    return c.json({
      timeframe: `${days} days`,
      leaders,
    });
  } catch (error) {
    console.error("Timeframe leaderboard error:", error);
    return c.json({ error: "Failed to fetch timeframe leaderboard" }, 500);
  }
});

export default leaderboard;
