function escapeXml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function truncate(str, maxLen = 50) {
  if (str.length <= maxLen) return str;
  return str.substring(0, maxLen - 3) + "...";
}

// Color palette
const COLORS = {
  bg: "#0d1117",
  bgLight: "#161b22",
  border: "#30363d",
  purple: "#6e40c9",
  blue: "#58a6ff",
  green: "#1DB954",
  cyan: "#39d4d4",
  yellow: "#e3b341",
  orange: "#f0883e",
  red: "#f85149",
  text: "#e6edf3",
  textMuted: "#8b949e",
  textDim: "#484f58",
};

const LANG_COLORS = {
  TypeScript: "#3178C6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  Java: "#b07219",
  Go: "#00ADD8",
  Rust: "#dea584",
  "C++": "#f34b7d",
  C: "#555555",
  "C#": "#178600",
  Ruby: "#701516",
  PHP: "#4F5D95",
  Swift: "#F05138",
  Kotlin: "#A97BFF",
  Dart: "#00B4AB",
  Vue: "#41b883",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Shell: "#89e051",
  Lua: "#000080",
  Zig: "#ec915c",
};

function getLangColor(lang) {
  return LANG_COLORS[lang] || COLORS.textMuted;
}

function renderTerminalSVG(stats) {
  const W = 850;
  const H = 520;

  if (!stats) {
    return renderErrorTerminal(W, H);
  }

  const username = escapeXml(stats.username);
  const name = escapeXml(stats.name);
  const memberSince = new Date(stats.createdAt).getFullYear();
  const now = new Date();
  const uptime = `${now.getFullYear() - memberSince}y ${now.getMonth()}m ${now.getDate()}d`;

  // Build terminal lines with timing for typing animation
  const lines = [];
  let delay = 0;
  const TYPING_SPEED = 0.04; // seconds per character
  const LINE_PAUSE = 0.3;
  const SECTION_PAUSE = 0.6;

  function addLine(text, color = COLORS.text, indent = 0, isCommand = false) {
    const duration = isCommand ? text.length * TYPING_SPEED : 0.01;
    lines.push({ text, color, indent, delay, duration, isCommand });
    delay += duration + LINE_PAUSE;
  }

  function addBlank() {
    lines.push({ text: "", color: COLORS.text, indent: 0, delay, duration: 0 });
    delay += 0.15;
  }

  function addSection() {
    delay += SECTION_PAUSE;
  }

  // === BOOT SEQUENCE ===
  addLine(`${username}@github:~$ neofetch --github`, COLORS.green, 0, true);
  addSection();
  addBlank();

  // ASCII art header (compact)
  const asciiLines = [
    "  ██████╗  ██╗  ████████╗ ██╗  ██╗ ██╗   ██╗ ██████╗ ",
    " ██╔════╝  ██║  ╚══██╔══╝ ██║  ██║ ██║   ██║ ██╔══██╗",
    " ██║  ███╗ ██║     ██║    ███████║ ██║   ██║ ██████╔╝",
    " ██║   ██║ ██║     ██║    ██╔══██║ ██║   ██║ ██╔══██╗",
    " ╚██████╔╝ ██║     ██║    ██║  ██║ ╚██████╔╝ ██████╔╝",
    "  ╚═════╝  ╚═╝     ╚═╝    ╚═╝  ╚═╝  ╚═════╝  ╚═════╝ ",
  ];
  for (const line of asciiLines) {
    addLine(line, COLORS.purple, 0);
  }
  addBlank();

  // System info (neofetch style — right side of ascii)
  addLine(`┌──────────────────────────────────────────────────────┐`, COLORS.border, 0);
  addLine(`│  ${name} @ GitHub`, COLORS.cyan, 0);
  addLine(`│  ${"─".repeat(52)}`, COLORS.border, 0);
  addLine(`│  OS:       GitHub Universe`, COLORS.text, 0);
  addLine(`│  Host:     github.com/${username}`, COLORS.text, 0);
  addLine(`│  Uptime:   ${uptime} (since ${memberSince})`, COLORS.text, 0);
  addLine(`│  Repos:    ${stats.publicRepos} public repositories`, COLORS.text, 0);
  addLine(`│  Stars:    ⭐ ${stats.totalStars} total`, COLORS.yellow, 0);
  addLine(`│  Forks:    🍴 ${stats.totalForks} total`, COLORS.text, 0);
  addLine(`│  Network:  ${stats.followers} followers · ${stats.following} following`, COLORS.text, 0);
  addLine(`└──────────────────────────────────────────────────────┘`, COLORS.border, 0);

  addBlank();
  addLine(`${username}@github:~$ cat /proc/languages`, COLORS.green, 0, true);
  addSection();

  // Language bars
  if (stats.topLangs.length > 0) {
    const maxPct = Math.max(...stats.topLangs.map((l) => l.pct));
    for (const lang of stats.topLangs) {
      const barLen = Math.max(1, Math.round((lang.pct / maxPct) * 20));
      const bar = "█".repeat(barLen) + "░".repeat(20 - barLen);
      addLine(`  ${lang.lang.padEnd(14)} ${bar} ${lang.pct}%`, getLangColor(lang.lang), 0);
    }
  }

  addBlank();
  addLine(`${username}@github:~$ tail -f /var/log/activity.log`, COLORS.green, 0, true);
  addSection();

  // Recent activity
  if (stats.recentActivity.length > 0) {
    for (const activity of stats.recentActivity.slice(0, 4)) {
      addLine(`  ${activity.icon} ${truncate(activity.text, 55)}`, COLORS.textMuted, 0);
    }
  }

  addBlank();
  addLine(`${username}@github:~$ ls --top-repos`, COLORS.green, 0, true);
  addSection();

  // Top repos
  if (stats.topRepos.length > 0) {
    for (const repo of stats.topRepos) {
      const desc = repo.description ? truncate(repo.description, 35) : "No description";
      addLine(`  📦 ${repo.name.padEnd(20)} ⭐${String(repo.stars).padEnd(5)} [${repo.lang}]`, COLORS.blue, 0);
      addLine(`     ${desc}`, COLORS.textDim, 0);
    }
  }

  addBlank();
  addLine(`${username}@github:~$ █`, COLORS.green, 0);

  // Calculate total height needed
  const HEADER_H = 44;
  const LINE_H = 16;
  const PADDING_TOP = 16;
  const totalContentH = HEADER_H + PADDING_TOP + lines.length * LINE_H + 20;
  const finalH = Math.max(H, totalContentH);

  return `
<svg width="${W}" height="${finalH}" viewBox="0 0 ${W} ${finalH}" xmlns="http://www.w3.org/2000/svg">
  <style>
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes blink {
      0%, 50% { opacity: 1; }
      51%, 100% { opacity: 0; }
    }
    @keyframes typing {
      from { width: 0; }
      to { width: 100%; }
    }
    @keyframes scanline {
      0% { transform: translateY(-100%); }
      100% { transform: translateY(${finalH}px); }
    }
    @keyframes glowPulse {
      0%, 100% { opacity: 0.3; }
      50% { opacity: 0.6; }
    }
    .terminal-text {
      font-family: 'JetBrains Mono', 'Fira Code', 'Cascadia Code', 'SF Mono', 'Consolas', monospace;
      font-size: 12px;
    }
    .cursor {
      animation: blink 1s step-end infinite;
    }
    .scanline {
      animation: scanline 8s linear infinite;
    }
    .glow {
      animation: glowPulse 3s ease-in-out infinite;
    }
  </style>

  <defs>
    <!-- Terminal window background gradient -->
    <linearGradient id="termBg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#1a1b26"/>
      <stop offset="100%" stop-color="${COLORS.bg}"/>
    </linearGradient>

    <!-- Title bar gradient -->
    <linearGradient id="titleBar" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#21262d"/>
      <stop offset="100%" stop-color="#161b22"/>
    </linearGradient>

    <!-- Glow effect -->
    <filter id="glow">
      <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>

    <!-- CRT scanline pattern -->
    <pattern id="scanlines" patternUnits="userSpaceOnUse" width="4" height="4">
      <rect width="4" height="2" fill="rgba(255,255,255,0.015)"/>
    </pattern>

    <!-- Drop shadow -->
    <filter id="shadow" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="#000" flood-opacity="0.5"/>
    </filter>

    <clipPath id="terminalClip">
      <rect x="1" y="1" width="${W - 2}" height="${finalH - 2}" rx="10"/>
    </clipPath>
  </defs>

  <!-- Terminal window -->
  <g filter="url(#shadow)">
    <rect width="${W}" height="${finalH}" rx="10" fill="url(#termBg)"/>
    <rect x="0.5" y="0.5" width="${W - 1}" height="${finalH - 1}" rx="10" fill="none" stroke="${COLORS.border}" stroke-width="1"/>
  </g>

  <!-- Title bar -->
  <rect width="${W}" height="38" rx="10" fill="url(#titleBar)"/>
  <rect y="28" width="${W}" height="10" fill="url(#titleBar)"/>
  <line x1="0" y1="38" x2="${W}" y2="38" stroke="${COLORS.border}" stroke-width="0.5"/>

  <!-- Window buttons -->
  <circle cx="20" cy="19" r="6" fill="#f85149" opacity="0.9"/>
  <circle cx="40" cy="19" r="6" fill="#e3b341" opacity="0.9"/>
  <circle cx="60" cy="19" r="6" fill="#1DB954" opacity="0.9"/>

  <!-- Window title -->
  <text x="${W / 2}" y="23" fill="${COLORS.textMuted}" class="terminal-text" font-size="12" text-anchor="middle">
    ⌘ ${username}@github — bash — ${W}x${finalH}
  </text>

  <!-- CRT scanline overlay -->
  <g clip-path="url(#terminalClip)">
    <rect width="${W}" height="${finalH}" fill="url(#scanlines)" opacity="0.5"/>
  </g>

  <!-- Animated scanline beam -->
  <g clip-path="url(#terminalClip)">
    <rect class="scanline" x="0" y="0" width="${W}" height="2" fill="rgba(110,64,201,0.07)"/>
  </g>

  <!-- Accent glow bar at top -->
  <rect class="glow" x="80" y="38" width="${W - 160}" height="1" rx="1" fill="${COLORS.purple}" opacity="0.4"/>

  <!-- Terminal content -->
  <g transform="translate(20, ${HEADER_H + PADDING_TOP})">
    ${lines
      .map((line, i) => {
        if (!line.text) return "";

        const y = i * LINE_H;
        const animDelay = line.delay;

        if (line.isCommand) {
          // For command lines: show prompt immediately, typing animation for command
          const parts = line.text.split("$ ");
          const prompt = parts[0] + "$ ";
          const cmd = parts[1] || "";

          return `
    <g opacity="0" style="animation: fadeIn 0.01s ${animDelay}s forwards">
      <text x="0" y="${y}" class="terminal-text" fill="${COLORS.green}" xml:space="preserve">${escapeXml(prompt)}</text>
      <text x="${prompt.length * 7.2}" y="${y}" class="terminal-text" fill="${COLORS.text}" filter="url(#glow)" xml:space="preserve">
        ${escapeXml(cmd)}
        <animate attributeName="opacity" values="0;1" dur="${line.duration}s" begin="${animDelay}s" fill="freeze"/>
      </text>
    </g>`;
        }

        return `
    <g opacity="0" style="animation: fadeIn 0.15s ${animDelay}s forwards">
      <text x="${line.indent}" y="${y}" class="terminal-text" fill="${line.color}" xml:space="preserve">${escapeXml(line.text)}</text>
    </g>`;
      })
      .join("\n")}
  </g>

  <!-- Bottom status bar -->
  <rect x="0" y="${finalH - 24}" width="${W}" height="24" fill="#161b22" opacity="0.95"/>
  <line x1="0" y1="${finalH - 24}" x2="${W}" y2="${finalH - 24}" stroke="${COLORS.border}" stroke-width="0.5"/>
  
  <text x="12" y="${finalH - 8}" class="terminal-text" font-size="10" fill="${COLORS.purple}">
    ● INSERT
  </text>
  <text x="${W / 2}" y="${finalH - 8}" class="terminal-text" font-size="10" fill="${COLORS.textDim}" text-anchor="middle">
    github.com/${username} — Last updated: ${new Date().toISOString().split("T")[0]}
  </text>
  <text x="${W - 12}" y="${finalH - 8}" class="terminal-text" font-size="10" fill="${COLORS.textDim}" text-anchor="end">
    UTF-8 | bash
  </text>

  <!-- Vignette effect -->
  <g clip-path="url(#terminalClip)">
    <rect width="${W}" height="${finalH}" fill="url(#termBg)" opacity="0" pointer-events="none">
      <animate attributeName="opacity" values="0.3;0;0" dur="2s" fill="freeze"/>
    </rect>
  </g>
</svg>`;
}

