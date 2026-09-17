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

const die = n => `[d${n}](https://github.com/Davi-Tlr/Davi-Tlr/issues/new?title=roll:d${n}&body=Press+Create.)`;

const vaultRows = state.vault.length
  ? state.vault.map(v => `**${esc(v.relic)}** — ${esc(v.dungeon)}, by [@${esc(v.actor)}](https://github.com/${esc(v.actor)}) in ${v.rolls} roll${v.rolls === 1 ? '' : 's'}`).join('<br>')
  : 'Empty. Nothing has been brought back yet.';

const block = `${START_MARK}
<img align="left" width="42%" src="./assets/descent.svg" alt="${esc(state.dungeon.name)}: level ${state.depth} of ${state.dungeon.floor}" />

### ${esc(state.dungeon.name)}

**The floor lies on level ${state.dungeon.floor}.** The party is on level ${state.depth} with
${state.torches} torch${state.torches === 1 ? '' : 'es'} lit. Reach the floor and the relic comes up with
them; let the last torch go out and the dungeon keeps it.

Roll a d20 to move them — it opens a pre-filled issue, just press **Create**.
High takes them deeper, low costs light.

**${die(20)}** &nbsp;·&nbsp; won ${state.wins} · lost ${state.losses}${state.best !== null ? ` · best ${state.best} rolls` : ''}

<p align="center">
  <a href="https://github.com/Davi-Tlr/Davi-Tlr/issues/new?title=roll:d20&body=Press+Create.">
    <img src="./assets/last-roll.svg" width="240" alt="Latest d20 roll" />
  </a>
</p>

<details>
<summary>the vault &nbsp;·&nbsp; ${state.vault.length} recovered</summary>
<br>
<sub>${vaultRows}</sub>
</details>

<sub>${rows}</sub>

<br clear="both" />
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
