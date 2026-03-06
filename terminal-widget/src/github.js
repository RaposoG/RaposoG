const GITHUB_USERNAME = process.env.GITHUB_USERNAME || "RaposoG";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || "";

async function fetchGitHubStats() {
  const headers = {
    "User-Agent": "github-terminal-widget",
    Accept: "application/vnd.github.v3+json",
  };
  if (GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${GITHUB_TOKEN}`;
  }

  try {
    const [userRes, reposRes, eventsRes] = await Promise.all([
      fetch(`https://api.github.com/users/${encodeURIComponent(GITHUB_USERNAME)}`, { headers }),
      fetch(`https://api.github.com/users/${encodeURIComponent(GITHUB_USERNAME)}/repos?per_page=100&sort=updated`, { headers }),
      fetch(`https://api.github.com/users/${encodeURIComponent(GITHUB_USERNAME)}/events/public?per_page=30`, { headers }),
    ]);

    if (!userRes.ok) {
      throw new Error(`GitHub API error: ${userRes.status}`);
    }

    const user = await userRes.json();
    const repos = reposRes.ok ? await reposRes.json() : [];
    const events = eventsRes.ok ? await eventsRes.json() : [];

    // Calculate stats
    const totalStars = repos.reduce((sum, r) => sum + (r.stargazers_count || 0), 0);
    const totalForks = repos.reduce((sum, r) => sum + (r.forks_count || 0), 0);

    // Language stats
    const langCount = {};
    for (const repo of repos) {
      if (repo.language) {
        langCount[repo.language] = (langCount[repo.language] || 0) + 1;
      }
    }
    const topLangs = Object.entries(langCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([lang, count]) => ({ lang, count, pct: Math.round((count / repos.length) * 100) }));

    // Recent activity
    const recentActivity = events.slice(0, 5).map((ev) => {
      const repo = ev.repo?.name?.split("/")[1] || ev.repo?.name || "unknown";
      switch (ev.type) {
        case "PushEvent":
          return { icon: "⚡", text: `Pushed ${ev.payload?.commits?.length || 0} commit(s) to ${repo}` };
        case "CreateEvent":
          return { icon: "✨", text: `Created ${ev.payload?.ref_type || "repo"} in ${repo}` };
        case "PullRequestEvent":
          return { icon: "🔀", text: `${ev.payload?.action} PR in ${repo}` };
        case "IssuesEvent":
          return { icon: "📋", text: `${ev.payload?.action} issue in ${repo}` };
        case "WatchEvent":
          return { icon: "⭐", text: `Starred ${repo}` };
        case "ForkEvent":
          return { icon: "🍴", text: `Forked ${repo}` };
        case "DeleteEvent":
          return { icon: "🗑️", text: `Deleted ${ev.payload?.ref_type} in ${repo}` };
        case "ReleaseEvent":
          return { icon: "🚀", text: `Released ${ev.payload?.release?.tag_name || "version"} in ${repo}` };
        default:
          return { icon: "📡", text: `${ev.type.replace("Event", "")} in ${repo}` };
      }
    });

    // Top repos by stars
    const topRepos = repos
      .filter((r) => !r.fork)
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, 3)
      .map((r) => ({
        name: r.name,
        stars: r.stargazers_count,
        lang: r.language || "N/A",
        description: r.description || "",
      }));

    return {
      username: user.login,
      name: user.name || user.login,
      bio: user.bio || "",
      publicRepos: user.public_repos,
      followers: user.followers,
      following: user.following,
      totalStars,
      totalForks,
      topLangs,
      recentActivity,
      topRepos,
      createdAt: user.created_at,
    };
  } catch (err) {
    console.error("GitHub API error:", err.message);
    return null;
  }
}

module.exports = { fetchGitHubStats };
