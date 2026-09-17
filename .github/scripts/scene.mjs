// Draws the chronicle as a cross-section of the dungeon: where the party is,
// how far the floor still is, how much light is left, and the scoreboard.
// Torchlight is amber on purpose — the rest of the profile is blue, and the
// dungeon should not look like the flight planner.

const esc = s => String(s).replace(/[&<>"']/g, c =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' }[c]));

const W = 380, H = 330;
const ROWS = 6;
const TOP = 74, ROW_H = 22;

function wrap(text, cols, max) {
  const out = [];
  let line = '';
  for (const word of String(text).split(/\s+/)) {
    if ((line + ' ' + word).trim().length > cols) { out.push(line.trim()); line = word; }
    else line += ' ' + word;
    if (out.length === max) break;
  }
  if (out.length < max && line.trim()) out.push(line.trim());
  if (out.length === max) {
    const last = out[max - 1];
    if (last.length > cols - 1) out[max - 1] = last.slice(0, cols - 1).trimEnd() + '…';
  }
  return out;
}

export function renderScene(state) {
  const { dungeon, depth, torches, wins, losses, best, entry, outcome } = state;
  const floor = dungeon.floor;

  const lit = outcome === 'loss' || outcome === 'fumble' ? '#f85149'
            : outcome === 'win' ? '#3fb950'
            : outcome === 'crit' ? '#ffb224'
            : '#e3a008';

  // Keep the party mid-frame, but never scroll past the floor.
  const party = Math.min(Math.floor(ROWS / 2), depth);
  const first = depth - party;

  let rows = '';
  for (let i = 0; i < ROWS; i++) {
    const level = first + i;
    if (level < 0) continue;
    const y = TOP + i * ROW_H;
    const dist = Math.abs(i - party);
    const fade = Math.max(0.07, 0.46 - dist * 0.1);
    const inset = 30 + dist * 8;
    const isFloor = level === floor;

    rows += `\n    <rect x="${inset}" y="${y}" width="${W - inset * 2}" height="13" rx="2" fill="${isFloor ? '#2a2113' : '#20262f'}" opacity="${isFloor ? 0.95 : fade + 0.18}"/>`;
    if (isFloor) {
      rows += `\n    <rect x="${inset}" y="${y}" width="${W - inset * 2}" height="13" rx="2" fill="none" stroke="#d29922" stroke-width="1" stroke-dasharray="3 2" opacity="0.9"/>`;
      rows += `\n    <text x="${W / 2}" y="${y + 10}" text-anchor="middle" font-family="ui-monospace,Menlo,monospace" font-size="9.5" fill="#e3b341" letter-spacing="1.2">THE FLOOR</text>`;
    } else {
      rows += `\n    <line x1="${inset}" y1="${y + 14}" x2="${W - inset}" y2="${y + 14}" stroke="${lit}" stroke-width="0.7" opacity="${fade * 0.5}"/>`;
      if (level === 0) {
        rows += `\n    <text x="${inset + 6}" y="${y + 10}" font-family="ui-monospace,Menlo,monospace" font-size="9" fill="#7d8590" letter-spacing="1">SURFACE</text>`;
      } else if (dist <= 2) {
        rows += `\n    <text x="${inset - 6}" y="${y + 10}" text-anchor="end" font-family="ui-monospace,Menlo,monospace" font-size="9.5" fill="#6e7681" opacity="${1 - dist * 0.3}">${level}</text>`;
      }
    }
  }

  // If the floor sits below the visible window, say how far it still is.
  const hint = floor > first + ROWS - 1
    ? `<text x="${W / 2}" y="${TOP + ROWS * ROW_H + 6}" text-anchor="middle" font-family="ui-monospace,Menlo,monospace" font-size="9.5" fill="#6e7681">↓ ${floor - depth} more level${floor - depth === 1 ? '' : 's'} to the floor</text>`
    : '';

  const py = TOP + party * ROW_H + 6;

  // Progress toward the floor.
  const pct = Math.max(0, Math.min(1, depth / floor));
  const BW = W - 60;
  const bar = `
  <rect x="30" y="52" width="${BW}" height="4" rx="2" fill="#20262f"/>
  <rect x="30" y="52" width="${(BW * pct).toFixed(1)}" height="4" rx="2" fill="${lit}" opacity="0.9"/>`;

  const FY = H - 18;
  let torchRow = '';
  for (let i = 0; i < 3; i++) {
    const x = W - 74 + i * 20;
    const on = i < torches;
    torchRow += `\n    <rect x="${x - 1.5}" y="${FY + 3}" width="3" height="10" rx="1" fill="${on ? '#5c4a22' : '#2a2f38'}"/>`;
    torchRow += on
      ? `\n    <g transform="translate(${x} ${FY})">
      <path d="M 0 -9 q 5 5 0 9 q -5 -4 0 -9" fill="${lit}">
        <animateTransform attributeName="transform" type="scale" values="1 1;1.18 0.88;0.9 1.12;1 1" dur="${(0.7 + i * 0.17).toFixed(2)}s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.8;1;0.75;0.95" dur="${(0.9 + i * 0.13).toFixed(2)}s" repeatCount="indefinite"/>
      </path>
    </g>`
      : `\n    <circle cx="${x}" cy="${FY - 2}" r="2" fill="#2a2f38"/>`;
  }

  // The name gets the whole top line now — the scoreboard moved to the foot,
  // where it is not competing with it for width.
  // wrap() breaks on a word boundary, so a name that does not fit comes back
  // looking like a complete name. Say that it was cut.
  let name = wrap(dungeon.name, 46, 1)[0];
  if (name !== dungeon.name) name = name.replace(/[ ,.]+$/, '') + '…';
  const lines = wrap(entry?.text ?? 'the expedition waits for its first roll', 42, 3);
  const journal = lines.map((l, i) =>
    `<text x="${W / 2}" y="${244 + i * 13.5}" text-anchor="middle" font-family="ui-monospace,Menlo,monospace" font-size="10" fill="#8b949e">${esc(l)}</text>`
  ).join('\n  ');

  const who = entry?.actor
    ? `<text x="${W / 2}" y="${228}" text-anchor="middle" font-family="ui-monospace,Menlo,monospace" font-size="11" fill="${lit}">@${esc(entry.actor)} rolled ${entry.roll}</text>`
    : '';

  const score = `${wins}W · ${losses}L${best !== null ? ` · best ${best}` : ''}`;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${esc(dungeon.name)}: party on level ${depth} of ${floor}, ${torches} torches lit, ${wins} won and ${losses} lost">
  <defs>
    <linearGradient id="deep" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#11161d"/><stop offset="100%" stop-color="#07090d"/>
    </linearGradient>
    <radialGradient id="lamp" cx="0.5" cy="0.5">
      <stop offset="0%" stop-color="${lit}" stop-opacity="0.32"/>
      <stop offset="100%" stop-color="${lit}" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect width="${W}" height="${H}" rx="10" fill="url(#deep)" stroke="#262d38" stroke-width="1.5"/>

  <text x="20" y="28" font-family="ui-monospace,Menlo,monospace" font-size="12" font-weight="600" fill="#e6edf3">${esc(name)}</text>
  <text x="20" y="42" font-family="ui-monospace,Menlo,monospace" font-size="9.5" fill="#6e7681">the floor lies on level ${floor}${dungeon.attempts ? ` · ${dungeon.attempts} failed attempt${dungeon.attempts === 1 ? '' : 's'}` : ''}</text>
${bar}
${rows}
  ${hint}

  <circle cx="${W / 2}" cy="${py}" r="44" fill="url(#lamp)">
    <animate attributeName="r" values="40;48;40" dur="4s" repeatCount="indefinite"/>
  </circle>
  <circle cx="${W / 2}" cy="${py}" r="4.5" fill="${lit}">
    <animate attributeName="opacity" values="0.75;1;0.75" dur="2.2s" repeatCount="indefinite"/>
  </circle>

  <text x="20" y="${H - 34}" font-family="ui-monospace,Menlo,monospace" font-size="9.5" fill="#6e7681">${score}</text>
  <text x="20" y="${H - 16}" font-family="ui-monospace,Menlo,monospace" font-size="10.5" fill="#6e7681">level <tspan fill="#e6edf3" font-size="15" font-weight="600">${depth}</tspan> / ${floor}</text>
  <text x="${W - 20}" y="${H - 34}" text-anchor="end" font-family="ui-monospace,Menlo,monospace" font-size="9" fill="#6e7681">torches</text>
${torchRow}

  ${who}
  ${journal}
</svg>
`;
}
