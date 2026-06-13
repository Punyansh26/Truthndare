/**
 * Calculate MVP awards for the leaderboard
 */
export function calculateMVPs(players) {
  if (!players || players.length === 0) return {};

  const mvps = {};

  // Most Daring 🔥 — most dares completed
  const mostDaring = [...players].sort((a, b) =>
    (b.stats?.daresCompleted || 0) - (a.stats?.daresCompleted || 0)
  )[0];
  if (mostDaring?.stats?.daresCompleted > 0) {
    mvps.mostDaring = mostDaring.id;
  }

  // Most Honest 💬 — most truths completed
  const mostHonest = [...players].sort((a, b) =>
    (b.stats?.truthsCompleted || 0) - (a.stats?.truthsCompleted || 0)
  )[0];
  if (mostHonest?.stats?.truthsCompleted > 0) {
    mvps.mostHonest = mostHonest.id;
  }

  // Biggest Skipper 😅 — most skips used
  const biggestSkipper = [...players].sort((a, b) =>
    (b.stats?.skipsUsed || 0) - (a.stats?.skipsUsed || 0)
  )[0];
  if (biggestSkipper?.stats?.skipsUsed > 0) {
    mvps.biggestSkipper = biggestSkipper.id;
  }

  return mvps;
}

/**
 * Calculate completion rate for a player
 */
export function getCompletionRate(player) {
  const total = (player.stats?.truthsCompleted || 0) +
    (player.stats?.daresCompleted || 0) +
    (player.stats?.skipsUsed || 0);
  if (total === 0) return 0;
  const completed = (player.stats?.truthsCompleted || 0) + (player.stats?.daresCompleted || 0);
  return Math.round((completed / total) * 100);
}

/**
 * Get ranked players list
 */
export function getRankedPlayers(players) {
  return [...players].sort((a, b) => b.score - a.score);
}
