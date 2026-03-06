# 🖥️ GitHub Terminal Widget

An animated retro terminal SVG widget that displays your GitHub stats in real-time, styled like a hacker terminal with typing animations, CRT scanlines, and a neofetch-inspired layout.

## ✨ Features

- **Animated typing effect** — Commands appear character by character
- **CRT scanline overlay** — Retro terminal aesthetic
- **Real GitHub data** — Stats, languages, activity, and top repos from the GitHub API
- **neofetch-style layout** — Familiar to any terminal enthusiast
- **Auto-caching** — 5-minute cache to avoid API rate limits
- **Self-hosted** — Deploy on your own server with Docker

## 🚀 Quick Start

### 1. Set Environment Variables

Create a `.env` file:

```env
GITHUB_USERNAME=RaposoG
GITHUB_TOKEN=ghp_your_token_here   # Optional, but recommended for higher rate limits
PORT=3000
```

### 2. Run with Docker

```bash
docker compose up -d
```

### 3. Add to README

```markdown
[![GitHub Terminal](https://your-server.com/api/terminal)](https://github.com/RaposoG)
```

## 🔧 Local Development

```bash
npm install
node src/server.js
```

Visit `http://localhost:3001/api/terminal` to see the widget.

## 📡 API Endpoint

| Route | Description |
|---|---|
| `GET /api/terminal` | Returns the animated SVG terminal |
| `GET /health` | Health check endpoint |

## 🎨 What it shows

- ASCII art header
- System info (repos, stars, forks, followers)
- Top programming languages with progress bars
- Recent GitHub activity feed
- Top repositories with descriptions
- All wrapped in a beautiful terminal window with animations