function renderErrorTerminal(W, H) {
  return `
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <style>
    @keyframes blink { 0%, 50% { opacity: 1; } 51%, 100% { opacity: 0; } }
    @keyframes scanline { 0% { transform: translateY(-100%); } 100% { transform: translateY(${H}px); } }
    .terminal-text { font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace; font-size: 12px; }
    .cursor { animation: blink 1s step-end infinite; }
  </style>
  
  <defs>
    <linearGradient id="termBg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#1a1b26"/>
      <stop offset="100%" stop-color="${COLORS.bg}"/>
    </linearGradient>
    <linearGradient id="titleBar" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#21262d"/>
      <stop offset="100%" stop-color="#161b22"/>
    </linearGradient>
    <filter id="shadow" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="#000" flood-opacity="0.5"/>
    </filter>
  </defs>

  <g filter="url(#shadow)">
    <rect width="${W}" height="${H}" rx="10" fill="url(#termBg)"/>
    <rect x="0.5" y="0.5" width="${W - 1}" height="${H - 1}" rx="10" fill="none" stroke="${COLORS.border}" stroke-width="1"/>
  </g>

  <rect width="${W}" height="38" rx="10" fill="url(#titleBar)"/>
  <rect y="28" width="${W}" height="10" fill="url(#titleBar)"/>
  <circle cx="20" cy="19" r="6" fill="#f85149" opacity="0.9"/>
  <circle cx="40" cy="19" r="6" fill="#e3b341" opacity="0.9"/>
  <circle cx="60" cy="19" r="6" fill="#1DB954" opacity="0.9"/>
  <text x="${W / 2}" y="23" fill="${COLORS.textMuted}" class="terminal-text" font-size="12" text-anchor="middle">
    ⌘ terminal — bash
  </text>

  <g transform="translate(20, 70)">
    <text x="0" y="0" class="terminal-text" fill="${COLORS.green}">user@github:~$ </text>
    <text x="115" y="0" class="terminal-text" fill="${COLORS.text}">neofetch --github</text>
    <text x="0" y="32" class="terminal-text" fill="${COLORS.red}">  ⚠  Error: Could not reach GitHub API</text>
    <text x="0" y="56" class="terminal-text" fill="${COLORS.textMuted}">  Retrying in a few moments...</text>
    <text x="0" y="88" class="terminal-text" fill="${COLORS.green}">user@github:~$ <tspan class="cursor" fill="${COLORS.text}">█</tspan></text>
  </g>
</svg>`;
}

module.exports = { renderTerminalSVG };
