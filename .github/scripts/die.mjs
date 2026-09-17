// Draws the d20 as a faceted icosahedron seen face-on, and animates the roll:
// the die spins up, numbers shuffle past, then it settles on the result.
// Pure SMIL — GitHub strips <script> and <style>, so every motion is an
// <animate>/<set> element that survives sanitising.

import { randomInt } from 'node:crypto';

const esc = s => String(s).replace(/[&<>"']/g, c =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' }[c]));

// hexagonal silhouette, flat top and bottom
const V = [[55,0],[27.5,47.6],[-27.5,47.6],[-55,0],[-27.5,-47.6],[27.5,-47.6]];
// the face turned toward the viewer
const A = [0,-31], B = [27.5,17], C = [-27.5,17];
const p = (...pts) => pts.map(([x,y]) => `${x},${y}`).join(' ');

// Nine faces fan out from the centre triangle to the silhouette — one per
// hexagon edge plus one per centre-triangle vertex. Miss any and the die
// shows a gap straight through to the background. Fills are shaded as if lit
// from the upper left, which is what reads as a solid object.
const FACES = [
  { pts: p(A, V[4], V[5]), fill: '#2b3a50' },
  { pts: p(A, V[5], V[0]), fill: '#253248' },
  { pts: p(A, V[0], B),    fill: '#202c40' },
  { pts: p(B, V[0], V[1]), fill: '#1a2434' },
  { pts: p(B, V[1], V[2]), fill: '#151d2b' },
  { pts: p(B, V[2], C),    fill: '#172030' },
  { pts: p(C, V[2], V[3]), fill: '#1c2636' },
  { pts: p(C, V[3], V[4]), fill: '#222f43' },
  { pts: p(C, V[4], A),    fill: '#27354c' },
];

const SPIN = 0.85;   // seconds of shuffling
const TICKS = 11;    // fake numbers shown on the way

export function renderDie({ value, sides, actor, idle = false }) {
  const crit   = !idle && value === sides && sides >= 20;
  const fumble = !idle && value === 1 && sides >= 20;

  const edge   = crit ? '#3fb950' : fumble ? '#f85149' : '#58a6ff';
  const label  = idle ? 'ROLL ME' : crit ? 'NAT ' + sides : fumble ? 'FUMBLE' : `d${sides}`;
  const face   = idle ? '?' : String(value);
  const fsize  = v => v.length >= 3 ? 22 : v.length === 2 ? 32 : 36;

  // numbers that flash past before the real one lands
  const shuffle = [];
  if (!idle) {
    for (let i = 0; i < TICKS; i++) {
      const n = String(randomInt(1, sides + 1));
      const t = (i * SPIN / TICKS).toFixed(3);
      shuffle.push(`<text y="13" text-anchor="middle" font-family="ui-monospace,Menlo,monospace" font-size="${fsize(n)}" font-weight="600" fill="#8b949e" opacity="0">${n}<set attributeName="opacity" to="1" begin="${t}s" dur="${(SPIN / TICKS).toFixed(3)}s"/></text>`);
    }
  }

  const result = idle
    ? `<text y="13" text-anchor="middle" font-family="ui-monospace,Menlo,monospace" font-size="36" font-weight="600" fill="#e6edf3" opacity="0.9">?</text>`
    : `<text y="13" text-anchor="middle" font-family="ui-monospace,Menlo,monospace" font-size="${fsize(face)}" font-weight="600" fill="#e6edf3" opacity="0">${face}<set attributeName="opacity" to="1" begin="${SPIN}s" fill="freeze"/></text>`;

  // the die spins fast, then eases into place
  const spin = idle
    ? `<animateTransform attributeName="transform" type="rotate" values="-3;3;-3" dur="6s" repeatCount="indefinite" additive="sum"/>`
    : `<animateTransform attributeName="transform" type="rotate" values="0;260;360" keyTimes="0;0.7;1" dur="${SPIN + 0.25}s" fill="freeze" calcMode="spline" keySplines="0.1 0 0.3 1;0.2 0 0 1" additive="sum"/>`;

  const settle = idle ? '' :
    `<animateTransform attributeName="transform" type="scale" values="1;1.12;0.97;1" keyTimes="0;0.55;0.8;1" dur="0.5s" begin="${SPIN}s" fill="freeze" additive="sum"/>`;

  const halo = (crit || fumble)
    ? `<circle r="72" fill="none" stroke="${edge}" stroke-width="1.5" opacity="0">
         <animate attributeName="opacity" values="0;0.55;0" dur="1.8s" begin="${SPIN + 0.2}s" repeatCount="indefinite"/>
         <animate attributeName="r" values="58;82" dur="1.8s" begin="${SPIN + 0.2}s" repeatCount="indefinite"/>
       </circle>` : '';

  const faces = FACES.map(f =>
    `<polygon points="${f.pts}" fill="${f.fill}" stroke="${edge}" stroke-width="0.7" stroke-opacity="0.3" stroke-linejoin="round"/>`
  ).join('\n      ');

  const caption = idle ? 'no rolls yet' : `@${esc(actor)}`;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 165" width="240" height="165" role="img" aria-label="${idle ? 'A d20 waiting for its first roll' : `d${sides} rolled ${value} by ${esc(actor)}`}">
  <defs>
    <linearGradient id="plate" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#161b22"/><stop offset="100%" stop-color="#0d1117"/>
    </linearGradient>
    <radialGradient id="lift" cx="0.5" cy="0.35">
      <stop offset="0%" stop-color="${edge}" stop-opacity="0.16"/>
      <stop offset="100%" stop-color="${edge}" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect width="240" height="165" rx="10" fill="url(#plate)" stroke="#30363d" stroke-width="1.5"/>
  <rect width="240" height="165" rx="10" fill="url(#lift)"/>

  <g transform="translate(120 72)">
    ${halo}
    <g>
      ${spin}
      ${settle}
      ${faces}
      <polygon points="${p(A, B, C)}" fill="#1c2534" stroke="${edge}" stroke-width="1.4" stroke-opacity="0.9" stroke-linejoin="round"/>
    </g>
    <g>
      ${shuffle.join('\n      ')}
      ${result}
    </g>
  </g>

  <text x="120" y="140" text-anchor="middle" font-family="ui-monospace,Menlo,monospace" font-size="11" fill="${edge}" letter-spacing="1.6" opacity="${idle ? '0.9' : '0'}">${label}${idle ? '' : `<set attributeName="opacity" to="0.95" begin="${SPIN + 0.1}s" fill="freeze"/>`}</text>
  <text x="120" y="154" text-anchor="middle" font-family="ui-monospace,Menlo,monospace" font-size="9.5" fill="#6e7681">${caption}</text>
</svg>
`;
}
