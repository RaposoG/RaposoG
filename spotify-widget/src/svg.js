function escapeXml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function truncate(str, maxLen = 30) {
  if (str.length <= maxLen) return str;
  return str.substring(0, maxLen - 3) + "...";
}

function renderSVG(track) {
  const W = 460;
  const H = 140;
  const RADIUS = 12;

  if (!track) {
    return `
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0d1117"/>
      <stop offset="100%" stop-color="#161b22"/>
    </linearGradient>
    <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#6e40c9"/>
      <stop offset="100%" stop-color="#1DB954"/>
    </linearGradient>
  </defs>

  <rect width="${W}" height="${H}" rx="${RADIUS}" fill="url(#bg)"/>
  <rect x="0.5" y="0.5" width="${W - 1}" height="${H - 1}" rx="${RADIUS}" fill="none" stroke="#30363d" stroke-width="1"/>

  <!-- Accent line top -->
  <rect x="1" y="1" width="${W - 2}" height="3" rx="${RADIUS}" fill="url(#accent)" opacity="0.6"/>

  <!-- Spotify icon -->
  <g transform="translate(${W / 2 - 60}, ${H / 2 - 12})">
    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" fill="#1DB954"/>
  </g>
  <text x="${W / 2 + 10}" y="${H / 2 + 5}" fill="#8b949e" font-family="'Segoe UI', Ubuntu, sans-serif" font-size="14" text-anchor="start">
    Not playing anything right now
  </text>
</svg>`;
  }

  const title = escapeXml(truncate(track.title, 34));
  const artist = escapeXml(truncate(track.artist, 40));
  const album = escapeXml(truncate(track.album, 40));
  const statusText = track.isPlaying ? "NOW PLAYING" : "RECENTLY PLAYED";

  const albumArtSection = track.albumArt
    ? `
    <!-- Album art with rounded corners -->
    <defs>
      <clipPath id="albumClip">
        <rect x="16" y="20" width="100" height="100" rx="8"/>
      </clipPath>
    </defs>
    <image x="16" y="20" width="100" height="100" clip-path="url(#albumClip)"
      href="${escapeXml(track.albumArt)}" preserveAspectRatio="xMidYMid slice"/>
    <!-- Album art border -->
    <rect x="16" y="20" width="100" height="100" rx="8" fill="none" stroke="#30363d" stroke-width="1"/>`
    : `
    <!-- Placeholder album art -->
    <rect x="16" y="20" width="100" height="100" rx="8" fill="#161b22" stroke="#30363d" stroke-width="1"/>
    <g transform="translate(42, 46)">
      <path d="M24 0C10.7 0 0 10.7 0 24s10.7 24 24 24 24-10.7 24-24S37.3 0 24 0zm11 34.7c-.5.7-1.3 1-2 .5-5.6-3.5-12.7-4.2-21.1-2.3-.8.2-1.6-.4-1.8-1.1-.2-.8.3-1.6 1.1-1.8 9.1-2 17 0 23.3 2.7.8.4 1 1.3.5 2zm2.9-6.6c-.6.8-1.7 1.2-2.5.6-6.5-4-16.3-5.2-23.9-2.8-1 .3-2-.2-2.3-1.2-.3-1 .2-2 1.2-2.3 8.7-2.7 19.5-1.4 26.9 3.2.8.5 1.1 1.6.6 2.5z" fill="#30363d"/>
    </g>`;

  return `
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0d1117"/>
      <stop offset="100%" stop-color="#161b22"/>
    </linearGradient>
    <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#6e40c9"/>
      <stop offset="100%" stop-color="#1DB954"/>
    </linearGradient>
    <linearGradient id="barGradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#1DB954"/>
      <stop offset="50%" stop-color="#6e40c9"/>
      <stop offset="100%" stop-color="#58a6ff"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="${W}" height="${H}" rx="${RADIUS}" fill="url(#bg)"/>
  <rect x="0.5" y="0.5" width="${W - 1}" height="${H - 1}" rx="${RADIUS}" fill="none" stroke="#30363d" stroke-width="1"/>

  <!-- Accent line top -->
  <rect x="1" y="1" width="${W - 2}" height="3" rx="${RADIUS}" fill="url(#accent)" opacity="0.6"/>

  ${albumArtSection}

  <!-- Status label -->
  <g transform="translate(132, 36)">
    <!-- Spotify icon small -->
    <path d="M6 0C2.7 0 0 2.7 0 6s2.7 6 6 6 6-2.7 6-6S9.33 0 6 0zm2.76 8.67c-.12.18-.33.24-.51.12-1.41-.87-3.18-1.05-5.28-.57-.21.06-.39-.09-.45-.27-.06-.21.09-.39.27-.45 2.28-.51 4.26-.3 5.82.66.21.09.24.33.15.51zm.72-1.65c-.15.21-.42.3-.63.15-1.62-.99-4.08-1.29-5.97-.69-.24.06-.51-.06-.57-.3-.06-.24.06-.51.3-.57 2.16-.66 4.86-.33 6.72.78.18.09.24.42.15.63zm.06-1.68C7.62 4.2 4.41 4.08 2.58 4.65c-.3.09-.6-.09-.69-.36-.09-.3.09-.6.36-.69 2.13-.63 5.64-.51 7.86.81.27.15.36.51.21.78-.15.21-.51.3-.78.15z" fill="#1DB954"/>
    <text x="16" y="9" fill="#1DB954" font-family="'Segoe UI', Ubuntu, sans-serif" font-size="10" font-weight="700" letter-spacing="1">
      ${statusText}
    </text>
  </g>

  <!-- Track title -->
  <text x="132" y="62" fill="#e6edf3" font-family="'Segoe UI', Ubuntu, sans-serif" font-size="15" font-weight="700">
    ${title}
  </text>

  <!-- Artist -->
  <text x="132" y="82" fill="#8b949e" font-family="'Segoe UI', Ubuntu, sans-serif" font-size="13">
    ${artist}
  </text>

  <!-- Album -->
  <text x="132" y="100" fill="#484f58" font-family="'Segoe UI', Ubuntu, sans-serif" font-size="11">
    ${album}
  </text>

  <!-- Equalizer bars animation -->
  <g transform="translate(132, 110)">
    <rect x="0" y="4" width="3" height="8" rx="1" fill="#1DB954" opacity="0.8">
      <animate attributeName="height" values="8;3;8;5;8" dur="1.2s" repeatCount="indefinite"/>
      <animate attributeName="y" values="4;9;4;7;4" dur="1.2s" repeatCount="indefinite"/>
    </rect>
    <rect x="5" y="2" width="3" height="10" rx="1" fill="#1DB954" opacity="0.7">
      <animate attributeName="height" values="10;4;6;10;4" dur="0.9s" repeatCount="indefinite"/>
      <animate attributeName="y" values="2;8;6;2;8" dur="0.9s" repeatCount="indefinite"/>
    </rect>
    <rect x="10" y="5" width="3" height="7" rx="1" fill="#1DB954" opacity="0.9">
      <animate attributeName="height" values="7;10;3;7;10" dur="1.1s" repeatCount="indefinite"/>
      <animate attributeName="y" values="5;2;9;5;2" dur="1.1s" repeatCount="indefinite"/>
    </rect>
    <rect x="15" y="3" width="3" height="9" rx="1" fill="#1DB954" opacity="0.6">
      <animate attributeName="height" values="9;5;9;3;9" dur="1.4s" repeatCount="indefinite"/>
      <animate attributeName="y" values="3;7;3;9;3" dur="1.4s" repeatCount="indefinite"/>
    </rect>
  </g>
</svg>`;
}

module.exports = { renderSVG };
