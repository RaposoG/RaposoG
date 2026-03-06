const express = require("express");
const { fetchGitHubStats } = require("./github");
const { renderTerminalSVG } = require("./svg");

const app = express();
const PORT = process.env.PORT || 3001;

// Cache stats for 5 minutes to avoid rate limiting
let cachedStats = null;
let cacheTimestamp = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

async function getStats() {
  const now = Date.now();
  if (cachedStats && now - cacheTimestamp < CACHE_TTL) {
    return cachedStats;
  }
  cachedStats = await fetchGitHubStats();
  cacheTimestamp = now;
  return cachedStats;
}

app.get("/api/terminal", async (_req, res) => {
  try {
    const stats = await getStats();

    res.setHeader("Content-Type", "image/svg+xml");
    res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=60");

    return res.send(renderTerminalSVG(stats));
  } catch (err) {
    console.error("Error generating terminal widget:", err.message);
    res.setHeader("Content-Type", "image/svg+xml");
    return res.send(renderTerminalSVG(null));
  }
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

app.listen(PORT, () => {
  console.log(`🖥️  Terminal widget running on http://localhost:${PORT}`);
  console.log(`📡 Widget endpoint: http://localhost:${PORT}/api/terminal`);
});
