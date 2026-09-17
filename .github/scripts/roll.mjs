// A visitor opens an issue titled "roll:d20"; this advances the chronicle,
// redraws the scene and the die, and rewrites the README block.
//
// Everything here arrives from a stranger on the internet, so nothing is
// trusted: the title must match the pattern exactly, the username must look
// like a username, and both are escaped before they reach any output.

import { randomInt } from 'node:crypto';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { renderDie } from './die.mjs';
import { renderScene } from './scene.mjs';
import { advance, START, makeDungeon } from './chronicle.mjs';

const SIDES = [4, 6, 8, 10, 12, 20, 100];
const STATE_PATH = '.github/chronicle.json';
const JOURNAL = 4;

const title = process.env.TITLE ?? '';
const actor = process.env.ACTOR ?? '';

const match = /^roll:\s*d(\d{1,3})$/i.exec(title.trim());
if (!match) {
  console.log(`ignored: title "${title}" is not a roll`);
  process.exit(0);
}

const sides = Number(match[1]);
if (!SIDES.includes(sides)) {
  console.log(`ignored: d${sides} is not one of ${SIDES.join(', ')}`);
  process.exit(0);
}

if (!/^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/.test(actor)) {
  console.log(`ignored: "${actor}" is not a valid username`);
  process.exit(0);
}

const roll = randomInt(1, sides + 1);

// ---------- state ----------
let saved = { ...START, journal: [] };
if (existsSync(STATE_PATH)) {
  try {
    const parsed = JSON.parse(readFileSync(STATE_PATH, 'utf8'));
    if (parsed && typeof parsed === 'object') saved = { ...saved, ...parsed };
  } catch {
    console.log('chronicle unreadable, starting a fresh expedition');
  }
}

const { state, entry, outcome } = advance(saved, { roll, sides, actor });
const journal = [entry, ...(Array.isArray(saved.journal) ? saved.journal : [])].slice(0, JOURNAL);

mkdirSync('.github', { recursive: true });
writeFileSync(STATE_PATH, JSON.stringify({ ...state, journal }, null, 2) + '\n');

// ---------- drawings ----------
mkdirSync('assets', { recursive: true });
writeFileSync('assets/last-roll.svg', renderDie({ value: roll, sides, actor }));
writeFileSync('assets/descent.svg', renderScene({ ...state, entry, outcome }));

// ---------- README ----------
const esc = s => String(s).replace(/[&<>"']/g, c =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' }[c]));

const START_MARK = '<!-- DICE:START -->';
const END_MARK = '<!-- DICE:END -->';

const rows = journal.map(e =>
  `\`d${e.sides}\` **${e.roll}** · [@${esc(e.actor)}](https://github.com/${esc(e.actor)}) ${esc(e.text)}`
).join('<br>');

const BODY = encodeURIComponent(
  'The party is waiting at the mouth of the tunnel.\n\n' +
  'Press **Create** below and the die is cast — a workflow rolls it, moves them,\n' +
  'and closes this issue. Nothing else is asked of you.\n');
const die = n => `[d${n}](https://github.com/Davi-Tlr/Davi-Tlr/issues/new?title=roll:d${n}&body=${BODY})`;

const vaultRows = state.vault.length
  ? state.vault.map(v => `**${esc(v.relic)}** — ${esc(v.dungeon)}, by [@${esc(v.actor)}](https://github.com/${esc(v.actor)}) in ${v.rolls} roll${v.rolls === 1 ? '' : 's'}`).join('<br>')
  : 'Empty. Nothing has been brought back yet.';

const away = state.dungeon.floor - state.depth;
const standing = state.depth === 0
  ? `They are at the entrance, packs checked, ${state.torches} torches lit.`
  : `They are ${away} level${away === 1 ? '' : 's'} short of it, with ${state.torches} torch${state.torches === 1 ? '' : 'es'} still burning.`;

const block = `${START_MARK}
<table>
<tr>
<td width="42%" valign="top">

<img src="./assets/descent.svg" width="100%" alt="${esc(state.dungeon.name)}: level ${state.depth} of ${state.dungeon.floor}" />

</td>
<td width="58%" valign="top">

### ${esc(state.dungeon.name)}

Somewhere on level ${state.dungeon.floor} lies **${esc(state.dungeon.relic)}**.
${standing}${state.dungeon.attempts ? ` ${state.dungeon.attempts} expedition${state.dungeon.attempts === 1 ? ' has' : 's have'} already failed here.` : ''}

A high roll takes them deeper. A low one costs light. When the last torch
goes out they climb back up empty-handed, and the dungeon keeps what it has.

**${die(20)}** — one click, then press *Create*. That is the whole game.

<sub>**${state.wins}** recovered &nbsp;·&nbsp; **${state.losses}** lost${state.best !== null ? ` &nbsp;·&nbsp; fastest descent: **${state.best}** rolls` : ''}</sub>

<details>
<summary>the vault &nbsp;·&nbsp; ${state.vault.length} recovered</summary>
<br>
<sub>${vaultRows}</sub>
</details>

</td>
</tr>
</table>

<sub>${rows}</sub>

${END_MARK}`;

const readme = readFileSync('README.md', 'utf8');
const a = readme.indexOf(START_MARK);
const b = readme.indexOf(END_MARK);
if (a === -1 || b === -1) {
  console.error(`README is missing the ${START_MARK} / ${END_MARK} markers`);
  process.exit(1);
}

writeFileSync('README.md', readme.slice(0, a) + block + readme.slice(b + END_MARK.length));
console.log(`@${actor} rolled ${roll} on a d${sides} — ${outcome} — ${state.dungeon.name} level ${state.depth}/${state.dungeon.floor}, ${state.torches} torches, ${state.wins}W/${state.losses}L`);
