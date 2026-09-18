// The chronicle: a procedurally named dungeon with a floor to reach, a relic
// to bring back, and a scoreboard. No model, no API. Seeded tables are how a
// table does this anyway, and they keep the workflow deterministic and free.

import { randomInt } from 'node:crypto';

export const MAX_TORCHES = 3;
const VAULT_SIZE = 6;   // relics kept in the <details> list

// ---------------------------------------------------------------- generation

// mulberry32: same dungeon id always yields the same dungeon, so the state is
// reproducible and the generator is testable.
function seeded(seed) {
  let a = seed >>> 0;
  const next = () => {
    a = (a + 0x6D2B79F5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  next(); next(); next();   // warm-up: the first outputs still track the seed
  return next;
}

const ADJ = ['Sunken', 'Hollow', 'Drowned', 'Gilded', 'Shattered', 'Whispering',
             'Forgotten', 'Iron', 'Pale', 'Weeping', 'Buried', 'Starving'];
const PLACE = ['Vault', 'Deep', 'Warren', 'Reliquary', 'Hold', 'Spiral',
               'Barrow', 'Undercroft', 'Gaol', 'Cistern'];
const OF = ['Ash', 'Nine Bells', 'the Cartographer', 'Salt', 'the Second Sun',
            'Rust', 'the Quiet King', 'Moths', 'Lanterns', 'the Long Year',
            'Broken Oaths', 'the Tenth Door'];
const RELICS = [
  'the Ashen Crown',
  'a lantern that burns with no fuel',
  "the Cartographer's last map",
  'a key with no matching door',
  'the Bell of Nine Tongues',
  'a ledger of debts nobody remembers owing',
  'the Pale Sigil',
  'a compass that points at something other than north',
  'a jar of the dark from the bottom floor',
  'the Second Sun, or a convincing forgery of it',
  'a door, removed intact from its frame',
  'the name of something that would rather keep it',
];

export function makeDungeon(id) {
  // One stream per field. Drawing them all from a single stream correlates the
  // choices and the same relic keeps coming back.
  const draw = (salt, list) => list[Math.floor(seeded(id * salt)() * list.length)];
  return {
    id,
    name: `The ${draw(2654435761, ADJ)} ${draw(40503, PLACE)} of ${draw(1103515245, OF)}`,
    floor: 4 + Math.floor(seeded(id * 22695477)() * 6),   // the level that ends it: 4–9
    relic: draw(69069, RELICS),
    attempts: 0,
  };
}

export const START = {
  dungeon: makeDungeon(1),
  depth: 0,
  torches: MAX_TORCHES,
  rolls: 0,          // rolls spent on the current attempt
  wins: 0,
  losses: 0,
  best: null,        // fewest rolls in a winning attempt
  vault: [],
  journal: [],
};

// ---------------------------------------------------------------- the tables

const TABLE = [
  { min: 20, max: 20, depth: +2, torches: +1, lines: [
    'found a stair carved by no human hand, and took it two levels down',
    'pried open a sealed door, and behind it a shaft going down with a torch still burning',
    'followed the draught to a chasm and descended it in one rope-length',
  ]},
  { min: 15, max: 19, depth: +2, torches: 0, lines: [
    'pressed on through a passage that widened as it fell',
    'crossed the bridge over the underground river without waking anything',
    'picked the lock on the warden gate and went through quietly',
  ]},
  { min: 10, max: 14, depth: +1, torches: -1, lines: [
    'took the long corridor. Something breathed at the far end of it',
    'went down through water that came to the knee, and lost a torch to it',
    'squeezed through the collapse. One torch did not survive the crawl',
  ]},
  { min: 5, max: 9, depth: +1, torches: -1, lines: [
    'pushed on by guesswork, and paid a torch for the detour',
    'backtracked twice into the same room, burning light for nothing',
    'waited out something heavy walking past in the dark',
  ]},
  { min: 2, max: 4, depth: 0, torches: -1, lines: [
    'retreated up a level with something following, and did not look back',
    'lost the passage to a cave-in and climbed back the way they came',
    'was driven up the stair by a smell none of them wanted to name',
  ]},
  { min: 1, max: 1, depth: -1, torches: -2, lines: [
    'woke what sleeps on this level. Two torches lost in the running',
    'stepped on the wrong flagstone. The floor answered, and it cost them dearly',
    'dropped the lantern down the shaft and fled by what light was left',
  ]},
];

const bandFor = roll => TABLE.find(band => roll >= band.min && roll <= band.max);
const pickLine = list => list[randomInt(0, list.length)];

/**
 * Apply one roll. Returns the next state, the journal entry, and the outcome:
 * 'win' when the party reaches the dungeon's floor, 'loss' when the light runs
 * out, otherwise 'crit' / 'fumble' / 'normal' (or 'flavour' for a non-d20).
 */
/**
 * A chronicle read back from disk can be anything: a partial write, a bad
 * merge, someone editing the JSON by hand. A number that is not a number goes
 * to NaN on the first sum and stays there, because the state is written back
 * out after every roll. Anything that fails to be a number starts over.
 */
function withSaneNumbers(state) {
  const number = (value, fallback) => (Number.isFinite(value) ? value : fallback);
  return {
    ...state,
    depth: number(state.depth, 0),
    torches: number(state.torches, MAX_TORCHES),
    rolls: number(state.rolls, 0),
    wins: number(state.wins, 0),
    losses: number(state.losses, 0),
    best: Number.isFinite(state.best) ? state.best : null,
    vault: Array.isArray(state.vault) ? state.vault : [],
  };
}

export function advance(prev, { roll, sides, actor }) {
  const current = withSaneNumbers({ ...START, ...prev });
  const savedDungeon = current.dungeon;
  const dungeon = Number.isFinite(savedDungeon?.floor)
    ? { ...savedDungeon, attempts: Number.isFinite(savedDungeon.attempts) ? savedDungeon.attempts : 0 }
    : makeDungeon(1);

  // The same four fields were being written out at each of the four exits.
  const journalEntry = text => ({ actor, roll, sides, text, at: new Date().toISOString() });

  if (sides !== 20) {
    return {
      state: current,
      entry: journalEntry(`rolled a d${sides} in the dark for no reason anyone recorded`),
      outcome: 'flavour',
    };
  }

  const band = bandFor(roll);
  let depth = Math.max(0, current.depth + band.depth);
  let torches = Math.min(MAX_TORCHES, current.torches + band.torches);
  let text = pickLine(band.lines);
  let outcome = roll === 20 ? 'crit' : roll === 1 ? 'fumble' : 'normal';
  const rolls = current.rolls + 1;

  let { wins, losses, best } = current;
  let vault = [...current.vault];
  let nextDungeon = dungeon;

  // At the entrance the party is resupplying: light is free and a bad roll
  // just means they have not set off yet.
  if (current.depth === 0) {
    torches = MAX_TORCHES;
    depth = Math.max(0, band.depth);
    if (band.depth <= 0) {
      text = 'checked the packs at the entrance and decided the hour was wrong';
      outcome = 'normal';
    }
  }

  if (depth >= dungeon.floor) {
    // The floor is reached: the relic is taken and a new dungeon opens.
    outcome = 'win';
    text = `reached the floor of ${dungeon.name} and came back up with ${dungeon.relic}`;
    wins += 1;
    best = best === null ? rolls : Math.min(best, rolls);
    vault = [{ relic: dungeon.relic, dungeon: dungeon.name, actor, rolls }, ...vault].slice(0, VAULT_SIZE);
    nextDungeon = makeDungeon(dungeon.id + 1);
    return {
      state: { ...current, dungeon: nextDungeon, depth: 0, torches: MAX_TORCHES, rolls: 0, wins, losses, best, vault },
      entry: journalEntry(text),
      outcome,
    };
  }

  if (torches <= 0) {
    // The light fails. The dungeon keeps its secret and waits for the next try.
    outcome = 'loss';
    text = `${text}. Then the last torch went out, and ${dungeon.name} kept its floor`;
    losses += 1;
    nextDungeon = { ...dungeon, attempts: dungeon.attempts + 1 };
    return {
      state: { ...current, dungeon: nextDungeon, depth: 0, torches: MAX_TORCHES, rolls: 0, wins, losses, best, vault },
      entry: journalEntry(text),
      outcome,
    };
  }

  return {
    state: { ...current, dungeon, depth, torches, rolls, wins, losses, best, vault },
    entry: journalEntry(text),
    outcome,
  };
}
