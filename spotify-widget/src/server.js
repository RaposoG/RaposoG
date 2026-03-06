const express = require("express");
const { getNowPlaying, exchangeCode, getAuthUrl } = require("./spotify");
const { renderSVG } = require("./svg");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/api/spotify", async (_req, res) => {
  try {
    const data = await getNowPlaying();

    res.setHeader("Content-Type", "image/svg+xml");
    res.setHeader("Cache-Control", "s-maxage=1, stale-while-revalidate");

    if (!data || !data.is_playing) {
      return res.send(renderSVG(null));
    }

    const track = {
      title: data.item.name,
      artist: data.item.artists.map((a) => a.name).join(", "),
      album: data.item.album.name,
      albumArt: data.item.album.images[0]?.url,
      songUrl: data.item.external_urls.spotify,
      isPlaying: data.is_playing,
    };

    return res.send(renderSVG(track));
  } catch (err) {
    console.error("Error fetching Spotify data:", err.message);
    res.setHeader("Content-Type", "image/svg+xml");
    return res.send(renderSVG(null));
  }
});

// OAuth: Step 1 — Redirect to Spotify authorization
app.get("/login", (_req, res) => {
  res.redirect(getAuthUrl());
});

// OAuth: Step 2 — Handle callback, exchange code for tokens
app.get("/callback", async (req, res) => {
  const code = req.query.code;
  const error = req.query.error;

  if (error) {
    return res.status(400).send(`Error: ${error}`);
  }

  if (!code) {
    return res.status(400).send("Missing code parameter");
  }

  try {
    const data = await exchangeCode(code);

    if (data.refresh_token) {
      // Update the .env file with the refresh token
      const envPath = path.join(__dirname, "..", ".env");
      if (fs.existsSync(envPath)) {
        let envContent = fs.readFileSync(envPath, "utf-8");
        envContent = envContent.replace(
          /SPOTIFY_REFRESH_TOKEN=.*/,
          `SPOTIFY_REFRESH_TOKEN=${data.refresh_token}`
        );
        fs.writeFileSync(envPath, envContent);
      }

      // Also set it in the current process
      process.env.SPOTIFY_REFRESH_TOKEN = data.refresh_token;

      res.send(
        `<h1>✅ Success!</h1>
         <p>Refresh token saved. The widget is now active.</p>
         <p>Test it: <a href="/api/spotify">/api/spotify</a></p>
         <br/>
         <p><strong>Refresh Token:</strong></p>
         <pre style="background:#111;color:#0f0;padding:16px;border-radius:8px;word-break:break-all;">${data.refresh_token}</pre>
         <p><em>This token has been automatically saved to .env</em></p>`
      );
    } else {
      res.status(500).send(
        `<h1>❌ Error</h1><pre>${JSON.stringify(data, null, 2)}</pre>`
      );
    }
  } catch (err) {
    res.status(500).send(`<h1>❌ Error</h1><p>${err.message}</p>`);
  }
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`Spotify widget running on port ${PORT}`);
  if (
    !process.env.SPOTIFY_REFRESH_TOKEN ||
    process.env.SPOTIFY_REFRESH_TOKEN === "COLE_O_REFRESH_TOKEN_AQUI"
  ) {
    console.log(
      "\n⚠️  No refresh token set. Visit /login to authorize with Spotify.\n"
    );
  }
});
