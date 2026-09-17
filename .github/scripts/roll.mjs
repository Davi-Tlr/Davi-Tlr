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
import { renderBlock, spliceBlock } from './block.mjs';

const esc = s => String(s).replace(/[&<>"']/g, c =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' }[c]));

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

const prevDungeon = saved.dungeon ?? START.dungeon;
const { state, entry, outcome } = advance(saved, { roll, sides, actor });
const journal = [entry, ...(Array.isArray(saved.journal) ? saved.journal : [])].slice(0, JOURNAL);

mkdirSync('.github', { recursive: true });
writeFileSync(STATE_PATH, JSON.stringify({ ...state, journal }, null, 2) + '\n');

// ---------- drawings ----------
mkdirSync('assets', { recursive: true });
writeFileSync('assets/last-roll.svg', renderDie({ value: roll, sides, actor }));
writeFileSync('assets/descent.svg', renderScene({ ...state, entry, outcome }));


// ---------- the reply to whoever rolled ----------
const headline = outcome === 'win'
  ? `You rolled **${roll}** — and that was the one.`
  : outcome === 'loss'
  ? `You rolled **${roll}**, and the light ran out.`
  : outcome === 'crit'
  ? `You rolled a **natural ${sides}**.`
  : outcome === 'fumble'
  ? `You rolled a **1**.`
  : `You rolled **${roll}**.`;

const wherenow = outcome === 'win'
  ? `It is in the vault now, with your name on it. A new dungeon has opened: **${esc(state.dungeon.name)}**, and its floor lies on level ${state.dungeon.floor}.`
  : outcome === 'loss'
  ? `The party climbed back out empty-handed. **${esc(prevDungeon.name)}** keeps its floor, and has now turned back ${state.dungeon.attempts} expedition${state.dungeon.attempts === 1 ? '' : 's'}. They will go again.`
  : `They are on level ${state.depth} of ${state.dungeon.floor}, with ${state.torches} torch${state.torches === 1 ? '' : 'es'} lit.`;

writeFileSync('.github/roll-reply.md', `### ${headline}

The party ${esc(entry.text)}.

${wherenow}

Running total: **${state.wins}** recovered, **${state.losses}** lost.${state.best !== null ? ` Fastest descent so far: **${state.best}** rolls.` : ''}

[See where they are now →](https://github.com/Davi-Tlr)
`);

// ---------- README ----------

writeFileSync('README.md', spliceBlock(readFileSync('README.md', 'utf8'), renderBlock(state, journal)));
console.log(`@${actor} rolled ${roll} on a d${sides} — ${outcome} — ${state.dungeon.name} level ${state.depth}/${state.dungeon.floor}, ${state.torches} torches, ${state.wins}W/${state.losses}L`);
