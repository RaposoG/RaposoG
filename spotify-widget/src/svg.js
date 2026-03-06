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
  if (!track) {
    return `
      <svg width="480" height="133" xmlns="http://www.w3.org/2000/svg">
        <foreignObject width="480" height="133">
          <div xmlns="http://www.w3.org/1999/xhtml"
            style="display:flex;align-items:center;justify-content:center;width:100%;height:100%;background:#0d1117;border-radius:10px;border:1px solid #30363d;font-family:'Segoe UI',Arial,sans-serif;">
            <div style="display:flex;align-items:center;gap:12px;color:#8b949e;">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="#1DB954">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
              </svg>
              <span style="font-size:14px;">Not playing anything right now</span>
            </div>
          </div>
        </foreignObject>
      </svg>`;
  }

  const title = escapeXml(truncate(track.title, 32));
  const artist = escapeXml(truncate(track.artist, 36));
  const album = escapeXml(truncate(track.album, 36));

  return `
    <svg width="480" height="133" xmlns="http://www.w3.org/2000/svg">
      <foreignObject width="480" height="133">
        <div xmlns="http://www.w3.org/1999/xhtml"
          style="display:flex;align-items:center;width:100%;height:100%;background:#0d1117;border-radius:10px;border:1px solid #30363d;font-family:'Segoe UI',Arial,sans-serif;overflow:hidden;">

          <div style="width:110px;height:110px;margin:11px;border-radius:8px;overflow:hidden;flex-shrink:0;">
            <img src="${escapeXml(track.albumArt)}" width="110" height="110" style="object-fit:cover;" />
          </div>

          <div style="display:flex;flex-direction:column;justify-content:center;padding:12px 16px 12px 4px;overflow:hidden;flex:1;">
            <div style="display:flex;align-items:center;gap:6px;margin-bottom:6px;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#1DB954">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
              </svg>
              <span style="font-size:11px;color:#1DB954;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">
                ${track.isPlaying ? "Now Playing" : "Recently Played"}
              </span>
            </div>

            <div style="font-size:15px;font-weight:700;color:#e6edf3;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-bottom:3px;">
              ${title}
            </div>
            <div style="font-size:13px;color:#8b949e;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-bottom:2px;">
              ${artist}
            </div>
            <div style="font-size:11px;color:#484f58;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
              ${album}
            </div>
          </div>
        </div>
      </foreignObject>
    </svg>`;
}

module.exports = { renderSVG };
