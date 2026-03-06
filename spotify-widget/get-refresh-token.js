const https = require("https");
const crypto = require("crypto");
const selfsigned = require("selfsigned");

const CLIENT_ID = "322ece552f7745f5a492f271ca2914f2";
const CLIENT_SECRET = "6c04ec55a801464d8dd4ad2c9efb6b33";
const REDIRECT_URI = "https://localhost:3000/callback";
const SCOPES = "user-read-currently-playing user-read-playback-state";

async function exchangeCodeForToken(code) {
  const basic = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString(
    "base64"
  );

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: REDIRECT_URI,
    }),
  });

  return response.json();
}

console.log("\n🎵 Spotify Refresh Token Generator\n");
console.log("Generating self-signed certificate...\n");

const attrs = [{ name: "commonName", value: "localhost" }];
const pems = selfsigned.generate(attrs, { days: 1 });

const server = https.createServer(
  { key: pems.private, cert: pems.cert },
  async (req, res) => {
    const url = new URL(req.url, "https://localhost:3000");

    if (url.pathname === "/callback") {
      const code = url.searchParams.get("code");
      const error = url.searchParams.get("error");

      if (error) {
        res.writeHead(400, { "Content-Type": "text/html" });
        res.end(`<h1>❌ Error: ${error}</h1>`);
        server.close();
        return;
      }

      if (code) {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(
          "<h1>✅ Success! Check your terminal for the refresh token.</h1><p>You can close this tab.</p>"
        );

        try {
          const data = await exchangeCodeForToken(code);

          if (data.refresh_token) {
            console.log("✅ SUCCESS! Here is your refresh token:\n");
            console.log("━".repeat(60));
            console.log(data.refresh_token);
            console.log("━".repeat(60));
            console.log(
              "\nCopy the token above and paste it in your .env file."
            );
          } else {
            console.log(
              "❌ Error from Spotify:",
              JSON.stringify(data, null, 2)
            );
          }
        } catch (err) {
          console.log("❌ Error exchanging code:", err.message);
        }

        server.close();
        return;
      }
    }

    res.writeHead(404);
    res.end("Not found");
  }
);

server.listen(3000, () => {
  const authUrl = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent(SCOPES)}`;

  console.log("✅ HTTPS server running on https://localhost:3000\n");
  console.log("📋 Open this URL in your browser:\n");
  console.log(authUrl);
  console.log(
    "\n⏳ Waiting for authorization...\n"
  );
  console.log(
    "(The browser will show a certificate warning — click 'Advanced' > 'Proceed to localhost')\n"
  );
});
